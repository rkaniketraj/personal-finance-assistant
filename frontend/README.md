# Personal Finance App - Frontend

💰 A modern, responsive React-based frontend for personal finance management with AI-powered insights and interactive visualizations.

## 🌟 Features

### User Experience
- 🎨 **Modern UI/UX** - Clean, intuitive design with Tailwind CSS
- 📱 **Responsive Design** - Seamless experience across all devices
- 🌙 **Dark Theme Ready** - Beautiful interface adaptable to user preferences
- ⚡ **Fast Performance** - Optimized with Vite for lightning-fast development and builds
- 🔄 **Real-time Updates** - Live data synchronization with backend

### Core Functionality
- 🔐 **Secure Authentication** - JWT-based login/register with persistent sessions
- 💳 **Transaction Management** - Add, edit, delete, and categorize transactions
- 📊 **Interactive Dashboard** - Visual overview of financial health with charts
- 📄 **Receipt Processing** - Upload and automatically extract expense data
- 🤖 **AI Financial Insights** - Personalized analysis and recommendations
- 📈 **Spending Analytics** - Detailed breakdowns and trend analysis

### Advanced Features
- **Smart Categories** - Intelligent expense categorization
- **Visual Analytics** - Interactive charts with Chart.js integration
- **Receipt OCR** - AI-powered receipt data extraction
- **Pattern Recognition** - Spending behavior analysis
- **Financial Goals** - Track progress toward financial objectives
- **Export Data** - Download financial reports and transaction history

### Technical Features
- **React 19** - Latest React features with modern hooks
- **React Router v7** - Advanced client-side routing
- **Tailwind CSS** - Utility-first styling framework
- **Chart.js** - Beautiful, interactive data visualizations
- **Axios** - Robust HTTP client with interceptors
- **Vite** - Next-generation build tool
- **ESLint** - Code quality and consistency

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Backend API running (see backend README)

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env` file in the frontend directory:
   ```env
   # API Configuration
   VITE_API_BASE_URL=http://localhost:5000/api

   # Optional: Additional configuration
   VITE_APP_NAME=Personal Finance Assistant
   VITE_APP_VERSION=1.0.0
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open in browser**
   Visit `http://localhost:5173` to view the application

## 🏗️ Project Structure

```
frontend/
├── public/                      # Static assets
│   └── vite.svg                # App favicon
├── src/
│   ├── App.jsx                 # Main application component
│   ├── App.css                 # Global styles
│   ├── main.jsx                # Application entry point
│   ├── index.css               # Tailwind and base styles
│   ├── assets/                 # Static assets (images, icons)
│   │   └── react.svg           # React logo
│   ├── components/             # Reusable UI components
│   │   └── common/
│   │       ├── Header.jsx      # Navigation header
│   │       ├── Loader.jsx      # Loading spinner
│   │       ├── Modal.jsx       # Modal dialogs
│   │       ├── Notifications.jsx # Toast notifications
│   │       └── ProtectedRoute.jsx # Route protection
│   ├── config/
│   │   └── index.js            # App configuration
│   ├── pages/                  # Main application pages
│   │   ├── LandingPage.jsx     # Welcome/marketing page
│   │   ├── Login.jsx           # User authentication
│   │   ├── Register.jsx        # User registration
│   │   ├── Dashboard.jsx       # Main dashboard
│   │   ├── Transactions.jsx    # Transaction management
│   │   ├── Receipts.jsx        # Receipt upload/processing
│   │   ├── Analysis.jsx        # AI insights and analytics
│   │   └── Profile.jsx         # User profile management
│   ├── services/               # API and external services
│   │   ├── api.js              # Axios HTTP client setup
│   │   └── aiService.js        # AI analysis API calls
│   └── utils/                  # Utility functions
│       └── auth.js             # Authentication helpers
├── eslint.config.js            # ESLint configuration
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── vite.config.js              # Vite build configuration
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## 📱 Pages & Features

### 🏠 Landing Page
- **Marketing content** - Feature highlights and benefits
- **Call-to-action** - Sign up and login prompts
- **Responsive design** - Mobile-first approach
- **Smooth animations** - Engaging user experience

### 🔐 Authentication
- **Login/Register forms** - Clean, accessible forms
- **Form validation** - Real-time input validation
- **Error handling** - User-friendly error messages
- **Remember me** - Persistent login sessions

### 📊 Dashboard
- **Financial overview** - Income, expenses, and balance
- **Quick stats** - Key financial metrics
- **Recent transactions** - Latest activity overview
- **Spending charts** - Visual expense breakdown
- **Quick actions** - Add transaction, upload receipt

### 💳 Transactions
- **Transaction list** - Searchable and filterable
- **Add/Edit forms** - Intuitive transaction entry
- **Category management** - Smart categorization
- **Bulk operations** - Multiple transaction actions
- **Export options** - CSV/PDF export functionality

### 📄 Receipts
- **Upload interface** - Drag-and-drop file upload
- **OCR processing** - Automatic data extraction
- **Preview mode** - Receipt image viewing
- **Edit extracted data** - Manual correction capability
- **Receipt gallery** - Historical receipt storage

### 🤖 AI Analysis
- **Financial insights** - AI-powered spending analysis
- **Personalized advice** - Custom financial recommendations
- **Spending patterns** - Behavioral analysis and trends
- **Goal tracking** - Progress toward financial objectives
- **Interactive reports** - Detailed analytics with charts

### 👤 Profile
- **User information** - Account details management
- **Security settings** - Password change, security options
- **Preferences** - App customization settings
- **Data export** - Download personal financial data

## 🎨 UI Components

### Common Components
```javascript
// Header with navigation
<Header />

