require 'minitest/autorun'
require 'nokogiri'

module Jekyll
  class BlogTester < Generator
    safe true
    priority :lowest

    def generate(site)
      @site = site
      
      if ENV['RUN_TESTS'] == 'true'
        run_blog_tests
      end
    end

    private

    def run_blog_tests
      Jekyll.logger.info "Blog Tester:", "Running blog functionality tests..."
      
      test_blog_structure
      test_post_rendering
      test_tag_functionality
      test_feed_generation
      test_seo_implementation
      
      Jekyll.logger.info "Blog Tester:", "All tests completed"
    end

    def test_blog_structure
      Jekyll.logger.info "Blog Tester:", "Testing blog structure..."
      
      # Test blog index exists
      blog_index = @site.pages.find { |p| p.url == '/blog/' }
      raise "Blog index page not found" unless blog_index
      
      # Test blog layout exists
      blog_layout = @site.layouts['blog']
      raise "Blog layout not found" unless blog_layout
      
      # Test post layout exists
      post_layout = @site.layouts['post']
      raise "Post layout not found" unless post_layout
      
      Jekyll.logger.info "Blog Tester:", "✅ Blog structure tests passed"
    end

    def test_post_rendering
      Jekyll.logger.info "Blog Tester:", "Testing post rendering..."
      
      @site.posts.docs.each do |post|
        # Test post has required front matter
        required_fields = %w[title date categories tags excerpt author]
        required_fields.each do |field|
          unless post.data.key?(field)
            Jekyll.logger.warn "Blog Tester:", "⚠️ Post missing #{field}: #{post.relative_path}"
          end
        end
        
        # Test post content is not empty
        if post.content.strip.empty?
          Jekyll.logger.warn "Blog Tester:", "⚠️ Empty post content: #{post.relative_path}"
        end
        
        # Test excerpt separator exists
        unless post.content.include?('<!--more-->')
          Jekyll.logger.warn "Blog Tester:", "⚠️ Missing excerpt separator: #{post.relative_path}"
        end
      end
      
      Jekyll.logger.info "Blog Tester:", "✅ Post rendering tests completed"
    end

    def test_tag_functionality
      Jekyll.logger.info "Blog Tester:", "Testing tag functionality..."
      
      # Test tag pages exist for all tags
      @site.tags.each do |tag_name, posts|
        tag_page_url = "/blog/tags/#{tag_name.downcase.gsub(/\s+/, '-')}/"
        tag_page = @site.pages.find { |p| p.url == tag_page_url }
        
        unless tag_page
          Jekyll.logger.warn "Blog Tester:", "⚠️ Tag page missing for: #{tag_name}"
        end
      end
      
      # Test tags index exists
      tags_index = @site.pages.find { |p| p.url == '/blog/tags/' }
      unless tags_index
        Jekyll.logger.warn "Blog Tester:", "⚠️ Tags index page missing"
      end
      
      Jekyll.logger.info "Blog Tester:", "✅ Tag functionality tests completed"
    end

    def test_feed_generation
      Jekyll.logger.info "Blog Tester:", "Testing feed generation..."
      
      # Test RSS feed
      rss_feed = @site.pages.find { |p| p.url == '/feed.xml' }
      if rss_feed
        # Validate RSS content
        begin
          doc = Nokogiri::XML(rss_feed.content)
          
          # Check for required RSS elements
          unless doc.at_xpath('//channel/title')
            Jekyll.logger.warn "Blog Tester:", "⚠️ RSS feed missing title"
          end
          
          unless doc.at_xpath('//channel/description')
            Jekyll.logger.warn "Blog Tester:", "⚠️ RSS feed missing description"
          end
          
          # Check for items
          items = doc.xpath('//item')
          if items.empty?
            Jekyll.logger.warn "Blog Tester:", "⚠️ RSS feed has no items"
          end
          
        rescue => e
          Jekyll.logger.warn "Blog Tester:", "⚠️ RSS feed validation error: #{e.message}"
        end
      else
        Jekyll.logger.warn "Blog Tester:", "⚠️ RSS feed not found"
      end
      
      # Test JSON feed
      json_feed = @site.pages.find { |p| p.url == '/feed.json' }
      unless json_feed
        Jekyll.logger.warn "Blog Tester:", "⚠️ JSON feed not found"
      end
      
      Jekyll.logger.info "Blog Tester:", "✅ Feed generation tests completed"
    end

    def test_seo_implementation
      Jekyll.logger.info "Blog Tester:", "Testing SEO implementation..."
      
      @site.posts.docs.each do |post|
        # Test SEO title length
        seo_title = post.data['seo_title'] || post.data['title']
        if seo_title && seo_title.length > 60
          Jekyll.logger.warn "Blog Tester:", "⚠️ SEO title too long (#{seo_title.length} chars): #{post.relative_path}"
        end
        
        # Test meta description length
        seo_desc = post.data['seo_description'] || post.data['excerpt']
        if seo_desc && seo_desc.length > 160
          Jekyll.logger.warn "Blog Tester:", "⚠️ SEO description too long (#{seo_desc.length} chars): #{post.relative_path}"
        end
        
        # Test image alt text
        if post.data['image'] && !post.data['image_alt']
          Jekyll.logger.warn "Blog Tester:", "⚠️ Featured image missing alt text: #{post.relative_path}"
        end
      end
      
      Jekyll.logger.info "Blog Tester:", "✅ SEO implementation tests completed"
    end
  end

  # Hook to run tests after site generation
  Jekyll::Hooks.register :site, :post_write do |site|
    if ENV['RUN_TESTS'] == 'true'
      tester = BlogTester.new
      tester.generate(site)
    end
  end
end