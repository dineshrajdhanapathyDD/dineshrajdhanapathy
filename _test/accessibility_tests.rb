#!/usr/bin/env ruby

require 'nokogiri'
require 'colorize'

class AccessibilityTester
  def initialize(site_dir)
    @site_dir = site_dir
    @issues = []
  end

  def test_blog_accessibility
    puts "🔍 Running accessibility tests for blog...".colorize(:yellow)
    
    # Test blog index
    test_page_accessibility(File.join(@site_dir, 'blog', 'index.html'), 'Blog Index')
    
    # Test individual blog posts
    blog_posts = Dir.glob(File.join(@site_dir, 'blog', '**', '*.html')).reject do |file|
      file.include?('index.html') || file.include?('tags')
    end
    
    blog_posts.first(3).each do |post_file|
      test_page_accessibility(post_file, File.basename(post_file, '.html'))
    end
    
    # Test tag pages
    tag_index = File.join(@site_dir, 'blog', 'tags', 'index.html')
    test_page_accessibility(tag_index, 'Tags Index') if File.exist?(tag_index)
    
    generate_accessibility_report
  end

  private

  def test_page_accessibility(file_path, page_name)
    return unless File.exist?(file_path)
    
    content = File.read(file_path)
    doc = Nokogiri::HTML(content)
    
    puts "\n📄 Testing #{page_name}...".colorize(:cyan)
    
    # Test 1: Page has proper document structure
    test_document_structure(doc, page_name)
    
    # Test 2: Heading hierarchy
    test_heading_hierarchy(doc, page_name)
    
    # Test 3: Images have alt text
    test_image_alt_text(doc, page_name)
    
    # Test 4: Links have descriptive text
    test_link_accessibility(doc, page_name)
    
    # Test 5: Form accessibility
    test_form_accessibility(doc, page_name)
    
    # Test 6: Color contrast (basic check)
    test_color_contrast(doc, page_name)
    
    # Test 7: Keyboard navigation
    test_keyboard_navigation(doc, page_name)
    
    # Test 8: ARIA labels and roles
    test_aria_implementation(doc, page_name)
  end

  def test_document_structure(doc, page_name)
    issues = []
    
    # Check for lang attribute
    html_element = doc.at_css('html')
    unless html_element && html_element['lang']
      issues << "Missing lang attribute on html element"
    end
    
    # Check for page title
    title = doc.at_css('title')
    unless title && !title.content.strip.empty?
      issues << "Missing or empty page title"
    end
    
    # Check for main landmark
    main_element = doc.at_css('main, [role="main"]')
    unless main_element
      issues << "Missing main landmark"
    end
    
    # Check for skip links
    skip_link = doc.at_css('a[href^="#"]')
    unless skip_link
      issues << "Missing skip navigation link"
    end
    
    report_test_results("Document Structure", page_name, issues)
  end

  def test_heading_hierarchy(doc, page_name)
    issues = []
    headings = doc.css('h1, h2, h3, h4, h5, h6')
    
    if headings.empty?
      issues << "No headings found on page"
    else
      # Check for h1
      h1_count = doc.css('h1').length
      if h1_count == 0
        issues << "No h1 heading found"
      elsif h1_count > 1
        issues << "Multiple h1 headings found (#{h1_count})"
      end
      
      # Check heading sequence
      previous_level = 0
      headings.each_with_index do |heading, index|
        level = heading.name[1].to_i
        
        if index == 0 && level != 1
          issues << "First heading is not h1"
        elsif level > previous_level + 1
          issues << "Heading level skipped: #{heading.name} after h#{previous_level}"
        end
        
        previous_level = level
      end
    end
    
    report_test_results("Heading Hierarchy", page_name, issues)
  end

  def test_image_alt_text(doc, page_name)
    issues = []
    images = doc.css('img')
    
    images.each do |img|
      src = img['src'] || img['data-src']
      
      unless img['alt']
        issues << "Image missing alt attribute: #{src}"
      else
        alt_text = img['alt'].strip
        
        # Check for poor alt text
        poor_alt_patterns = [
          /^image$/i,
          /^picture$/i,
          /^photo$/i,
          /^img_\d+$/i,
          /^dsc_\d+$/i
        ]
        
        if poor_alt_patterns.any? { |pattern| alt_text.match?(pattern) }
          issues << "Poor alt text quality: '#{alt_text}' for #{src}"
        end
        
        # Check alt text length
        if alt_text.length > 125
          issues << "Alt text too long (#{alt_text.length} chars): #{src}"
        end
      end
    end
    
    report_test_results("Image Alt Text", page_name, issues)
  end

  def test_link_accessibility(doc, page_name)
    issues = []
    links = doc.css('a[href]')
    
    links.each do |link|
      href = link['href']
      link_text = link.text.strip
      
      # Check for empty link text
      if link_text.empty?
        # Check for aria-label or title
        unless link['aria-label'] || link['title']
          issues << "Link has no accessible text: #{href}"
        end
      end
      
      # Check for generic link text
      generic_texts = ['click here', 'read more', 'more', 'here', 'link']
      if generic_texts.include?(link_text.downcase)
        issues << "Generic link text: '#{link_text}' for #{href}"
      end
      
      # Check for external links
      if href.start_with?('http') && !href.include?(doc.at_css('html')&.[]('data-domain'))
        unless link['target'] == '_blank' && (link['rel']&.include?('noopener') || link['rel']&.include?('noreferrer'))
          issues << "External link missing security attributes: #{href}"
        end
      end
    end
    
    report_test_results("Link Accessibility", page_name, issues)
  end

  def test_form_accessibility(doc, page_name)
    issues = []
    
    # Test form inputs
    inputs = doc.css('input, textarea, select')
    inputs.each do |input|
      next if input['type'] == 'hidden'
      
      input_id = input['id']
      input_type = input['type'] || 'text'
      
      # Check for associated label
      has_label = false
      
      if input_id
        label = doc.at_css("label[for='#{input_id}']")
        has_label = true if label
      end
      
      # Check for aria-label or aria-labelledby
      has_label = true if input['aria-label'] || input['aria-labelledby']
      
      unless has_label
        issues << "Input missing accessible label: #{input_type} input"
      end
      
      # Check required fields have proper indication
      if input['required']
        unless input['aria-required'] || doc.at_css("label[for='#{input_id}'] .required")
          issues << "Required field not properly indicated: #{input_type} input"
        end
      end
    end
    
    report_test_results("Form Accessibility", page_name, issues)
  end

  def test_color_contrast(doc, page_name)
    issues = []
    
    # Basic check for color-only information
    elements_with_color = doc.css('[style*="color"]')
    if elements_with_color.any?
      issues << "Elements using inline color styles found - ensure sufficient contrast"
    end
    
    # Check for color-only error indicators
    error_elements = doc.css('.error, .warning, .success')
    error_elements.each do |element|
      unless element.text.strip.length > 0
        issues << "Color-only status indicator found - add text or icons"
      end
    end
    
    report_test_results("Color Contrast", page_name, issues)
  end

  def test_keyboard_navigation(doc, page_name)
    issues = []
    
    # Check for focusable elements
    focusable = doc.css('a, button, input, textarea, select, [tabindex]')
    
    # Check for skip links
    skip_links = doc.css('a[href^="#"]')
    if skip_links.empty?
      issues << "No skip navigation links found"
    end
    
    # Check for tabindex values
    negative_tabindex = doc.css('[tabindex="-1"]')
    positive_tabindex = doc.css('[tabindex]:not([tabindex="0"]):not([tabindex="-1"])')
    
    if positive_tabindex.any?
      issues << "Positive tabindex values found - may disrupt natural tab order"
    end
    
    # Check for focus indicators
    css_content = doc.css('style, link[rel="stylesheet"]').map(&:content).join
    unless css_content.include?(':focus') || css_content.include?('focus-visible')
      issues << "No focus indicators found in CSS"
    end
    
    report_test_results("Keyboard Navigation", page_name, issues)
  end

  def test_aria_implementation(doc, page_name)
    issues = []
    
    # Check for proper ARIA usage
    aria_elements = doc.css('[aria-label], [aria-labelledby], [aria-describedby], [role]')
    
    # Check for invalid ARIA attributes
    aria_elements.each do |element|
      element.attributes.each do |name, attr|
        if name.start_with?('aria-')
          # Basic validation - in real implementation, you'd check against ARIA spec
          if attr.value.strip.empty?
            issues << "Empty ARIA attribute: #{name}"
          end
        end
      end
    end
    
    # Check for landmarks
    landmarks = doc.css('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], header, nav, main, footer')
    if landmarks.length < 2
      issues << "Insufficient landmark elements for page structure"
    end
    
    # Check for live regions if dynamic content exists
    dynamic_elements = doc.css('.search-results, .filter-results, .loading')
    if dynamic_elements.any?
      live_regions = doc.css('[aria-live], [aria-atomic]')
      if live_regions.empty?
        issues << "Dynamic content found but no ARIA live regions"
      end
    end
    
    report_test_results("ARIA Implementation", page_name, issues)
  end

  def report_test_results(test_name, page_name, issues)
    if issues.empty?
      puts "  ✅ #{test_name}: PASS".colorize(:green)
    else
      puts "  ❌ #{test_name}: #{issues.length} issue(s)".colorize(:red)
      issues.each do |issue|
        puts "    - #{issue}".colorize(:red)
        @issues << {
          page: page_name,
          test: test_name,
          issue: issue
        }
      end
    end
  end

  def generate_accessibility_report
    puts "\n📊 Accessibility Test Summary".colorize(:blue).bold
    puts "=" * 50
    
    if @issues.empty?
      puts "🎉 All accessibility tests passed!".colorize(:green).bold
    else
      puts "⚠️  Found #{@issues.length} accessibility issues:".colorize(:yellow).bold
      
      # Group issues by page
      issues_by_page = @issues.group_by { |issue| issue[:page] }
      
      issues_by_page.each do |page, page_issues|
        puts "\n#{page}:".colorize(:yellow)
        page_issues.each do |issue|
          puts "  [#{issue[:test]}] #{issue[:issue]}".colorize(:red)
        end
      end
    end
    
    # Save detailed report
    report_file = File.join(File.dirname(__FILE__), 'accessibility_report.json')
    File.write(report_file, JSON.pretty_generate({
      timestamp: Time.now.iso8601,
      total_issues: @issues.length,
      issues: @issues
    }))
    
    puts "\n📄 Detailed report saved to: #{report_file}".colorize(:cyan)
  end
end

# Run if called directly
if __FILE__ == $0
  site_dir = ARGV[0] || File.join(File.dirname(__FILE__), '..', '_site')
  
  unless Dir.exist?(site_dir)
    puts "❌ Site directory not found: #{site_dir}".colorize(:red)
    puts "Please build the Jekyll site first or provide the correct path.".colorize(:yellow)
    exit 1
  end
  
  tester = AccessibilityTester.new(site_dir)
  tester.test_blog_accessibility
end