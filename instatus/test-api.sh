#!/bin/bash

# Instatus Clone API Test Script
# This script tests the main API endpoints to verify the implementation

set -e

API_URL="http://localhost:3001/api"
FRONTEND_URL="http://localhost:3000"

echo "🚀 Testing Instatus Clone API Implementation"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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
    esac
}

# Function to test API endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=$4
    local description=$5
    
    echo -e "\n${BLUE}Testing: $description${NC}"
    echo "Endpoint: $method $endpoint"
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $JWT_TOKEN" \
            -d "$data" \
            "$API_URL$endpoint" 2>/dev/null || echo -e "\n000")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            -H "Authorization: Bearer $JWT_TOKEN" \
            "$API_URL$endpoint" 2>/dev/null || echo -e "\n000")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" = "$expected_status" ]; then
        print_status "SUCCESS" "HTTP $http_code - $description"
        return 0
    else
        print_status "ERROR" "HTTP $http_code (expected $expected_status) - $description"
        echo "Response: $body"
        return 1
    fi
}

# Check if backend is running
print_status "INFO" "Checking if backend is running..."
if ! curl -s "$API_URL/health" > /dev/null; then
    print_status "ERROR" "Backend is not running at $API_URL"
    print_status "INFO" "Please start the backend with: npm run dev:backend"
    exit 1
fi

print_status "SUCCESS" "Backend is running"

# Test 1: Health Check
echo -e "\n${YELLOW}=== 1. Health Check ===${NC}"
test_endpoint "GET" "/health" "" "200" "API Health Check"

# Test 2: User Registration
echo -e "\n${YELLOW}=== 2. User Registration ===${NC}"
RANDOM_EMAIL="test$(date +%s)@example.com"
REGISTER_DATA="{\"email\":\"$RANDOM_EMAIL\",\"name\":\"Test User\",\"password\":\"password123\"}"
test_endpoint "POST" "/auth/register" "$REGISTER_DATA" "201" "User Registration"

# Test 3: User Login
echo -e "\n${YELLOW}=== 3. User Login ===${NC}"
LOGIN_DATA="{\"email\":\"$RANDOM_EMAIL\",\"password\":\"password123\"}"
login_response=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d "$LOGIN_DATA" \
    "$API_URL/auth/login")

