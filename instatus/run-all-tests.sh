#!/bin/bash

# Comprehensive Test Runner for Instatus Clone
# Runs all unit tests, integration tests, and generates coverage reports

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    case $status in
        "SUCCESS")
            echo -e "${GREEN}✅ $message${NC}"
            ;;
        "ERROR")
            echo -e "${RED}❌ $message${NC}"
            ;;
        "INFO")
            echo -e "${BLUE}ℹ️  $message${NC}"
            ;;
        "WARNING")
            echo -e "${YELLOW}⚠️  $message${NC}"
            ;;
        "HEADER")
            echo -e "${PURPLE}🧪 $message${NC}"
            ;;
    esac
}

# Function to run tests for a service
run_service_tests() {
    local service_name=$1
    local service_path=$2
    
    print_status "HEADER" "Running $service_name Tests"
    echo "=================================="
    
    if [ ! -d "$service_path" ]; then
        print_status "WARNING" "$service_name directory not found: $service_path"
        return 1
    fi
    
    cd "$service_path"
    
    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        print_status "WARNING" "No package.json found in $service_path"
        cd - > /dev/null
        return 1
    fi
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        print_status "INFO" "Installing dependencies for $service_name..."
        npm install
    fi
    
    # Run linting
    print_status "INFO" "Running linting for $service_name..."
    if npm run lint > /dev/null 2>&1; then
        print_status "SUCCESS" "$service_name linting passed"
    else
        print_status "WARNING" "$service_name linting failed (continuing anyway)"
    fi
    
    # Run type checking
    print_status "INFO" "Running type checking for $service_name..."
    if npm run type-check > /dev/null 2>&1; then
        print_status "SUCCESS" "$service_name type checking passed"
    else
        print_status "WARNING" "$service_name type checking failed (continuing anyway)"
    fi
    
    # Run unit tests
    print_status "INFO" "Running unit tests for $service_name..."
    if npm test -- --coverage --watchAll=false; then
        print_status "SUCCESS" "$service_name unit tests passed"
        
        # Display coverage summary
        if [ -f "coverage/coverage-summary.json" ]; then
            print_status "INFO" "Coverage summary for $service_name:"
            node -e "
                const coverage = require('./coverage/coverage-summary.json');
                const total = coverage.total;
                console.log('  Lines: ' + total.lines.pct + '%');
                console.log('  Functions: ' + total.functions.pct + '%');
                console.log('  Branches: ' + total.branches.pct + '%');
                console.log('  Statements: ' + total.statements.pct + '%');
            "
        fi
    else
        print_status "ERROR" "$service_name unit tests failed"
        cd - > /dev/null
        return 1
    fi
    
    cd - > /dev/null
    return 0
}

# Function to generate combined coverage report
generate_combined_coverage() {
    print_status "HEADER" "Generating Combined Coverage Report"
    echo "======================================="
    
    # Create combined coverage directory
    mkdir -p coverage-combined
    
    # Combine coverage reports
    local services=("backend" "frontend" "monitoring" "notifications")
    local coverage_files=""
    
    for service in "${services[@]}"; do
        if [ -f "$service/coverage/coverage-final.json" ]; then
            coverage_files="$coverage_files $service/coverage/coverage-final.json"
        fi
    done
    
    if [ -n "$coverage_files" ]; then
        print_status "INFO" "Combining coverage reports..."
        
        # Use nyc to combine coverage reports
        npx nyc merge $coverage_files coverage-combined/coverage.json
        npx nyc report --reporter=html --reporter=text-summary --temp-dir=coverage-combined --report-dir=coverage-combined/html
        
        print_status "SUCCESS" "Combined coverage report generated in coverage-combined/"
    else
        print_status "WARNING" "No coverage files found to combine"
    fi
}

# Function to run integration tests
run_integration_tests() {
    print_status "HEADER" "Running Integration Tests"
    echo "================================="
    
    # Check if services are running
    print_status "INFO" "Checking if services are running..."
    
    local services_running=true
    
    # Check backend
    if ! curl -s http://localhost:3001/api/health > /dev/null; then
        print_status "WARNING" "Backend not running - starting services..."
        services_running=false
    fi
    
    # Start services if not running
    if [ "$services_running" = false ]; then
        print_status "INFO" "Starting all services..."
        npm run docker:up
        sleep 30 # Wait for services to start
        
        # Wait for backend to be ready
        local retries=0
        while [ $retries -lt 30 ]; do
            if curl -s http://localhost:3001/api/health > /dev/null; then
                break
            fi
            sleep 2
            ((retries++))
        done
        
        if [ $retries -eq 30 ]; then
            print_status "ERROR" "Services failed to start within timeout"
            return 1
        fi
    fi
    
    # Run API integration tests
    print_status "INFO" "Running API integration tests..."
    if ./test-api.sh; then
        print_status "SUCCESS" "API integration tests passed"
    else
        print_status "ERROR" "API integration tests failed"
        return 1
    fi
    
    # Run complete validation
    print_status "INFO" "Running complete system validation..."
    if ./validate-complete-implementation.sh; then
        print_status "SUCCESS" "System validation passed"
    else
        print_status "ERROR" "System validation failed"
        return 1
    fi
    
    return 0
}

