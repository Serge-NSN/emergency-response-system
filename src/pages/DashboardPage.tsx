import React, { useState, useEffect } from 'react';
import { 
  ClipboardDocumentListIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  FireIcon,
  HeartIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline';
import { EmergencyReport, EmergencyType } from '../types';

const DashboardPage: React.FC = () => {
  const [emergencies, setEmergencies] = useState<EmergencyReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    setEmergencies([
      {
        id: '1',
        type: EmergencyType.FIRE,
        priority: 'high' as any,
        status: 'responding' as any,
        title: 'Fire outbreak in Bamenda Central',
        description: 'Large fire reported in commercial district',
        location: { latitude: 5.9597, longitude: 10.1459 },
        reporter: { id: '1', name: 'John Doe' },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    setLoading(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emergency-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Response Dashboard</h1>
        <p className="text-gray-600">Manage and respond to emergency situations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-emergency-red rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Emergencies</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-emergency-orange rounded-lg">
              <ClockIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Response</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
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
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-emergency-blue rounded-lg">
              <ClipboardDocumentListIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Cases</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Active Emergencies</h2>
        <div className="space-y-4">
          {emergencies.map((emergency) => (
            <div key={emergency.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getEmergencyIcon(emergency.type)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-gray-900">{emergency.title}</h3>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-emergency-orange text-white">
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
                <div className="flex space-x-2">
                  <button className="btn-primary text-sm">Respond</button>
                  <button className="btn-success text-sm">Resolve</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 