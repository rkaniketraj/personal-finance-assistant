import { Link } from 'react-router-dom';

const LandingPage = () => {

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-sm">FA</span>
              </div>
              <span className="text-xl font-semibold text-slate-900 tracking-tight">FinanceAssistant</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors">Features</a>
              <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors">How it Works</a>
              <a href="#about" className="text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors">About</a>
            </nav>

            
            <div className="flex items-center space-x-3">
              <Link 
                to="/login" 
                className="text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors"
              >
                Sign in
              </Link>
              <Link 
                to="/register" 
                className="bg-slate-900 text-white px-5 py-2 rounded-lg hover:bg-slate-800 font-medium text-sm transition-all duration-200"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="py-24 px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-slate-900 mb-6 tracking-tight leading-tight">
              Track Your Finances,<br />
              <span className="font-medium">Master Your Future</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Personal finance management made simple with AI-powered insights. 
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link 
                to="/register" 
                className="bg-slate-900 text-white px-8 py-3 rounded-xl hover:bg-slate-800 font-medium text-base transition-all duration-200 hover:shadow-lg hover:scale-105"
              >
                Get Started
              </Link>
              <Link 
                to="/login" 
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium text-base group transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                  <span className="text-sm">▶</span>
                </div>
                <span>Demo Login</span>
              </Link>
            </div>

            {/* Finance-themed Graphics */}
            <div id='home' className="relative mt-20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-sm hover:shadow-md transition-all duration-300 group">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3 tracking-tight">Smart Analytics</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Visualize your spending patterns with interactive charts</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-sm hover:shadow-md transition-all duration-300 group">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3 tracking-tight">Receipt OCR</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Automatically extract expenses from receipts</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-sm hover:shadow-md transition-all duration-300 group">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3 tracking-tight">Easy Tracking</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Simple income and expense management</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Key Features</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">Everything you need to manage your finances effectively</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-slate-50/50 p-8 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all duration-300 group">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 tracking-tight">Income & Expense Tracking</h3>
                <p className="text-slate-600 leading-relaxed">Easily log your income and expenses with detailed categorization</p>
              </div>
              
              <div className="bg-slate-50/50 p-8 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all duration-300 group">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 tracking-tight">Analytics & Charts</h3>
                <p className="text-slate-600 leading-relaxed">Visualize your spending patterns with interactive charts and graphs</p>
              </div>
              
              <div className="bg-slate-50/50 p-8 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all duration-300 group">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 tracking-tight">Receipt Processing</h3>
                <p className="text-slate-600 leading-relaxed">Upload receipts and automatically extract transaction details</p>
              </div>
              
              <div className="bg-slate-50/50 p-8 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all duration-300 group">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 tracking-tight">Advanced Filtering</h3>
                <p className="text-slate-600 leading-relaxed">Filter transactions by date range, category, and search terms</p>
              </div>
              
              <div className="bg-slate-50/50 p-8 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all duration-300 group">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 tracking-tight">Category Insights</h3>
                <p className="text-slate-600 leading-relaxed">Understand your spending habits with category-wise breakdowns</p>
              </div>
              
              <div className="bg-slate-50/50 p-8 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all duration-300 group">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 tracking-tight">PDF Import</h3>
                <p className="text-slate-600 leading-relaxed">Import transaction history from PDF statements</p>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">How it Works</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">Get started with your financial journey in just a few simple steps</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              <div className="text-center group">
                <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 font-semibold text-xl group-hover:bg-slate-800 transition-colors">
                  1
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4 tracking-tight">Create Your Account</h3>
                <p className="text-slate-600 leading-relaxed">Sign up in seconds and set up your personalized finance dashboard with secure authentication</p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 font-semibold text-xl group-hover:bg-slate-800 transition-colors">
                  2
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4 tracking-tight">Track Your Finances</h3>
                <p className="text-slate-600 leading-relaxed">Add income and expenses manually, upload receipts for automatic processing, or import from PDF statements</p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 font-semibold text-xl group-hover:bg-slate-800 transition-colors">
                  3
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4 tracking-tight">Get Insights</h3>
                <p className="text-slate-600 leading-relaxed">Analyze your spending patterns with interactive charts and receive AI-powered financial recommendations</p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-light text-slate-900 mb-6 tracking-tight">About FinanceAssistant</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed mb-12">
              We believe everyone deserves access to powerful financial tools without complexity. 
              FinanceAssistant combines AI technology with intuitive design to help you understand 
              your spending habits and make informed financial decisions.
            </p>
          
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8 border-t border-slate-700/50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 sm:mb-0">
              <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-sm">FA</span>
              </div>
              <span className="text-lg font-semibold tracking-tight">FinanceAssistant</span>
            </div>
            <p className="text-slate-400 text-sm">
              © 2025 Personal Finance Assistant
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;