import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ExclamationTriangleIcon, FireIcon, HeartIcon, ShieldExclamationIcon, CheckCircleIcon, XMarkIcon, CloudIcon, BoltIcon } from '@heroicons/react/24/outline';
import { EmergencyType } from '../types';
import { getEmergencyReports, EmergencyReportWithId } from '../services/emergencyService';
import { useLocation } from 'react-router-dom';

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom marker colors for different emergency types
const createCustomIcon = (color: string) => {
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="24" height="36" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 10.5 12 24 12 24s12-13.5 12-24c0-6.627-5.373-12-12-12z" fill="${color}"/>
        <circle cx="12" cy="12" r="6" fill="white"/>
        <circle cx="12" cy="12" r="4" fill="${color}"/>
      </svg>
    `)}`,
    iconSize: [24, 36],
    iconAnchor: [12, 36],
    popupAnchor: [0, -36],
  });
};

const MapPage: React.FC = () => {
  const [emergencies, setEmergencies] = useState<EmergencyReportWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const location = useLocation();
  const mapRef = useRef<any>(null);

  useEffect(() => {
    // Check if user was redirected from emergency report
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      setShowSuccessMessage(true);
      // Clear the state to prevent showing message on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchEmergencies = async () => {
      try {
        const reports = await getEmergencyReports();
        setEmergencies(reports);
      } catch (error) {
        console.error('Error fetching emergencies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmergencies();
  }, []);

  // Function to fit map bounds to show all emergencies
  const fitMapToEmergencies = () => {
    if (mapRef.current && emergencies.length > 0) {
      const map = mapRef.current;
      
      // Create bounds from emergency locations
      const bounds = emergencies.map(emergency => [
        emergency.location.latitude,
        emergency.location.longitude
      ]);
      
      // Fit the map to show all emergencies
      map.fitBounds(bounds, {
        padding: [20, 20], // Add some padding around the bounds
        maxZoom: 15 // Limit maximum zoom to prevent too much zoom
      });
    }
  };

  // Fit map when emergencies are loaded
  useEffect(() => {
    if (!loading && emergencies.length > 0) {
      // Small delay to ensure map is fully rendered
      setTimeout(fitMapToEmergencies, 100);
    }
  }, [emergencies, loading]);

  const getEmergencyIcon = (type: EmergencyType) => {
    switch (type) {
      case EmergencyType.FIRE:
        return <FireIcon className="h-6 w-6 text-emergency-red" />;
      case EmergencyType.MEDICAL:
        return <HeartIcon className="h-6 w-6 text-emergency-red" />;
      case EmergencyType.ARMED_CONFLICT:
        return <ShieldExclamationIcon className="h-6 w-6 text-emergency-orange" />;
      case EmergencyType.FLOOD:
        return <CloudIcon className="h-6 w-6 text-emergency-blue" />;
      case EmergencyType.ACCIDENT:
        return <ExclamationTriangleIcon className="h-6 w-6 text-emergency-orange" />;
      case EmergencyType.NATURAL_DISASTER:
        return <BoltIcon className="h-6 w-6 text-emergency-purple" />;
      default:
        return <ExclamationTriangleIcon className="h-6 w-6 text-emergency-yellow" />;
    }
  };

  const getEmergencyMarkerColor = (type: EmergencyType) => {
    switch (type) {
      case EmergencyType.FIRE:
        return '#dc2626'; // emergency-red
      case EmergencyType.MEDICAL:
        return '#dc2626'; // emergency-red
      case EmergencyType.ARMED_CONFLICT:
        return '#ea580c'; // emergency-orange
      case EmergencyType.FLOOD:
        return '#2563eb'; // emergency-blue
      case EmergencyType.ACCIDENT:
        return '#ea580c'; // emergency-orange
      case EmergencyType.NATURAL_DISASTER:
        return '#7c3aed'; // emergency-purple
      case EmergencyType.OTHER:
        return '#ca8a04'; // emergency-yellow
      default:
        return '#6b7280'; // emergency-gray
    }
  };

  const getEmergencyTypeLabel = (type: EmergencyType) => {
    switch (type) {
      case EmergencyType.FIRE:
        return 'Fire';
      case EmergencyType.FLOOD:
        return 'Flood';
      case EmergencyType.ARMED_CONFLICT:
        return 'Security';
      case EmergencyType.MEDICAL:
        return 'Medical';
      case EmergencyType.ACCIDENT:
        return 'Accident';
      case EmergencyType.NATURAL_DISASTER:
        return 'Natural Disaster';
      case EmergencyType.OTHER:
        return 'Other';
      default:
        return 'Unknown';
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
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
              <p className="text-green-800 font-medium">{successMessage}</p>
            </div>
            <button
              onClick={() => setShowSuccessMessage(false)}
              className="text-green-600 hover:text-green-800"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Emergency Map</h1>
          <p className="text-gray-600">View all reported emergencies in real-time</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            {emergencies.length} active emergencies
          </div>
          {emergencies.length > 0 && (
            <button
              onClick={fitMapToEmergencies}
              className="px-3 py-1 text-sm bg-emergency-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Show All Emergencies
            </button>
          )}
        </div>
      </div>

      {/* Emergency Type Legend */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Types</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.values(EmergencyType).map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: getEmergencyMarkerColor(type) }}
              ></div>
              <span className="text-sm text-gray-700">{getEmergencyTypeLabel(type)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="h-96 w-full">
          <MapContainer
            ref={mapRef}
            center={[5.9597, 10.1459]} // Default center (Bamenda, Cameroon)
            zoom={10} // Default zoom level
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
                icon={createCustomIcon(getEmergencyMarkerColor(emergency.type))}
              >
                <Popup>
                  <div className="p-2">
                    <div className="flex items-center space-x-2 mb-2">
                      {getEmergencyIcon(emergency.type)}
                      <h3 className="font-semibold text-gray-900">{emergency.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{emergency.description}</p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">
                        {getEmergencyTypeLabel(emergency.type)}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full text-white ${getPriorityColor(emergency.priority)}`}>
                        {emergency.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>By {emergency.reporter.name}</span>
                      <span>{new Date(emergency.createdAt).toLocaleTimeString()}</span>
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