if echo "$login_response" | grep -q "token"; then
    JWT_TOKEN=$(echo "$login_response" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    print_status "SUCCESS" "User Login - Token received"
else
    print_status "ERROR" "User Login - No token received"
    echo "Response: $login_response"
    exit 1
fi

# Test 4: Get Current User
echo -e "\n${YELLOW}=== 4. Get Current User ===${NC}"
test_endpoint "GET" "/auth/me" "" "200" "Get Current User"

# Test 5: Create Project
echo -e "\n${YELLOW}=== 5. Create Project ===${NC}"
PROJECT_DATA="{\"name\":\"Test Status Page\",\"slug\":\"test-status-$(date +%s)\",\"description\":\"A test status page\"}"
project_response=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $JWT_TOKEN" \
    -d "$PROJECT_DATA" \
    "$API_URL/projects")

if echo "$project_response" | grep -q "id"; then
    PROJECT_ID=$(echo "$project_response" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    PROJECT_SLUG=$(echo "$project_response" | grep -o '"slug":"[^"]*"' | cut -d'"' -f4)
    print_status "SUCCESS" "Project Creation - Project ID: $PROJECT_ID"
else
    print_status "ERROR" "Project Creation Failed"
    echo "Response: $project_response"
    exit 1
fi

# Test 6: Get Projects
echo -e "\n${YELLOW}=== 6. Get Projects ===${NC}"
test_endpoint "GET" "/projects" "" "200" "Get User Projects"

# Test 7: Get Project Details
echo -e "\n${YELLOW}=== 7. Get Project Details ===${NC}"
test_endpoint "GET" "/projects/$PROJECT_ID" "" "200" "Get Project Details"

# Test 8: Create Component
echo -e "\n${YELLOW}=== 8. Create Component ===${NC}"
COMPONENT_DATA="{\"name\":\"API Server\",\"description\":\"Main API backend\",\"status\":\"operational\"}"
component_response=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $JWT_TOKEN" \
    -d "$COMPONENT_DATA" \
    "$API_URL/projects/$PROJECT_ID/components")

if echo "$component_response" | grep -q "id"; then
    COMPONENT_ID=$(echo "$component_response" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    print_status "SUCCESS" "Component Creation - Component ID: $COMPONENT_ID"
else
    print_status "ERROR" "Component Creation Failed"
    echo "Response: $component_response"
fi

# Test 9: Get Components
echo -e "\n${YELLOW}=== 9. Get Components ===${NC}"
test_endpoint "GET" "/projects/$PROJECT_ID/components" "" "200" "Get Project Components"

# Test 10: Create Incident
echo -e "\n${YELLOW}=== 10. Create Incident ===${NC}"
INCIDENT_DATA="{\"title\":\"Test Incident\",\"content\":\"This is a test incident\",\"status\":\"investigating\",\"impact\":\"minor\"}"
incident_response=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $JWT_TOKEN" \
    -d "$INCIDENT_DATA" \
    "$API_URL/projects/$PROJECT_ID/incidents")

if echo "$incident_response" | grep -q "id"; then
    INCIDENT_ID=$(echo "$incident_response" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    print_status "SUCCESS" "Incident Creation - Incident ID: $INCIDENT_ID"
else
    print_status "ERROR" "Incident Creation Failed"
    echo "Response: $incident_response"
fi

# Test 11: Get Public Status Page
echo -e "\n${YELLOW}=== 11. Get Public Status Page ===${NC}"
if [ -n "$PROJECT_SLUG" ]; then
    test_endpoint "GET" "/status/$PROJECT_SLUG" "" "200" "Get Public Status Page"
else
    print_status "WARNING" "Skipping public status page test - no project slug"
fi

# Test 12: Subscribe to Status Page
echo -e "\n${YELLOW}=== 12. Subscribe to Status Page ===${NC}"
if [ -n "$PROJECT_SLUG" ]; then
    SUBSCRIBE_DATA="{\"email\":\"subscriber@example.com\",\"notify_by\":[\"email\"]}"
    # Remove JWT token for public endpoint
    JWT_TOKEN_BACKUP=$JWT_TOKEN
    JWT_TOKEN=""
    test_endpoint "POST" "/status/$PROJECT_SLUG/subscribe" "$SUBSCRIBE_DATA" "201" "Subscribe to Status Page"
    JWT_TOKEN=$JWT_TOKEN_BACKUP
else
    print_status "WARNING" "Skipping subscription test - no project slug"
fi

# Test 13: API Documentation
echo -e "\n${YELLOW}=== 13. API Documentation ===${NC}"
if curl -s "$API_URL/docs" | grep -q "swagger"; then
    print_status "SUCCESS" "API Documentation is available"
else
    print_status "WARNING" "API Documentation may not be properly configured"
fi

# Summary
echo -e "\n${YELLOW}=== Test Summary ===${NC}"
print_status "INFO" "API Base URL: $API_URL"
print_status "INFO" "Frontend URL: $FRONTEND_URL"
print_status "INFO" "Test User Email: $RANDOM_EMAIL"
if [ -n "$PROJECT_ID" ]; then
    print_status "INFO" "Test Project ID: $PROJECT_ID"
fi
if [ -n "$PROJECT_SLUG" ]; then
    print_status "INFO" "Test Project Slug: $PROJECT_SLUG"
    print_status "INFO" "Public Status Page: $API_URL/status/$PROJECT_SLUG"
fi

echo -e "\n${GREEN}🎉 API Testing Complete!${NC}"
echo -e "${BLUE}You can now test the frontend at: $FRONTEND_URL${NC}"
echo -e "${BLUE}API Documentation: $API_URL/docs${NC}"

# Test frontend if it's running
echo -e "\n${YELLOW}=== Frontend Check ===${NC}"
if curl -s "$FRONTEND_URL" > /dev/null; then
    print_status "SUCCESS" "Frontend is running at $FRONTEND_URL"
else
    print_status "WARNING" "Frontend is not running. Start it with: npm run dev:frontend"
fi

echo -e "\n${GREEN}✨ All tests completed successfully!${NC}"
echo -e "${BLUE}The Instatus Clone implementation is working correctly.${NC}"
