# Blog Testing Suite

This directory contains comprehensive tests for the blog functionality of the portfolio website.

## Test Categories

### 1. Ruby Tests (`blog_test_suite.rb`)
Comprehensive backend testing including:
- Blog structure validation
- Post rendering tests
- Tag functionality verification
- RSS/JSON feed validation
- SEO implementation checks
- Performance asset optimization
- Internal link validation
- Accessibility features

### 2. JavaScript Tests (`blog_js_tests.html`)
Client-side functionality testing:
- Search functionality
- Tag filtering
- Performance benchmarks
- User interaction tests

### 3. Accessibility Tests (`accessibility_tests.rb`)
WCAG 2.1 AA compliance testing:
- Document structure
- Heading hierarchy
- Image alt text
- Link accessibility
- Form accessibility
- Color contrast
- Keyboard navigation
- ARIA implementation

### 4. Build Tests
Jekyll build process validation:
- Successful compilation
- Essential file generation
- Plugin functionality
- Configuration validation

## Running Tests

### Quick Start
```bash
# Run all tests
ruby _test/run_tests.rb

# Run specific test categories
ruby _test/run_tests.rb build
ruby _test/run_tests.rb ruby
ruby _test/run_tests.rb validation
ruby _test/run_tests.rb javascript
```

### Individual Test Suites

#### Ruby Tests
```bash
cd portfolio-website
ruby _test/blog_test_suite.rb
```

#### Accessibility Tests
```bash
cd portfolio-website
ruby _test/accessibility_tests.rb _site
```

#### JavaScript Tests
Open `_test/blog_js_tests.html` in a web browser and click "Run All Tests"

### Prerequisites

1. **Ruby Dependencies**
   ```bash
   cd _test
   bundle install
   ```

2. **Built Jekyll Site**
   ```bash
   bundle exec jekyll build
   ```

## Test Configuration

### Environment Variables
- `JEKYLL_ENV=test` - Sets test environment
- `RUN_TESTS=true` - Enables test plugins during build

### Test Data
The test suite uses sample blog posts located in `_posts/` directory. Ensure you have at least 2-3 sample posts for comprehensive testing.

## Test Results

### Output Formats
- **Console**: Colored output with pass/fail indicators
- **JSON Reports**: Detailed results saved to `_test/test_results.json`
- **Accessibility Report**: Issues saved to `_test/accessibility_report.json`

### Success Criteria
- **Build Tests**: All essential files generated successfully
- **Ruby Tests**: 90%+ pass rate
- **Accessibility**: Zero critical issues
- **JavaScript**: All functionality tests pass
- **Performance**: Page load times < 3 seconds

## Continuous Integration

### GitHub Actions Integration
Add to `.github/workflows/test.yml`:

```yaml
name: Blog Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: ruby/setup-ruby@v1
        with:
          ruby-version: 3.0
          bundler-cache: true
      
      - name: Install test dependencies
        run: |
          cd _test
          bundle install
      
      - name: Run blog tests
        run: ruby _test/run_tests.rb
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-results
          path: _test/test_results.json
```

### Pre-commit Hooks
Add to `.git/hooks/pre-commit`:

```bash
#!/bin/sh
echo "Running blog tests..."
ruby _test/run_tests.rb build
if [ $? -ne 0 ]; then
  echo "Tests failed. Commit aborted."
  exit 1
fi
```

## Test Development

### Adding New Tests

#### Ruby Tests
Add test methods to `BlogTestSuite` class in `blog_test_suite.rb`:

```ruby
def test_new_functionality
  # Test implementation
  assert condition, "Error message"
end
```

#### JavaScript Tests
Add test functions to `blog_js_tests.html`:

```javascript
function testNewFeature() {
    testFramework.test('Feature description', () => {
        // Test implementation
        return condition;
    });
}
```

#### Accessibility Tests
Add test methods to `AccessibilityTester` class:

```ruby
def test_new_accessibility_feature(doc, page_name)
  issues = []
  # Test implementation
  report_test_results("Test Name", page_name, issues)
end
```

### Test Data Management
- Sample posts should cover various scenarios
- Include posts with different tags, categories, and content types
- Test edge cases like empty content, missing metadata

## Troubleshooting

### Common Issues

1. **Jekyll Build Fails**
   - Check `_config.yml` syntax
   - Verify plugin dependencies
   - Review post front matter

2. **Ruby Tests Fail**
   - Ensure Jekyll site is built (`bundle exec jekyll build`)
   - Check file permissions
   - Verify test dependencies installed

3. **JavaScript Tests Don't Load**
   - Open browser developer tools
   - Check for JavaScript errors
   - Verify file paths are correct

4. **Accessibility Tests Report False Positives**
   - Review ARIA implementation
   - Check semantic HTML structure
   - Validate color contrast manually

### Performance Optimization
- Run tests in parallel when possible
- Cache Jekyll builds between test runs
- Use focused tests during development

## Best Practices

1. **Test-Driven Development**
   - Write tests before implementing features
   - Keep tests simple and focused
   - Use descriptive test names

2. **Maintenance**
   - Update tests when requirements change
   - Remove obsolete tests
   - Keep test data current

3. **Documentation**
   - Document test purpose and expectations
   - Include setup instructions
   - Explain complex test logic

## Contributing

When adding new blog features:

1. Add corresponding tests
2. Update this README if needed
3. Ensure all tests pass
4. Document any new test dependencies

## Resources

- [Jekyll Testing Guide](https://jekyllrb.com/docs/testing/)
- [Minitest Documentation](https://github.com/seattlerb/minitest)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web Accessibility Testing](https://webaim.org/articles/screenreader_testing/)