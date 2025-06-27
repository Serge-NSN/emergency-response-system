import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ExclamationTriangleIcon, FireIcon, HeartIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline';
import { EmergencyReport, EmergencyType } from '../types';

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapPage: React.FC = () => {
  const [emergencies, setEmergencies] = useState<EmergencyReport[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    setEmergencies([
      {
        id: '1',
        type: EmergencyType.FIRE,
        priority: 'high' as any,
        status: 'reported' as any,
        title: 'Fire outbreak in Bamenda Central',
        description: 'Large fire reported in commercial district',
        location: { latitude: 5.9597, longitude: 10.1459 },
        reporter: { id: '1', name: 'John Doe' },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        type: EmergencyType.MEDICAL,
        priority: 'critical' as any,
        status: 'responding' as any,
        title: 'Medical emergency - Heart attack',
        description: 'Patient experiencing chest pain and difficulty breathing',
        location: { latitude: 5.9600, longitude: 10.1460 },
        reporter: { id: '2', name: 'Jane Smith' },
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-emergency-red';
      case 'high':
        return 'bg-emergency-orange';
      case 'medium':
        return 'bg-emergency-yellow';
      case 'low':
        return 'bg-emergency-blue';
      default:
        return 'bg-gray-500';
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Emergency Map</h1>
          <p className="text-gray-600">View all reported emergencies in real-time</p>
        </div>
        <div className="text-sm text-gray-500">
          {emergencies.length} active emergencies
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="h-96 w-full">
          <MapContainer
            center={[5.9597, 10.1459]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {emergencies.map((emergency) => (
              <Marker
                key={emergency.id}
                position={[emergency.location.latitude, emergency.location.longitude]}
              >
                <Popup>
                  <div className="p-2">
                    <div className="flex items-center space-x-2 mb-2">
                      {getEmergencyIcon(emergency.type)}
                      <h3 className="font-semibold text-gray-900">{emergency.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{emergency.description}</p>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full text-white ${getPriorityColor(emergency.priority)}`}>
                        {emergency.priority}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(emergency.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {emergencies.map((emergency) => (
          <div key={emergency.id} className="card">
            <div className="flex items-start space-x-3">
              {getEmergencyIcon(emergency.type)}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-medium text-gray-900">{emergency.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full text-white ${getPriorityColor(emergency.priority)}`}>
                    {emergency.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{emergency.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Reported by {emergency.reporter.name}</span>
                  <span>{new Date(emergency.createdAt).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapPage; 