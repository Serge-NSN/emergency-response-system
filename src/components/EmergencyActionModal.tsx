import React, { useState } from 'react';
import { XMarkIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface EmergencyActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (notes: string) => Promise<void>;
  action: 'respond' | 'resolve' | 'acknowledge' | 'close';
  emergencyTitle: string;
  loading?: boolean;
}

const EmergencyActionModal: React.FC<EmergencyActionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  action,
  emergencyTitle,
  loading = false
}) => {
  const [notes, setNotes] = useState('');

  const handleConfirm = async () => {
    try {
      await onConfirm(notes);
      setNotes('');
      onClose();
    } catch (error) {
      console.error('Error performing action:', error);
    }
  };

  const handleClose = () => {
    setNotes('');
    onClose();
  };

  const getActionConfig = () => {
    switch (action) {
      case 'respond':
        return {
          title: 'Respond to Emergency',
          description: 'You are about to respond to this emergency. This will change the status to "Responding".',
          icon: <ExclamationTriangleIcon className="h-6 w-6 text-emergency-orange" />,
          buttonText: 'Respond',
          buttonColor: 'bg-emergency-orange hover:bg-orange-700',
          placeholder: 'Add any notes about your response (optional)...'
        };
      case 'resolve':
        return {
          title: 'Resolve Emergency',
          description: 'You are about to mark this emergency as resolved. This will change the status to "Resolved".',
          icon: <CheckCircleIcon className="h-6 w-6 text-emergency-green" />,
          buttonText: 'Resolve',
          buttonColor: 'bg-emergency-green hover:bg-green-700',
          placeholder: 'Add resolution notes (optional)...'
        };
      case 'acknowledge':
        return {
          title: 'Acknowledge Emergency',
          description: 'You are about to acknowledge this emergency. This will change the status to "Acknowledged".',
          icon: <ExclamationTriangleIcon className="h-6 w-6 text-emergency-blue" />,
          buttonText: 'Acknowledge',
          buttonColor: 'bg-emergency-blue hover:bg-blue-700',
          placeholder: 'Add acknowledgment notes (optional)...'
        };
      case 'close':
        return {
          title: 'Close Emergency',
          description: 'You are about to close this emergency. This will change the status to "Closed".',
          icon: <CheckCircleIcon className="h-6 w-6 text-gray-600" />,
          buttonText: 'Close',
          buttonColor: 'bg-gray-600 hover:bg-gray-700',
          placeholder: 'Add closing notes (optional)...'
        };
      default:
        return {
          title: 'Action',
          description: 'Perform an action on this emergency.',
          icon: <ExclamationTriangleIcon className="h-6 w-6 text-gray-600" />,
          buttonText: 'Confirm',
          buttonColor: 'bg-emergency-blue hover:bg-blue-700',
          placeholder: 'Add notes (optional)...'
        };
    }
  };

  const config = getActionConfig();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {config.icon}
            <h2 className="text-xl font-semibold text-gray-900">{config.title}</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Emergency</h3>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              {emergencyTitle}
            </p>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-4">
              {config.description}
            </p>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                id="notes"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emergency-blue focus:border-transparent"
                placeholder={config.placeholder}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className={`flex-1 px-4 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${config.buttonColor}`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                config.buttonText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyActionModal; 