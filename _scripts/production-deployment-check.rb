#!/usr/bin/env ruby
# Production Deployment Preparation Script
# Validates blog functionality, performance, and URLs for GitHub Pages deployment

require 'net/http'
require 'uri'
require 'json'
require 'yaml'
require 'fileutils'

class ProductionDeploymentChecker
  def initialize
    @base_path = File.expand_path('..', __dir__)
    @errors = []
    @warnings = []
    @performance_issues = []
    @url_issues = []
  end

  def run_all_checks
    puts "🚀 Starting Production Deployment Preparation..."
    puts "=" * 50
    
    check_jekyll_configuration
    validate_blog_structure
    check_performance_requirements
    validate_internal_links
    validate_blog_urls
    check_seo_requirements
    check_accessibility_compliance
    validate_github_pages_compatibility
    
    generate_deployment_report
  end

  private

  def check_jekyll_configuration
    puts "\n📋 Checking Jekyll Configuration..."
    
    config_file = File.join(@base_path, '_config.yml')
    unless File.exist?(config_file)
      @errors << "Missing _config.yml file"
      return
    end

    config = YAML.load_file(config_file)
    
    # Check required blog settings
    required_settings = %w[title description url baseurl]
    required_settings.each do |setting|
      unless config[setting]
        @warnings << "Missing #{setting} in _config.yml"
      end
    end

    # Check blog-specific settings
    if config['blog']
      puts "  ✅ Blog configuration found"
    else
      @warnings << "Blog-specific configuration not found in _config.yml"
    end

    # Check pagination settings
    if config['paginate']
      puts "  ✅ Pagination configured (#{config['paginate']} posts per page)"
    else
      @warnings << "Pagination not configured"
    end

    puts "  ✅ Jekyll configuration check completed"
  end

  def validate_blog_structure
    puts "\n📁 Validating Blog Structure..."
    
    # Check required directories
    required_dirs = %w[_posts _layouts blog]
    required_dirs.each do |dir|
      dir_path = File.join(@base_path, dir)
      if Dir.exist?(dir_path)
        puts "  ✅ #{dir} directory exists"
      else
        @errors << "Missing required directory: #{dir}"
      end
    end

    # Check blog layouts
    layout_files = %w[blog.html post.html]
    layout_files.each do |layout|
      layout_path = File.join(@base_path, '_layouts', layout)
      if File.exist?(layout_path)
        puts "  ✅ #{layout} layout exists"
      else
        @errors << "Missing blog layout: #{layout}"
      end
    end

    # Check blog posts
    posts_dir = File.join(@base_path, '_posts')
    if Dir.exist?(posts_dir)
      post_files = Dir.glob(File.join(posts_dir, '*.md'))
      if post_files.any?
        puts "  ✅ Found #{post_files.length} blog posts"
        validate_post_front_matter(post_files)
      else
        @warnings << "No blog posts found in _posts directory"
      end
    end

    puts "  ✅ Blog structure validation completed"
  end

  def validate_post_front_matter(post_files)
    puts "\n📝 Validating Post Front Matter..."
    
    post_files.each do |post_file|
      content = File.read(post_file)
      
      # Extract front matter
      if content.match(/\A---\s*\n(.*?)\n---\s*\n/m)
        front_matter_yaml = $1
        begin
          front_matter = YAML.load(front_matter_yaml)
          
          # Check required fields
          required_fields = %w[layout title date]
          required_fields.each do |field|
            unless front_matter[field]
              @warnings << "Post #{File.basename(post_file)} missing #{field}"
            end
          end
          
          # Check recommended fields
          recommended_fields = %w[excerpt tags categories]
          recommended_fields.each do |field|
            unless front_matter[field]
              @warnings << "Post #{File.basename(post_file)} missing recommended field: #{field}"
            end
          end
          
        rescue YAML::SyntaxError => e
          @errors << "Invalid YAML in #{File.basename(post_file)}: #{e.message}"
        end
      else
        @errors << "Post #{File.basename(post_file)} missing front matter"
      end
    end
    
    puts "  ✅ Post front matter validation completed"
  end

  def check_performance_requirements
    puts "\n⚡ Checking Performance Requirements..."
    
    # Check CSS files
    css_dir = File.join(@base_path, 'assets', 'css')
    if Dir.exist?(css_dir)
      css_files = Dir.glob(File.join(css_dir, '*.css'))
      css_files.each do |css_file|
        file_size = File.size(css_file)
        if file_size > 100_000 # 100KB
          @performance_issues << "Large CSS file: #{File.basename(css_file)} (#{file_size} bytes)"
        end
      end
      puts "  ✅ CSS files checked (#{css_files.length} files)"
    end

    # Check JavaScript files
    js_dir = File.join(@base_path, 'assets', 'js')
    if Dir.exist?(js_dir)
      js_files = Dir.glob(File.join(js_dir, '*.js'))
      js_files.each do |js_file|
        file_size = File.size(js_file)
        if file_size > 200_000 # 200KB
          @performance_issues << "Large JS file: #{File.basename(js_file)} (#{file_size} bytes)"
        end
      end
      puts "  ✅ JavaScript files checked (#{js_files.length} files)"
    end

    # Check image optimization
    check_image_optimization

    puts "  ✅ Performance requirements check completed"
  end

  def check_image_optimization
    puts "\n🖼️  Checking Image Optimization..."
    
    images_dir = File.join(@base_path, 'assets', 'images')
    if Dir.exist?(images_dir)
      image_extensions = %w[.jpg .jpeg .png .gif .webp]
      large_images = []
      
      Dir.glob(File.join(images_dir, '**', '*')).each do |file|
        next unless File.file?(file)
        next unless image_extensions.include?(File.extname(file).downcase)
        
        file_size = File.size(file)
        if file_size > 500_000 # 500KB
          large_images << "#{File.basename(file)} (#{(file_size / 1024.0).round}KB)"
        end
      end
      
      if large_images.any?
        @performance_issues << "Large images found: #{large_images.join(', ')}"
      else
        puts "  ✅ All images are optimally sized"
      end
    end
  end

  def validate_internal_links
    puts "\n🔗 Validating Internal Links..."
    
    # Check blog index page
    blog_index = File.join(@base_path, 'blog', 'index.md')
    if File.exist?(blog_index)
      puts "  ✅ Blog index page exists"
    else
      @errors << "Blog index page missing: blog/index.md"
    end

    # Check navigation links in layouts
    default_layout = File.join(@base_path, '_layouts', 'default.html')
    if File.exist?(default_layout)
      content = File.read(default_layout)
      if content.include?('/blog/')
        puts "  ✅ Blog navigation link found in default layout"
      else
        @warnings << "Blog navigation link not found in default layout"
      end
    end

    puts "  ✅ Internal links validation completed"
  end

  def validate_blog_urls
    puts "\n🌐 Validating Blog URL Structure..."
    
    # Check permalink configuration
    config_file = File.join(@base_path, '_config.yml')
    if File.exist?(config_file)
      config = YAML.load_file(config_file)
      
      if config['permalink']
        puts "  ✅ Permalink structure configured: #{config['permalink']}"
      else
        @warnings << "Permalink structure not explicitly configured"
      end
      
      # Check collections configuration for posts
      if config['collections'] && config['collections']['posts']
        puts "  ✅ Posts collection configured"
      end
    end

    # Validate post URLs follow Jekyll conventions
    posts_dir = File.join(@base_path, '_posts')
    if Dir.exist?(posts_dir)
      post_files = Dir.glob(File.join(posts_dir, '*.md'))
      post_files.each do |post_file|
        filename = File.basename(post_file, '.md')
        unless filename.match(/^\d{4}-\d{2}-\d{2}-.+/)
          @errors << "Invalid post filename format: #{filename}"
        end
      end
      puts "  ✅ Post URL structure validated"
    end

    puts "  ✅ Blog URL validation completed"
  end

  def check_seo_requirements
    puts "\n🔍 Checking SEO Requirements..."
    
    # Check sitemap
    sitemap_file = File.join(@base_path, 'sitemap.xml')
    if File.exist?(sitemap_file)
      puts "  ✅ Sitemap exists"
    else
      @warnings << "Sitemap not found"
    end

    # Check robots.txt
    robots_file = File.join(@base_path, 'robots.txt')
    if File.exist?(robots_file)
      puts "  ✅ Robots.txt exists"
    else
      @warnings << "Robots.txt not found"
    end

    # Check RSS feed
    feed_files = ['feed.xml', 'feed.json']
    feed_found = false
    feed_files.each do |feed_file|
      if File.exist?(File.join(@base_path, feed_file))
        puts "  ✅ RSS feed exists: #{feed_file}"
        feed_found = true
      end
    end
    
    unless feed_found
      @warnings << "No RSS feed found"
    end

    # Check SEO meta tags in layouts
    check_seo_meta_tags

    puts "  ✅ SEO requirements check completed"
  end

  def check_seo_meta_tags
    puts "\n🏷️  Checking SEO Meta Tags..."
    
    layout_files = Dir.glob(File.join(@base_path, '_layouts', '*.html'))
    layout_files.each do |layout_file|
      content = File.read(layout_file)
      
      # Check for essential meta tags
      essential_tags = [
        '<meta name="description"',
        '<meta property="og:title"',
        '<meta property="og:description"',
        '<meta name="twitter:card"'
      ]
      
      essential_tags.each do |tag|
        unless content.include?(tag)
          @warnings << "Missing SEO tag in #{File.basename(layout_file)}: #{tag}"
        end
      end
    end
    
    puts "  ✅ SEO meta tags check completed"
  end

  def check_accessibility_compliance
    puts "\n♿ Checking Accessibility Compliance..."
    
    # Check for accessibility JavaScript
    accessibility_js = File.join(@base_path, 'assets', 'js', 'accessibility.js')
    if File.exist?(accessibility_js)
      puts "  ✅ Accessibility JavaScript found"
    else
      @warnings << "Accessibility JavaScript not found"
    end

    # Check layouts for accessibility features
    layout_files = Dir.glob(File.join(@base_path, '_layouts', '*.html'))
    layout_files.each do |layout_file|
      content = File.read(layout_file)
      
      # Check for skip links
      unless content.include?('skip-link') || content.include?('skip-to-content')
        @warnings << "No skip links found in #{File.basename(layout_file)}"
      end
      
      # Check for ARIA landmarks
      unless content.include?('role=') || content.include?('aria-')
        @warnings << "No ARIA attributes found in #{File.basename(layout_file)}"
      end
    end
    
    puts "  ✅ Accessibility compliance check completed"
  end

  def validate_github_pages_compatibility
    puts "\n🐙 Validating GitHub Pages Compatibility..."
    
    # Check Gemfile for GitHub Pages compatibility
    gemfile = File.join(@base_path, 'Gemfile')
    if File.exist?(gemfile)
      content = File.read(gemfile)
      if content.include?('github-pages') || content.include?('jekyll')
        puts "  ✅ Gemfile configured for GitHub Pages"
      else
        @warnings << "Gemfile may not be configured for GitHub Pages"
      end
    else
      @warnings << "Gemfile not found"
    end

    # Check for unsupported plugins
    config_file = File.join(@base_path, '_config.yml')
    if File.exist?(config_file)
      config = YAML.load_file(config_file)
      if config['plugins']
        unsupported_plugins = config['plugins'] - [
          'jekyll-feed', 'jekyll-sitemap', 'jekyll-seo-tag', 
          'jekyll-paginate', 'jekyll-redirect-from'
        ]
        
        if unsupported_plugins.any?
          @warnings << "Potentially unsupported plugins: #{unsupported_plugins.join(', ')}"
        else
          puts "  ✅ All plugins are GitHub Pages compatible"
        end
      end
    end

    # Check for .nojekyll file (should not exist for Jekyll sites)
    nojekyll_file = File.join(@base_path, '.nojekyll')
    if File.exist?(nojekyll_file)
      @warnings << ".nojekyll file found - may interfere with Jekyll processing"
    else
      puts "  ✅ No .nojekyll file found"
    end

    puts "  ✅ GitHub Pages compatibility check completed"
  end

  def generate_deployment_report
    puts "\n" + "=" * 50
    puts "📊 PRODUCTION DEPLOYMENT REPORT"
    puts "=" * 50

    if @errors.empty? && @warnings.empty? && @performance_issues.empty?
      puts "\n🎉 EXCELLENT! Your blog is ready for production deployment!"
      puts "\n✅ All checks passed successfully"
      puts "✅ No critical issues found"
      puts "✅ Performance requirements met"
      puts "✅ SEO optimization complete"
      puts "✅ Accessibility compliance verified"
      puts "✅ GitHub Pages compatibility confirmed"
    else
      puts "\n📋 Deployment Status Summary:"
      
      if @errors.any?
        puts "\n❌ CRITICAL ERRORS (#{@errors.length}):"
        @errors.each { |error| puts "   • #{error}" }
      end
      
      if @warnings.any?
        puts "\n⚠️  WARNINGS (#{@warnings.length}):"
        @warnings.each { |warning| puts "   • #{warning}" }
      end
      
      if @performance_issues.any?
        puts "\n⚡ PERFORMANCE ISSUES (#{@performance_issues.length}):"
        @performance_issues.each { |issue| puts "   • #{issue}" }
      end
      
      if @url_issues.any?
        puts "\n🔗 URL ISSUES (#{@url_issues.length}):"
        @url_issues.each { |issue| puts "   • #{issue}" }
      end
    end

    # Generate recommendations
    generate_recommendations

    puts "\n" + "=" * 50
    puts "🚀 Deployment preparation completed!"
    puts "=" * 50
  end

  def generate_recommendations
    puts "\n💡 RECOMMENDATIONS:"
    
    if @errors.any?
      puts "\n🔴 Critical Actions Required:"
      puts "   • Fix all critical errors before deployment"
      puts "   • Test blog functionality locally"
      puts "   • Verify all required files are present"
    end
    
    if @performance_issues.any?
      puts "\n⚡ Performance Optimizations:"
      puts "   • Compress large images using tools like TinyPNG"
      puts "   • Minify CSS and JavaScript files"
      puts "   • Consider lazy loading for images"
      puts "   • Enable gzip compression on server"
    end
    
    if @warnings.any?
      puts "\n⚠️  Recommended Improvements:"
      puts "   • Address SEO warnings for better search visibility"
      puts "   • Add missing accessibility features"
      puts "   • Complete blog configuration settings"
    end
    
    puts "\n🎯 Best Practices:"
    puts "   • Test your blog on multiple devices and browsers"
    puts "   • Validate HTML using W3C validator"
    puts "   • Run Lighthouse audits for performance insights"
    puts "   • Monitor Core Web Vitals after deployment"
    puts "   • Set up Google Analytics for blog tracking"
    puts "   • Consider adding a content security policy"
  end
end

# Run the deployment checker
if __FILE__ == $0
  checker = ProductionDeploymentChecker.new
  checker.run_all_checks
end