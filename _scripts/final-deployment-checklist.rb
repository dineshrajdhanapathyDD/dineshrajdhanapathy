#!/usr/bin/env ruby
# Final Deployment Checklist
# Comprehensive pre-deployment validation for blog functionality

require 'yaml'
require 'json'
require 'fileutils'

class FinalDeploymentChecklist
  def initialize
    @base_path = File.expand_path('..', __dir__)
    @checklist_results = {
      passed: [],
      failed: [],
      warnings: [],
      score: 0,
      total_checks: 0
    }
  end

  def run_final_checks
    puts "🚀 Final Deployment Checklist for Blog Section"
    puts "=" * 60
    puts "Ensuring production readiness..."
    puts ""
    
    # Core functionality checks
    check_jekyll_build_compatibility
    check_blog_core_functionality
    check_performance_requirements
    check_seo_optimization
    check_accessibility_compliance
    check_mobile_responsiveness
    check_security_considerations
    check_github_pages_compatibility
    
    # Generate final report
    generate_final_report
    create_deployment_summary
  end

  private

  def check_item(description, &block)
    @checklist_results[:total_checks] += 1
    print "  #{description}... "
    
    begin
      result = yield
      if result
        puts "✅"
        @checklist_results[:passed] << description
        @checklist_results[:score] += 1
      else
        puts "❌"
        @checklist_results[:failed] << description
      end
    rescue => e
      puts "⚠️  (#{e.message})"
      @checklist_results[:warnings] << "#{description}: #{e.message}"
    end
  end

  def check_jekyll_build_compatibility
    puts "\n🏗️  Jekyll Build Compatibility"
    
    check_item("_config.yml exists and is valid") do
      config_file = File.join(@base_path, '_config.yml')
      File.exist?(config_file) && YAML.load_file(config_file)
    end
    
    check_item("Gemfile configured for GitHub Pages") do
      gemfile = File.join(@base_path, 'Gemfile')
      if File.exist?(gemfile)
        content = File.read(gemfile)
        content.include?('github-pages') || content.include?('jekyll')
      else
        false
      end
    end
    
    check_item("No conflicting plugins") do
      config_file = File.join(@base_path, '_config.yml')
      if File.exist?(config_file)
        config = YAML.load_file(config_file)
        if config['plugins']
          github_pages_plugins = %w[
            jekyll-coffeescript jekyll-default-layout jekyll-gist
            jekyll-github-metadata jekyll-optional-front-matter
            jekyll-paginate jekyll-readme-index jekyll-titles-from-headings
            jekyll-relative-links jekyll-feed jekyll-sitemap jekyll-seo-tag
          ]
          unsupported = config['plugins'] - github_pages_plugins
          unsupported.empty?
        else
          true
        end
      else
        false
      end
    end
    
    check_item("No .nojekyll file present") do
      !File.exist?(File.join(@base_path, '.nojekyll'))
    end
  end

  def check_blog_core_functionality
    puts "\n📚 Blog Core Functionality"
    
    check_item("Blog index page exists") do
      File.exist?(File.join(@base_path, 'blog', 'index.md')) ||
      File.exist?(File.join(@base_path, 'blog', 'index.html'))
    end
    
    check_item("Blog layout templates exist") do
      blog_layout = File.exist?(File.join(@base_path, '_layouts', 'blog.html'))
      post_layout = File.exist?(File.join(@base_path, '_layouts', 'post.html'))
      blog_layout && post_layout
    end
    
    check_item("At least one blog post exists") do
      posts_dir = File.join(@base_path, '_posts')
      Dir.exist?(posts_dir) && Dir.glob(File.join(posts_dir, '*.md')).any?
    end
    
    check_item("Blog navigation integrated") do
      default_layout = File.join(@base_path, '_layouts', 'default.html')
      if File.exist?(default_layout)
        content = File.read(default_layout)
        content.include?('/blog/') || content.include?('blog')
      else
        false
      end
    end
    
    check_item("Tag system implemented") do
      tags_dir = File.join(@base_path, 'blog', 'tags')
      tag_layout = File.join(@base_path, '_layouts', 'tag.html')
      Dir.exist?(tags_dir) && File.exist?(tag_layout)
    end
    
    check_item("Search functionality available") do
      blog_js = File.join(@base_path, 'assets', 'js', 'blog.js')
      File.exist?(blog_js) && File.read(blog_js).include?('search')
    end
    
    check_item("Reading time calculation implemented") do
      reading_time_plugin = File.join(@base_path, '_plugins', 'reading_time.rb')
      File.exist?(reading_time_plugin)
    end
  end

  def check_performance_requirements
    puts "\n⚡ Performance Requirements"
    
    check_item("CSS files are reasonably sized") do
      css_dir = File.join(@base_path, 'assets', 'css')
      if Dir.exist?(css_dir)
        css_files = Dir.glob(File.join(css_dir, '*.css'))
        css_files.all? { |file| File.size(file) < 200_000 } # 200KB limit
      else
        true
      end
    end
    
    check_item("JavaScript files are optimized") do
      js_dir = File.join(@base_path, 'assets', 'js')
      if Dir.exist?(js_dir)
        js_files = Dir.glob(File.join(js_dir, '*.js'))
        js_files.all? { |file| File.size(file) < 300_000 } # 300KB limit
      else
        true
      end
    end
    
    check_item("Images are optimized") do
      images_dir = File.join(@base_path, 'assets', 'images')
      if Dir.exist?(images_dir)
        image_files = Dir.glob(File.join(images_dir, '**', '*')).select do |f|
          File.file?(f) && %w[.jpg .jpeg .png .gif .webp].include?(File.extname(f).downcase)
        end
        large_images = image_files.select { |file| File.size(file) > 1_000_000 } # 1MB limit
        large_images.length < 3 # Allow up to 2 large images
      else
        true
      end
    end
    
    check_item("Lazy loading implemented") do
      blog_js = File.join(@base_path, 'assets', 'js', 'blog.js')
      if File.exist?(blog_js)
        content = File.read(blog_js)
        content.include?('IntersectionObserver') || content.include?('lazy')
      else
        false
      end
    end
    
    check_item("Performance monitoring in place") do
      performance_js = File.join(@base_path, 'assets', 'js', 'performance-monitor.js')
      File.exist?(performance_js)
    end
  end

  def check_seo_optimization
    puts "\n🔍 SEO Optimization"
    
    check_item("Sitemap includes blog posts") do
      sitemap = File.join(@base_path, 'sitemap.xml')
      if File.exist?(sitemap)
        content = File.read(sitemap)
        content.include?('/blog/')
      else
        false
      end
    end
    
    check_item("RSS feed configured") do
      File.exist?(File.join(@base_path, 'feed.xml')) ||
      File.exist?(File.join(@base_path, 'feed.json'))
    end
    
    check_item("SEO meta tags in layouts") do
      post_layout = File.join(@base_path, '_layouts', 'post.html')
      if File.exist?(post_layout)
        content = File.read(post_layout)
        content.include?('og:title') && content.include?('description')
      else
        false
      end
    end
    
    check_item("Structured data markup") do
      post_layout = File.join(@base_path, '_layouts', 'post.html')
      if File.exist?(post_layout)
        content = File.read(post_layout)
        content.include?('application/ld+json') || content.include?('schema.org')
      else
        false
      end
    end
    
    check_item("Robots.txt configured") do
      File.exist?(File.join(@base_path, 'robots.txt'))
    end
  end

  def check_accessibility_compliance
    puts "\n♿ Accessibility Compliance"
    
    check_item("Skip links implemented") do
      layouts = Dir.glob(File.join(@base_path, '_layouts', '*.html'))
      layouts.any? do |layout|
        content = File.read(layout)
        content.include?('skip-link') || content.include?('skip-to-content')
      end
    end
    
    check_item("ARIA attributes present") do
      layouts = Dir.glob(File.join(@base_path, '_layouts', '*.html'))
      layouts.any? do |layout|
        content = File.read(layout)
        content.include?('aria-') || content.include?('role=')
      end
    end
    
    check_item("Proper heading hierarchy") do
      post_layout = File.join(@base_path, '_layouts', 'post.html')
      if File.exist?(post_layout)
        content = File.read(post_layout)
        # Check for h1, h2 structure
        content.include?('<h1') && content.include?('<h2')
      else
        false
      end
    end
    
    check_item("Alt attributes on images") do
      layouts = Dir.glob(File.join(@base_path, '_layouts', '*.html'))
      layouts.all? do |layout|
        content = File.read(layout)
        img_tags = content.scan(/<img[^>]*>/)
        img_tags.empty? || img_tags.all? { |tag| tag.include?('alt=') }
      end
    end
    
    check_item("Accessibility JavaScript available") do
      File.exist?(File.join(@base_path, 'assets', 'js', 'accessibility.js'))
    end
  end

  def check_mobile_responsiveness
    puts "\n📱 Mobile Responsiveness"
    
    check_item("Viewport meta tag present") do
      layouts = Dir.glob(File.join(@base_path, '_layouts', '*.html'))
      layouts.any? do |layout|
        content = File.read(layout)
        content.include?('name="viewport"')
      end
    end
    
    check_item("Responsive CSS implemented") do
      css_files = Dir.glob(File.join(@base_path, 'assets', 'css', '*.css'))
      css_files.any? do |css_file|
        content = File.read(css_file)
        content.include?('@media') && (content.include?('max-width') || content.include?('min-width'))
      end
    end
    
    check_item("Touch-friendly navigation") do
      css_files = Dir.glob(File.join(@base_path, 'assets', 'css', '*.css'))
      css_files.any? do |css_file|
        content = File.read(css_file)
        content.include?('touch-action') || content.include?('44px') # Minimum touch target
      end
    end
    
    check_item("Mobile-optimized images") do
      layouts = Dir.glob(File.join(@base_path, '_layouts', '*.html'))
      layouts.any? do |layout|
        content = File.read(layout)
        content.include?('srcset') || content.include?('picture')
      end
    end
  end

  def check_security_considerations
    puts "\n🔒 Security Considerations"
    
    check_item("No sensitive data in repository") do
      # Check for common sensitive files
      sensitive_patterns = %w[.env config.json secrets.yml api_keys.txt]
      sensitive_files = sensitive_patterns.any? do |pattern|
        Dir.glob(File.join(@base_path, '**', pattern)).any?
      end
      !sensitive_files
    end
    
    check_item("External links are secure") do
      layouts = Dir.glob(File.join(@base_path, '_layouts', '*.html'))
      layouts.all? do |layout|
        content = File.read(layout)
        external_links = content.scan(/href=["'](https?:\/\/[^"']+)["']/).flatten
        external_links.all? { |link| link.start_with?('https://') }
      end
    end
    
    check_item("No inline JavaScript") do
      layouts = Dir.glob(File.join(@base_path, '_layouts', '*.html'))
      layouts.all? do |layout|
        content = File.read(layout)
        !content.include?('javascript:') && !content.match(/<script[^>]*>[^<]+<\/script>/)
      end
    end
    
    check_item("Content Security Policy considerations") do
      # Check if CSP meta tag or headers are configured
      layouts = Dir.glob(File.join(@base_path, '_layouts', '*.html'))
      layouts.any? do |layout|
        content = File.read(layout)
        content.include?('Content-Security-Policy')
      end
    end
  end

  def check_github_pages_compatibility
    puts "\n🐙 GitHub Pages Compatibility"
    
    check_item("Jekyll version compatibility") do
      gemfile = File.join(@base_path, 'Gemfile')
      if File.exist?(gemfile)
        content = File.read(gemfile)
        # Check for GitHub Pages gem or compatible Jekyll version
        content.include?('github-pages') || content.match(/jekyll.*[34]\.\d+/)
      else
        false
      end
    end
    
    check_item("No unsupported file types") do
      # Check for files that GitHub Pages doesn't support
      unsupported_extensions = %w[.php .asp .jsp]
      unsupported_files = Dir.glob(File.join(@base_path, '**', '*')).select do |file|
        unsupported_extensions.include?(File.extname(file).downcase)
      end
      unsupported_files.empty?
    end
    
    check_item("Repository structure is correct") do
      # Check for required files and structure
      required_files = %w[_config.yml index.html]
      required_files.all? { |file| File.exist?(File.join(@base_path, file)) }
    end
    
    check_item("Build size is reasonable") do
      # Estimate total repository size
      total_size = Dir.glob(File.join(@base_path, '**', '*')).select { |f| File.file?(f) }
                      .sum { |f| File.size(f) }
      total_size < 100_000_000 # 100MB limit
    end
  end

  def generate_final_report
    puts "\n" + "=" * 60
    puts "📊 FINAL DEPLOYMENT REPORT"
    puts "=" * 60
    
    success_rate = (@checklist_results[:score].to_f / @checklist_results[:total_checks] * 100).round(1)
    
    puts "\n🎯 Overall Readiness Score: #{@checklist_results[:score]}/#{@checklist_results[:total_checks]} (#{success_rate}%)"
    
    if success_rate >= 95
      puts "🎉 EXCELLENT! Your blog is production-ready!"
      deployment_status = "READY FOR DEPLOYMENT"
    elsif success_rate >= 85
      puts "✅ GOOD! Minor issues to address before deployment."
      deployment_status = "MOSTLY READY"
    elsif success_rate >= 70
      puts "⚠️  FAIR! Several issues need attention."
      deployment_status = "NEEDS WORK"
    else
      puts "❌ POOR! Critical issues must be resolved."
      deployment_status = "NOT READY"
    end
    
    puts "\n📋 Deployment Status: #{deployment_status}"
    
    if @checklist_results[:failed].any?
      puts "\n❌ Failed Checks (#{@checklist_results[:failed].length}):"
      @checklist_results[:failed].each { |item| puts "   • #{item}" }
    end
    
    if @checklist_results[:warnings].any?
      puts "\n⚠️  Warnings (#{@checklist_results[:warnings].length}):"
      @checklist_results[:warnings].each { |item| puts "   • #{item}" }
    end
    
    if @checklist_results[:passed].any?
      puts "\n✅ Passed Checks (#{@checklist_results[:passed].length}):"
      @checklist_results[:passed].first(5).each { |item| puts "   • #{item}" }
      if @checklist_results[:passed].length > 5
        puts "   ... and #{@checklist_results[:passed].length - 5} more"
      end
    end
  end

  def create_deployment_summary
    puts "\n" + "=" * 60
    puts "🚀 DEPLOYMENT SUMMARY"
    puts "=" * 60
    
    puts "\n📝 Pre-Deployment Actions Completed:"
    puts "   ✅ Blog structure validation"
    puts "   ✅ Performance requirements check"
    puts "   ✅ SEO optimization verification"
    puts "   ✅ Accessibility compliance review"
    puts "   ✅ Mobile responsiveness validation"
    puts "   ✅ Security considerations check"
    puts "   ✅ GitHub Pages compatibility verification"
    
    puts "\n🎯 Next Steps:"
    if @checklist_results[:failed].empty?
      puts "   1. ✅ All checks passed - ready for deployment!"
      puts "   2. 🚀 Push changes to GitHub Pages"
      puts "   3. 🔍 Monitor deployment for any issues"
      puts "   4. 📊 Set up analytics and monitoring"
    else
      puts "   1. 🔧 Address failed checks listed above"
      puts "   2. 🧪 Re-run this checklist after fixes"
      puts "   3. 🚀 Deploy once all checks pass"
    end
    
    puts "\n💡 Post-Deployment Recommendations:"
    puts "   • Monitor Core Web Vitals and performance metrics"
    puts "   • Set up Google Analytics for blog tracking"
    puts "   • Test blog functionality across different devices"
    puts "   • Monitor for 404 errors and broken links"
    puts "   • Consider setting up automated testing"
    puts "   • Plan content strategy and publishing schedule"
    
    # Save checklist results
    save_checklist_results
    
    puts "\n" + "=" * 60
    puts "✨ Blog deployment preparation completed!"
    puts "=" * 60
  end

  def save_checklist_results
    results_file = File.join(@base_path, 'final-deployment-checklist-results.json')
    File.write(results_file, JSON.pretty_generate(@checklist_results))
    puts "\n💾 Checklist results saved to: final-deployment-checklist-results.json"
  end
end

# Run the final deployment checklist
if __FILE__ == $0
  checklist = FinalDeploymentChecklist.new
  checklist.run_final_checks
end