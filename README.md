# 💰 Personal Finance Assistant

A comprehensive, personal finance management application that helps users track expenses, manage transactions, and gain valuable financial insights through intelligent analysis and receipt processing.

## 🎥 Demo Video

🔗 **[Watch the Demo Video](https://drive.google.com/file/d/1ll5XFa4DGRFVe_jYmCXNHIbWxWzPXkVr/view?usp=sharing)**  

## 📖 Project Description

The Personal Finance Assistant is a full-stack web application designed to simplify personal financial management. Built with modern technologies and powered by artificial intelligence, it offers users an intuitive platform to:

- **Track Financial Transactions** - Seamlessly manage income and expenses with smart categorization
- **Process Receipts with AI** - Upload receipt images and automatically extract transaction data using Google Gemini AI
- **Generate Financial Insights** - Get personalized recommendations and spending pattern analysis
- **Visualize Financial Data** - Interactive charts and graphs for better financial understanding
- **Secure Data Management** - JWT-based authentication with encrypted data storage

### 🎯 Key Features

#### 🔐 **Secure Authentication System**
- JWT-based user authentication
- Persistent login sessions
- Secure password hashing with bcryptjs
- Protected routes and middleware

#### 💳 **Smart Transaction Management**
- Add, and delete transactions
- Intelligent expense categorization
- Real-time financial summaries
- Advanced filtering and search capabilities

#### 📄 **AI-Powered Receipt Processing**
- Upload receipt images (JPG, PNG, GIF)
- Google Gemini AI OCR for automatic data extraction
- Manual correction of extracted data
- Receipt image storage and management

#### 📊 **Interactive Financial Analytics**
- Real-time spending analysis
- Category-wise expense breakdowns
- Monthly and yearly financial trends
- Visual charts and graphs with Chart.js

#### 📱 **Modern User Experience**
- Responsive design for all devices
- Clean, intuitive interface with Tailwind CSS
- Real-time notifications and feedback
- Fast, optimized performance with Vite

## 🛠️ Tech Stack

### **Frontend**
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.1.0 | User interface framework |
| **Vite** | 7.0.4 | Build tool and development server |
| **Tailwind CSS** | 3.4.0 | Utility-first CSS framework |
| **React Router** | 7.7.1 | Client-side routing |
| **Chart.js** | 4.5.0 | Data visualization |
| **Axios** | 1.11.0 | HTTP client for API requests |
| **React Markdown** | 10.1.0 | Markdown rendering |

### **Backend**
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | - | Server runtime environment |
| **Express.js** | 4.18.2 | Web application framework |
| **MongoDB** | - | NoSQL database |
| **Mongoose** | 8.0.0 | MongoDB ODM |
| **JWT** | 9.0.2 | Authentication tokens |
| **bcryptjs** | 2.4.3 | Password hashing |
| **Multer** | 2.0.2 | File upload middleware |
| **Google Gemini AI** | 0.24.1 | AI OCR and analysis |

## 🚀 How to Run the Project

### **Prerequisites**
Before running the application, ensure you have the following installed:
- **Node.js** (version 16 or higher)
- **MongoDB** (local installation or cloud instance)
- **Git** (for cloning the repository)
- **npm** or **yarn** (package manager)

### **Installation & Setup**

#### **1. Clone the Repository**
```bash
git clone https://github.com/rkaniketraj/personal-finance-assistant.git
cd personal-finance-assistant
```

#### **2. Backend Setup**

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
# Create a .env file with the following content:
```

Create a `.env` file in the `backend` directory:
```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/finance-app

# Server Configuration
PORT=5000

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex_for_security

# AI Services (Optional - for enhanced features)
GEMINI_API_KEY=your_google_gemini_api_key_here

# Environment
NODE_ENV=development
```

```bash
# Start the backend server
npm run dev
```

The backend server will start on `http://localhost:5000`

#### **3. Frontend Setup**

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
# Create a .env file with the following content:
```

Create a `.env` file in the `frontend` directory:
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
```

```bash
# Start the frontend development server
npm run dev
```

The frontend application will start on `http://localhost:5173`

#### **4. Database Setup MongoDB Atlas (Cloud)**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get the connection string
4. Replace the `MONGODB_URI` in your `.env` file

#### **5. Google Gemini AI Setup**

For AI-powered features including receipt OCR:
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your backend `.env` file as `GEMINI_API_KEY`

### **🎯 Verification Steps**

1. **Backend Health Check**
   - Visit `http://localhost:5000/api/health`
   - Should return: `{"status":"OK"}`

2. **Frontend Application**
   - Visit `http://localhost:5173`
   - Should display the landing page

3. **Database Connection**
   - Register a new user account
   - Login should work successfully

4. **Feature Testing**
   - Create a test transaction
   - Upload a receipt image
   - View dashboard analytics

## 📂 Project Structure

```
personal-finance-assistant/
├── backend/                     # Node.js/Express API server
│   ├── src/
│   │   ├── app.js              # Main application entry
│   │   ├── controllers/        # Business logic
│   │   ├── middleware/         # Authentication & validation
│   │   ├── models/             # Database schemas
│   │   ├── routes/             # API endpoints
│   │   └── services/           # External service integrations
│   ├── uploads/                # File storage
│   ├── package.json            # Backend dependencies
│   └── README.md               # Backend documentation
├── frontend/                   # React application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Application pages
│   │   ├── services/           # API integration
│   │   ├── utils/              # Utility functions
│   │   └── config/             # App configuration
│   ├── public/                 # Static assets
│   ├── package.json            # Frontend dependencies
│   └── README.md               # Frontend documentation
└── README.md                   # This main project README
```


## 📱 Usage Guide

### **Getting Started**
1. **Create Account** - Register with email and password
2. **Add Transactions** - Start by adding your recent expenses and income
3. **Upload Receipts** - Use the receipt scanner for automatic data entry
4. **View Analytics** - Check your dashboard for spending insights

### **Best Practices**
- **Regular Updates** - Add transactions daily for accurate tracking
- **Categorize Properly** - Use consistent categories for better analysis
- **Review AI Insights** - Check recommendations weekly
- **Backup Data** - Export your data regularly
