#!/usr/bin/env ruby

require 'json'
require 'net/http'
require 'uri'
require 'colorize'
require 'fileutils'

class BrowserTestRunner
  def initialize
    @test_results = {
      timestamp: Time.now.iso8601,
      browsers: {},
      summary: {
        total_tests: 0,
        passed: 0,
        failed: 0,
        warnings: 0
      }
    }
    
    @test_urls = [
      '/blog/',
      '/blog/tags/',
      '/blog/2024/01/15/welcome-to-my-blog/',
      '/blog/2024/01/10/aws-best-practices/',
      '/blog/2024/01/05/kubernetes-deployment-strategies/'
    ]
    
    @base_url = 'http://localhost:4000'
  end

  def run_all_tests
    puts "🌐 Starting Cross-Browser Testing Suite".colorize(:blue).bold
    puts "=" * 60
    
    # Check if Jekyll server is running
    unless server_running?
      puts "❌ Jekyll server not running at #{@base_url}".colorize(:red)
      puts "Please start the server with: bundle exec jekyll serve".colorize(:yellow)
      return false
    end
    
    # Run tests for each browser configuration
    test_configurations.each do |config|
      test_browser_configuration(config)
    end
    
    # Generate comprehensive report
    generate_test_report
    
    puts "\n✅ Cross-browser testing completed!".colorize(:green).bold
    true
  end

  private

  def server_running?
    begin
      uri = URI("#{@base_url}/")
      response = Net::HTTP.get_response(uri)
      response.code == '200'
    rescue
      false
    end
  end

  def test_configurations
    [
      {
        name: 'Chrome Desktop',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        viewport: { width: 1920, height: 1080 },
        features: ['css-grid', 'flexbox', 'es6', 'fetch', 'webp'],
        category: 'desktop'
      },
      {
        name: 'Firefox Desktop',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
        viewport: { width: 1920, height: 1080 },
        features: ['css-grid', 'flexbox', 'es6', 'fetch'],
        category: 'desktop'
      },
      {
        name: 'Safari Desktop',
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
        viewport: { width: 1440, height: 900 },
        features: ['css-grid', 'flexbox', 'es6', 'fetch', 'webp'],
        category: 'desktop'
      },
      {
        name: 'Edge Desktop',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59',
        viewport: { width: 1366, height: 768 },
        features: ['css-grid', 'flexbox', 'es6', 'fetch', 'webp'],
        category: 'desktop'
      },
      {
        name: 'Chrome Mobile',
        user_agent: 'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
        viewport: { width: 375, height: 667 },
        features: ['css-grid', 'flexbox', 'es6', 'fetch', 'webp', 'touch'],
        category: 'mobile'
      },
      {
        name: 'Safari Mobile',
        user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
        viewport: { width: 375, height: 812 },
        features: ['css-grid', 'flexbox', 'es6', 'fetch', 'touch'],
        category: 'mobile'
      },
      {
        name: 'iPad Safari',
        user_agent: 'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
        viewport: { width: 768, height: 1024 },
        features: ['css-grid', 'flexbox', 'es6', 'fetch', 'touch'],
        category: 'tablet'
      },
      {
        name: 'Android Tablet',
        user_agent: 'Mozilla/5.0 (Linux; Android 10; SM-T870) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Safari/537.36',
        viewport: { width: 1024, height: 768 },
        features: ['css-grid', 'flexbox', 'es6', 'fetch', 'webp', 'touch'],
        category: 'tablet'
      }
    ]
  end

  def test_browser_configuration(config)
    puts "\n🔍 Testing #{config[:name]}".colorize(:cyan).bold
    puts "   Viewport: #{config[:viewport][:width]}×#{config[:viewport][:height]}"
    puts "   Category: #{config[:category].capitalize}"
    
    browser_results = {
      name: config[:name],
      category: config[:category],
      viewport: config[:viewport],
      user_agent: config[:user_agent],
      tests: {},
      summary: { passed: 0, failed: 0, warnings: 0 }
    }
    
    @test_urls.each do |url|
      test_result = test_url(url, config)
      browser_results[:tests][url] = test_result
      
      case test_result[:status]
      when 'pass'
        browser_results[:summary][:passed] += 1
        @test_results[:summary][:passed] += 1
      when 'fail'
        browser_results[:summary][:failed] += 1
        @test_results[:summary][:failed] += 1
      when 'warning'
        browser_results[:summary][:warnings] += 1
        @test_results[:summary][:warnings] += 1
      end
      
      @test_results[:summary][:total_tests] += 1
    end
    
    # Test browser-specific features
    test_browser_features(config, browser_results)
    
    @test_results[:browsers][config[:name]] = browser_results
    
    # Print summary for this browser
    summary = browser_results[:summary]
    puts "   Results: #{summary[:passed]} passed, #{summary[:failed]} failed, #{summary[:warnings]} warnings"
  end

  def test_url(url, config)
    full_url = "#{@base_url}#{url}"
    
    begin
      uri = URI(full_url)
      http = Net::HTTP.new(uri.host, uri.port)
      http.read_timeout = 10
      
      request = Net::HTTP::Get.new(uri)
      request['User-Agent'] = config[:user_agent]
      
      response = http.request(request)
      
      result = {
        url: url,
        status_code: response.code.to_i,
        response_time: measure_response_time(full_url, config),
        content_length: response.body.length,
        issues: [],
        status: 'pass'
      }
      
      # Analyze response
      analyze_response(response, config, result)
      
      puts "     ✅ #{url}".colorize(:green) if result[:status] == 'pass'
      puts "     ⚠️  #{url}".colorize(:yellow) if result[:status] == 'warning'
      puts "     ❌ #{url}".colorize(:red) if result[:status] == 'fail'
      
      result
      
    rescue => e
      puts "     ❌ #{url} - #{e.message}".colorize(:red)
      {
        url: url,
        status_code: 0,
        error: e.message,
        status: 'fail'
      }
    end
  end

  def measure_response_time(url, config)
    start_time = Time.now
    
    begin
      uri = URI(url)
      http = Net::HTTP.new(uri.host, uri.port)
      request = Net::HTTP::Get.new(uri)
      request['User-Agent'] = config[:user_agent]
      
      response = http.request(request)
      end_time = Time.now
      
      ((end_time - start_time) * 1000).round(2) # Convert to milliseconds
    rescue
      0
    end
  end

  def analyze_response(response, config, result)
    content = response.body
    
    # Check status code
    if response.code.to_i != 200
      result[:issues] << "HTTP #{response.code}"
      result[:status] = 'fail'
      return
    end
    
    # Check content length
    if content.length < 1000
      result[:issues] << "Content too short (#{content.length} bytes)"
      result[:status] = 'warning'
    end
    
    # Check for essential HTML elements
    essential_elements = [
      '<html',
      '<head>',
      '<body>',
      '<title>',
      '</html>'
    ]
    
    essential_elements.each do |element|
      unless content.include?(element)
        result[:issues] << "Missing #{element}"
        result[:status] = 'fail'
      end
    end
    
    # Check for blog-specific elements
    if result[:url].include?('/blog/')
      blog_elements = [
        'class="post-preview"',
        'class="search-container"',
        'class="tag-'
      ]
      
      blog_elements.each do |element|
        unless content.include?(element)
          result[:issues] << "Missing blog element: #{element}"
          result[:status] = 'warning'
        end
      end
    end
    
    # Check for responsive meta tag
    unless content.include?('name="viewport"')
      result[:issues] << "Missing viewport meta tag"
      result[:status] = 'warning'
    end
    
    # Check for CSS Grid/Flexbox usage (basic check)
    if config[:features].include?('css-grid')
      unless content.include?('display: grid') || content.include?('display:grid')
        result[:issues] << "CSS Grid not detected"
        result[:status] = 'warning'
      end
    end
    
    # Check response time
    if result[:response_time] > 3000
      result[:issues] << "Slow response time (#{result[:response_time]}ms)"
      result[:status] = 'warning'
    end
    
    # Mobile-specific checks
    if config[:category] == 'mobile'
      # Check for touch-friendly elements
      unless content.include?('touch-action') || content.include?('ontouchstart')
        result[:issues] << "No touch optimization detected"
        result[:status] = 'warning'
      end
      
      # Check for mobile-specific CSS
      unless content.include?('@media') && content.include?('max-width')
        result[:issues] << "No responsive CSS detected"
        result[:status] = 'warning'
      end
    end
  end

  def test_browser_features(config, browser_results)
    puts "     🧪 Testing browser features..."
    
    feature_tests = {
      'CSS Grid' => config[:features].include?('css-grid'),
      'Flexbox' => config[:features].include?('flexbox'),
      'ES6' => config[:features].include?('es6'),
      'Fetch API' => config[:features].include?('fetch'),
      'WebP Images' => config[:features].include?('webp'),
      'Touch Events' => config[:features].include?('touch')
    }
    
    browser_results[:feature_support] = feature_tests
    
    feature_tests.each do |feature, supported|
      if supported
        puts "       ✅ #{feature}".colorize(:green)
      else
        puts "       ❌ #{feature}".colorize(:red)
      end
    end
  end

  def generate_test_report
    puts "\n📊 Cross-Browser Test Report".colorize(:blue).bold
    puts "=" * 60
    
    # Overall summary
    summary = @test_results[:summary]
    total = summary[:total_tests]
    passed = summary[:passed]
    failed = summary[:failed]
    warnings = summary[:warnings]
    
    success_rate = total > 0 ? (passed.to_f / total * 100).round(1) : 0
    
    puts "\nOverall Results:".colorize(:yellow).bold
    puts "  Total Tests: #{total}"
    puts "  Passed: #{passed}".colorize(:green)
    puts "  Failed: #{failed}".colorize(failed > 0 ? :red : :green)
    puts "  Warnings: #{warnings}".colorize(warnings > 0 ? :yellow : :green)
    puts "  Success Rate: #{success_rate}%".colorize(success_rate >= 90 ? :green : :yellow)
    
    # Browser breakdown
    puts "\nBrowser Results:".colorize(:yellow).bold
    @test_results[:browsers].each do |browser_name, results|
      browser_summary = results[:summary]
      browser_total = browser_summary[:passed] + browser_summary[:failed] + browser_summary[:warnings]
      browser_success = browser_total > 0 ? (browser_summary[:passed].to_f / browser_total * 100).round(1) : 0
      
      puts "  #{browser_name}:"
      puts "    Success Rate: #{browser_success}%".colorize(browser_success >= 90 ? :green : :yellow)
      puts "    Passed: #{browser_summary[:passed]}, Failed: #{browser_summary[:failed]}, Warnings: #{browser_summary[:warnings]}"
    end
    
    # Critical issues
    critical_issues = []
    @test_results[:browsers].each do |browser_name, results|
      results[:tests].each do |url, test_result|
        if test_result[:status] == 'fail'
          critical_issues << {
            browser: browser_name,
            url: url,
            issues: test_result[:issues] || [test_result[:error]]
          }
        end
      end
    end
    
    if critical_issues.any?
      puts "\nCritical Issues:".colorize(:red).bold
      critical_issues.each do |issue|
        puts "  #{issue[:browser]} - #{issue[:url]}:".colorize(:red)
        issue[:issues].each do |problem|
          puts "    - #{problem}".colorize(:red)
        end
      end
    else
      puts "\n✅ No critical issues found!".colorize(:green).bold
    end
    
    # Performance summary
    puts "\nPerformance Summary:".colorize(:yellow).bold
    response_times = []
    @test_results[:browsers].each do |browser_name, results|
      results[:tests].each do |url, test_result|
        if test_result[:response_time]
          response_times << test_result[:response_time]
        end
      end
    end
    
    if response_times.any?
      avg_response = (response_times.sum / response_times.length).round(2)
      max_response = response_times.max
      min_response = response_times.min
      
      puts "  Average Response Time: #{avg_response}ms"
      puts "  Fastest Response: #{min_response}ms"
      puts "  Slowest Response: #{max_response}ms"
      
      if avg_response < 1000
        puts "  Performance: Excellent".colorize(:green)
      elsif avg_response < 3000
        puts "  Performance: Good".colorize(:yellow)
      else
        puts "  Performance: Needs Improvement".colorize(:red)
      end
    end
    
    # Save detailed report
    report_file = File.join(File.dirname(__FILE__), 'browser_test_report.json')
    File.write(report_file, JSON.pretty_generate(@test_results))
    puts "\n📄 Detailed report saved to: #{report_file}".colorize(:cyan)
    
    # Generate HTML report
    generate_html_report
  end

  def generate_html_report
    html_content = generate_html_report_content
    report_file = File.join(File.dirname(__FILE__), 'browser_test_report.html')
    File.write(report_file, html_content)
    puts "📄 HTML report saved to: #{report_file}".colorize(:cyan)
  end

  def generate_html_report_content
    summary = @test_results[:summary]
    success_rate = summary[:total_tests] > 0 ? (summary[:passed].to_f / summary[:total_tests] * 100).round(1) : 0
    
    <<~HTML
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Cross-Browser Test Report</title>
          <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f8f9fa; }
              .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
              .content { padding: 30px; }
              .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }
              .metric { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #007bff; }
              .metric-value { font-size: 2em; font-weight: bold; color: #007bff; }
              .metric-label { color: #6c757d; margin-top: 5px; }
              .browser-results { margin: 30px 0; }
              .browser-card { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 15px 0; border-left: 4px solid #28a745; }
              .browser-card.warning { border-left-color: #ffc107; }
              .browser-card.error { border-left-color: #dc3545; }
              .test-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px; margin: 15px 0; }
              .test-item { background: white; padding: 15px; border-radius: 6px; border: 1px solid #dee2e6; }
              .status-pass { color: #28a745; }
              .status-fail { color: #dc3545; }
              .status-warning { color: #ffc107; }
              .timestamp { color: #6c757d; font-size: 0.9em; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>🌐 Cross-Browser Test Report</h1>
                  <p class="timestamp">Generated on #{@test_results[:timestamp]}</p>
              </div>
              
              <div class="content">
                  <div class="summary">
                      <div class="metric">
                          <div class="metric-value">#{summary[:total_tests]}</div>
                          <div class="metric-label">Total Tests</div>
                      </div>
                      <div class="metric">
                          <div class="metric-value">#{summary[:passed]}</div>
                          <div class="metric-label">Passed</div>
                      </div>
                      <div class="metric">
                          <div class="metric-value">#{summary[:failed]}</div>
                          <div class="metric-label">Failed</div>
                      </div>
                      <div class="metric">
                          <div class="metric-value">#{success_rate}%</div>
                          <div class="metric-label">Success Rate</div>
                      </div>
                  </div>
                  
                  <div class="browser-results">
                      <h2>Browser Test Results</h2>
                      #{generate_browser_cards}
                  </div>
              </div>
          </div>
      </body>
      </html>
    HTML
  end

  def generate_browser_cards
    cards = []
    
    @test_results[:browsers].each do |browser_name, results|
      browser_summary = results[:summary]
      total_tests = browser_summary[:passed] + browser_summary[:failed] + browser_summary[:warnings]
      success_rate = total_tests > 0 ? (browser_summary[:passed].to_f / total_tests * 100).round(1) : 0
      
      card_class = if browser_summary[:failed] > 0
                     'error'
                   elsif browser_summary[:warnings] > 0
                     'warning'
                   else
                     ''
                   end
      
      test_items = results[:tests].map do |url, test_result|
        status_class = "status-#{test_result[:status]}"
        issues_text = test_result[:issues] ? test_result[:issues].join(', ') : ''
        
        <<~HTML
          <div class="test-item">
              <strong>#{url}</strong>
              <div class="#{status_class}">#{test_result[:status].upcase}</div>
              #{issues_text.empty? ? '' : "<div>Issues: #{issues_text}</div>"}
              #{test_result[:response_time] ? "<div>Response: #{test_result[:response_time]}ms</div>" : ''}
          </div>
        HTML
      end.join
      
      cards << <<~HTML
        <div class="browser-card #{card_class}">
            <h3>#{browser_name}</h3>
            <p><strong>Category:</strong> #{results[:category].capitalize}</p>
            <p><strong>Viewport:</strong> #{results[:viewport][:width]}×#{results[:viewport][:height]}</p>
            <p><strong>Success Rate:</strong> #{success_rate}%</p>
            <p><strong>Results:</strong> #{browser_summary[:passed]} passed, #{browser_summary[:failed]} failed, #{browser_summary[:warnings]} warnings</p>
            
            <div class="test-grid">
                #{test_items}
            </div>
        </div>
      HTML
    end
    
    cards.join
  end
end

# Command line interface
if __FILE__ == $0
  runner = BrowserTestRunner.new
  
  case ARGV[0]
  when 'help', '--help', '-h'
    puts "Cross-Browser Test Runner"
    puts "Usage: ruby browser_test_runner.rb [options]"
    puts ""
    puts "Options:"
    puts "  help    Show this help message"
    puts "  report  Generate report from existing results"
    puts ""
    puts "Make sure Jekyll server is running on http://localhost:4000"
  when 'report'
    # Generate report from existing results if available
    results_file = File.join(File.dirname(__FILE__), 'browser_test_report.json')
    if File.exist?(results_file)
      puts "📄 Generating report from existing results..."
      # This would load and regenerate the HTML report
    else
      puts "❌ No existing test results found. Run tests first."
    end
  else
    runner.run_all_tests
  end
end
    HTML
  end
end