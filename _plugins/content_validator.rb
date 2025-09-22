module Jekyll
  class ContentValidator < Generator
    safe true
    priority :low

    def generate(site)
      @site = site
      @errors = []
      @warnings = []

      validate_posts
      validate_pages
      validate_images
      
      display_results if @errors.any? || @warnings.any?
      
      # Fail build if there are critical errors
      if @errors.any? && ENV['JEKYLL_ENV'] == 'production'
        raise "Build failed due to content validation errors. See above for details."
      end
    end

    private

    def validate_posts
      @site.posts.docs.each do |post|
        validate_post_front_matter(post)
        validate_post_content(post)
        validate_post_images(post)
      end
    end

    def validate_pages
      @site.pages.each do |page|
        next unless page.path.include?('blog') || page.data['layout'] == 'blog'
        validate_page_content(page)
      end
    end

    def validate_post_front_matter(post)
      data = post.data
      path = post.relative_path

      # Required fields
      required_fields = %w[title date categories tags excerpt author]
      required_fields.each do |field|
        unless data.key?(field) && !data[field].to_s.empty?
          @errors << "#{path}: Missing required field '#{field}'"
        end
      end

      # Validate title length
      if data['title'] && data['title'].length > 60
        @warnings << "#{path}: Title is #{data['title'].length} characters (recommended: 50-60)"
      end

      # Validate excerpt length
      if data['excerpt'] && data['excerpt'].length > 160
        @warnings << "#{path}: Excerpt is #{data['excerpt'].length} characters (recommended: 150-160)"
      end

      # Validate tags count
      if data['tags'] && data['tags'].length > 10
        @warnings << "#{path}: Too many tags (#{data['tags'].length}), recommended: 3-8"
      end

      # Validate image path
      if data['image'] && !data['image'].start_with?('/assets/images/')
        @warnings << "#{path}: Image path should start with '/assets/images/'"
      end

      # Validate SEO fields
      if data['seo_title'] && data['seo_title'].length > 60
        @warnings << "#{path}: SEO title is #{data['seo_title'].length} characters (recommended: 50-60)"
      end

      if data['seo_description'] && data['seo_description'].length > 160
        @warnings << "#{path}: SEO description is #{data['seo_description'].length} characters (recommended: 150-160)"
      end
    end

    def validate_post_content(post)
      content = post.content
      path = post.relative_path

      # Check for excerpt separator
      unless content.include?('<!--more-->')
        @warnings << "#{path}: Missing excerpt separator '<!--more-->'"
      end

      # Check content length
      word_count = content.split.length
      if word_count < 300
        @warnings << "#{path}: Content might be too short (#{word_count} words)"
      elsif word_count > 3000
        @warnings << "#{path}: Content might be too long (#{word_count} words)"
      end

      # Check for headings
      headings = content.scan(/^#{1,6}\s+.+$/)
      if headings.empty?
        @warnings << "#{path}: No headings found in content"
      end

      # Check for code blocks without language
      unspecified_blocks = content.scan(/```\n/).length
      if unspecified_blocks > 0
        @warnings << "#{path}: #{unspecified_blocks} code block(s) without language specification"
      end
    end

    def validate_post_images(post)
      content = post.content
      path = post.relative_path

      # Find image references
      images = content.scan(/!\[([^\]]*)\]\(([^)]+)\)/)
      
      images.each do |alt_text, src|
        if alt_text.empty?
          @warnings << "#{path}: Image missing alt text: #{src}"
        end

        # Check if local image exists
        if src.start_with?('/assets/') || src.start_with?('assets/')
          image_path = File.join(@site.source, src.sub(/^\//, ''))
          unless File.exist?(image_path)
            @errors << "#{path}: Image not found: #{src}"
          end
        end
      end

      # Check featured image
      if post.data['image']
        featured_image_path = File.join(@site.source, post.data['image'].sub(/^\//, ''))
        unless File.exist?(featured_image_path)
          @errors << "#{path}: Featured image not found: #{post.data['image']}"
        end
      end
    end

    def validate_images
      # Check for orphaned images in blog directory
      blog_images_dir = File.join(@site.source, 'assets', 'images', 'blog')
      return unless Dir.exist?(blog_images_dir)

      used_images = Set.new
      
      # Collect all image references from posts
      @site.posts.docs.each do |post|
        # Featured images
        if post.data['image']
          used_images.add(post.data['image'].sub(/^\//, ''))
        end

        # Content images
        images = post.content.scan(/!\[[^\]]*\]\(([^)]+)\)/).flatten
        images.each do |src|
          if src.start_with?('/assets/') || src.start_with?('assets/')
            used_images.add(src.sub(/^\//, ''))
          end
        end
      end

      # Find unused images
      Dir.glob(File.join(blog_images_dir, '**', '*')).each do |file_path|
        next if File.directory?(file_path)
        
        relative_path = file_path.sub(@site.source + '/', '')
        unless used_images.include?(relative_path)
          @warnings << "Unused image found: #{relative_path}"
        end
      end
    end

    def validate_page_content(page)
      return unless page.content

      path = page.relative_path
      
      # Check for broken internal links
      links = page.content.scan(/\[([^\]]+)\]\(([^)]+)\)/)
      
      links.each do |text, url|
        next unless url.start_with?('/')
        
        # Check if internal link target exists
        target_path = File.join(@site.source, url.sub(/^\//, ''))
        target_path += '.html' unless File.extname(target_path) != ''
        
        unless File.exist?(target_path) || @site.pages.any? { |p| p.url == url }
          @warnings << "#{path}: Broken internal link: #{url}"
        end
      end
    end

    def display_results
      puts "\n" + "=" * 60
      puts "📋 CONTENT VALIDATION RESULTS"
      puts "=" * 60

      if @errors.any?
        puts "\n❌ ERRORS (#{@errors.length}):"
        @errors.each_with_index do |error, i|
          puts "  #{i + 1}. #{error}"
        end
      end

      if @warnings.any?
        puts "\n⚠️  WARNINGS (#{@warnings.length}):"
        @warnings.each_with_index do |warning, i|
          puts "  #{i + 1}. #{warning}"
        end
      end

      puts "\n📊 SUMMARY:"
      puts "  Posts validated: #{@site.posts.docs.length}"
      puts "  Errors: #{@errors.length}"
      puts "  Warnings: #{@warnings.length}"

      if @errors.empty? && @warnings.empty?
        puts "\n✅ All content validation checks passed!"
      elsif @errors.empty?
        puts "\n✅ No critical errors. Consider addressing warnings."
      else
        puts "\n❌ Critical errors found. Please fix before deploying."
      end

      puts "=" * 60 + "\n"
    end
  end

  # Hook to validate content on build
  Jekyll::Hooks.register :site, :post_write do |site|
    # Only run in development or when explicitly requested
    if ENV['VALIDATE_CONTENT'] == 'true' || Jekyll.env == 'development'
      validator = ContentValidator.new
      validator.generate(site)
    end
  end
end