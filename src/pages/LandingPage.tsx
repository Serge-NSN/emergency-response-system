import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ExclamationTriangleIcon, 
  ShieldCheckIcon, 
  ClockIcon, 
  MapPinIcon,
  UserGroupIcon,
  ChartBarIcon,
  PhoneIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-red-600/20 animate-pulse"></div>
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400/30 rounded-full animate-bounce-slow"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-red-400/30 rounded-full animate-bounce-slow delay-1000"></div>
          <div className="absolute bottom-32 left-1/3 w-20 h-20 bg-yellow-400/30 rounded-full animate-bounce-slow delay-2000"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left animate-slide-up">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full mb-6 animate-pulse">
                <ExclamationTriangleIcon className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
                Emergency
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-blue-600">
                  Response System
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-2xl leading-relaxed">
                Empowering communities with real-time emergency reporting, rapid response coordination, 
                and comprehensive incident management. Every second counts when lives are at stake.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  to="/register" 
                  className="group relative px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl shadow-lg font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300"
                >
                  <span className="relative z-10">Get Started Now</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link 
                  to="/login" 
                  className="px-8 py-4 bg-white text-gray-800 border-2 border-gray-300 rounded-xl shadow-lg font-semibold text-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-200"
                >
                  Sign In
                </Link>
              </div>
            </div>

            {/* Right Content - Emergency Scene */}
            <div className="flex-1 flex justify-center animate-slide-up delay-300">
              <div className="relative w-96 h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-red-500/20 rounded-full animate-spin-slow"></div>
                <div className="absolute inset-4 bg-gradient-to-br from-blue-400/30 to-red-400/30 rounded-full animate-spin-slow reverse"></div>
                <div className="absolute inset-8 bg-white rounded-full shadow-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <ExclamationTriangleIcon className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">24/7 Emergency Response</h3>
                    <p className="text-gray-600">Always ready to help</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Our System?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with cutting-edge technology to ensure the fastest and most reliable emergency response
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: ClockIcon,
                title: "Real-time Response",
                description: "Instant emergency alerts and rapid response coordination"
              },
              {
                icon: MapPinIcon,
                title: "Location Tracking",
                description: "Precise GPS tracking for accurate emergency location"
              },
              {
                icon: UserGroupIcon,
                title: "Team Coordination",
                description: "Seamless communication between responders and dispatchers"
              },
              {
                icon: ChartBarIcon,
                title: "Analytics & Reports",
                description: "Comprehensive data analysis for improved response times"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-red-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-red-600">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "99.9%", label: "Uptime" },
              { number: "<30s", label: "Response Time" },
              { number: "10K+", label: "Lives Saved" },
              { number: "24/7", label: "Support" }
            ].map((stat, index) => (
              <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 300}ms` }}>
                <div className="text-4xl font-bold text-white mb-2 animate-count-up">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of emergency responders and community members who trust our system 
              to keep their communities safe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl shadow-lg font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105"
              >
                Start Your Free Trial
              </Link>
              <Link 
                to="/login" 
                className="px-8 py-4 bg-white text-gray-800 border-2 border-gray-300 rounded-xl shadow-lg font-semibold text-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
                <span className="text-xl font-bold">Emergency Response</span>
              </div>
              <p className="text-gray-400">
                Empowering communities with reliable emergency response solutions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/landing" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center space-x-2">
                  <PhoneIcon className="w-4 h-4" />
                  <span>Emergency: 911</span>
                </li>
                <li className="flex items-center space-x-2">
                  <GlobeAltIcon className="w-4 h-4" />
                  <span>www.emergency-response.com</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Real-time Alerts</li>
                <li>GPS Tracking</li>
                <li>Team Coordination</li>
                <li>Analytics Dashboard</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Emergency Response System. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes slide-up {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 1s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        .animate-slide-up.delay-300 {
          animation-delay: 0.3s;
        }
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease both;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }
        .animate-bounce-slow.delay-1000 {
          animation-delay: 1s;
        }
        .animate-bounce-slow.delay-2000 {
          animation-delay: 2s;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-spin-slow.reverse {
          animation-direction: reverse;
        }
        @keyframes count-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-count-up {
          animation: count-up 1s ease-out both;
        }
      `}</style>
    </div>
  );
};

export default LandingPage; 