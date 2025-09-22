module Jekyll
  module ReadingTimeFilter
    def reading_time(input)
      # Average reading speed is 200 words per minute
      words_per_minute = 200
      
      # Strip HTML tags and count words
      word_count = input.to_s.gsub(/<[^>]*>/, '').split.length
      
      # Calculate reading time in minutes, minimum 1 minute
      reading_time = (word_count.to_f / words_per_minute).ceil
      reading_time = [reading_time, 1].max
      
      # Return formatted string
      if reading_time == 1
        "#{reading_time} min read"
      else
        "#{reading_time} min read"
      end
    end
    
    def reading_time_minutes(input)
      # Return just the number of minutes for use in structured data
      words_per_minute = 200
      word_count = input.to_s.gsub(/<[^>]*>/, '').split.length
      reading_time = (word_count.to_f / words_per_minute).ceil
      [reading_time, 1].max
    end
    
    def word_count(input)
      # Return word count for debugging or display
      input.to_s.gsub(/<[^>]*>/, '').split.length
    end
  end
end

Liquid::Template.register_filter(Jekyll::ReadingTimeFilter)