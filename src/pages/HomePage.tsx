import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  ExclamationTriangleIcon,
  MapIcon,
  ChartBarIcon,
  PhoneIcon,
  ClockIcon,
  CheckCircleIcon,
  FireIcon,
  BoltIcon,
  HeartIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline';
import { EmergencyReport, EmergencyType, EmergencyPriority } from '../types';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [recentEmergencies, setRecentEmergencies] = useState<EmergencyReport[]>([]);
  const [stats, setStats] = useState({
    totalEmergencies: 0,
    activeEmergencies: 0,
    resolvedToday: 0,
    averageResponseTime: 0
  });

  // Mock data for demonstration
  useEffect(() => {
    setStats({
      totalEmergencies: 156,
      activeEmergencies: 8,
      resolvedToday: 12,
      averageResponseTime: 4.2
    });

    setRecentEmergencies([
      {
        id: '1',
        type: EmergencyType.FIRE,
        priority: EmergencyPriority.HIGH,
        status: 'reported' as any,
        title: 'Fire outbreak in Bamenda Central',
        description: 'Large fire reported in commercial district',
        location: { latitude: 5.9597, longitude: 10.1459 },
        reporter: { id: '1', name: 'John Doe' },
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        updatedAt: new Date()
      },
      {
        id: '2',
        type: EmergencyType.MEDICAL,
        priority: EmergencyPriority.CRITICAL,
        status: 'responding' as any,
        title: 'Medical emergency - Heart attack',
        description: 'Patient experiencing chest pain and difficulty breathing',
        location: { latitude: 5.9600, longitude: 10.1460 },
        reporter: { id: '2', name: 'Jane Smith' },
        createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        updatedAt: new Date()
      }
    ]);
  }, []);

  const getEmergencyIcon = (type: EmergencyType) => {
    switch (type) {
      case EmergencyType.FIRE:
        return <FireIcon className="h-6 w-6 text-emergency-red" />;
      case EmergencyType.MEDICAL:
        return <HeartIcon className="h-6 w-6 text-emergency-red" />;
      case EmergencyType.ARMED_CONFLICT:
        return <ShieldExclamationIcon className="h-6 w-6 text-emergency-orange" />;
      default:
        return <ExclamationTriangleIcon className="h-6 w-6 text-emergency-yellow" />;
    }
  };

  const getPriorityColor = (priority: EmergencyPriority) => {
    switch (priority) {
      case EmergencyPriority.CRITICAL:
        return 'bg-emergency-red text-white';
      case EmergencyPriority.HIGH:
        return 'bg-emergency-orange text-white';
      case EmergencyPriority.MEDIUM:
        return 'bg-emergency-yellow text-black';
      case EmergencyPriority.LOW:
        return 'bg-emergency-blue text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const quickActions = [
    {
      title: 'Report Emergency',
      description: 'Report a new emergency situation',
      icon: ExclamationTriangleIcon,
      href: '/report',
      color: 'bg-emergency-red hover:bg-red-700'
    },
    {
      title: 'View Map',
      description: 'See all emergency locations',
      icon: MapIcon,
      href: '/map',
      color: 'bg-emergency-blue hover:bg-blue-700'
    },
    {
      title: 'Response Dashboard',
      description: 'Manage emergency responses',
      icon: ChartBarIcon,
      href: '/dashboard',
      color: 'bg-emergency-green hover:bg-green-700',
      roles: ['responder', 'admin']
    }
  ];

  const filteredQuickActions = quickActions.filter(action => 
    !action.roles || action.roles.includes(user?.role || 'public')
  );

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-emergency-blue to-blue-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-blue-100">
          Stay informed and help keep our community safe. Report emergencies and track responses in real-time.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredQuickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.title}
              to={action.href}
              className={`${action.color} text-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200`}
            >
              <Icon className="h-8 w-8 mb-4" />
              <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
              <p className="text-sm opacity-90">{action.description}</p>
            </Link>
          );
        })}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-emergency-red rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Emergencies</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEmergencies}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-emergency-orange rounded-lg">
              <ClockIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Emergencies</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeEmergencies}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-emergency-green rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Resolved Today</p>
              <p className="text-2xl font-bold text-gray-900">{stats.resolvedToday}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-emergency-blue rounded-lg">
              <BoltIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageResponseTime}m</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Emergencies */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Emergencies</h2>
          <Link to="/map" className="text-emergency-blue hover:text-blue-700 text-sm font-medium">
            View all →
          </Link>
        </div>

        <div className="space-y-4">
          {recentEmergencies.map((emergency) => (
            <div key={emergency.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getEmergencyIcon(emergency.type)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-gray-900">{emergency.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(emergency.priority)}`}>
                        {emergency.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{emergency.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Reported by {emergency.reporter.name}</span>
                      <span>•</span>
                      <span>{new Date(emergency.createdAt).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Emergency Contacts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
            <PhoneIcon className="h-5 w-5 text-emergency-red" />
            <div>
              <p className="font-medium text-gray-900">Fire Department</p>
              <p className="text-sm text-gray-600">+237 XXX XXX XXX</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <PhoneIcon className="h-5 w-5 text-emergency-blue" />
            <div>
              <p className="font-medium text-gray-900">Police</p>
              <p className="text-sm text-gray-600">+237 XXX XXX XXX</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <PhoneIcon className="h-5 w-5 text-emergency-green" />
            <div>
              <p className="font-medium text-gray-900">Ambulance</p>
              <p className="text-sm text-gray-600">+237 XXX XXX XXX</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
            <PhoneIcon className="h-5 w-5 text-emergency-orange" />
            <div>
              <p className="font-medium text-gray-900">Emergency Hotline</p>
              <p className="text-sm text-gray-600">+237 XXX XXX XXX</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 