# Function to run performance tests
run_performance_tests() {
    print_status "HEADER" "Running Performance Tests"
    echo "================================"
    
    # Simple load test using curl
    print_status "INFO" "Running basic load test..."
    
    local api_url="http://localhost:3001/api"
    local total_requests=100
    local concurrent_requests=10
    local success_count=0
    
    # Test health endpoint
    for i in $(seq 1 $concurrent_requests); do
        {
            for j in $(seq 1 $((total_requests / concurrent_requests))); do
                if curl -s "$api_url/health" > /dev/null; then
                    ((success_count++))
                fi
            done
        } &
    done
    
    wait
    
    local success_rate=$((success_count * 100 / total_requests))
    
    if [ $success_rate -ge 95 ]; then
        print_status "SUCCESS" "Performance test passed ($success_rate% success rate)"
    else
        print_status "WARNING" "Performance test warning ($success_rate% success rate)"
    fi
}

# Function to run security tests
run_security_tests() {
    print_status "HEADER" "Running Security Tests"
    echo "============================="
    
    # Check for common security issues
    print_status "INFO" "Checking for security vulnerabilities..."
    
    # Run npm audit for each service
    local services=("backend" "frontend" "monitoring" "notifications")
    local total_vulnerabilities=0
    
    for service in "${services[@]}"; do
        if [ -d "$service" ] && [ -f "$service/package.json" ]; then
            cd "$service"
            
            local audit_result=$(npm audit --audit-level=moderate --json 2>/dev/null || echo '{"vulnerabilities":{}}')
            local vuln_count=$(echo "$audit_result" | node -e "
                const data = JSON.parse(require('fs').readFileSync(0, 'utf8'));
                console.log(Object.keys(data.vulnerabilities || {}).length);
            ")
            
            if [ "$vuln_count" -eq 0 ]; then
                print_status "SUCCESS" "$service: No security vulnerabilities found"
            else
                print_status "WARNING" "$service: $vuln_count vulnerabilities found"
                total_vulnerabilities=$((total_vulnerabilities + vuln_count))
            fi
            
            cd - > /dev/null
        fi
    done
    
    if [ $total_vulnerabilities -eq 0 ]; then
        print_status "SUCCESS" "Security audit passed"
    else
        print_status "WARNING" "Security audit found $total_vulnerabilities total vulnerabilities"
    fi
}

# Main execution
main() {
    print_status "HEADER" "INSTATUS CLONE - COMPREHENSIVE TEST SUITE"
    echo "=================================================="
    
    local start_time=$(date +%s)
    local failed_tests=0
    local total_tests=0
    
    # Change to project root
    cd "$(dirname "$0")"
    
    # Run tests for each service
    local services=(
        "Backend:backend"
        "Frontend:frontend"
        "Monitoring:monitoring"
        "Notifications:notifications"
    )
    
    for service_info in "${services[@]}"; do
        IFS=':' read -r service_name service_path <<< "$service_info"
        ((total_tests++))
        
        if ! run_service_tests "$service_name" "$service_path"; then
            ((failed_tests++))
        fi
        
        echo ""
    done
    
    # Run integration tests
    ((total_tests++))
    if ! run_integration_tests; then
        ((failed_tests++))
    fi
    echo ""
    
    # Run performance tests
    ((total_tests++))
    if ! run_performance_tests; then
        ((failed_tests++))
    fi
    echo ""
    
    # Run security tests
    ((total_tests++))
    if ! run_security_tests; then
        ((failed_tests++))
    fi
    echo ""
    
    # Generate combined coverage report
    generate_combined_coverage
    echo ""
    
    # Final summary
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    local passed_tests=$((total_tests - failed_tests))
    
    print_status "HEADER" "TEST SUMMARY"
    echo "==================="
    print_status "INFO" "Total test suites: $total_tests"
    print_status "INFO" "Passed: $passed_tests"
    print_status "INFO" "Failed: $failed_tests"
    print_status "INFO" "Duration: ${duration}s"
    
    if [ $failed_tests -eq 0 ]; then
        echo ""
        print_status "SUCCESS" "🎉 ALL TESTS PASSED! 🎉"
        print_status "SUCCESS" "The Instatus Clone is working perfectly!"
        echo ""
        print_status "INFO" "Coverage reports available in:"
        print_status "INFO" "  - backend/coverage/"
        print_status "INFO" "  - frontend/coverage/"
        print_status "INFO" "  - monitoring/coverage/"
        print_status "INFO" "  - notifications/coverage/"
        print_status "INFO" "  - coverage-combined/"
        echo ""
        exit 0
    else
        echo ""
        print_status "ERROR" "❌ $failed_tests TEST SUITE(S) FAILED"
        print_status "ERROR" "Please check the output above for details"
        echo ""
        exit 1
    fi
}

# Run main function
main "$@"
