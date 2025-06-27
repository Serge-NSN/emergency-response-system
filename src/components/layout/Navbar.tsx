import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { 
  BellIcon, 
  ExclamationTriangleIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/landing');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <ExclamationTriangleIcon className="h-8 w-8 text-emergency-red" />
              <span className="text-xl font-bold text-gray-900">
                Emergency Response
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Emergency Report Button */}
            <Link
              to="/report"
              className="btn-danger flex items-center space-x-2"
            >
              <ExclamationTriangleIcon className="h-5 w-5" />
              <span>Report Emergency</span>
            </Link>

            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-gray-900">
              <BellIcon className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emergency-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
              >
                <UserCircleIcon className="h-8 w-8" />
                <span className="hidden sm:block">{user.name}</span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/report"
                className="btn-danger flex items-center space-x-2 w-full justify-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <ExclamationTriangleIcon className="h-5 w-5" />
                <span>Report Emergency</span>
              </Link>
              
              <Link
                to="/profile"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 