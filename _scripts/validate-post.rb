#!/usr/bin/env ruby

# Blog Post Validation Script
# Usage: ruby _scripts/validate-post.rb _posts/2024-01-15-post-title.md

require 'yaml'
require 'uri'

class BlogPostValidator
  def initialize(filepath)
    @filepath = filepath
    @errors = []
    @warnings = []
    @content = File.read(filepath) if File.exist?(filepath)
  end

  def validate
    return false unless file_exists?
    
    validate_filename
    validate_front_matter
    validate_content_structure
    validate_images
    validate_links
    validate_seo
    
    display_results
    @errors.empty?
  end

  private

  def file_exists?
    unless File.exist?(@filepath)
      @errors << "File does not exist: #{@filepath}"
      return false
    end
    true
  end

  def validate_filename
    filename = File.basename(@filepath)
    
    # Check naming convention: YYYY-MM-DD-title.md
    unless filename.match?(/^\d{4}-\d{2}-\d{2}-.+\.md$/)
      @errors << "Filename must follow format: YYYY-MM-DD-title.md"
    end
    
    # Check for valid date
    date_part = filename[0..9]
    begin
      Date.parse(date_part)
    rescue ArgumentError
      @errors << "Invalid date in filename: #{date_part}"
    end
  end

  def validate_front_matter
    # Extract front matter
    if @content.start_with?('---')
      parts = @content.split('---', 3)
      if parts.length >= 3
        begin
          @front_matter = YAML.load(parts[1])
        rescue Psych::SyntaxError => e
          @errors << "Invalid YAML in front matter: #{e.message}"
          return
        end
      else
        @errors << "Front matter not properly closed with ---"
        return
      end
    else
      @errors << "Missing front matter"
      return
    end

    validate_required_fields
    validate_optional_fields
  end

  def validate_required_fields
    required_fields = %w[layout title date categories tags excerpt author]
    
    required_fields.each do |field|
      unless @front_matter.key?(field)
        @errors << "Missing required field: #{field}"
      end
    end

    # Validate specific field formats
    if @front_matter['layout'] != 'post'
      @errors << "Layout must be 'post' for blog posts"
    end

    if @front_matter['title']
      title = @front_matter['title']
      if title.length > 60
        @warnings << "Title is #{title.length} characters (recommended: 50-60)"
      end
      if title.length < 10
        @warnings << "Title might be too short (#{title.length} characters)"
      end
    end

    if @front_matter['excerpt']
      excerpt = @front_matter['excerpt']
      if excerpt.length > 160
        @warnings << "Excerpt is #{excerpt.length} characters (recommended: 150-160)"
      end
      if excerpt.length < 50
        @warnings << "Excerpt might be too short (#{excerpt.length} characters)"
      end
    end

    # Validate date format
    if @front_matter['date']
      begin
        Date.parse(@front_matter['date'].to_s)
      rescue ArgumentError
        @errors << "Invalid date format in front matter"
      end
    end

    # Validate categories and tags
    if @front_matter['categories'] && !@front_matter['categories'].is_a?(Array)
      @errors << "Categories must be an array"
    end

    if @front_matter['tags'] && !@front_matter['tags'].is_a?(Array)
      @errors << "Tags must be an array"
    end

    if @front_matter['tags'] && @front_matter['tags'].length > 10
      @warnings << "Too many tags (#{@front_matter['tags'].length}), recommended: 3-8"
    end
  end

  def validate_optional_fields
    # Validate image path if present
    if @front_matter['image']
      image_path = @front_matter['image']
      unless image_path.start_with?('/assets/images/')
        @warnings << "Image path should start with /assets/images/"
      end
      
      # Check if image file exists
      full_path = File.join('.', image_path.sub(/^\//, ''))
      unless File.exist?(full_path)
        @warnings << "Featured image not found: #{image_path}"
      end
    end

    # Validate SEO fields
    if @front_matter['seo_title'] && @front_matter['seo_title'].length > 60
      @warnings << "SEO title is #{@front_matter['seo_title'].length} characters (recommended: 50-60)"
    end

    if @front_matter['seo_description'] && @front_matter['seo_description'].length > 160
      @warnings << "SEO description is #{@front_matter['seo_description'].length} characters (recommended: 150-160)"
    end

    # Validate canonical URL if present
    if @front_matter['canonical_url']
      begin
        URI.parse(@front_matter['canonical_url'])
      rescue URI::InvalidURIError
        @errors << "Invalid canonical URL format"
      end
    end
  end

  def validate_content_structure
    # Extract content after front matter
    parts = @content.split('---', 3)
    return unless parts.length >= 3
    
    content = parts[2].strip

    # Check for excerpt separator
    unless content.include?('<!--more-->')
      @warnings << "Missing excerpt separator <!--more-->"
    end

    # Check for proper heading structure
    headings = content.scan(/^(\#{1,6})\s+(.+)$/)
    
    if headings.empty?
      @warnings << "No headings found in content"
    else
      # Check if first heading is H1 and matches title
      first_heading = headings.first
      if first_heading && first_heading[0].length == 1
        h1_text = first_heading[1].strip
        title = @front_matter['title']
        unless h1_text == title
          @warnings << "H1 heading doesn't match front matter title"
        end
      else
        @warnings << "Content should start with H1 heading"
      end
    end

    # Check content length
    word_count = content.split.length
    if word_count < 300
      @warnings << "Content might be too short (#{word_count} words)"
    elsif word_count > 3000
      @warnings << "Content might be too long (#{word_count} words)"
    end

    # Check for code blocks without language specification
    unspecified_code_blocks = content.scan(/```\n/).length
    if unspecified_code_blocks > 0
      @warnings << "#{unspecified_code_blocks} code block(s) without language specification"
    end
  end

  def validate_images
    # Find all image references in content
    image_refs = @content.scan(/!\[([^\]]*)\]\(([^)]+)\)/)
    
    image_refs.each do |alt_text, src|
      # Check alt text
      if alt_text.empty?
        @warnings << "Image missing alt text: #{src}"
      end

      # Check if local image exists
      if src.start_with?('/assets/') || src.start_with?('assets/')
        full_path = File.join('.', src.sub(/^\//, ''))
        unless File.exist?(full_path)
          @warnings << "Image not found: #{src}"
        end
      end
    end
  end

  def validate_links
    # Find all links in content
    links = @content.scan(/\[([^\]]+)\]\(([^)]+)\)/)
    
    links.each do |text, url|
      # Check for empty link text
      if text.strip.empty?
        @warnings << "Empty link text for URL: #{url}"
      end

      # Validate URL format for external links
      if url.start_with?('http')
        begin
          URI.parse(url)
        rescue URI::InvalidURIError
          @warnings << "Invalid URL format: #{url}"
        end
      end

      # Check for generic link text
      generic_texts = ['click here', 'read more', 'here', 'link']
      if generic_texts.include?(text.downcase.strip)
        @warnings << "Generic link text should be more descriptive: '#{text}'"
      end
    end
  end

  def validate_seo
    # Check for focus keyword in title and content
    if @front_matter['tags'] && @front_matter['tags'].any?
      primary_tag = @front_matter['tags'].first
      title = @front_matter['title']&.downcase || ''
      content = @content.downcase
      
      unless title.include?(primary_tag.downcase)
        @warnings << "Primary tag '#{primary_tag}' not found in title"
      end
      
      tag_mentions = content.scan(/\b#{Regexp.escape(primary_tag.downcase)}\b/).length
      if tag_mentions < 2
        @warnings << "Primary tag '#{primary_tag}' mentioned only #{tag_mentions} time(s) in content"
      end
    end

    # Check for internal links
    internal_links = @content.scan(/\]\(\/[^)]+\)/).length
    if internal_links == 0
      @warnings << "No internal links found (good for SEO to link to related content)"
    end
  end

  def display_results
    puts "🔍 Validating: #{@filepath}"
    puts "=" * 50

    if @errors.any?
      puts "❌ ERRORS (#{@errors.length}):"
      @errors.each_with_index do |error, i|
        puts "  #{i + 1}. #{error}"
      end
      puts
    end

    if @warnings.any?
      puts "⚠️  WARNINGS (#{@warnings.length}):"
      @warnings.each_with_index do |warning, i|
        puts "  #{i + 1}. #{warning}"
      end
      puts
    end

    if @errors.empty? && @warnings.empty?
      puts "✅ All checks passed! Post is ready for publication."
    elsif @errors.empty?
      puts "✅ No errors found. Consider addressing warnings for better quality."
    else
      puts "❌ Please fix errors before publishing."
    end

    puts
    puts "📊 SUMMARY:"
    puts "  Errors: #{@errors.length}"
    puts "  Warnings: #{@warnings.length}"
    
    if @content
      word_count = @content.split('---', 3)[2]&.split&.length || 0
      puts "  Word count: #{word_count}"
      puts "  Estimated reading time: #{(word_count / 200.0).ceil} minutes"
    end
  end
end

# Main execution
if ARGV.empty?
  puts "❌ Usage: ruby _scripts/validate-post.rb _posts/YYYY-MM-DD-post-title.md"
  puts "📝 Example: ruby _scripts/validate-post.rb _posts/2024-01-15-kubernetes-tutorial.md"
  exit 1
end

filepath = ARGV[0]
validator = BlogPostValidator.new(filepath)
success = validator.validate

exit(success ? 0 : 1)