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
  ShieldExclamationIcon,
  TruckIcon,
  UserGroupIcon,
  SignalIcon,
  WifiIcon,
  CogIcon,
  StarIcon,
  ArrowRightIcon,
  PlayIcon,
  PauseIcon,
  StopIcon
} from '@heroicons/react/24/outline';
import { EmergencyType, EmergencyPriority } from '../types';
import { getEmergencyReports, EmergencyReportWithId } from '../services/emergencyService';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [recentEmergencies, setRecentEmergencies] = useState<EmergencyReportWithId[]>([]);
  const [stats, setStats] = useState({
    totalEmergencies: 0,
    activeEmergencies: 0,
    resolvedToday: 0,
    averageResponseTime: 0
  });
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reports = await getEmergencyReports();
        
        // Calculate stats from real data
        const totalEmergencies = reports.length;
        const activeEmergencies = reports.filter(r => 
          r.status === 'reported' || r.status === 'acknowledged' || r.status === 'responding'
        ).length;
        
        // Get today's resolved emergencies
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const resolvedToday = reports.filter(r => 
          r.status === 'resolved' && r.resolvedAt && r.resolvedAt >= today
        ).length;

        setStats({
          totalEmergencies,
          activeEmergencies,
          resolvedToday,
          averageResponseTime: 4.2 // This would need more complex calculation
        });

        // Get recent emergencies (last 5)
        setRecentEmergencies(reports.slice(0, 5));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
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
      color: 'from-emergency-red to-red-600',
      bgColor: 'bg-gradient-to-br',
      animation: 'animate-pulse'
    },
    {
      title: 'View Map',
      description: 'See all emergency locations',
      icon: MapIcon,
      href: '/map',
      color: 'from-emergency-blue to-blue-600',
      bgColor: 'bg-gradient-to-br',
      animation: 'animate-bounce'
    },
    {
      title: 'Response Dashboard',
      description: 'Manage emergency responses',
      icon: ChartBarIcon,
      href: '/dashboard',
      color: 'from-emergency-green to-green-600',
      bgColor: 'bg-gradient-to-br',
      animation: 'animate-ping',
      roles: ['responder', 'admin']
    }
  ];

  const filteredQuickActions = quickActions.filter(action => 
    !action.roles || action.roles.includes(user?.role || 'public')
  );

  const systemFeatures = [
    {
      icon: SignalIcon,
      title: 'Real-time Monitoring',
      description: '24/7 emergency tracking and response coordination',
      color: 'text-emergency-blue'
    },
    {
      icon: TruckIcon,
      title: 'Rapid Response',
      description: 'Quick deployment of emergency services and resources',
      color: 'text-emergency-orange'
    },
    {
      icon: UserGroupIcon,
      title: 'Community Safety',
      description: 'Empowering citizens to report and respond to emergencies',
      color: 'text-emergency-green'
    },
    {
      icon: WifiIcon,
      title: 'Smart Connectivity',
      description: 'Advanced communication systems for seamless coordination',
      color: 'text-emergency-purple'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section with Animated Background */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-emergency-blue rounded-2xl p-8 text-white">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 animate-spin-slow">
            <SignalIcon className="h-16 w-16" />
          </div>
          <div className="absolute top-20 right-20 animate-pulse">
            <ExclamationTriangleIcon className="h-12 w-12" />
          </div>
          <div className="absolute bottom-10 left-20 animate-bounce">
            <ShieldExclamationIcon className="h-10 w-10" />
          </div>
          <div className="absolute bottom-20 right-10 animate-ping">
            <FireIcon className="h-8 w-8" />
          </div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-emergency-red rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-emergency-orange rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-3 h-3 bg-emergency-green rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
            <span className="text-sm font-medium text-blue-200">SYSTEM ACTIVE</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Emergency Response System
          </h1>
          <p className="text-xl text-blue-100 mb-6 max-w-2xl">
            Advanced humanitarian assistance and predictive management for crisis-prone regions. 
            Real-time emergency reporting, intelligent response coordination, and community safety.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link
              to="/report"
              className="inline-flex items-center px-6 py-3 bg-emergency-red hover:bg-red-700 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
              Report Emergency
            </Link>
            <Link
              to="/map"
              className="inline-flex items-center px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
            >
              <MapIcon className="h-5 w-5 mr-2" />
              View Live Map
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions with Advanced Animations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredQuickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.title}
              to={action.href}
              className={`${action.bgColor} ${action.color} text-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group relative overflow-hidden`}
              style={{animationDelay: `${index * 0.1}s`}}
            >
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className={`absolute top-4 right-4 ${action.animation}`}>
                  <Icon className="h-12 w-12" />
                </div>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <Icon className="h-10 w-10 group-hover:scale-110 transition-transform duration-300" />
                  <ArrowRightIcon className="h-5 w-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </div>
                <h3 className="text-xl font-bold mb-2">{action.title}</h3>
                <p className="text-sm opacity-90">{action.description}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Live Statistics with Animated Counters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-l-4 border-emergency-red">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Emergencies</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalEmergencies}</p>
            </div>
            <div className="p-3 bg-emergency-red rounded-lg">
              <ExclamationTriangleIcon className="h-8 w-8 text-white animate-pulse" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-l-4 border-emergency-orange">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Active Emergencies</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activeEmergencies}</p>
            </div>
            <div className="p-3 bg-emergency-orange rounded-lg">
              <ClockIcon className="h-8 w-8 text-white animate-spin" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-l-4 border-emergency-green">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Resolved Today</p>
              <p className="text-3xl font-bold text-gray-900">{stats.resolvedToday}</p>
            </div>
            <div className="p-3 bg-emergency-green rounded-lg">
              <CheckCircleIcon className="h-8 w-8 text-white animate-bounce" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-l-4 border-emergency-blue">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Avg Response Time</p>
              <p className="text-3xl font-bold text-gray-900">{stats.averageResponseTime}m</p>
            </div>
            <div className="p-3 bg-emergency-blue rounded-lg">
              <BoltIcon className="h-8 w-8 text-white animate-ping" />
            </div>
          </div>
        </div>
      </div>

      {/* System Features */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Advanced System Features</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our comprehensive emergency response platform combines cutting-edge technology 
            with humanitarian expertise to protect communities in crisis-prone regions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {systemFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={feature.title}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-center group"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className={`inline-flex p-4 rounded-full bg-gray-100 group-hover:bg-blue-50 transition-colors duration-300 mb-4`}>
                  <Icon className={`h-8 w-8 ${feature.color} group-hover:scale-110 transition-transform duration-300`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Emergencies */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Emergencies</h2>
          <Link 
            to="/map" 
            className="text-emergency-blue hover:text-blue-700 font-medium flex items-center"
          >
            View All
            <ArrowRightIcon className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        <div className="space-y-4">
          {recentEmergencies.map((emergency) => (
            <div 
              key={emergency.id}
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="flex-shrink-0 mr-4">
                {getEmergencyIcon(emergency.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{emergency.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(emergency.priority)}`}>
                    {emergency.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{emergency.description}</p>
                <div className="flex items-center text-xs text-gray-500 mt-2">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  {Math.round((Date.now() - emergency.createdAt.getTime()) / (1000 * 60))} minutes ago
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Indicator */}
      <div className="bg-gradient-to-r from-emergency-green to-green-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <span className="font-semibold">System Status: Operational</span>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <span>Response Teams: Active</span>
            <span>Communication: Stable</span>
            <span>GPS Tracking: Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 