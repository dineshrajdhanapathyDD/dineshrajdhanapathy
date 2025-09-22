#!/bin/bash

# Blog Test Suite Runner
# Usage: ./test.sh [category]
# Categories: all, build, ruby, validation, javascript, accessibility

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo -e "${BLUE}🚀 Blog Test Suite${NC}"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "$ROOT_DIR/_config.yml" ]; then
    echo -e "${RED}❌ Error: Not in Jekyll project root${NC}"
    echo "Please run this script from the portfolio website directory"
    exit 1
fi

# Check Ruby dependencies
if [ ! -f "$SCRIPT_DIR/Gemfile" ]; then
    echo -e "${YELLOW}⚠️  Installing test dependencies...${NC}"
    cd "$SCRIPT_DIR"
    bundle init
    bundle add minitest minitest-reporters nokogiri colorize
fi

# Ensure test dependencies are installed
cd "$SCRIPT_DIR"
if ! bundle check > /dev/null 2>&1; then
    echo -e "${YELLOW}📦 Installing test dependencies...${NC}"
    bundle install
fi

cd "$ROOT_DIR"

# Function to run specific test category
run_test_category() {
    case $1 in
        "build")
            echo -e "${YELLOW}🔨 Running build tests...${NC}"
            ruby "$SCRIPT_DIR/run_tests.rb" build
            ;;
        "ruby")
            echo -e "${YELLOW}🧪 Running Ruby tests...${NC}"
            ruby "$SCRIPT_DIR/run_tests.rb" ruby
            ;;
        "validation")
            echo -e "${YELLOW}🔍 Running validation tests...${NC}"
            ruby "$SCRIPT_DIR/run_tests.rb" validation
            ;;
        "javascript")
            echo -e "${YELLOW}🌐 JavaScript tests...${NC}"
            ruby "$SCRIPT_DIR/run_tests.rb" javascript
            ;;
        "accessibility")
            echo -e "${YELLOW}♿ Running accessibility tests...${NC}"
            if [ -d "$ROOT_DIR/_site" ]; then
                ruby "$SCRIPT_DIR/accessibility_tests.rb" "$ROOT_DIR/_site"
            else
                echo -e "${RED}❌ Site not built. Building now...${NC}"
                bundle exec jekyll build
                ruby "$SCRIPT_DIR/accessibility_tests.rb" "$ROOT_DIR/_site"
            fi
            ;;
        "all"|"")
            echo -e "${YELLOW}🎯 Running all tests...${NC}"
            ruby "$SCRIPT_DIR/run_tests.rb"
            
            # Also run accessibility tests
            echo -e "\n${YELLOW}♿ Running accessibility tests...${NC}"
            if [ -d "$ROOT_DIR/_site" ]; then
                ruby "$SCRIPT_DIR/accessibility_tests.rb" "$ROOT_DIR/_site"
            else
                echo -e "${YELLOW}⚠️  Site not built, skipping accessibility tests${NC}"
            fi
            ;;
        *)
            echo -e "${RED}❌ Unknown test category: $1${NC}"
            echo "Available categories: all, build, ruby, validation, javascript, accessibility"
            exit 1
            ;;
    esac
}

# Check for test category argument
CATEGORY=${1:-"all"}

# Ensure Jekyll is available
if ! command -v bundle &> /dev/null; then
    echo -e "${RED}❌ Bundler not found. Please install Ruby and Bundler first.${NC}"
    exit 1
fi

# Check if Gemfile exists
if [ ! -f "$ROOT_DIR/Gemfile" ]; then
    echo -e "${RED}❌ Gemfile not found. This doesn't appear to be a Jekyll project.${NC}"
    exit 1
fi

# Install Jekyll dependencies if needed
if ! bundle check > /dev/null 2>&1; then
    echo -e "${YELLOW}📦 Installing Jekyll dependencies...${NC}"
    bundle install
fi

# Run the specified test category
run_test_category "$CATEGORY"

# Check if JavaScript test file exists and provide instructions
JS_TEST_FILE="$SCRIPT_DIR/blog_js_tests.html"
if [ -f "$JS_TEST_FILE" ] && [ "$CATEGORY" = "all" ]; then
    echo -e "\n${BLUE}🌐 JavaScript Tests Available${NC}"
    echo "Open the following file in your browser to run JavaScript tests:"
    echo -e "${YELLOW}file://$JS_TEST_FILE${NC}"
fi

# Show test results location
RESULTS_FILE="$SCRIPT_DIR/test_results.json"
if [ -f "$RESULTS_FILE" ]; then
    echo -e "\n${GREEN}📄 Test results saved to: $RESULTS_FILE${NC}"
fi

echo -e "\n${GREEN}✅ Test suite completed!${NC}"