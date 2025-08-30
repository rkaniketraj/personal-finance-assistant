# Simple Finance App Backend

A minimal, modular backend for a personal finance application built in a day-like approach.

## Features

- User authentication (register/login)
- Transaction management (CRUD operations)
- Simple financial summary
- MongoDB integration
- JWT-based authentication

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

3. **Run the server**
   ```bash
   npm run dev  # Development mode with nodemon
   npm start    # Production mode
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile

### Transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/summary` - Get financial summary
- `GET /api/transactions/:id` - Get single transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Health Check
- `GET /api/health` - Server health status

## Project Structure

```
src/
├── app.js              # Main application file
├── models/
│   ├── User.js         # User model
│   └── Transaction.js  # Transaction model
├── controllers/
│   ├── authController.js        # Auth logic
│   └── transactionController.js # Transaction logic
├── middleware/
│   └── auth.js         # JWT authentication
└── routes/
    ├── auth.js         # Auth routes
    └── transactions.js # Transaction routes
```

## Environment Variables

- `MONGODB_URI` - MongoDB connection string
- `PORT` - Server port (default: 5000)
- `JWT_SECRET` - Secret key for JWT tokens

## Transaction Categories

- Food & Dining
- Transportation
- Shopping
- Entertainment
- Healthcare
- Utilities
- Education
- Travel
- Salary
- Business
- Investment
- Others

## Notes

This is a simplified version focusing on core functionality:
- Removed complex validation layers
- Simplified error handling
- Basic CRUD operations
- Clean, readable code structure
- No OCR/AI features for simplicity
