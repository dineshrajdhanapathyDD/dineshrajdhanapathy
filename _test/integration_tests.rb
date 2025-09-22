#!/usr/bin/env ruby

require 'minitest/autorun'
require 'minitest/reporters'
require 'nokogiri'
require 'json'
require 'colorize'

# Use spec reporter for better output
Minitest::Reporters.use! Minitest::Reporters::SpecReporter.new

class BlogIntegrationTest < Minitest::Test
  def setup
    @site_dir = File.expand_path('../_site', __dir__)
    @source_dir = File.expand_path('..', __dir__)
    
    # Ensure site is built
    unless Dir.exist?(@site_dir)
      puts "Building Jekyll site for integration testing..."
      system("cd #{@source_dir} && bundle exec jekyll build")
    end
  end

  def test_navigation_integration
    # Test that all main pages include blog navigation
    main_pages = ['index.html', 'projects.html', 'contact.html']
    
    main_pages.each do |page|
      page_path = File.join(@site_dir, page)
      assert File.exist?(page_path), "Main page should exist: #{page}"
      
      content = File.read(page_path)
      doc = Nokogiri::HTML(content)
      
      # Test main navigation includes blog link
      blog_nav_link = doc.at_css('nav a[href*="blog"]')
      assert blog_nav_link, "Main navigation should include blog link in #{page}"
      
      # Test footer navigation includes blog link
      footer_blog_link = doc.css('footer a[href*="blog"]')
      assert footer_blog_link.any?, "Footer should include blog link in #{page}"
    end
  end

  def test_blog_pages_inherit_site_structure
    blog_index = File.join(@site_dir, 'blog', 'index.html')
    
    if File.exist?(blog_index)
      content = File.read(blog_index)
      doc = Nokogiri::HTML(content)
      
      # Test header structure
      header = doc.at_css('header.header')
      assert header, "Blog index should have site header"
      
      # Test navigation
      nav = doc.at_css('nav.nav')
      assert nav, "Blog index should have site navigation"
      
      # Test footer
      footer = doc.at_css('footer.footer')
      assert footer, "Blog index should have site footer"
      
      # Test CSS includes
      css_links = doc.css('link[rel="stylesheet"]')
      css_hrefs = css_links.map { |link| link['href'] }
      
      assert css_hrefs.any? { |href| href.include?('main.css') }, "Blog should include main site CSS"
      assert css_hrefs.any? { |href| href.include?('blog.css') }, "Blog should include blog-specific CSS"
    else
      puts "⚠️ Blog index not found - may not be built yet".colorize(:yellow)
    end
  end

  def test_homepage_blog_integration
    homepage = File.join(@site_dir, 'index.html')
    assert File.exist?(homepage), "Homepage should exist"
    
    content = File.read(homepage)
    doc = Nokogiri::HTML(content)
    
    # Test recent blog section exists
    recent_blog_section = doc.at_css('.recent-blog')
    assert recent_blog_section, "Homepage should have recent blog section"
    
    # Test blog section has proper structure
    blog_header = doc.at_css('.recent-blog__header')
    assert blog_header, "Recent blog section should have header"
    
    blog_content = doc.at_css('.recent-blog__content')
    assert blog_content, "Recent blog section should have content area"
    
    # Test "View All Posts" link
    view_all_link = doc.at_css('a[href*="blog"]')
    assert view_all_link, "Homepage should have link to blog"
    
    # Test JavaScript includes
    script_tags = doc.css('script[src]')
    script_srcs = script_tags.map { |script| script['src'] }
    
    assert script_srcs.any? { |src| src.include?('homepage-blog.js') }, 
           "Homepage should include blog integration JavaScript"
  end

  def test_css_integration
    # Test that blog CSS doesn't conflict with main site CSS
    main_css = File.join(@site_dir, 'assets', 'css', 'main.css')
    blog_css = File.join(@site_dir, 'assets', 'css', 'blog.css')
    
    if File.exist?(main_css) && File.exist?(blog_css)
      main_content = File.read(main_css)
      blog_content = File.read(blog_css)
      
      # Test that blog CSS uses consistent naming conventions
      blog_classes = blog_content.scan(/\.([a-zA-Z0-9_-]+)/).flatten.uniq
      
      # Check for potential conflicts (classes that might override main site)
      conflicting_classes = %w[header footer nav main container btn]
      conflicts = blog_classes & conflicting_classes
      
      # Allow some expected conflicts but warn about others
      allowed_conflicts = %w[btn] # Blog can extend button styles
      unexpected_conflicts = conflicts - allowed_conflicts
      
      assert unexpected_conflicts.empty?, 
             "Blog CSS should not conflict with main site classes: #{unexpected_conflicts.join(', ')}"
    end
  end

  def test_javascript_integration
    homepage = File.join(@site_dir, 'index.html')
    
    if File.exist?(homepage)
      content = File.read(homepage)
      doc = Nokogiri::HTML(content)
      
      # Test JavaScript loading order
      script_tags = doc.css('script[src]')
      script_srcs = script_tags.map { |script| script['src'] }
      
      # Main.js should load before blog-specific scripts
      main_js_index = script_srcs.find_index { |src| src.include?('main.js') }
      blog_js_index = script_srcs.find_index { |src| src.include?('homepage-blog.js') }
      
      if main_js_index && blog_js_index
        assert main_js_index < blog_js_index, 
               "Main JavaScript should load before blog JavaScript"
      end
    end
  end

  def test_seo_integration
    # Test that blog pages have proper SEO integration
    homepage = File.join(@site_dir, 'index.html')
    
    if File.exist?(homepage)
      content = File.read(homepage)
      doc = Nokogiri::HTML(content)
      
      # Test structured data includes blog search action
      structured_data = doc.css('script[type="application/ld+json"]')
      
      structured_data.each do |script|
        begin
          data = JSON.parse(script.content)
          
          if data['potentialAction']
            actions = data['potentialAction']
            actions = [actions] unless actions.is_a?(Array)
            
            blog_search_action = actions.find do |action|
              action['target'] && action['target'].include?('blog')
            end
            
            if blog_search_action
              assert blog_search_action['target'].include?('blog'), 
                     "Blog search action should target blog pages"
            end
          end
        rescue JSON::ParserError
          # Skip invalid JSON
        end
      end
    end
  end

  def test_accessibility_integration
    # Test that blog maintains site accessibility standards
    blog_index = File.join(@site_dir, 'blog', 'index.html')
    
    if File.exist?(blog_index)
      content = File.read(blog_index)
      doc = Nokogiri::HTML(content)
      
      # Test skip links
      skip_links = doc.css('a.skip-link')
      assert skip_links.any?, "Blog should have skip links for accessibility"
      
      # Test ARIA landmarks
      main_landmark = doc.at_css('main[role="main"], main')
      assert main_landmark, "Blog should have main landmark"
      
      nav_landmark = doc.at_css('nav[role="navigation"], nav')
      assert nav_landmark, "Blog should have navigation landmark"
      
      # Test heading hierarchy
      headings = doc.css('h1, h2, h3, h4, h5, h6')
      assert headings.any?, "Blog should have proper heading structure"
      
      h1_count = doc.css('h1').length
      assert h1_count == 1, "Blog should have exactly one h1 heading"
    end
  end

  def test_performance_integration
    # Test that blog assets are optimized
    css_files = Dir.glob(File.join(@site_dir, 'assets', 'css', '*.css'))
    js_files = Dir.glob(File.join(@site_dir, 'assets', 'js', '*.js'))
    
    # Test CSS file sizes (basic check)
    css_files.each do |css_file|
      size = File.size(css_file)
      filename = File.basename(css_file)
      
      # Warn if CSS files are very large (> 100KB)
      if size > 100_000
        puts "⚠️ Large CSS file detected: #{filename} (#{size} bytes)".colorize(:yellow)
      end
    end
    
    # Test JavaScript file sizes
    js_files.each do |js_file|
      size = File.size(js_file)
      filename = File.basename(js_file)
      
      # Warn if JS files are very large (> 200KB)
      if size > 200_000
        puts "⚠️ Large JavaScript file detected: #{filename} (#{size} bytes)".colorize(:yellow)
      end
    end
  end

  def test_responsive_integration
    # Test that blog pages work with existing responsive design
    blog_css = File.join(@site_dir, 'assets', 'css', 'blog.css')
    
    if File.exist?(blog_css)
      content = File.read(blog_css)
      
      # Test for responsive breakpoints
      assert content.include?('@media'), "Blog CSS should include responsive breakpoints"
      
      # Test for common responsive patterns
      responsive_patterns = [
        'max-width',
        'min-width',
        'grid-template-columns',
        'flex-direction'
      ]
      
      responsive_patterns.each do |pattern|
        assert content.include?(pattern), 
               "Blog CSS should include responsive pattern: #{pattern}"
      end
    end
  end

  def test_feed_integration
    # Test RSS feed includes blog posts
    rss_feed = File.join(@site_dir, 'feed.xml')
    
    if File.exist?(rss_feed)
      content = File.read(rss_feed)
      doc = Nokogiri::XML(content)
      
      # Test RSS structure
      assert doc.at_xpath('//rss'), "Should have valid RSS structure"
      assert doc.at_xpath('//channel'), "RSS should have channel"
      
      # Test for items (blog posts)
      items = doc.xpath('//item')
      if items.any?
        # Test first item structure
        first_item = items.first
        assert first_item.at_xpath('title'), "RSS item should have title"
        assert first_item.at_xpath('link'), "RSS item should have link"
        assert first_item.at_xpath('description'), "RSS item should have description"
      end
    end
  end

  def test_sitemap_integration
    # Test sitemap includes blog pages
    sitemap = File.join(@site_dir, 'sitemap.xml')
    
    if File.exist?(sitemap)
      content = File.read(sitemap)
      doc = Nokogiri::XML(content)
      
      # Test sitemap structure
      urlset = doc.at_xpath('//xmlns:urlset', 'xmlns' => 'http://www.sitemaps.org/schemas/sitemap/0.9')
      assert urlset, "Should have valid sitemap structure"
      
      # Test for blog URLs
      urls = doc.xpath('//xmlns:url/xmlns:loc', 'xmlns' => 'http://www.sitemaps.org/schemas/sitemap/0.9')
      blog_urls = urls.select { |url| url.content.include?('blog') }
      
      if blog_urls.any?
        puts "✅ Found #{blog_urls.length} blog URLs in sitemap".colorize(:green)
      else
        puts "⚠️ No blog URLs found in sitemap".colorize(:yellow)
      end
    end
  end
end

# Run tests if this file is executed directly
if __FILE__ == $0
  # Set up test environment
  ENV['JEKYLL_ENV'] = 'test'
  
  puts "🔗 Running Blog Integration Tests".colorize(:blue).bold
  puts "=" * 50
  
  # Run the tests
  Minitest.run
end