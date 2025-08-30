# Personal Finance App - Backend API

🚀 A powerful and intelligent backend API for personal finance management, featuring AI-powered insights and receipt processing capabilities.

## 🌟 Features

### Core Functionality
- 🔐 **User Authentication** - JWT-based secure authentication with cookie support
- 💳 **Transaction Management** - Complete CRUD operations for financial transactions
- 📊 **Financial Analytics** - Real-time insights and spending analysis
- 📄 **Receipt Processing** - AI-powered OCR with Google Gemini for automatic expense entry
- 🤖 **AI Financial Advisor** - Personalized financial insights and recommendations
- 📈 **Spending Pattern Analysis** - Behavioral insights and trend detection

### AI & Machine Learning
- **Gemini AI Integration** - Advanced financial analysis and advice generation
- **OCR Receipt Processing** - Automatic expense extraction from receipt images
- **Spending Pattern Recognition** - AI-powered behavioral analysis
- **Personalized Recommendations** - Tailored financial advice based on spending habits

### Technical Features
- **MongoDB Integration** - Scalable NoSQL database with Mongoose ODM
- **File Upload Support** - Multer-based image handling for receipts
- **CORS Configuration** - Secure cross-origin resource sharing
- **Error Handling** - Comprehensive error management and logging
- **Environment Configuration** - Flexible deployment settings

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Google Gemini API key (optional, falls back to mock data)

### Installation

1. **Clone and navigate to backend**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the backend directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/finance-app

   # Server Configuration
   PORT=5000

   # Authentication
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex

   # AI Services (Optional)
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the server**
   ```bash
   # Development mode (auto-restart)
   npm run dev

   # Production mode
   npm start
   ```

5. **Verify installation**
   Visit `http://localhost:5000/api/health` - should return `{"status":"OK"}`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <jwt_token>
```

### Transaction Management

#### Create Transaction
```http
POST /api/transactions
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "amount": 250.00,
  "category": "Food & Dining",
  "description": "Lunch at restaurant",
  "type": "expense",
  "date": "2025-08-31"
}
```

#### Get All Transactions
```http
GET /api/transactions
Authorization: Bearer <jwt_token>

# Query parameters (optional):
# ?page=1&limit=10&category=Food&type=expense&startDate=2025-01-01&endDate=2025-12-31
```

#### Get Financial Summary
```http
GET /api/transactions/summary
Authorization: Bearer <jwt_token>
```

#### Update Transaction
```http
PUT /api/transactions/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "amount": 300.00,
  "description": "Updated description"
}
```

#### Delete Transaction
```http
DELETE /api/transactions/:id
Authorization: Bearer <jwt_token>
```

### Receipt Processing

#### Upload Receipt
```http
POST /api/receipts/upload
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

{
  "receipt": <image_file>
}
```

#### Get Receipt Data
```http
GET /api/receipts/:id
Authorization: Bearer <jwt_token>
```

#### Get All Receipts
```http
GET /api/receipts
Authorization: Bearer <jwt_token>
```

### AI Analysis Endpoints

#### Get Financial Insights
```http
GET /api/ai/insights
Authorization: Bearer <jwt_token>

# Query parameters:
# ?period=30d  (7d, 30d, 90d, 6m, 1y)
```

#### Get Spending Analysis
```http
GET /api/ai/spending-patterns
Authorization: Bearer <jwt_token>
```

#### Get Financial Advice
```http
GET /api/ai/advice
Authorization: Bearer <jwt_token>
```

## 🏗️ Project Architecture

```
backend/
├── src/
│   ├── app.js                    # Main application entry point
│   ├── controllers/              # Business logic controllers
│   │   ├── authController.js     # Authentication logic
│   │   ├── transactionController.js  # Transaction management
│   │   ├── receiptController.js  # Receipt processing
│   │   └── aiController.js       # AI analysis endpoints
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── models/                  # Mongoose data models
│   │   ├── User.js              # User account model
│   │   ├── Transaction.js       # Financial transaction model
│   │   └── Receipt.js           # Receipt metadata model
│   ├── routes/                  # API route definitions
│   │   ├── auth.js              # Authentication routes
│   │   ├── transactions.js      # Transaction routes
│   │   ├── receipts.js          # Receipt routes
│   │   └── ai.js                # AI analysis routes
│   └── services/                # External service integrations
│       ├── aiFinancialService.js    # AI financial analysis
│       └── geminiOCR.js         # OCR receipt processing
├── uploads/                     # File upload storage
│   └── receipts/               # Receipt image storage
├── package.json                 # Dependencies and scripts
└── README.md                   # This file
```

## 💾 Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Transaction Model
```javascript
{
  userId: ObjectId,
  amount: Number,
  category: String,
  description: String,
  type: 'income' | 'expense',
  date: Date,
  receiptId: ObjectId (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### Receipt Model
```javascript
{
  userId: ObjectId,
  filename: String,
  originalName: String,
  mimetype: String,
  size: Number,
  ocrData: {
    merchant: String,
    amount: Number,
    date: Date,
    items: [String],
    category: String,
    currency: String,
    rawText: String
  },
  processed: Boolean,
  createdAt: Date
}
```

## 🏷️ Supported Categories

**Expense Categories:**
- Food & Dining
- Transportation
- Shopping
- Entertainment
- Healthcare
- Utilities
- Education
- Travel
- Others

**Income Categories:**
- Salary
- Business
- Investment
- Others

## 🤖 AI Services Configuration

### Gemini AI Setup
1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to `.env` file: `GEMINI_API_KEY=your_key_here`
3. AI features will automatically activate

### Fallback Behavior
- Without API key: Mock data and insights are generated
- With API key errors: Graceful fallback to mock responses
- All AI features remain functional regardless of configuration

## 🛠️ Development

### Available Scripts
```bash
npm start          # Production server
npm run dev        # Development server with auto-reload
npm test           # Run tests (if configured)
```

### Environment Variables
```env
# Required
MONGODB_URI=mongodb://localhost:27017/finance-app
JWT_SECRET=your_jwt_secret_key

# Optional
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
```

### File Upload Configuration
- **Storage**: Local filesystem (`./uploads/receipts/`)
- **Supported formats**: JPG, JPEG, PNG, GIF
- **Max file size**: 5MB
- **Naming**: `receipt-{timestamp}-{random}.{ext}`

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcryptjs with salt rounds
- **CORS Configuration** - Restricted origin access
- **Cookie Security** - HTTP-only cookies for auth
- **Input Validation** - Mongoose schema validation
- **File Upload Security** - MIME type and size restrictions

## 📊 API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error info (development only)"
}
```

## 🚀 Deployment

### Production Checklist
- [ ] Set strong `JWT_SECRET`
- [ ] Configure production MongoDB URI
- [ ] Set `NODE_ENV=production`
- [ ] Configure reverse proxy (nginx)
- [ ] Set up SSL certificates
- [ ] Configure file upload permissions
- [ ] Set up monitoring and logging

### Docker Support
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src/ ./src/
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

MIT License - see LICENSE file for details

## 👤 Author

**Alagadapa Jaya Harsh Vardhan**  
*Indian Institute of Information Technology, Sri City*

---

*Built with ❤️ using Node.js, Express, MongoDB, and Google Gemini AI*
