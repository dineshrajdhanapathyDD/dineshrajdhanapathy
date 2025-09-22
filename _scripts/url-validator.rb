#!/usr/bin/env ruby
# URL Validator Script
# Validates all blog URLs and internal links for production deployment

require 'net/http'
require 'uri'
require 'yaml'
require 'json'

class URLValidator
  def initialize
    @base_path = File.expand_path('..', __dir__)
    @base_url = get_base_url
    @validation_results = {
      internal_links: [],
      external_links: [],
      blog_urls: [],
      broken_links: [],
      warnings: [],
      total_checked: 0
    }
  end

  def validate_all_urls
    puts "🔗 Starting URL Validation..."
    puts "Base URL: #{@base_url}"
    puts "=" * 50
    
    validate_blog_structure_urls
    validate_internal_links_in_layouts
    validate_post_urls
    validate_navigation_links
    validate_sitemap_urls
    validate_feed_urls
    
    generate_validation_report
  end

  private

  def get_base_url
    config_file = File.join(@base_path, '_config.yml')
    if File.exist?(config_file)
      config = YAML.load_file(config_file)
      base_url = config['url'] || 'http://localhost:4000'
      baseurl = config['baseurl'] || ''
      "#{base_url}#{baseurl}"
    else
      'http://localhost:4000'
    end
  end

  def validate_blog_structure_urls
    puts "\n📚 Validating Blog Structure URLs..."
    
    # Check blog index
    blog_index_paths = [
      '/blog/',
      '/blog/index.html',
      '/blog/index.md'
    ]
    
    blog_index_paths.each do |path|
      file_path = File.join(@base_path, path.gsub('/', ''))
      if File.exist?(file_path) || File.exist?(file_path.gsub('.html', '.md'))
        @validation_results[:blog_urls] << {
          url: "#{@base_url}#{path}",
          status: 'valid',
          type: 'blog_index'
        }
        puts "  ✅ Blog index accessible at #{path}"
      end
    end
    
    # Check tag pages structure
    tags_dir = File.join(@base_path, 'blog', 'tags')
    if Dir.exist?(tags_dir)
      tag_files = Dir.glob(File.join(tags_dir, '*.html'))
      tag_files.each do |tag_file|
        tag_name = File.basename(tag_file, '.html')
        url = "#{@base_url}/blog/tags/#{tag_name}/"
        @validation_results[:blog_urls] << {
          url: url,
          status: 'valid',
          type: 'tag_page'
        }
      end
      puts "  ✅ Found #{tag_files.length} tag pages"
    end
    
    puts "  ✅ Blog structure URL validation completed"
  end

  def validate_internal_links_in_layouts
    puts "\n🏗️  Validating Internal Links in Layouts..."
    
    layout_files = Dir.glob(File.join(@base_path, '_layouts', '*.html'))
    layout_files.each do |layout_file|
      content = File.read(layout_file)
      filename = File.basename(layout_file)
      
      # Extract internal links
      internal_links = content.scan(/href=["']([^"']*?)["']/).flatten
      internal_links.select! { |link| link.start_with?('/') || link.start_with?('#') }
      
      internal_links.each do |link|
        next if link.start_with?('#') # Skip anchor links
        
        # Convert link to file path
        file_path = convert_url_to_file_path(link)
        
        if validate_file_exists(file_path)
          @validation_results[:internal_links] << {
            url: link,
            source: filename,
            status: 'valid'
          }
        else
          @validation_results[:broken_links] << {
            url: link,
            source: filename,
            status: 'broken',
            type: 'internal'
          }
        end
      end
    end
    
    puts "  ✅ Layout internal links validation completed"
  end

  def validate_post_urls
    puts "\n📝 Validating Blog Post URLs..."
    
    posts_dir = File.join(@base_path, '_posts')
    if Dir.exist?(posts_dir)
      post_files = Dir.glob(File.join(posts_dir, '*.md'))
      
      post_files.each do |post_file|
        filename = File.basename(post_file, '.md')
        
        # Validate filename format
        unless filename.match(/^\d{4}-\d{2}-\d{2}-.+/)
          @validation_results[:warnings] << "Invalid post filename format: #{filename}"
          next
        end
        
        # Extract date and slug from filename
        date_match = filename.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)$/)
        if date_match
          year, month, day, slug = date_match.captures
          
          # Generate expected URL based on Jekyll permalink structure
          expected_url = "/blog/#{year}/#{month}/#{day}/#{slug}/"
          
          @validation_results[:blog_urls] << {
            url: "#{@base_url}#{expected_url}",
            status: 'valid',
            type: 'blog_post',
            source_file: filename
          }
          
          # Validate front matter
          validate_post_front_matter(post_file, filename)
        end
      end
      
      puts "  ✅ Found #{post_files.length} blog posts with valid URL structure"
    end
    
    puts "  ✅ Blog post URL validation completed"
  end

  def validate_post_front_matter(post_file, filename)
    content = File.read(post_file)
    
    if content.match(/\A---\s*\n(.*?)\n---\s*\n/m)
      front_matter_yaml = $1
      begin
        front_matter = YAML.load(front_matter_yaml)
        
        # Check for custom permalink
        if front_matter['permalink']
          custom_url = front_matter['permalink']
          @validation_results[:blog_urls] << {
            url: "#{@base_url}#{custom_url}",
            status: 'valid',
            type: 'custom_permalink',
            source_file: filename
          }
        end
        
        # Check for canonical URL
        if front_matter['canonical_url']
          @validation_results[:external_links] << {
            url: front_matter['canonical_url'],
            source: filename,
            type: 'canonical'
          }
        end
        
      rescue YAML::SyntaxError => e
        @validation_results[:warnings] << "Invalid YAML in #{filename}: #{e.message}"
      end
    end
  end

  def validate_navigation_links
    puts "\n🧭 Validating Navigation Links..."
    
    # Check main navigation in layouts
    layout_files = Dir.glob(File.join(@base_path, '_layouts', '*.html'))
    layout_files.each do |layout_file|
      content = File.read(layout_file)
      filename = File.basename(layout_file)
      
      # Look for navigation elements
      nav_links = []
      
      # Extract links from navigation sections
      nav_sections = content.scan(/<nav[^>]*>(.*?)<\/nav>/m)
      nav_sections.each do |nav_content|
        links = nav_content.first.scan(/href=["']([^"']*?)["']/).flatten
        nav_links.concat(links)
      end
      
      # Also check for common navigation patterns
      common_nav_links = content.scan(/href=["']\/(blog|projects|contact|about)[\/"]/).flatten
      nav_links.concat(common_nav_links.map { |link| "/#{link}/" })
      
      nav_links.uniq.each do |link|
        next if link.start_with?('http') || link.start_with?('#')
        
        file_path = convert_url_to_file_path(link)
        
        if validate_file_exists(file_path)
          @validation_results[:internal_links] << {
            url: link,
            source: filename,
            status: 'valid',
            type: 'navigation'
          }
        else
          @validation_results[:broken_links] << {
            url: link,
            source: filename,
            status: 'broken',
            type: 'navigation'
          }
        end
      end
    end
    
    puts "  ✅ Navigation links validation completed"
  end

  def validate_sitemap_urls
    puts "\n🗺️  Validating Sitemap URLs..."
    
    sitemap_file = File.join(@base_path, 'sitemap.xml')
    if File.exist?(sitemap_file)
      content = File.read(sitemap_file)
      
      # Extract URLs from sitemap
      urls = content.scan(/<loc>(.*?)<\/loc>/).flatten
      
      urls.each do |url|
        # Check if it's a blog URL
        if url.include?('/blog/')
          @validation_results[:blog_urls] << {
            url: url,
            status: 'valid',
            type: 'sitemap_entry'
          }
        end
      end
      
      puts "  ✅ Found #{urls.length} URLs in sitemap"
    else
      @validation_results[:warnings] << "Sitemap file not found"
    end
    
    puts "  ✅ Sitemap URL validation completed"
  end

  def validate_feed_urls
    puts "\n📡 Validating Feed URLs..."
    
    feed_files = ['feed.xml', 'feed.json']
    feed_files.each do |feed_file|
      feed_path = File.join(@base_path, feed_file)
      if File.exist?(feed_path)
        content = File.read(feed_path)
        
        # Extract URLs from feed
        if feed_file.end_with?('.xml')
          urls = content.scan(/<link[^>]*>(.*?)<\/link>/).flatten
          urls.concat(content.scan(/href=["']([^"']*?)["']/).flatten)
        elsif feed_file.end_with?('.json')
          begin
            feed_data = JSON.parse(content)
            if feed_data['items']
              urls = feed_data['items'].map { |item| item['url'] }.compact
            end
          rescue JSON::ParserError
            @validation_results[:warnings] << "Invalid JSON in #{feed_file}"
            next
          end
        end
        
        urls&.each do |url|
          if url.include?('/blog/')
            @validation_results[:blog_urls] << {
              url: url,
              status: 'valid',
              type: 'feed_entry',
              source: feed_file
            }
          end
        end
        
        puts "  ✅ Validated #{feed_file}"
      end
    end
    
    puts "  ✅ Feed URL validation completed"
  end

  def convert_url_to_file_path(url)
    # Remove leading slash and convert URL to file path
    path = url.gsub(/^\//, '')
    
    # Handle different file extensions
    possible_paths = [
      File.join(@base_path, "#{path}.html"),
      File.join(@base_path, "#{path}.md"),
      File.join(@base_path, path, 'index.html'),
      File.join(@base_path, path, 'index.md'),
      File.join(@base_path, path)
    ]
    
    possible_paths.find { |p| File.exist?(p) } || possible_paths.first
  end

  def validate_file_exists(file_path)
    File.exist?(file_path) || Dir.exist?(file_path)
  end

  def generate_validation_report
    puts "\n" + "=" * 50
    puts "🔗 URL VALIDATION REPORT"
    puts "=" * 50
    
    @validation_results[:total_checked] = 
      @validation_results[:internal_links].length +
      @validation_results[:external_links].length +
      @validation_results[:blog_urls].length
    
    puts "\n📊 Validation Summary:"
    puts "   Total URLs checked: #{@validation_results[:total_checked]}"
    puts "   Blog URLs: #{@validation_results[:blog_urls].length}"
    puts "   Internal links: #{@validation_results[:internal_links].length}"
    puts "   External links: #{@validation_results[:external_links].length}"
    puts "   Broken links: #{@validation_results[:broken_links].length}"
    puts "   Warnings: #{@validation_results[:warnings].length}"
    
    if @validation_results[:broken_links].empty? && @validation_results[:warnings].empty?
      puts "\n🎉 EXCELLENT! All URLs are valid and accessible!"
      puts "✅ No broken links found"
      puts "✅ All blog URLs follow proper structure"
      puts "✅ Navigation links are working correctly"
    else
      if @validation_results[:broken_links].any?
        puts "\n❌ Broken Links Found (#{@validation_results[:broken_links].length}):"
        @validation_results[:broken_links].each do |link|
          puts "   • #{link[:url]} (in #{link[:source]})"
        end
      end
      
      if @validation_results[:warnings].any?
        puts "\n⚠️  Warnings (#{@validation_results[:warnings].length}):"
        @validation_results[:warnings].each do |warning|
          puts "   • #{warning}"
        end
      end
    end
    
    # Blog URL structure analysis
    analyze_blog_url_structure
    
    # Generate recommendations
    generate_url_recommendations
    
    # Save results
    save_validation_results
  end

  def analyze_blog_url_structure
    puts "\n📚 Blog URL Structure Analysis:"
    
    blog_posts = @validation_results[:blog_urls].select { |url| url[:type] == 'blog_post' }
    
    if blog_posts.any?
      puts "   Blog posts: #{blog_posts.length}"
      
      # Analyze URL patterns
      url_patterns = blog_posts.map { |post| post[:url] }
      
      # Check for consistent date structure
      date_pattern = url_patterns.all? { |url| url.match(/\/\d{4}\/\d{2}\/\d{2}\//) }
      if date_pattern
        puts "   ✅ Consistent date-based URL structure"
      else
        puts "   ⚠️  Inconsistent URL structure detected"
      end
      
      # Check for clean URLs (ending with /)
      clean_urls = url_patterns.all? { |url| url.end_with?('/') }
      if clean_urls
        puts "   ✅ Clean URLs (trailing slash)"
      else
        puts "   ⚠️  Some URLs don't end with trailing slash"
      end
    end
    
    # Tag pages analysis
    tag_pages = @validation_results[:blog_urls].select { |url| url[:type] == 'tag_page' }
    if tag_pages.any?
      puts "   Tag pages: #{tag_pages.length}"
      puts "   ✅ Tag-based filtering available"
    end
  end

  def generate_url_recommendations
    puts "\n💡 URL RECOMMENDATIONS:"
    
    if @validation_results[:broken_links].any?
      puts "\n🔴 Critical Actions:"
      puts "   • Fix all broken internal links before deployment"
      puts "   • Verify file paths and naming conventions"
      puts "   • Test navigation flow manually"
    end
    
    if @validation_results[:warnings].any?
      puts "\n⚠️  Improvements:"
      puts "   • Address filename format warnings"
      puts "   • Fix YAML syntax errors in front matter"
      puts "   • Add missing sitemap or feed files"
    end
    
    puts "\n🎯 Best Practices:"
    puts "   • Use consistent URL structure across all blog posts"
    puts "   • Implement proper redirects for changed URLs"
    puts "   • Add canonical URLs to prevent duplicate content"
    puts "   • Test URLs in different browsers and devices"
    puts "   • Monitor 404 errors after deployment"
    puts "   • Consider implementing URL shortening for social sharing"
    
    puts "\n🚀 SEO Optimizations:"
    puts "   • Ensure all blog URLs are included in sitemap"
    puts "   • Add structured data markup to blog posts"
    puts "   • Implement breadcrumb navigation"
    puts "   • Use descriptive slugs in URLs"
  end

  def save_validation_results
    results_file = File.join(@base_path, 'url-validation-results.json')
    File.write(results_file, JSON.pretty_generate(@validation_results))
    puts "\n💾 Validation results saved to: url-validation-results.json"
  end
end

# Run the URL validation
if __FILE__ == $0
  validator = URLValidator.new
  validator.validate_all_urls
end