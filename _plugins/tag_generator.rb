module Jekyll
  class TagPageGenerator < Generator
    safe true

    def generate(site)
      if site.layouts.key? 'tag'
        dir = site.config['tag_dir'] || 'blog/tags'
        site.tags.each_key do |tag|
          site.pages << TagPage.new(site, site.source, File.join(dir, tag.downcase.gsub(/\s+/, '-')), tag)
        end
      end
    end
  end

  class TagPage < Page
    def initialize(site, base, dir, tag)
      @site = site
      @base = base
      @dir = dir
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'tag.html')
      self.data['tag'] = tag
      self.data['title'] = "Posts tagged \"#{tag}\""
      self.data['description'] = "All posts tagged with #{tag}"
      self.data['seo_title'] = "#{tag} Posts | #{site.config['title']}"
      self.data['seo_description'] = "Browse all posts tagged with #{tag} on #{site.config['title']}"
    end
  end
end