import React, { useState, useEffect } from 'react';
import { 
  ClipboardDocumentListIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  FireIcon,
  HeartIcon,
  ShieldExclamationIcon,
  EyeIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';
import { EmergencyType, EmergencyStatus, UserRole } from '../types';
import { getEmergencyReports, EmergencyReportWithId, respondToEmergency, resolveEmergency, acknowledgeEmergency } from '../services/emergencyService';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import EmergencyActionModal from '../components/EmergencyActionModal';

const DashboardPage: React.FC = () => {
  const [emergencies, setEmergencies] = useState<EmergencyReportWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmergency, setSelectedEmergency] = useState<EmergencyReportWithId | null>(null);
  const [modalAction, setModalAction] = useState<'respond' | 'resolve' | 'acknowledge'>('respond');
  const [actionLoading, setActionLoading] = useState(false);
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    fetchEmergencies();
  }, []);

  const fetchEmergencies = async () => {
    try {
      setLoading(true);
      const reports = await getEmergencyReports();
      setEmergencies(reports);
    } catch (error) {
      console.error('Error fetching emergencies:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const getStatusColor = (status: EmergencyStatus) => {
    switch (status) {
      case EmergencyStatus.REPORTED:
        return 'bg-red-100 text-red-800';
      case EmergencyStatus.ACKNOWLEDGED:
        return 'bg-blue-100 text-blue-800';
      case EmergencyStatus.RESPONDING:
        return 'bg-orange-100 text-orange-800';
      case EmergencyStatus.RESOLVED:
        return 'bg-green-100 text-green-800';
      case EmergencyStatus.CLOSED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: EmergencyStatus) => {
    switch (status) {
      case EmergencyStatus.REPORTED:
        return 'Reported';
      case EmergencyStatus.ACKNOWLEDGED:
        return 'Acknowledged';
      case EmergencyStatus.RESPONDING:
        return 'Responding';
      case EmergencyStatus.RESOLVED:
        return 'Resolved';
      case EmergencyStatus.CLOSED:
        return 'Closed';
      default:
        return status;
    }
  };

  const canPerformAction = (emergency: EmergencyReportWithId, action: string) => {
    if (!user) return false;
    
    // Only responders and admins can perform actions
    if (user.role === UserRole.PUBLIC) return false;

    switch (action) {
      case 'acknowledge':
        return emergency.status === EmergencyStatus.REPORTED;
      case 'respond':
        return emergency.status === EmergencyStatus.REPORTED || emergency.status === EmergencyStatus.ACKNOWLEDGED;
      case 'resolve':
        return emergency.status === EmergencyStatus.RESPONDING || emergency.status === EmergencyStatus.ACKNOWLEDGED;
      default:
        return false;
    }
  };

  const handleActionClick = (emergency: EmergencyReportWithId, action: 'respond' | 'resolve' | 'acknowledge') => {
    setSelectedEmergency(emergency);
    setModalAction(action);
    setModalOpen(true);
  };

  const handleActionConfirm = async (notes: string) => {
    if (!selectedEmergency || !user) return;

    try {
      setActionLoading(true);
      
      switch (modalAction) {
        case 'acknowledge':
          await acknowledgeEmergency(selectedEmergency.id, user.id, user.name, notes);
          break;
        case 'respond':
          await respondToEmergency(selectedEmergency.id, user.id, user.name, notes);
          break;
        case 'resolve':
          await resolveEmergency(selectedEmergency.id, user.id, user.name, notes);
          break;
      }

      // Refresh the emergencies list
      await fetchEmergencies();
      
      // Show success notification
      const actionLabels = {
        acknowledge: 'acknowledged',
        respond: 'responded to',
        resolve: 'resolved'
      };
      showSuccess(
        'Action Completed',
        `Emergency "${selectedEmergency.title}" has been ${actionLabels[modalAction]}.`
      );
    } catch (error) {
      console.error('Error performing action:', error);
      showError(
        'Action Failed',
        `Failed to ${modalAction} emergency. Please try again.`
      );
    } finally {
      setActionLoading(false);
    }
  };

  const getAvailableActions = (emergency: EmergencyReportWithId) => {
    const actions = [];
    
    if (canPerformAction(emergency, 'acknowledge')) {
      actions.push(
        <button
          key="acknowledge"
          onClick={() => handleActionClick(emergency, 'acknowledge')}
          className="btn-primary text-sm"
        >
          Acknowledge
        </button>
      );
    }
    
    if (canPerformAction(emergency, 'respond')) {
      actions.push(
        <button
          key="respond"
          onClick={() => handleActionClick(emergency, 'respond')}
          className="btn-warning text-sm"
        >
          Respond
        </button>
      );
    }
    
    if (canPerformAction(emergency, 'resolve')) {
      actions.push(
        <button
          key="resolve"
          onClick={() => handleActionClick(emergency, 'resolve')}
          className="btn-success text-sm"
        >
          Resolve
        </button>
      );
    }

    return actions;
  };

  // Calculate dashboard statistics
  const activeEmergencies = emergencies.filter(e => 
    e.status !== EmergencyStatus.RESOLVED && e.status !== EmergencyStatus.CLOSED
  ).length;
  
  const pendingResponse = emergencies.filter(e => 
    e.status === EmergencyStatus.REPORTED || e.status === EmergencyStatus.ACKNOWLEDGED
  ).length;
  
  const resolvedToday = emergencies.filter(e => {
    if (e.status !== EmergencyStatus.RESOLVED && e.status !== EmergencyStatus.CLOSED) return false;
    const today = new Date();
    const resolvedDate = e.resolvedAt || e.updatedAt;
    return resolvedDate.toDateString() === today.toDateString();
  }).length;

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
              <p className="text-2xl font-bold text-gray-900">{activeEmergencies}</p>
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
              <p className="text-2xl font-bold text-gray-900">{pendingResponse}</p>
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
              <p className="text-2xl font-bold text-gray-900">{resolvedToday}</p>
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
              <p className="text-2xl font-bold text-gray-900">{emergencies.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Emergency Cases</h2>
        <div className="space-y-4">
          {emergencies.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No emergency cases found</p>
            </div>
          ) : (
            emergencies.map((emergency) => (
              <div key={emergency.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getEmergencyIcon(emergency.type)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-gray-900">{emergency.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(emergency.status)}`}>
                          {getStatusLabel(emergency.status)}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-emergency-orange text-white">
                          {emergency.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{emergency.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Reported by {emergency.reporter.name}</span>
                        <span>•</span>
                        <span>{new Date(emergency.createdAt).toLocaleDateString()} at {new Date(emergency.createdAt).toLocaleTimeString()}</span>
                        {emergency.respondedBy && (
                          <>
                            <span>•</span>
                            <span>Responded by {emergency.respondedBy.name}</span>
                          </>
                        )}
                        {emergency.resolvedBy && (
                          <>
                            <span>•</span>
                            <span>Resolved by {emergency.resolvedBy.name}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {getAvailableActions(emergency)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <EmergencyActionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleActionConfirm}
        action={modalAction}
        emergencyTitle={selectedEmergency?.title || ''}
        loading={actionLoading}
      />
    </div>
  );
};

export default DashboardPage; 