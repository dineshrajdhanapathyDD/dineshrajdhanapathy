require 'mini_magick'
require 'fileutils'

module Jekyll
  class PerformanceOptimizer < Generator
    safe true
    priority :low

    def generate(site)
      @site = site
      
      optimize_images if should_optimize?
      generate_critical_css
      optimize_assets
      add_performance_headers
      
      Jekyll.logger.info "Performance Optimizer:", "Optimizations complete"
    end

    private

    def should_optimize?
      ENV['JEKYLL_ENV'] == 'production' || ENV['OPTIMIZE_ASSETS'] == 'true'
    end

    def optimize_images
      Jekyll.logger.info "Performance Optimizer:", "Optimizing images..."
      
      blog_images_dir = File.join(@site.source, 'assets', 'images', 'blog')
      return unless Dir.exist?(blog_images_dir)

      Dir.glob(File.join(blog_images_dir, '**', '*.{jpg,jpeg,png}')).each do |image_path|
        optimize_image(image_path)
      end
    end

    def optimize_image(image_path)
      return unless File.exist?(image_path)
      
      begin
        image = MiniMagick::Image.open(image_path)
        original_size = File.size(image_path)
        
        # Skip if already optimized (file modified recently)
        return if File.mtime(image_path) > Time.now - 3600
        
        # Resize if too large
        if image.width > 1200
          image.resize "1200x"
        end
        
        # Optimize quality
        if image_path.match?(/\.jpe?g$/i)
          image.quality "85"
        end
        
        # Strip metadata
        image.strip
        
        # Write optimized image
        image.write image_path
        
        new_size = File.size(image_path)
        savings = ((original_size - new_size).to_f / original_size * 100).round(1)
        
        if savings > 5
          Jekyll.logger.info "Performance Optimizer:", 
            "Optimized #{File.basename(image_path)} - #{savings}% smaller"
        end
        
      rescue => e
        Jekyll.logger.warn "Performance Optimizer:", 
          "Failed to optimize #{File.basename(image_path)}: #{e.message}"
      end
    end

    def generate_critical_css
      Jekyll.logger.info "Performance Optimizer:", "Generating critical CSS..."
      
      critical_css = extract_critical_css
      
      if critical_css && !critical_css.empty?
        critical_css_path = File.join(@site.dest, 'assets', 'css', 'critical.css')
        FileUtils.mkdir_p(File.dirname(critical_css_path))
        File.write(critical_css_path, critical_css)
        
        Jekyll.logger.info "Performance Optimizer:", "Critical CSS generated"
      end
    end

    def extract_critical_css
      # Extract critical CSS for above-the-fold content
      critical_selectors = [
        '.header', '.nav', '.hero', '.blog__header',
        '.post__header', '.post__title', '.post__meta',
        '.post-preview:first-child', '.blog__search',
        'body', 'html', 'h1', 'h2', 'p'
      ]
      
      css_files = Dir.glob(File.join(@site.dest, 'assets', 'css', '*.css'))
      critical_css = ""
      
      css_files.each do |css_file|
        content = File.read(css_file)
        
        critical_selectors.each do |selector|
          # Simple regex to extract CSS rules for critical selectors
          matches = content.scan(/#{Regexp.escape(selector)}[^{]*\{[^}]*\}/m)
          critical_css += matches.join("\n") + "\n"
        end
      end
      
      # Minify critical CSS
      critical_css.gsub(/\s+/, ' ').gsub(/;\s*}/, '}').strip
    end

    def optimize_assets
      Jekyll.logger.info "Performance Optimizer:", "Optimizing CSS and JS assets..."
      
      # Minify CSS files
      css_files = Dir.glob(File.join(@site.dest, 'assets', 'css', '*.css'))
      css_files.each { |file| minify_css(file) }
      
      # Minify JS files
      js_files = Dir.glob(File.join(@site.dest, 'assets', 'js', '*.js'))
      js_files.each { |file| minify_js(file) }
    end

    def minify_css(file_path)
      return if file_path.include?('.min.css')
      
      content = File.read(file_path)
      
      # Simple CSS minification
      minified = content
        .gsub(/\/\*.*?\*\//m, '') # Remove comments
        .gsub(/\s+/, ' ')         # Collapse whitespace
        .gsub(/;\s*}/, '}')       # Remove unnecessary semicolons
        .gsub(/\s*{\s*/, '{')     # Clean braces
        .gsub(/\s*}\s*/, '}')
        .gsub(/\s*;\s*/, ';')     # Clean semicolons
        .strip
      
      # Only write if significantly smaller
      if minified.length < content.length * 0.9
        File.write(file_path, minified)
        Jekyll.logger.info "Performance Optimizer:", 
          "Minified #{File.basename(file_path)}"
      end
    end

    def minify_js(file_path)
      return if file_path.include?('.min.js')
      
      content = File.read(file_path)
      
      # Simple JS minification (basic)
      minified = content
        .gsub(/\/\/.*$/, '')      # Remove single-line comments
        .gsub(/\/\*.*?\*\//m, '') # Remove multi-line comments
        .gsub(/\s+/, ' ')         # Collapse whitespace
        .gsub(/;\s*}/, '}')       # Clean up
        .strip
      
      # Only write if significantly smaller
      if minified.length < content.length * 0.9
        File.write(file_path, minified)
        Jekyll.logger.info "Performance Optimizer:", 
          "Minified #{File.basename(file_path)}"
      end
    end

    def add_performance_headers
      # Generate _headers file for Netlify or similar
      headers_content = generate_headers_file
      
      if headers_content
        headers_path = File.join(@site.dest, '_headers')
        File.write(headers_path, headers_content)
        Jekyll.logger.info "Performance Optimizer:", "Generated _headers file"
      end
    end

    def generate_headers_file
      <<~HEADERS
        # Performance and Security Headers
        
        /*
          # Cache Control
          Cache-Control: public, max-age=31536000
          
          # Security Headers
          X-Frame-Options: DENY
          X-Content-Type-Options: nosniff
          X-XSS-Protection: 1; mode=block
          Referrer-Policy: strict-origin-when-cross-origin
          
          # Performance Headers
          X-DNS-Prefetch-Control: on

        # HTML files - shorter cache
        /*.html
          Cache-Control: public, max-age=3600
          
        # CSS and JS files - long cache with versioning
        /assets/css/*
          Cache-Control: public, max-age=31536000, immutable
          
        /assets/js/*
          Cache-Control: public, max-age=31536000, immutable
          
        # Images - long cache
        /assets/images/*
          Cache-Control: public, max-age=31536000, immutable
          
        # Fonts - long cache
        /assets/fonts/*
          Cache-Control: public, max-age=31536000, immutable
          
        # Feed files
        /feed.xml
          Cache-Control: public, max-age=3600
          Content-Type: application/rss+xml; charset=utf-8
          
        /feed.json
          Cache-Control: public, max-age=3600
          Content-Type: application/json; charset=utf-8
          
        # Sitemap
        /sitemap.xml
          Cache-Control: public, max-age=86400
          Content-Type: application/xml; charset=utf-8
      HEADERS
    end
  end

  # Hook to run performance optimizations after site generation
  Jekyll::Hooks.register :site, :post_write do |site|
    if ENV['JEKYLL_ENV'] == 'production' || ENV['OPTIMIZE_ASSETS'] == 'true'
      optimizer = PerformanceOptimizer.new
      optimizer.generate(site)
    end
  end
end