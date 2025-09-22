#!/usr/bin/env ruby

require 'fileutils'
require 'json'
require 'open3'
require 'colorize'
require 'net/http'
require 'uri'

class BlogTestRunner
  def initialize
    @root_dir = File.expand_path('..', __dir__)
    @test_dir = File.join(@root_dir, '_test')
    @site_dir = File.join(@root_dir, '_site')
    @results = {
      ruby_tests: { passed: 0, failed: 0, total: 0 },
      build_tests: { passed: 0, failed: 0, total: 0 },
      validation_tests: { passed: 0, failed: 0, total: 0 },
      cross_browser_tests: { passed: 0, failed: 0, total: 0 },
      integration_tests: { passed: 0, failed: 0, total: 0 }
    }
  end

  def run_all_tests
    puts "🚀 Starting Blog Test Suite".colorize(:blue).bold
    puts "=" * 50
    
    # Ensure clean environment
    prepare_test_environment
    
    # Run different test categories
    run_build_tests
    run_ruby_tests
    run_validation_tests
    run_javascript_tests
    run_cross_browser_tests
    run_integration_tests
    
    # Generate report
    generate_test_report
    
    # Cleanup
    cleanup_test_environment
    
    puts "\n✅ Test suite completed!".colorize(:green).bold
  end

  private

  def prepare_test_environment
    puts "\n📋 Preparing test environment...".colorize(:yellow)
    
    # Set test environment
    ENV['JEKYLL_ENV'] = 'test'
    ENV['RUN_TESTS'] = 'true'
    
    # Clean previous build
    FileUtils.rm_rf(@site_dir) if Dir.exist?(@site_dir)
    
    puts "✓ Environment prepared".colorize(:green)
  end

  def run_build_tests
    puts "\n🔨 Running build tests...".colorize(:yellow)
    
    # Test Jekyll build
    build_output, build_status = Open3.capture2e("cd #{@root_dir} && bundle exec jekyll build --trace")
    
    if build_status.success?
      @results[:build_tests][:passed] += 1
      puts "✓ Jekyll build successful".colorize(:green)
    else
      @results[:build_tests][:failed] += 1
      puts "✗ Jekyll build failed".colorize(:red)
      puts build_output.colorize(:red)
    end
    
    @results[:build_tests][:total] += 1
    
    # Test essential files exist
    essential_files = [
      'blog/index.html',
      'blog/tags/index.html',
      'feed.xml',
      'assets/js/blog.js',
      'assets/css/blog.css'
    ]
    
    essential_files.each do |file|
      file_path = File.join(@site_dir, file)
      if File.exist?(file_path)
        @results[:build_tests][:passed] += 1
        puts "✓ #{file} exists".colorize(:green)
      else
        @results[:build_tests][:failed] += 1
        puts "✗ #{file} missing".colorize(:red)
      end
      @results[:build_tests][:total] += 1
    end
  end

  def run_ruby_tests
    puts "\n🧪 Running Ruby tests...".colorize(:yellow)
    
    test_file = File.join(@test_dir, 'blog_test_suite.rb')
    
    if File.exist?(test_file)
      test_output, test_status = Open3.capture2e("cd #{@root_dir} && ruby #{test_file}")
      
      # Parse minitest output
      if test_output.match(/(\d+) runs, (\d+) assertions, (\d+) failures, (\d+) errors/)
        runs = $1.to_i
        failures = $3.to_i
        errors = $4.to_i
        
        @results[:ruby_tests][:total] = runs
        @results[:ruby_tests][:failed] = failures + errors
        @results[:ruby_tests][:passed] = runs - failures - errors
        
        if test_status.success?
          puts "✓ Ruby tests completed successfully".colorize(:green)
        else
          puts "✗ Some Ruby tests failed".colorize(:red)
        end
        
        puts test_output
      else
        puts "⚠️ Could not parse test results".colorize(:yellow)
        puts test_output
      end
    else
      puts "✗ Ruby test file not found".colorize(:red)
    end
  end

  def run_validation_tests
    puts "\n🔍 Running validation tests...".colorize(:yellow)
    
    # HTML validation
    html_files = Dir.glob(File.join(@site_dir, '**', '*.html'))
    valid_html_count = 0
    
    html_files.first(5).each do |html_file| # Test first 5 files for speed
      if validate_html_file(html_file)
        valid_html_count += 1
        puts "✓ #{File.basename(html_file)} is valid HTML".colorize(:green)
      else
        puts "✗ #{File.basename(html_file)} has HTML issues".colorize(:red)
      end
    end
    
    @results[:validation_tests][:passed] = valid_html_count
    @results[:validation_tests][:failed] = 5 - valid_html_count
    @results[:validation_tests][:total] = 5
    
    # RSS feed validation
    rss_file = File.join(@site_dir, 'feed.xml')
    if File.exist?(rss_file) && validate_rss_feed(rss_file)
      @results[:validation_tests][:passed] += 1
      puts "✓ RSS feed is valid".colorize(:green)
    else
      @results[:validation_tests][:failed] += 1
      puts "✗ RSS feed validation failed".colorize(:red)
    end
    @results[:validation_tests][:total] += 1
    
    # JSON feed validation
    json_feed = File.join(@site_dir, 'feed.json')
    if File.exist?(json_feed) && validate_json_feed(json_feed)
      @results[:validation_tests][:passed] += 1
      puts "✓ JSON feed is valid".colorize(:green)
    else
      @results[:validation_tests][:failed] += 1
      puts "✗ JSON feed validation failed".colorize(:red)
    end
    @results[:validation_tests][:total] += 1
  end

  def run_javascript_tests
    puts "\n🌐 JavaScript tests available at:".colorize(:yellow)
    js_test_file = File.join(@test_dir, 'blog_js_tests.html')
    
    if File.exist?(js_test_file)
      puts "   file://#{js_test_file}".colorize(:blue)
      puts "   Open this file in a browser to run JavaScript tests".colorize(:cyan)
    else
      puts "✗ JavaScript test file not found".colorize(:red)
    end
  end

  def run_cross_browser_tests
    puts "\n🌐 Cross-browser testing tools:".colorize(:yellow)
    
    # Check if server is running for cross-browser tests
    server_running = check_jekyll_server
    
    if server_running
      puts "✓ Jekyll server detected - running automated cross-browser tests".colorize(:green)
      
      browser_test_file = File.join(@test_dir, 'browser_test_runner.rb')
      if File.exist?(browser_test_file)
        test_output, test_status = Open3.capture2e("cd #{@root_dir} && ruby #{browser_test_file}")
        
        if test_status.success?
          puts "✓ Cross-browser tests completed successfully".colorize(:green)
          @results[:cross_browser_tests] = { passed: 1, failed: 0, total: 1 }
        else
          puts "✗ Cross-browser tests failed".colorize(:red)
          @results[:cross_browser_tests] = { passed: 0, failed: 1, total: 1 }
        end
        
        puts test_output
      end
    else
      puts "⚠️ Jekyll server not running - providing manual testing tools".colorize(:yellow)
      
      # List available testing tools
      test_tools = [
        'browser_compatibility_tests.html',
        'responsive_tester.html',
        'CROSS_BROWSER_TESTING.md'
      ]
      
      test_tools.each do |tool|
        tool_path = File.join(@test_dir, tool)
        if File.exist?(tool_path)
          puts "   📄 #{tool}".colorize(:cyan)
        end
      end
      
      puts "\n   To run automated cross-browser tests:".colorize(:cyan)
      puts "   1. Start Jekyll server: bundle exec jekyll serve".colorize(:cyan)
      puts "   2. Run: ruby _test/browser_test_runner.rb".colorize(:cyan)
      
      @results[:cross_browser_tests] = { passed: 0, failed: 0, total: 0 }
    end
  end

  def run_integration_tests
    puts "\n🔗 Running integration tests...".colorize(:yellow)
    
    integration_test_file = File.join(@test_dir, 'integration_tests.rb')
    
    if File.exist?(integration_test_file)
      test_output, test_status = Open3.capture2e("cd #{@root_dir} && ruby #{integration_test_file}")
      
      # Parse minitest output
      if test_output.match(/(\d+) runs, (\d+) assertions, (\d+) failures, (\d+) errors/)
        runs = $1.to_i
        failures = $3.to_i
        errors = $4.to_i
        
        @results[:integration_tests] = {
          total: runs,
          failed: failures + errors,
          passed: runs - failures - errors
        }
        
        if test_status.success?
          puts "✓ Integration tests completed successfully".colorize(:green)
        else
          puts "✗ Some integration tests failed".colorize(:red)
        end
        
        puts test_output
      else
        puts "⚠️ Could not parse integration test results".colorize(:yellow)
        puts test_output
        @results[:integration_tests] = { passed: 0, failed: 0, total: 0 }
      end
    else
      puts "✗ Integration test file not found".colorize(:red)
      @results[:integration_tests] = { passed: 0, failed: 1, total: 1 }
    end
  end

  def check_jekyll_server
    begin
      uri = URI('http://localhost:4000/')
      response = Net::HTTP.get_response(uri)
      response.code == '200'
    rescue
      false
    end
  end

  def validate_html_file(file_path)
    content = File.read(file_path)
    
    # Basic HTML validation checks
    checks = [
      content.include?('<!DOCTYPE html>'),
      content.include?('<html'),
      content.include?('<head>'),
      content.include?('<body>'),
      content.include?('</html>'),
      !content.include?('<img') || content.scan(/<img[^>]*>/).all? { |img| img.include?('alt=') }
    ]
    
    checks.all?
  rescue
    false
  end

  def validate_rss_feed(file_path)
    content = File.read(file_path)
    
    # Basic RSS validation
    content.include?('<rss') &&
    content.include?('<channel>') &&
    content.include?('<title>') &&
    content.include?('<description>') &&
    content.include?('<item>')
  rescue
    false
  end

  def validate_json_feed(file_path)
    content = File.read(file_path)
    data = JSON.parse(content)
    
    # Basic JSON feed validation
    data.key?('version') &&
    data.key?('title') &&
    data.key?('items') &&
    data['items'].is_a?(Array)
  rescue
    false
  end

  def generate_test_report
    puts "\n📊 Test Results Summary".colorize(:blue).bold
    puts "=" * 50
    
    total_passed = 0
    total_failed = 0
    total_tests = 0
    
    @results.each do |category, results|
      category_name = category.to_s.gsub('_', ' ').capitalize
      puts "\n#{category_name}:".colorize(:yellow).bold
      puts "  Passed: #{results[:passed]}".colorize(:green)
      puts "  Failed: #{results[:failed]}".colorize(results[:failed] > 0 ? :red : :green)
      puts "  Total:  #{results[:total]}"
      
      total_passed += results[:passed]
      total_failed += results[:failed]
      total_tests += results[:total]
    end
    
    puts "\n" + "=" * 50
    puts "Overall Results:".colorize(:blue).bold
    puts "  Total Passed: #{total_passed}".colorize(:green)
    puts "  Total Failed: #{total_failed}".colorize(total_failed > 0 ? :red : :green)
    puts "  Total Tests:  #{total_tests}"
    
    success_rate = total_tests > 0 ? (total_passed.to_f / total_tests * 100).round(1) : 0
    puts "  Success Rate: #{success_rate}%".colorize(success_rate >= 90 ? :green : :yellow)
    
    # Save results to file
    results_file = File.join(@test_dir, 'test_results.json')
    File.write(results_file, JSON.pretty_generate({
      timestamp: Time.now.iso8601,
      results: @results,
      summary: {
        total_passed: total_passed,
        total_failed: total_failed,
        total_tests: total_tests,
        success_rate: success_rate
      }
    }))
    
    puts "\n📄 Detailed results saved to: #{results_file}".colorize(:cyan)
  end

  def cleanup_test_environment
    # Reset environment variables
    ENV.delete('RUN_TESTS')
    
    puts "\n🧹 Test environment cleaned up".colorize(:green)
  end
end

# Command line interface
if __FILE__ == $0
  runner = BlogTestRunner.new
  
  case ARGV[0]
  when 'build'
    runner.send(:run_build_tests)
  when 'ruby'
    runner.send(:run_ruby_tests)
  when 'validation'
    runner.send(:run_validation_tests)
  when 'js', 'javascript'
    runner.send(:run_javascript_tests)
  else
    runner.run_all_tests
  end
end