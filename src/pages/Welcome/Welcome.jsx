import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  PieChart, 
  Target, 
  Shield, 
  Smartphone,
  BarChart3,
  Wallet,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Lock,
  Zap,
  Home
} from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

const Welcome = () => {
  const navigate = useNavigate();
  const { currentUser, loading } = useAuth();

  const features = [
    {
      icon: Wallet,
      title: 'Track Every Dollar',
      description: 'Easily monitor all your income and expenses in one place. Categorize transactions and see where your money goes.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: PieChart,
      title: 'Visual Analytics',
      description: 'Beautiful charts and graphs help you understand your spending patterns and make smarter financial decisions.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Target,
      title: 'Set & Achieve Goals',
      description: 'Create budgets, set savings goals, and track your progress. Stay motivated with visual milestones.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: BarChart3,
      title: 'Smart Insights',
      description: 'Get personalized recommendations and insights based on your financial habits. Discover opportunities to save more.',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Shield,
      title: 'Bank-Level Security',
      description: 'Your financial data is protected with industry-standard encryption. Your privacy is our top priority.',
      color: 'from-indigo-500 to-blue-500',
    },
    {
      icon: Smartphone,
      title: 'Access Anywhere',
      description: 'Manage your finances on the go. Fully responsive design works seamlessly on all your devices.',
      color: 'from-teal-500 to-cyan-500',
    },
  ];

  const benefits = [
    'No credit card required',
    'Free to get started',
    '7-day session security',
    'No hidden fees',
  ];

  const stats = [
    { number: '10k+', label: 'Secure Sessions' },
    { number: '$2M+', label: 'Money Managed' },
    { number: '95%', label: 'Satisfaction Rate' },
    { number: '24/7', label: 'Support Available' },
  ];

  return (
    <div className="min-h-screen bg-dark-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-800/80 backdrop-blur-lg border-b border-dark-700">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-500 via-purple-500 to-primary-400 bg-clip-text text-transparent">
                Budgeta
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {currentUser ? (
                <>
                  <Link to="/dashboard">
                    <Button variant="primary" size="md" icon={<Home className="w-4 h-4" />}>
                      Go to Dashboard
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="md">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="primary" size="md">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-primary-400" />
              <span className="text-primary-400 text-sm font-semibold">Your Personal Finance Super App</span>
            </div>

            {/* Main Heading */}
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Take Control of Your
              <span className="block bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Financial Future
              </span>
            </h2>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              Track expenses, understand your spending habits, and achieve your financial goals with beautiful analytics and insights.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              {currentUser ? (
                <Link to="/dashboard">
                  <Button variant="primary" size="lg" icon={<Home className="w-5 h-5" />}>
                    Go to Your Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                      Start Free Today
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="lg">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Benefits List */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image/Dashboard Preview */}
          <div className="mt-16 max-w-6xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent z-10" />
              <div className="rounded-2xl overflow-hidden border-2 border-dark-700 shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=700&fit=crop" 
                  alt="Budgeta Dashboard Preview"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-dark-800/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything You Need to
              <span className="block bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">
                Master Your Money
              </span>
            </h3>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Powerful features designed to make financial management simple, intuitive, and effective.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-dark-800 border border-dark-700 rounded-2xl p-8 hover:border-primary-500/50 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-2"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-dark-800/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Get Started in 3 Simple Steps
            </h3>
            <p className="text-xl text-gray-400">
              Start managing your finances in minutes
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  title: 'Create Account',
                  description: 'Sign up in seconds with just your email. No credit card required.',
                  icon: Lock,
                },
                {
                  step: '02',
                  title: 'Add Transactions',
                  description: 'Start tracking your income and expenses. Categorize and organize easily.',
                  icon: Wallet,
                },
                {
                  step: '03',
                  title: 'Get Insights',
                  description: 'View beautiful analytics, set budgets, and achieve your financial goals.',
                  icon: Zap,
                },
              ].map((item, index) => (
                <div key={index} className="relative text-center">
                  {index < 2 && (
                    <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary-500 to-purple-500 opacity-30" />
                  )}
                  <div className="relative bg-dark-800 border border-dark-700 rounded-2xl p-8">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
                      {item.step}
                    </div>
                    <div className="mt-8 mb-6">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center">
                        <item.icon className="w-8 h-8 text-primary-400" />
                      </div>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">{item.title}</h4>
                    <p className="text-gray-400">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary-600 to-purple-600 rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Ready to Transform Your Financial Life?
              </h3>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of users who are already taking control of their finances with Budgeta.
              </p>
              <Link to="/register">
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="bg-white text-primary-600 hover:bg-gray-100"
                  icon={<ArrowRight className="w-5 h-5" />}
                >
                  Get Started Free
                </Button>
              </Link>
              <p className="text-white/70 text-sm mt-4">
                No credit card required • Free forever • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-dark-700">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">
                Budgeta
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
            <div className="text-sm text-gray-400">
              © 2024 Budgeta. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
