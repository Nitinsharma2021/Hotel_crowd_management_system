# Quick Start Guide

Get your Restaurant Reservation System up and running in minutes!

## 🚀 Prerequisites

1. **Node.js 18+** installed
2. **AWS CLI** configured with appropriate permissions
3. **AWS Account** with access to Lambda, API Gateway, DynamoDB, and Bedrock

## ⚡ Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
# Install all dependencies
npm run install-all
```

### 2. Deploy to AWS
```bash
# Run the deployment script
chmod +x deploy.sh
./deploy.sh
```

### 3. Start Development
```bash
# Start both frontend and backend
npm run dev
```

## 🧪 Test the System

### Test the AI Agent
```bash
# Test the AI agent with your API URL
curl -X POST https://your-api-url/ai-agent \
  -H "Content-Type: application/json" \
  -d '{"prompt": "book table for 3 persons today at 7 pm"}'
```

### Test the Frontend
1. Open `http://localhost:3000` in your browser
2. Navigate to "AI Assistant" 
3. Try these prompts:
   - "Book a table for 4 people tonight at 7 PM"
   - "Check availability for tomorrow"
   - "I need outdoor seating for 2 people"

## 📱 Key Features to Try

### 1. AI Assistant (Main Feature)
- **Location**: `/ai-assistant`
- **What to try**: Natural language booking requests
- **Example**: "Book a table for 6 people, birthday celebration"

### 2. Traditional Reservation Form
- **Location**: `/reserve`
- **What to try**: Step-by-step reservation process
- **Features**: Real-time table availability, form validation

### 3. Dashboard
- **Location**: `/dashboard`
- **What to try**: View analytics and restaurant metrics
- **Features**: Real-time statistics, table utilization

### 4. Reservation Management
- **Location**: `/reservations`
- **What to try**: View and manage existing reservations
- **Features**: Search, filter, and status management

## 🔧 Configuration

### Environment Variables

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

### AWS Services Required

1. **Lambda**: Serverless functions
2. **API Gateway**: REST API endpoints
3. **DynamoDB**: NoSQL database
4. **Bedrock**: AI/ML models
5. **IAM**: Access permissions

## 🐛 Troubleshooting

### Common Issues

1. **"AWS credentials not configured"**
   ```bash
   aws configure
   ```

2. **"Serverless not found"**
   ```bash
   npm install -g serverless
   ```

3. **"CORS errors"**
   - Check API Gateway CORS settings
   - Verify frontend API URL

4. **"Bedrock access denied"**
   - Ensure Bedrock permissions in IAM
   - Check region compatibility

### Debug Mode

```bash
# Backend with detailed logging
cd backend && npm run dev

# Frontend with console logs
cd frontend && npm start
```

## 📊 Sample Data

The system comes with sample data:
- **Restaurant**: "Fine Dining Restaurant"
- **Tables**: 11 tables (2-8 seats, indoor/outdoor)
- **Sample Reservations**: Pre-populated for testing

## 🔗 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/ai-agent` | POST | AI-powered reservation assistant |
| `/reservations` | POST | Create reservation |
| `/customers` | POST | Create customer |
| `/tables` | GET | List available tables |

## 🎯 Next Steps

1. **Customize**: Modify restaurant details and table layout
2. **Scale**: Add more restaurants and tables
3. **Integrate**: Connect with payment systems
4. **Deploy**: Move to production environment

## 📞 Support

- **Documentation**: See `README.md` for detailed docs
- **Issues**: Check GitHub issues
- **API Testing**: Use `test-api.js` script

---

**Happy Booking! 🍽️** 

---

## 1. **API Endpoint Connection (Code Review)**

### **API Service (`frontend/src/services/api.js`):**
```js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://6op1kbv0p2.execute-api.us-east-1.amazonaws.com/Prod';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const aiAgentAPI = {
  processRequest: (prompt) => api.post('/ai-agent', { prompt }),
};
```
- **This is correct.** All prompts are sent as POST to `/ai-agent` with `{ prompt: "..." }`.

---

### **AI Assistant (`frontend/src/pages/AIAssistant.js`):**
```js
const handleSendMessage = async () => {
  // ...
  const response = await aiAgentAPI.processRequest(inputValue);
  // ...
};
```
- **This is correct.** The chat prompt is sent to `/ai-agent`.

---

### **Reservation Form (`frontend/src/pages/ReservationForm.js`):**
```js
const onSubmit = async (data) => {
  // ...
  const prompt = `book table for ${data.partySize} persons on ${data.date} at ${data.time} for ${data.name} (${data.email}, ${data.phone})`;
  const response = await aiAgentAPI.processRequest(prompt);
  // ...
};
```
- **This is correct.** The reservation prompt is sent to `/ai-agent`.

---

## 2. **How to Run**

1. **Start the frontend:**
   ```sh
   cd frontend
   npm start
   ```
2. **Open your browser:**  
   Go to [http://localhost:3000](http://localhost:3000)

3. **Test:**
   - Use the AI chat and reservation form.
   - If you get an error, open DevTools (F12) → Network tab, and check the `/ai-agent` request.

---

## 3. **If You Get an Error**

- **Copy and paste here:**
  - The status code (e.g., 400, 500)
  - The full response body
  - The request payload

---

## 4. **If You Want Me to Run the App**

I can only guide you to run it on your machine, as I don’t have direct access to your local environment.  
**You must run:**
```sh
<code_block_to_apply_changes_from>
```
and then open [http://localhost:3000](http://localhost:3000) in your browser.

---

**Your code is correct. If you follow these steps and share any error details, I’ll help you fix any remaining issues immediately!** 

---

Here’s a clear, step-by-step plan to get your app working and fix any errors:

---

## 1. **Code Review: Your Setup is Correct**

- **API endpoint:** All prompts are sent to `/ai-agent` at your AWS API Gateway.
- **Request format:** `{ "prompt": "..." }` with `Content-Type: application/json`.
- **Frontend code:** Both the AI chat and reservation form use this endpoint and format.

---

## 2. **What to Do Next (Troubleshooting Checklist)**

### **A. Start the App**
1. In your terminal:
   ```sh
   cd frontend
   npm start
   ```
2. If asked for a port, type `3005` or accept the default if 3005 is shown.

### **B. Open the App**
- Go to [http://localhost:3005](http://localhost:3005) in your browser.

### **C. Test the AI Chat and Reservation Form**
- Try sending a prompt and making a reservation.

---

## 3. **If It’s Not Working: Gather Error Details**

### **A. Browser DevTools**
- Press `F12` to open DevTools.
- Go to the **Console** tab: Are there any red errors? Copy them here.
- Go to the **Network** tab, click the `/ai-agent` request:
  - What is the **status code** (e.g., 200, 400, 500)?
  - What is the **response body**?
  - What is the **request payload**?

### **B. Terminal Output**
- Are there any errors or warnings in the terminal where you ran `npm start`? Copy them here.

---

## 4. **If You Want Me to “Run All Code and Fix Error”**

I can only guide you to run and debug on your machine.  
**You must:**
- Start the app as above.
- Try the features.
- Copy any error messages (from browser or terminal) here.

---

## 5. **If You Want a Clean Start**

If you want to be sure everything is fresh:
1. Stop all running dev servers.
2. In the `frontend` directory, run:
   ```sh
   npm install
   npm start
   ```
3. Open [http://localhost:3005](http://localhost:3005).

---

## 6. **If You Still Get Errors**

**Copy and paste here:**
- The error message from the browser console.
- The status code, response, and payload from 