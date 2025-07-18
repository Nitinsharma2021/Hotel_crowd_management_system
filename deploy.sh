#!/bin/bash

# Restaurant Reservation System Deployment Script
# This script deploys the backend to AWS and provides instructions for frontend deployment

set -e

echo "🚀 Starting Restaurant Reservation System Deployment..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials are not configured. Please run 'aws configure' first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing dependencies..."

# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

cd ..

echo "✅ Dependencies installed"

# Deploy backend
echo "🔧 Deploying backend to AWS..."

cd backend

# Check if serverless is installed globally
if ! command -v serverless &> /dev/null; then
    echo "📦 Installing serverless globally..."
    npm install -g serverless
fi

# Deploy using serverless
echo "🚀 Deploying Lambda functions and API Gateway..."
serverless deploy --verbose

# Get the API Gateway URL from the deployment output
API_URL=$(serverless info --verbose | grep "endpoints:" -A 1 | grep "https://" | head -1 | awk '{print $2}')

if [ -z "$API_URL" ]; then
    echo "❌ Failed to get API Gateway URL from deployment output"
    echo "Please check the deployment output manually and update the frontend .env file"
else
    echo "✅ Backend deployed successfully!"
    echo "🌐 API Gateway URL: $API_URL"
    
    # Create frontend .env file
    cd ../frontend
    echo "REACT_APP_API_URL=$API_URL" > .env
    echo "✅ Created frontend .env file with API URL"
fi

cd ..

echo ""
echo "🎉 Deployment completed!"
echo ""
echo "📋 Next steps:"
echo "1. The backend has been deployed to AWS"
echo "2. The frontend .env file has been updated with the API URL"
echo "3. To start the frontend development server:"
echo "   cd frontend && npm start"
echo ""
echo "4. To build the frontend for production:"
echo "   cd frontend && npm run build"
echo ""
echo "5. To deploy the frontend to AWS S3/CloudFront:"
echo "   - Build the frontend: cd frontend && npm run build"
echo "   - Upload the build folder to S3"
echo "   - Configure CloudFront distribution"
echo ""
echo "🔗 API Documentation:"
echo "   - AI Agent: POST $API_URL/ai-agent"
echo "   - Reservations: POST $API_URL/reservations"
echo "   - Customers: POST $API_URL/customers"
echo ""
echo "📚 For more information, see the README.md file" 