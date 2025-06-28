import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  ExclamationTriangleIcon,
  MapPinIcon,
  CameraIcon,
  PaperAirplaneIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { EmergencyType, EmergencyPriority } from '../types';
import { createEmergencyReport } from '../services/emergencyService';

const EmergencyReportPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    type: EmergencyType.OTHER,
    priority: EmergencyPriority.MEDIUM,
    title: '',
    description: '',
    location: {
      latitude: 0,
      longitude: 0,
      address: ''
    },
    phone: user?.phone || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [images, setImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setFormData(prev => ({
            ...prev,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              address: ''
            }
          }));
          setLocationLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationLoading(false);
          setErrors(prev => ({ ...prev, location: 'Unable to get your location. Please enter manually.' }));
        }
      );
    } else {
      setErrors(prev => ({ ...prev, location: 'Geolocation is not supported by this browser.' }));
      setLocationLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length + images.length > 5) {
      setErrors(prev => ({ ...prev, images: 'Maximum 5 images allowed' }));
      return;
    }

    setImages(prev => [...prev, ...validFiles]);
    
    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (formData.location.latitude === 0 && formData.location.longitude === 0) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!user) {
      setErrors(prev => ({ ...prev, submit: 'You must be logged in to report an emergency.' }));
      return;
    }

    setLoading(true);
    setUploadProgress('Preparing to submit emergency report...');
    
    try {
      // Add timeout to prevent infinite loading (reduced to 20 seconds)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout - please check your internet connection and try again')), 20000);
      });

      // Save emergency report to Firebase
      const reportData = {
        type: formData.type,
        priority: formData.priority,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        phone: formData.phone,
        images: images
      };

      setUploadProgress('Uploading images and saving report...');
      const emergencyPromise = createEmergencyReport(reportData, user.id, user.name);
      
      // Race between the emergency report creation and timeout
      const emergencyId = await Promise.race([emergencyPromise, timeoutPromise]) as string;
      
      setUploadProgress('Emergency report submitted successfully!');
      console.log('Emergency report created with ID:', emergencyId);
      
      // Navigate to map to see the report
      navigate('/map', { 
        state: { 
          message: 'Emergency reported successfully! Response teams have been notified.',
          emergencyId: emergencyId
        } 
      });
    } catch (error) {
      console.error('Error submitting report:', error);
      let errorMessage = 'Failed to submit report. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          errorMessage = 'Request timed out. Please check your internet connection and try again.';
        } else if (error.message.includes('permission')) {
          errorMessage = 'Permission denied. Please check your Firebase configuration.';
        } else if (error.message.includes('storage')) {
          errorMessage = 'Image upload failed. Please try without images or check your connection.';
        } else if (error.message.includes('Firestore timeout')) {
          errorMessage = 'Database connection timed out. Please check your internet connection.';
        } else if (error.message.includes('Image upload timeout')) {
          errorMessage = 'Image upload is taking too long. Please try with smaller images or without images.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setErrors(prev => ({ 
        ...prev, 
        submit: errorMessage
      }));
    } finally {
      setLoading(false);
      setUploadProgress('');
    }
  };

  const emergencyTypes = [
    { value: EmergencyType.FIRE, label: 'Fire', color: 'text-emergency-red' },
    { value: EmergencyType.FLOOD, label: 'Flood', color: 'text-emergency-blue' },
    { value: EmergencyType.ARMED_CONFLICT, label: 'Armed Conflict', color: 'text-emergency-orange' },
    { value: EmergencyType.MEDICAL, label: 'Medical Emergency', color: 'text-emergency-red' },
    { value: EmergencyType.ACCIDENT, label: 'Accident', color: 'text-emergency-yellow' },
    { value: EmergencyType.NATURAL_DISASTER, label: 'Natural Disaster', color: 'text-emergency-orange' },
    { value: EmergencyType.OTHER, label: 'Other', color: 'text-gray-600' }
  ];

  const priorities = [
    { value: EmergencyPriority.LOW, label: 'Low', color: 'bg-emergency-blue' },
    { value: EmergencyPriority.MEDIUM, label: 'Medium', color: 'bg-emergency-yellow' },
    { value: EmergencyPriority.HIGH, label: 'High', color: 'bg-emergency-orange' },
    { value: EmergencyPriority.CRITICAL, label: 'Critical', color: 'bg-emergency-red' }
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <ExclamationTriangleIcon className="h-8 w-8 text-emergency-red" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Report Emergency</h1>
            <p className="text-gray-600">Help us respond quickly by providing accurate information</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Emergency Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emergency Type *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {emergencyTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                  className={`p-3 border rounded-lg text-left transition-colors ${
                    formData.type === type.value
                      ? 'border-emergency-blue bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className={`font-medium ${type.color}`}>{type.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Priority Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority Level *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {priorities.map((priority) => (
                <button
                  key={priority.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, priority: priority.value }))}
                  className={`p-3 border rounded-lg text-center transition-colors ${
                    formData.priority === priority.value
                      ? `${priority.color} text-white border-transparent`
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-medium">{priority.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Emergency Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emergency-blue focus:border-transparent ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Brief description of the emergency"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emergency-blue focus:border-transparent ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Provide detailed information about the emergency situation..."
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <div className="space-y-3">
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={locationLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-emergency-blue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <MapPinIcon className="h-5 w-5" />
                <span>{locationLoading ? 'Getting location...' : 'Use Current Location'}</span>
              </button>
              
              {currentLocation && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    Location detected: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                  </p>
                </div>
              )}
              
              {errors.location && <p className="text-sm text-red-600">{errors.location}</p>}
            </div>
          </div>

          {/* Contact Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Contact Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emergency-blue focus:border-transparent"
              placeholder="+237 XXX XXX XXX"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photos (Optional)
            </label>
            <div className="space-y-3">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <CameraIcon className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">Upload Photos (Max 5)</span>
              </label>
              
              {/* Image upload tips */}
              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                <p className="font-medium mb-1">📸 Image Upload Tips:</p>
                <ul className="space-y-1">
                  <li>• Maximum file size: 5MB per image (for faster uploads)</li>
                  <li>• Supported formats: JPG, PNG, GIF</li>
                  <li>• Ensure stable internet connection for uploads</li>
                  <li>• Smaller images upload faster and more reliably</li>
                  <li>• You can submit without images if upload fails</li>
                </ul>
              </div>
              
              {imagePreview.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {imagePreview.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {errors.images && <p className="text-sm text-red-600">{errors.images}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-danger flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>{uploadProgress || 'Submitting...'}</span>
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="h-5 w-5" />
                  <span>Submit Report</span>
                </>
              )}
            </button>
          </div>

          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.submit}</p>
              
              {/* Specific guidance for timeout errors */}
              {errors.submit.includes('timeout') && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm text-yellow-800 font-medium mb-2">🔧 Troubleshooting Tips:</p>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Check your internet connection</li>
                    <li>• Try submitting without images first</li>
                    <li>• Use smaller image files (under 1MB)</li>
                    <li>• Try again in a few minutes</li>
                  </ul>
                </div>
              )}
              
              {/* Options for image upload issues */}
              {(errors.submit.includes('Image upload failed') || errors.submit.includes('timeout')) && (
                <div className="mt-3 space-y-2">
                  <p className="text-sm text-red-600">
                    Quick solutions:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        setImages([]);
                        setImagePreview([]);
                        setErrors(prev => ({ ...prev, submit: '' }));
                        setUploadProgress('Images removed. You can now submit without images.');
                      }}
                      className="px-3 py-1 text-sm bg-emergency-blue text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Submit Without Images
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setErrors(prev => ({ ...prev, submit: '' }));
                        setUploadProgress('Retrying submission...');
                      }}
                      className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EmergencyReportPage; 