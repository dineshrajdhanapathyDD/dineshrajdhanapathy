#!/usr/bin/env ruby
# Blog Performance Audit Script
# Comprehensive performance analysis for blog functionality

require 'json'
require 'yaml'
require 'fileutils'

class BlogPerformanceAuditor
  def initialize
    @base_path = File.expand_path('..', __dir__)
    @audit_results = {
      performance_score: 0,
      issues: [],
      recommendations: [],
      metrics: {}
    }
  end

  def run_audit
    puts "🔍 Starting Blog Performance Audit..."
    puts "=" * 50
    
    audit_css_performance
    audit_javascript_performance
    audit_image_optimization
    audit_html_structure
    audit_blog_specific_features
    audit_mobile_performance
    audit_accessibility_performance
    
    calculate_performance_score
    generate_audit_report
    create_optimization_suggestions
  end

  private

  def audit_css_performance
    puts "\n🎨 Auditing CSS Performance..."
    
    css_dir = File.join(@base_path, 'assets', 'css')
    total_css_size = 0
    css_files = []
    
    if Dir.exist?(css_dir)
      Dir.glob(File.join(css_dir, '*.css')).each do |css_file|
        file_size = File.size(css_file)
        total_css_size += file_size
        css_files << {
          name: File.basename(css_file),
          size: file_size,
          size_kb: (file_size / 1024.0).round(2)
        }
        
        # Check for potential issues
        content = File.read(css_file)
        
        # Check for unused vendor prefixes
        if content.include?('-webkit-') || content.include?('-moz-')
          @audit_results[:issues] << "Vendor prefixes found in #{File.basename(css_file)} - consider autoprefixer"
        end
        
        # Check for large CSS files
        if file_size > 100_000
          @audit_results[:issues] << "Large CSS file: #{File.basename(css_file)} (#{(file_size/1024.0).round}KB)"
        end
        
        # Check for critical CSS opportunities
        if File.basename(css_file) == 'blog.css'
          if file_size > 50_000
            @audit_results[:recommendations] << "Consider splitting blog.css into critical and non-critical parts"
          end
        end
      end
    end
    
    @audit_results[:metrics][:total_css_size] = total_css_size
    @audit_results[:metrics][:css_files] = css_files
    
    puts "  ✅ CSS audit completed - #{css_files.length} files, #{(total_css_size/1024.0).round}KB total"
  end

  def audit_javascript_performance
    puts "\n⚡ Auditing JavaScript Performance..."
    
    js_dir = File.join(@base_path, 'assets', 'js')
    total_js_size = 0
    js_files = []
    
    if Dir.exist?(js_dir)
      Dir.glob(File.join(js_dir, '*.js')).each do |js_file|
        next if js_file.include?('.min.js') # Skip already minified files
        
        file_size = File.size(js_file)
        total_js_size += file_size
        js_files << {
          name: File.basename(js_file),
          size: file_size,
          size_kb: (file_size / 1024.0).round(2)
        }
        
        content = File.read(js_file)
        
        # Check for console.log statements
        if content.include?('console.log')
          @audit_results[:issues] << "Console.log statements found in #{File.basename(js_file)}"
        end
        
        # Check for large JavaScript files
        if file_size > 200_000
          @audit_results[:issues] << "Large JS file: #{File.basename(js_file)} (#{(file_size/1024.0).round}KB)"
        end
        
        # Check for modern JavaScript features
        if content.include?('addEventListener')
          # Good - using modern event handling
        elsif content.include?('attachEvent')
          @audit_results[:issues] << "Legacy event handling found in #{File.basename(js_file)}"
        end
        
        # Check for blog-specific optimizations
        if File.basename(js_file) == 'blog.js'
          audit_blog_javascript(content, File.basename(js_file))
        end
      end
    end
    
    @audit_results[:metrics][:total_js_size] = total_js_size
    @audit_results[:metrics][:js_files] = js_files
    
    puts "  ✅ JavaScript audit completed - #{js_files.length} files, #{(total_js_size/1024.0).round}KB total"
  end

  def audit_blog_javascript(content, filename)
    puts "\n📝 Auditing Blog-Specific JavaScript..."
    
    # Check for performance optimizations
    optimizations = {
      debouncing: content.include?('debounce'),
      throttling: content.include?('throttle'),
      lazy_loading: content.include?('IntersectionObserver') || content.include?('lazy'),
      event_delegation: content.include?('event.target'),
      request_animation_frame: content.include?('requestAnimationFrame')
    }
    
    optimizations.each do |optimization, present|
      if present
        puts "  ✅ #{optimization.to_s.humanize} implemented"
      else
        @audit_results[:recommendations] << "Consider implementing #{optimization.to_s.humanize} in #{filename}"
      end
    end
    
    # Check for search functionality optimization
    if content.include?('search')
      if content.include?('debounce')
        puts "  ✅ Search debouncing implemented"
      else
        @audit_results[:issues] << "Search functionality should use debouncing for better performance"
      end
    end
    
    # Check for image optimization
    if content.include?('img') || content.include?('image')
      if content.include?('loading="lazy"') || content.include?('lazy')
        puts "  ✅ Image lazy loading implemented"
      else
        @audit_results[:recommendations] << "Implement image lazy loading for better performance"
      end
    end
  end

  def audit_image_optimization
    puts "\n🖼️  Auditing Image Optimization..."
    
    images_dir = File.join(@base_path, 'assets', 'images')
    total_image_size = 0
    image_files = []
    format_distribution = Hash.new(0)
    
    if Dir.exist?(images_dir)
      Dir.glob(File.join(images_dir, '**', '*')).each do |image_file|
        next unless File.file?(image_file)
        
        ext = File.extname(image_file).downcase
        next unless %w[.jpg .jpeg .png .gif .webp .svg].include?(ext)
        
        file_size = File.size(image_file)
        total_image_size += file_size
        format_distribution[ext] += 1
        
        image_files << {
          name: File.basename(image_file),
          size: file_size,
          size_kb: (file_size / 1024.0).round(2),
          format: ext
        }
        
        # Check for optimization opportunities
        if file_size > 500_000 # 500KB
          @audit_results[:issues] << "Large image: #{File.basename(image_file)} (#{(file_size/1024.0).round}KB)"
        end
        
        # Check for modern formats
        if %w[.jpg .jpeg .png].include?(ext) && file_size > 100_000
          @audit_results[:recommendations] << "Consider WebP format for #{File.basename(image_file)}"
        end
      end
    end
    
    @audit_results[:metrics][:total_image_size] = total_image_size
    @audit_results[:metrics][:image_files] = image_files
    @audit_results[:metrics][:format_distribution] = format_distribution
    
    # Check for WebP support
    if format_distribution['.webp'] > 0
      puts "  ✅ WebP images found - modern format support"
    else
      @audit_results[:recommendations] << "Consider adding WebP images for better compression"
    end
    
    puts "  ✅ Image audit completed - #{image_files.length} files, #{(total_image_size/1024.0).round}KB total"
  end

  def audit_html_structure
    puts "\n📄 Auditing HTML Structure..."
    
    layout_files = Dir.glob(File.join(@base_path, '_layouts', '*.html'))
    layout_files.each do |layout_file|
      content = File.read(layout_file)
      filename = File.basename(layout_file)
      
      # Check for semantic HTML
      semantic_elements = %w[header nav main article section aside footer]
      semantic_count = semantic_elements.count { |element| content.include?("<#{element}") }
      
      if semantic_count >= 3
        puts "  ✅ Good semantic HTML structure in #{filename}"
      else
        @audit_results[:recommendations] << "Improve semantic HTML structure in #{filename}"
      end
      
      # Check for proper heading hierarchy
      headings = content.scan(/<h([1-6])/).flatten.map(&:to_i)
      if headings.any? && headings.first == 1
        puts "  ✅ Proper heading hierarchy in #{filename}"
      else
        @audit_results[:issues] << "Heading hierarchy issues in #{filename}"
      end
      
      # Check for meta tags
      if content.include?('<meta name="description"')
        puts "  ✅ Meta description found in #{filename}"
      else
        @audit_results[:issues] << "Missing meta description in #{filename}"
      end
    end
    
    puts "  ✅ HTML structure audit completed"
  end

  def audit_blog_specific_features
    puts "\n📚 Auditing Blog-Specific Features..."
    
    # Check blog index page
    blog_index = File.join(@base_path, 'blog', 'index.md')
    if File.exist?(blog_index)
      content = File.read(blog_index)
      
      # Check for pagination
      if content.include?('paginate') || content.include?('page.')
        puts "  ✅ Pagination implemented"
      else
        @audit_results[:recommendations] << "Consider implementing pagination for better performance"
      end
      
      # Check for search functionality
      if content.include?('search') || File.exist?(File.join(@base_path, 'assets', 'js', 'blog.js'))
        puts "  ✅ Search functionality available"
      else
        @audit_results[:recommendations] << "Consider adding search functionality"
      end
    end
    
    # Check post layout
    post_layout = File.join(@base_path, '_layouts', 'post.html')
    if File.exist?(post_layout)
      content = File.read(post_layout)
      
      # Check for reading time
      if content.include?('reading_time') || content.include?('read-time')
        puts "  ✅ Reading time calculation implemented"
      else
        @audit_results[:recommendations] << "Add reading time calculation for better UX"
      end
      
      # Check for social sharing
      if content.include?('share') || content.include?('social')
        puts "  ✅ Social sharing implemented"
      else
        @audit_results[:recommendations] << "Add social sharing buttons"
      end
      
      # Check for related posts
      if content.include?('related') || content.include?('site.related_posts')
        puts "  ✅ Related posts feature implemented"
      else
        @audit_results[:recommendations] << "Consider adding related posts feature"
      end
    end
    
    puts "  ✅ Blog features audit completed"
  end

  def audit_mobile_performance
    puts "\n📱 Auditing Mobile Performance..."
    
    # Check for responsive design
    css_files = Dir.glob(File.join(@base_path, 'assets', 'css', '*.css'))
    mobile_optimized = false
    
    css_files.each do |css_file|
      content = File.read(css_file)
      
      if content.include?('@media') && (content.include?('max-width') || content.include?('min-width'))
        mobile_optimized = true
        puts "  ✅ Responsive design implemented in #{File.basename(css_file)}"
      end
      
      # Check for mobile-specific optimizations
      if content.include?('touch-action') || content.include?('user-select')
        puts "  ✅ Touch optimizations found"
      end
    end
    
    unless mobile_optimized
      @audit_results[:issues] << "No responsive design media queries found"
    end
    
    # Check viewport meta tag
    layout_files = Dir.glob(File.join(@base_path, '_layouts', '*.html'))
    viewport_found = false
    
    layout_files.each do |layout_file|
      content = File.read(layout_file)
      if content.include?('name="viewport"')
        viewport_found = true
        puts "  ✅ Viewport meta tag found"
        break
      end
    end
    
    unless viewport_found
      @audit_results[:issues] << "Viewport meta tag missing"
    end
    
    puts "  ✅ Mobile performance audit completed"
  end

  def audit_accessibility_performance
    puts "\n♿ Auditing Accessibility Performance..."
    
    layout_files = Dir.glob(File.join(@base_path, '_layouts', '*.html'))
    accessibility_score = 0
    
    layout_files.each do |layout_file|
      content = File.read(layout_file)
      filename = File.basename(layout_file)
      
      # Check for ARIA attributes
      if content.include?('aria-') || content.include?('role=')
        accessibility_score += 1
        puts "  ✅ ARIA attributes found in #{filename}"
      end
      
      # Check for skip links
      if content.include?('skip-link') || content.include?('skip-to')
        accessibility_score += 1
        puts "  ✅ Skip links found in #{filename}"
      end
      
      # Check for alt attributes on images
      img_tags = content.scan(/<img[^>]*>/)
      img_tags.each do |img_tag|
        unless img_tag.include?('alt=')
          @audit_results[:issues] << "Image without alt attribute in #{filename}"
        end
      end
      
      # Check for proper form labels
      if content.include?('<form')
        if content.include?('<label') || content.include?('aria-label')
          accessibility_score += 1
          puts "  ✅ Form labels found in #{filename}"
        else
          @audit_results[:issues] << "Form without proper labels in #{filename}"
        end
      end
    end
    
    @audit_results[:metrics][:accessibility_score] = accessibility_score
    
    puts "  ✅ Accessibility audit completed - Score: #{accessibility_score}/#{layout_files.length * 3}"
  end

  def calculate_performance_score
    puts "\n📊 Calculating Performance Score..."
    
    score = 100
    
    # Deduct points for issues
    score -= @audit_results[:issues].length * 5
    
    # Deduct points for large files
    total_size = (@audit_results[:metrics][:total_css_size] || 0) + 
                 (@audit_results[:metrics][:total_js_size] || 0) + 
                 (@audit_results[:metrics][:total_image_size] || 0)
    
    if total_size > 2_000_000 # 2MB
      score -= 10
    elsif total_size > 1_000_000 # 1MB
      score -= 5
    end
    
    # Bonus points for optimizations
    if @audit_results[:metrics][:format_distribution] && @audit_results[:metrics][:format_distribution]['.webp'] > 0
      score += 5
    end
    
    if @audit_results[:metrics][:accessibility_score] && @audit_results[:metrics][:accessibility_score] > 0
      score += 5
    end
    
    @audit_results[:performance_score] = [score, 0].max
    
    puts "  ✅ Performance score calculated: #{@audit_results[:performance_score]}/100"
  end

  def generate_audit_report
    puts "\n" + "=" * 50
    puts "📊 BLOG PERFORMANCE AUDIT REPORT"
    puts "=" * 50
    
    puts "\n🎯 Overall Performance Score: #{@audit_results[:performance_score]}/100"
    
    if @audit_results[:performance_score] >= 90
      puts "🎉 EXCELLENT! Your blog performance is outstanding!"
    elsif @audit_results[:performance_score] >= 75
      puts "✅ GOOD! Your blog performance is solid with room for improvement."
    elsif @audit_results[:performance_score] >= 60
      puts "⚠️  FAIR! Your blog performance needs attention."
    else
      puts "❌ POOR! Your blog performance requires immediate optimization."
    end
    
    # File size summary
    if @audit_results[:metrics][:total_css_size]
      puts "\n📁 File Size Summary:"
      puts "   CSS: #{(@audit_results[:metrics][:total_css_size] / 1024.0).round}KB"
      puts "   JavaScript: #{(@audit_results[:metrics][:total_js_size] / 1024.0).round}KB"
      puts "   Images: #{(@audit_results[:metrics][:total_image_size] / 1024.0).round}KB"
      
      total_size = @audit_results[:metrics][:total_css_size] + 
                   @audit_results[:metrics][:total_js_size] + 
                   @audit_results[:metrics][:total_image_size]
      puts "   Total: #{(total_size / 1024.0).round}KB"
    end
    
    # Issues
    if @audit_results[:issues].any?
      puts "\n❌ Issues Found (#{@audit_results[:issues].length}):"
      @audit_results[:issues].each { |issue| puts "   • #{issue}" }
    end
    
    # Recommendations
    if @audit_results[:recommendations].any?
      puts "\n💡 Recommendations (#{@audit_results[:recommendations].length}):"
      @audit_results[:recommendations].each { |rec| puts "   • #{rec}" }
    end
  end

  def create_optimization_suggestions
    puts "\n🚀 OPTIMIZATION SUGGESTIONS:"
    
    puts "\n⚡ Immediate Actions:"
    puts "   • Compress and optimize all images over 100KB"
    puts "   • Minify CSS and JavaScript files"
    puts "   • Remove console.log statements from production code"
    puts "   • Add missing alt attributes to images"
    
    puts "\n🎯 Performance Improvements:"
    puts "   • Implement lazy loading for images and non-critical content"
    puts "   • Use WebP format for images where supported"
    puts "   • Add debouncing to search functionality"
    puts "   • Implement critical CSS for above-the-fold content"
    
    puts "\n📱 Mobile Optimizations:"
    puts "   • Ensure all touch targets are at least 44px"
    puts "   • Optimize font loading with font-display: swap"
    puts "   • Test on various mobile devices and screen sizes"
    puts "   • Implement service worker for offline functionality"
    
    puts "\n♿ Accessibility Enhancements:"
    puts "   • Add ARIA labels to interactive elements"
    puts "   • Ensure proper heading hierarchy (h1 → h2 → h3)"
    puts "   • Implement skip links for keyboard navigation"
    puts "   • Test with screen readers"
    
    puts "\n🔍 SEO Optimizations:"
    puts "   • Add structured data markup for blog posts"
    puts "   • Optimize meta descriptions for each page"
    puts "   • Implement breadcrumb navigation"
    puts "   • Add canonical URLs to prevent duplicate content"
    
    # Save audit results to file
    save_audit_results
  end

  def save_audit_results
    results_file = File.join(@base_path, 'blog-performance-audit-results.json')
    File.write(results_file, JSON.pretty_generate(@audit_results))
    puts "\n💾 Audit results saved to: blog-performance-audit-results.json"
  end
end

# String humanize method
class String
  def humanize
    self.gsub('_', ' ').split.map(&:capitalize).join(' ')
  end
end

# Run the audit
if __FILE__ == $0
  auditor = BlogPerformanceAuditor.new
  auditor.run_audit
end