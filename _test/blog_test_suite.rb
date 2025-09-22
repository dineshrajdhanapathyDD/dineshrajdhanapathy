#!/usr/bin/env ruby

require 'minitest/autorun'
require 'minitest/reporters'
require 'nokogiri'
require 'json'
require 'net/http'
require 'uri'

# Use spec reporter for better output
Minitest::Reporters.use! Minitest::Reporters::SpecReporter.new

class BlogTestSuite < Minitest::Test
  def setup
    @site_dir = File.expand_path('../_site', __dir__)
    @source_dir = File.expand_path('..', __dir__)
    
    # Ensure site is built
    unless Dir.exist?(@site_dir)
      puts "Building Jekyll site for testing..."
      system("cd #{@source_dir} && bundle exec jekyll build")
    end
  end

  def test_blog_index_exists
    blog_index = File.join(@site_dir, 'blog', 'index.html')
    assert File.exist?(blog_index), "Blog index page should exist"
    
    content = File.read(blog_index)
    doc = Nokogiri::HTML(content)
    
    # Test essential elements
    assert doc.at_css('h1'), "Blog index should have a main heading"
    assert doc.at_css('.post-preview'), "Blog index should have post previews"
    assert doc.at_css('.search-container'), "Blog index should have search functionality"
  end

  def test_blog_posts_rendering
    posts_dir = File.join(@site_dir, 'blog')
    
    # Find all post HTML files
    post_files = Dir.glob(File.join(posts_dir, '**', '*.html')).reject do |file|
      file.include?('index.html') || file.include?('tags')
    end
    
    refute_empty post_files, "Should have at least one blog post"
    
    post_files.each do |post_file|
      content = File.read(post_file)
      doc = Nokogiri::HTML(content)
      
      # Test post structure
      assert doc.at_css('article.post'), "Post should have article.post element: #{post_file}"
      assert doc.at_css('.post-header h1'), "Post should have title: #{post_file}"
      assert doc.at_css('.post-meta'), "Post should have metadata: #{post_file}"
      assert doc.at_css('.post-content'), "Post should have content: #{post_file}"
      
      # Test social sharing
      assert doc.at_css('.social-sharing'), "Post should have social sharing: #{post_file}"
      
      # Test navigation
      nav_links = doc.css('.post-navigation a')
      assert nav_links.any?, "Post should have navigation links: #{post_file}"
    end
  end

  def test_tag_pages_generation
    tags_dir = File.join(@site_dir, 'blog', 'tags')
    assert Dir.exist?(tags_dir), "Tags directory should exist"
    
    # Test tags index
    tags_index = File.join(tags_dir, 'index.html')
    assert File.exist?(tags_index), "Tags index should exist"
    
    content = File.read(tags_index)
    doc = Nokogiri::HTML(content)
    assert doc.at_css('.tag-cloud'), "Tags index should have tag cloud"
    
    # Test individual tag pages
    tag_files = Dir.glob(File.join(tags_dir, '*.html')).reject { |f| f.include?('index.html') }
    
    tag_files.each do |tag_file|
      content = File.read(tag_file)
      doc = Nokogiri::HTML(content)
      
      assert doc.at_css('h1'), "Tag page should have heading: #{tag_file}"
      assert doc.at_css('.post-preview'), "Tag page should have posts: #{tag_file}"
    end
  end

  def test_search_functionality
    # Test search index generation
    search_index = File.join(@site_dir, 'assets', 'js', 'search-index.json')
    assert File.exist?(search_index), "Search index should be generated"
    
    # Validate search index structure
    index_content = File.read(search_index)
    search_data = JSON.parse(index_content)
    
    assert search_data.key?('posts'), "Search index should have posts array"
    refute_empty search_data['posts'], "Search index should contain posts"
    
    # Test first post structure
    first_post = search_data['posts'].first
    required_fields = %w[id title content excerpt url date tags]
    required_fields.each do |field|
      assert first_post.key?(field), "Search index post should have #{field} field"
    end
  end

  def test_rss_feed_validation
    rss_feed = File.join(@site_dir, 'feed.xml')
    assert File.exist?(rss_feed), "RSS feed should exist"
    
    content = File.read(rss_feed)
    doc = Nokogiri::XML(content)
    
    # Test RSS structure
    assert doc.at_xpath('//rss'), "Should be valid RSS document"
    assert doc.at_xpath('//channel/title'), "RSS should have channel title"
    assert doc.at_xpath('//channel/description'), "RSS should have channel description"
    assert doc.at_xpath('//channel/link'), "RSS should have channel link"
    
    # Test items
    items = doc.xpath('//item')
    refute_empty items, "RSS should have items"
    
    items.first(3).each do |item|
      assert item.at_xpath('title'), "RSS item should have title"
      assert item.at_xpath('link'), "RSS item should have link"
      assert item.at_xpath('description'), "RSS item should have description"
      assert item.at_xpath('pubDate'), "RSS item should have publication date"
    end
  end

  def test_json_feed_validation
    json_feed = File.join(@site_dir, 'feed.json')
    assert File.exist?(json_feed), "JSON feed should exist"
    
    content = File.read(json_feed)
    feed_data = JSON.parse(content)
    
    # Test JSON feed structure
    assert feed_data.key?('version'), "JSON feed should have version"
    assert feed_data.key?('title'), "JSON feed should have title"
    assert feed_data.key?('home_page_url'), "JSON feed should have home page URL"
    assert feed_data.key?('feed_url'), "JSON feed should have feed URL"
    assert feed_data.key?('items'), "JSON feed should have items"
    
    refute_empty feed_data['items'], "JSON feed should have items"
    
    # Test first item structure
    first_item = feed_data['items'].first
    assert first_item.key?('id'), "JSON feed item should have id"
    assert first_item.key?('title'), "JSON feed item should have title"
    assert first_item.key?('content_html'), "JSON feed item should have content"
    assert first_item.key?('url'), "JSON feed item should have URL"
  end

  def test_seo_meta_tags
    posts_dir = File.join(@site_dir, 'blog')
    post_files = Dir.glob(File.join(posts_dir, '**', '*.html')).reject do |file|
      file.include?('index.html') || file.include?('tags')
    end
    
    post_files.first(3).each do |post_file|
      content = File.read(post_file)
      doc = Nokogiri::HTML(content)
      
      # Test essential meta tags
      assert doc.at_css('meta[property="og:title"]'), "Post should have OG title: #{post_file}"
      assert doc.at_css('meta[property="og:description"]'), "Post should have OG description: #{post_file}"
      assert doc.at_css('meta[property="og:url"]'), "Post should have OG URL: #{post_file}"
      assert doc.at_css('meta[property="og:type"]'), "Post should have OG type: #{post_file}"
      
      # Test Twitter meta tags
      assert doc.at_css('meta[name="twitter:card"]'), "Post should have Twitter card: #{post_file}"
      assert doc.at_css('meta[name="twitter:title"]'), "Post should have Twitter title: #{post_file}"
      
      # Test structured data
      structured_data = doc.at_css('script[type="application/ld+json"]')
      assert structured_data, "Post should have structured data: #{post_file}"
      
      # Validate JSON-LD
      begin
        JSON.parse(structured_data.content)
      rescue JSON::ParserError
        flunk "Invalid JSON-LD in post: #{post_file}"
      end
    end
  end

  def test_responsive_images
    posts_dir = File.join(@site_dir, 'blog')
    post_files = Dir.glob(File.join(posts_dir, '**', '*.html')).reject do |file|
      file.include?('index.html') || file.include?('tags')
    end
    
    post_files.first(2).each do |post_file|
      content = File.read(post_file)
      doc = Nokogiri::HTML(content)
      
      # Test responsive images
      images = doc.css('img[data-src]')
      images.each do |img|
        assert img['alt'], "Image should have alt text: #{post_file}"
        assert img['data-src'], "Image should have lazy loading: #{post_file}"
      end
      
      # Test picture elements for responsive images
      pictures = doc.css('picture')
      pictures.each do |picture|
        sources = picture.css('source')
        refute_empty sources, "Picture should have source elements: #{post_file}"
        
        img = picture.at_css('img')
        assert img, "Picture should have fallback img: #{post_file}"
      end
    end
  end

  def test_performance_assets
    # Test CSS minification
    css_files = Dir.glob(File.join(@site_dir, 'assets', 'css', '*.css'))
    css_files.each do |css_file|
      content = File.read(css_file)
      # Check if CSS appears minified (no unnecessary whitespace)
      lines = content.lines
      if lines.length > 10
        avg_line_length = content.length.to_f / lines.length
        assert avg_line_length > 50, "CSS should be minified: #{css_file}"
      end
    end
    
    # Test JavaScript files
    js_files = Dir.glob(File.join(@site_dir, 'assets', 'js', '*.js'))
    js_files.each do |js_file|
      next if js_file.include?('search-index.json')
      
      content = File.read(js_file)
      refute content.include?('console.log'), "Production JS should not have console.log: #{js_file}"
    end
  end

  def test_accessibility_features
    blog_index = File.join(@site_dir, 'blog', 'index.html')
    content = File.read(blog_index)
    doc = Nokogiri::HTML(content)
    
    # Test heading hierarchy
    headings = doc.css('h1, h2, h3, h4, h5, h6')
    refute_empty headings, "Page should have headings"
    
    # Test skip links
    skip_link = doc.at_css('a[href="#main-content"]')
    assert skip_link, "Page should have skip to main content link"
    
    # Test ARIA labels
    search_input = doc.at_css('input[type="search"]')
    if search_input
      assert search_input['aria-label'] || search_input['aria-labelledby'], 
             "Search input should have ARIA label"
    end
    
    # Test form labels
    inputs = doc.css('input')
    inputs.each do |input|
      next if input['type'] == 'hidden'
      
      label_id = input['id']
      if label_id
        label = doc.at_css("label[for='#{label_id}']")
        assert label || input['aria-label'] || input['aria-labelledby'], 
               "Input should have associated label: #{input}"
      end
    end
  end

  def test_internal_links
    blog_index = File.join(@site_dir, 'blog', 'index.html')
    content = File.read(blog_index)
    doc = Nokogiri::HTML(content)
    
    # Test internal links
    internal_links = doc.css('a[href^="/"]')
    internal_links.each do |link|
      href = link['href']
      next if href.start_with?('//') # Skip protocol-relative URLs
      
      # Convert to file path
      file_path = if href.end_with?('/')
                    File.join(@site_dir, href, 'index.html')
                  else
                    File.join(@site_dir, href)
                  end
      
      # Check if target exists
      assert File.exist?(file_path) || File.exist?(file_path + '.html'), 
             "Internal link target should exist: #{href}"
    end
  end
end

# Run tests if this file is executed directly
if __FILE__ == $0
  # Set up test environment
  ENV['JEKYLL_ENV'] = 'test'
  
  # Build site if needed
  source_dir = File.expand_path('..', __dir__)
  site_dir = File.join(source_dir, '_site')
  
  unless Dir.exist?(site_dir)
    puts "Building Jekyll site for testing..."
    system("cd #{source_dir} && bundle exec jekyll build")
  end
  
  # Run the tests
  Minitest.run
end