import { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, Users, TrendingUp, Shield, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar'
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mock Navbar component (replace this with your actual Navbar.jsx import)
  const Navbar = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">HR Dashboard</h1>
            </div>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                setEmail('');
                setPassword('');
                setError('');
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Welcome to HR Dashboard!</h2>
          <p className="text-gray-600 dark:text-gray-400">You have successfully logged in.</p>
        </div>
      </div>
    </div>
  );

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Check credentials
    if (email === 'admin' && password === 'password') {
      setTimeout(() => {
        setIsAuthenticated(true);
        setIsLoading(false);
      }, 1500);
    } else {
      setTimeout(() => {
        setError('Invalid credentials. Please use email: admin and password: password');
        setIsLoading(false);
      }, 1500);
    }
  };

  // If authenticated, show Navbar
  if (isAuthenticated) {
    return <Navbar />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Enhanced Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full opacity-5 blur-2xl"></div>
      </div>

      <div className="relative w-full max-w-md mx-auto">
        {/* Main Login Card */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/50 p-6 sm:p-8 lg:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center mb-6 shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
              HR Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-3 text-sm sm:text-base">
              Sign in to access your workspace
            </p>
          </div>

          {/* Credentials Info */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-2xl border border-blue-200 dark:border-blue-700">
            <div className="flex items-center mb-2">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Demo Credentials</span>
            </div>
            <div className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
              <p><span className="font-medium">Email:</span> admin</p>
              <p><span className="font-medium">Password:</span> password</p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 rounded-2xl border border-red-200 dark:border-red-700">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                <span className="text-sm text-red-800 dark:text-red-200">{error}</span>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email / Username
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white placeholder-gray-500 transition-all duration-200 text-sm sm:text-base"
                  placeholder="Enter: admin"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-14 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white placeholder-gray-500 transition-all duration-200 text-sm sm:text-base"
                  placeholder="Enter: password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 px-6 rounded-2xl font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  Authenticating...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Users, title: 'Employee Management', desc: 'Track & manage workforce' },
            { icon: TrendingUp, title: 'Analytics', desc: 'Performance insights' },
            { icon: Shield, title: 'Secure Access', desc: 'Role-based authentication' }
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/30 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200">
              <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}