#!/usr/bin/env ruby

# Blog Post Generator Script
# Usage: ruby _scripts/new-post.rb "Your Post Title"

require 'date'
require 'fileutils'

class BlogPostGenerator
  def initialize(title)
    @title = title
    @slug = generate_slug(title)
    @date = Date.today
    @filename = "#{@date.strftime('%Y-%m-%d')}-#{@slug}.md"
    @filepath = File.join('_posts', @filename)
  end

  def generate
    if File.exist?(@filepath)
      puts "❌ Post already exists: #{@filepath}"
      return false
    end

    # Ensure _posts directory exists
    FileUtils.mkdir_p('_posts')

    # Create post from template
    template_content = load_template
    post_content = populate_template(template_content)

    File.write(@filepath, post_content)
    
    puts "✅ Created new blog post: #{@filepath}"
    puts "📝 Title: #{@title}"
    puts "🔗 Slug: #{@slug}"
    puts "📅 Date: #{@date.strftime('%Y-%m-%d')}"
    puts ""
    puts "Next steps:"
    puts "1. Edit the post content in #{@filepath}"
    puts "2. Add a featured image to assets/images/blog/"
    puts "3. Update categories and tags"
    puts "4. Write compelling content"
    puts "5. Preview with: bundle exec jekyll serve"
    
    true
  end

  private

  def generate_slug(title)
    title.downcase
         .gsub(/[^\w\s-]/, '') # Remove special characters
         .gsub(/\s+/, '-')     # Replace spaces with hyphens
         .gsub(/-+/, '-')      # Remove multiple consecutive hyphens
         .strip                # Remove leading/trailing whitespace
         .gsub(/^-|-$/, '')    # Remove leading/trailing hyphens
  end

  def load_template
    template_path = '_templates/blog-post-template.md'
    
    if File.exist?(template_path)
      File.read(template_path)
    else
      default_template
    end
  end

  def populate_template(template)
    current_time = Time.now.strftime('%Y-%m-%d %H:%M:%S %z')
    
    template.gsub('Your Blog Post Title Here', @title)
            .gsub('YYYY-MM-DD HH:MM:SS -0500', current_time)
            .gsub('your-featured-image.jpg', "#{@slug}-featured.jpg")
            .gsub('SEO-Optimized Title | Dineshraj Dhanapathy', "#{@title} | Dineshraj Dhanapathy")
            .gsub('SEO-optimized description that includes relevant keywords and stays under 160 characters.', generate_default_description)
            .gsub('# Your Blog Post Title', "# #{@title}")
  end

  def generate_default_description
    "Learn about #{@title.downcase} with practical examples and best practices from experienced cloud engineer Dineshraj Dhanapathy."
  end

  def default_template
    <<~TEMPLATE
      ---
      layout: post
      title: "#{@title}"
      date: #{Time.now.strftime('%Y-%m-%d %H:%M:%S %z')}
      categories: [technology]
      tags: []
      excerpt: "Add your excerpt here"
      author: "Dineshraj Dhanapathy"
      image: "/assets/images/blog/#{@slug}-featured.jpg"
      image_alt: "#{@title}"
      seo_title: "#{@title} | Dineshraj Dhanapathy"
      seo_description: "#{generate_default_description}"
      draft: false
      featured: false
      ---

      # #{@title}

      Your introduction here.

      <!--more-->

      ## Content

      Your main content here.

      ## Conclusion

      Your conclusion here.
    TEMPLATE
  end
end

# Main execution
if ARGV.empty?
  puts "❌ Usage: ruby _scripts/new-post.rb \"Your Post Title\""
  puts "📝 Example: ruby _scripts/new-post.rb \"Getting Started with Kubernetes\""
  exit 1
end

title = ARGV.join(' ')
generator = BlogPostGenerator.new(title)
success = generator.generate

exit(success ? 0 : 1)