// Loading states
<Loader />

// Modal dialogs
<Modal />

// Notifications/toasts
<Notifications />

// Protected routes
<ProtectedRoute />
```

### Form Components
- **Input fields** - Styled form inputs with validation
- **Select dropdowns** - Custom dropdown components
- **Date pickers** - Calendar-based date selection
- **File uploaders** - Drag-and-drop file upload areas
- **Buttons** - Various button styles and states

### Data Visualization
- **Charts** - Line, bar, pie, and doughnut charts
- **Progress bars** - Goal and budget progress indicators
- **Heatmaps** - Spending pattern visualization
- **Tables** - Sortable and filterable data tables

## 🛠️ Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Type checking (if TypeScript is added)
npm run type-check
```

### Build Configuration

#### Vite Configuration
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

#### Tailwind Configuration
```javascript
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981'
      }
    }
  },
  plugins: []
}
```

### Environment Variables
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=Personal Finance Assistant
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=development

# Feature Flags
VITE_ENABLE_AI_FEATURES=true
VITE_ENABLE_ANALYTICS=true
```

## 📚 API Integration

### HTTP Client Setup
```javascript
// services/api.js
import axios from 'axios';
import config from '../config';

const api = axios.create({
  baseURL: config.API_BASE_URL,
  withCredentials: true,
  timeout: 10000
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### API Service Examples
```javascript
// Authentication
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  logout: () => api.post('/auth/logout')
};

// Transactions
export const transactionAPI = {
  getAll: (params) => api.get('/transactions', { params }),
  create: (data) => api.post('/transactions', data),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  delete: (id) => api.delete(`/transactions/${id}`),
  getSummary: () => api.get('/transactions/summary')
};

// AI Analysis
export const aiAPI = {
  getInsights: (period) => api.get(`/ai/insights?period=${period}`),
  getAdvice: () => api.get('/ai/advice'),
  getPatterns: () => api.get('/ai/spending-patterns')
};
```

## 🎯 State Management

### Authentication State
```javascript
// utils/auth.js
export const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

export const setUser = (userData) => {
  localStorage.setItem('user', JSON.stringify(userData));
  localStorage.setItem('authToken', userData.token);
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  window.location.href = '/';
};
```

### Component State Patterns
- **useState** - Local component state
- **useEffect** - Side effects and API calls
- **Custom hooks** - Reusable state logic
- **Context API** - Global state management (if needed)

## 🔒 Security Features

### Authentication
- **JWT token storage** - Secure token management
- **Automatic token refresh** - Session management
- **Route protection** - Protected route components
- **Logout on inactivity** - Security timeout

### Data Protection
- **Input sanitization** - XSS prevention
- **HTTPS enforcement** - Secure data transmission
- **CORS handling** - Cross-origin request security
- **Environment variables** - Secure configuration

## 🎨 Styling & Themes

### Tailwind CSS
```css
/* Custom utilities */
@layer utilities {
  .btn-primary {
    @apply bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-md border border-gray-200 p-6;
  }
  
  .input-field {
    @apply w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500;
  }
}
```

### Responsive Design
- **Mobile-first** - Optimized for mobile devices
- **Breakpoint system** - Tailwind responsive utilities
- **Flexible layouts** - CSS Grid and Flexbox
- **Touch-friendly** - Appropriate touch targets

## 📊 Performance Optimization

### Code Splitting
```javascript
// Lazy loading pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analysis = lazy(() => import('./pages/Analysis'));

// Suspense wrapper
<Suspense fallback={<Loader />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/analysis" element={<Analysis />} />
  </Routes>
</Suspense>
```

### Bundle Optimization
- **Tree shaking** - Remove unused code
- **Code splitting** - Lazy load components
- **Image optimization** - Compressed images
- **Bundle analysis** - Monitor bundle size

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Static Hosting (Netlify/Vercel)
```json
// package.json build settings
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### Environment Configuration
```bash
# Production environment variables
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_APP_NAME=Personal Finance Assistant
VITE_ENVIRONMENT=production
```

### Docker Support
```dockerfile
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🧪 Testing

### Testing Strategy
- **Unit tests** - Component testing with Jest/Vitest
- **Integration tests** - API integration testing
- **E2E tests** - End-to-end user flows
- **Visual regression** - UI consistency testing

### Example Test Setup
```javascript
// Component test example
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard';

test('renders dashboard title', () => {
  render(
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  );
  expect(screen.getByText('Dashboard')).toBeInTheDocument();
});
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Follow coding standards and run linter
4. Write tests for new functionality
5. Commit changes (`git commit -m 'Add new feature'`)
6. Push to branch (`git push origin feature/new-feature`)
7. Create Pull Request

### Code Standards
- **ESLint rules** - Consistent code formatting
- **Component structure** - Organized file structure
- **Naming conventions** - Clear, descriptive names
- **Documentation** - Inline code comments

## 📝 License

MIT License - see LICENSE file for details

## 👤 Author

**Alagadapa Jaya Harsh Vardhan**  
*Indian Institute of Information Technology, Sri City*

---

*Built with ❤️ using React, Tailwind CSS, Chart.js, and modern web technologies*
