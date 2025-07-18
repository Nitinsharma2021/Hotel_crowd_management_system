# Restaurant Reservation System with AI

A comprehensive multi-agent AI system for restaurant table management and reservations, built with AWS Lambda, DynamoDB, Amazon Bedrock, and React.

## 🚀 Features

### AI-Powered Features
- **Natural Language Processing**: Chat with AI to book tables using natural language
- **Intelligent Table Assignment**: AI automatically assigns optimal tables based on party size and preferences
- **Personalized Recommendations**: AI provides personalized suggestions based on customer history
- **Dynamic Waitlist Management**: Smart waitlist management with real-time updates

### Core Functionality
- **Real-time Table Availability**: Instant availability checking and updates
- **Customer Management**: Complete customer profiles with preferences and loyalty status
- **Reservation Management**: Full CRUD operations for reservations
- **Special Requests**: Handle dietary restrictions and special accommodations
- **Dashboard Analytics**: Real-time restaurant performance metrics

### Technical Features
- **Serverless Architecture**: Built on AWS Lambda with API Gateway
- **NoSQL Database**: DynamoDB for scalable data storage
- **AI Integration**: Amazon Bedrock for intelligent processing
- **Modern UI**: React with Tailwind CSS for beautiful, responsive design
- **Real-time Updates**: WebSocket-like functionality for live updates

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │  API Gateway    │    │   AWS Lambda    │
│                 │◄──►│                 │◄──►│   Functions     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                              ┌─────────────────┐
                                              │   DynamoDB      │
                                              │   Tables        │
                                              └─────────────────┘
                                                        │
                                              ┌─────────────────┐
                                              │ Amazon Bedrock  │
                                              │   AI Models     │
                                              └─────────────────┘
```

## 📋 Prerequisites

- Node.js 18+ and npm
- AWS CLI configured with appropriate permissions
- AWS account with access to:
  - Lambda
  - API Gateway
  - DynamoDB
  - Amazon Bedrock
  - IAM

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd restaurant-reservation-system
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Setup

Create environment files for both backend and frontend:

**Backend (.env)**
```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

**Frontend (.env)**
```env
REACT_APP_API_URL=https://your-api-gateway-url.amazonaws.com/Prod
```

### 4. Deploy Backend

```bash
cd backend

# Deploy to AWS
npm run deploy

# Note the API Gateway URL from the output
```

### 5. Update Frontend API URL

Update the `REACT_APP_API_URL` in the frontend `.env` file with your deployed API Gateway URL.

### 6. Start Development Servers

```bash
# From root directory
npm run dev

# Or start individually:
# Backend (API Gateway + Lambda)
cd backend && npm run dev

# Frontend (React)
cd frontend && npm start
```

## 🗄️ Database Schema

### DynamoDB Tables

#### Customers Table
```json
{
  "customer_id": "string (PK)",
  "name": "string",
  "email": "string",
  "phone_number": "string",
  "preferences": "object",
  "loyalty_status": "string",
  "created_at": "string",
  "updated_at": "string"
}
```

#### Restaurants Table
```json
{
  "restaurant_id": "string (PK)",
  "name": "string",
  "location": "string",
  "cuisine_type": "string",
  "rating": "number",
  "opening_hours": "object",
  "contact_info": "object",
  "created_at": "string",
  "updated_at": "string"
}
```

#### Tables Table
```json
{
  "table_id": "string (PK)",
  "restaurant_id": "string (GSI)",
  "table_number": "string",
  "seating_capacity": "number",
  "location_type": "string",
  "created_at": "string",
  "updated_at": "string"
}
```

#### Reservations Table
```json
{
  "reservation_id": "string (PK)",
  "customer_id": "string",
  "restaurant_id": "string (GSI)",
  "table_id": "string",
  "reservation_time": "string",
  "party_size": "number",
  "status": "string",
  "created_at": "string",
  "updated_at": "string"
}
```

#### Special Requests Table
```json
{
  "request_id": "string (PK)",
  "reservation_id": "string (GSI)",
  "note": "string",
  "priority": "string",
  "created_at": "string"
}
```

## 🔧 API Endpoints

### AI Agent
- `POST /ai-agent` - Process natural language requests

### Customers
- `POST /customers` - Create customer
- `GET /customers/{id}` - Get customer
- `PUT /customers/{id}` - Update customer

### Restaurants
- `POST /restaurants` - Create restaurant
- `GET /restaurants/{id}` - Get restaurant

### Tables
- `POST /tables` - Create table
- `GET /tables` - List tables

### Reservations
- `POST /reservations` - Create reservation
- `GET /reservations/{id}` - Get reservation
- `PUT /reservations/{id}` - Update reservation
- `POST /reservations/{id}/cancel` - Cancel reservation
- `GET /reservations/available-tables` - Get available tables

### Special Requests
- `POST /requests` - Create special request

## 🤖 AI Assistant Usage

The AI Assistant can handle various natural language requests:

### Example Prompts
- "Book a table for 4 people tonight at 7 PM"
- "Check availability for tomorrow evening"
- "I need a table for 2 with window seating"
- "Reservation for 6 people, birthday celebration"
- "Do you have outdoor seating available?"

### AI Capabilities
- **Intent Recognition**: Understands booking, availability, and special requests
- **Context Awareness**: Remembers conversation context
- **Smart Suggestions**: Recommends optimal times and tables
- **Error Handling**: Graceful handling of unclear requests

## 🎨 Frontend Features

### Pages
- **Home**: Landing page with features and statistics
- **AI Assistant**: Chat interface for natural language booking
- **Reservation Form**: Traditional form-based booking
- **Dashboard**: Restaurant management analytics
- **Reservations**: View and manage existing reservations

### Components
- **Navbar**: Navigation with active state indicators
- **Cards**: Reusable card components with hover effects
- **Forms**: Validated forms with error handling
- **Tables**: Responsive data tables
- **Charts**: Analytics visualizations (placeholder)

## 🚀 Deployment

### Backend Deployment
```bash
cd backend
npm run deploy
```

### Frontend Deployment
```bash
cd frontend
npm run build

# Deploy to S3, CloudFront, or your preferred hosting
```

### Environment Variables
Ensure all environment variables are set in your deployment environment:

**Backend (Lambda Environment Variables)**
- `CUSTOMERS_TABLE`
- `RESTAURANTS_TABLE`
- `TABLES_TABLE`
- `RESERVATIONS_TABLE`
- `REQUESTS_TABLE`

**Frontend (Build-time Variables)**
- `REACT_APP_API_URL`

## 🔒 Security

- **CORS**: Configured for cross-origin requests
- **IAM**: Least privilege access policies
- **API Gateway**: Request validation and throttling
- **DynamoDB**: Encryption at rest and in transit

## 📊 Monitoring

### CloudWatch Metrics
- Lambda function invocations and errors
- API Gateway request counts and latencies
- DynamoDB read/write capacity

### Custom Metrics
- Reservation success rates
- AI response times
- Table utilization rates

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### API Testing
Use the provided API endpoints with tools like Postman or curl:

```bash
# Test AI Agent
curl -X POST https://your-api-url/ai-agent \
  -H "Content-Type: application/json" \
  -d '{"prompt": "book table for 3 persons today at 7 pm"}'
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API reference

## 🔮 Future Enhancements

- **Real-time Notifications**: SMS/email confirmations
- **Payment Integration**: Online payment processing
- **Mobile App**: Native mobile applications
- **Advanced Analytics**: Machine learning insights
- **Multi-restaurant Support**: Chain restaurant management
- **Integration APIs**: Third-party booking platforms 