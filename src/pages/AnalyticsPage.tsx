import React, { useState, useEffect } from 'react';
import { ChartBarIcon, FireIcon, HeartIcon, ShieldExclamationIcon, ExclamationTriangleIcon, BoltIcon, CloudIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { getAnalyticsData, getRecentEmergencyReports } from '../services/analyticsService';
import { AnalyticsData, EmergencyType, EmergencyPriority, EmergencyReport } from '../types';

const AnalyticsPage: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [recentReports, setRecentReports] = useState<EmergencyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [data, recent] = await Promise.all([
        getAnalyticsData(),
        getRecentEmergencyReports(5)
      ]);
      setAnalyticsData(data);
      setRecentReports(recent);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError('Failed to load analytics data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const getEmergencyTypeIcon = (type: EmergencyType) => {
    switch (type) {
      case EmergencyType.FIRE:
        return <FireIcon className="h-6 w-6 text-white" />;
      case EmergencyType.MEDICAL:
        return <HeartIcon className="h-6 w-6 text-white" />;
      case EmergencyType.ARMED_CONFLICT:
        return <ShieldExclamationIcon className="h-6 w-6 text-white" />;
      case EmergencyType.ACCIDENT:
        return <ExclamationTriangleIcon className="h-6 w-6 text-white" />;
      case EmergencyType.NATURAL_DISASTER:
        return <CloudIcon className="h-6 w-6 text-white" />;
      default:
        return <ChartBarIcon className="h-6 w-6 text-white" />;
    }
  };

  const getEmergencyTypeColor = (type: EmergencyType) => {
    switch (type) {
      case EmergencyType.FIRE:
        return 'bg-emergency-red';
      case EmergencyType.MEDICAL:
        return 'bg-emergency-red';
      case EmergencyType.ARMED_CONFLICT:
        return 'bg-emergency-orange';
      case EmergencyType.ACCIDENT:
        return 'bg-emergency-orange';
      case EmergencyType.NATURAL_DISASTER:
        return 'bg-emergency-blue';
      default:
        return 'bg-emergency-blue';
    }
  };

  const getEmergencyTypeLabel = (type: EmergencyType) => {
    switch (type) {
      case EmergencyType.FIRE:
        return 'Fire Incidents';
      case EmergencyType.FLOOD:
        return 'Flood Incidents';
      case EmergencyType.ARMED_CONFLICT:
        return 'Security Incidents';
      case EmergencyType.MEDICAL:
        return 'Medical Emergencies';
      case EmergencyType.ACCIDENT:
        return 'Accidents';
      case EmergencyType.NATURAL_DISASTER:
        return 'Natural Disasters';
      case EmergencyType.OTHER:
        return 'Other Emergencies';
      default:
        return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emergency-red"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-emergency-red text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-600">No analytics data available</div>
      </div>
    );
  }

  const totalEmergencies = analyticsData.totalEmergencies;
  const fireCount = analyticsData.emergenciesByType[EmergencyType.FIRE] || 0;
  const medicalCount = analyticsData.emergenciesByType[EmergencyType.MEDICAL] || 0;
  const securityCount = analyticsData.emergenciesByType[EmergencyType.ARMED_CONFLICT] || 0;
  const otherCount = totalEmergencies - fireCount - medicalCount - securityCount;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive emergency response analytics and insights</p>
        </div>
        <button
          onClick={fetchAnalyticsData}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-emergency-blue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-emergency-red rounded-lg">
              <FireIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Fire Incidents</p>
              <p className="text-2xl font-bold text-gray-900">{fireCount}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-emergency-red rounded-lg">
              <HeartIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Medical Emergencies</p>
              <p className="text-2xl font-bold text-gray-900">{medicalCount}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-emergency-orange rounded-lg">
              <ShieldExclamationIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Security Incidents</p>
              <p className="text-2xl font-bold text-gray-900">{securityCount}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-emergency-blue rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Other Emergencies</p>
              <p className="text-2xl font-bold text-gray-900">{otherCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Emergency Types Distribution</h2>
          <div className="space-y-4">
            {Object.entries(analyticsData.emergenciesByType).map(([type, count]) => {
              if (count === 0) return null;
              const percentage = totalEmergencies > 0 ? ((count / totalEmergencies) * 100).toFixed(1) : '0';
              return (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 ${getEmergencyTypeColor(type as EmergencyType)} rounded-full`}></div>
                    <span className="text-sm text-gray-600">{getEmergencyTypeLabel(type as EmergencyType)}</span>
                  </div>
                  <span className="text-sm font-medium">{count} ({percentage}%)</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Response Time Metrics</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Average Response Time</span>
                <span className="font-medium">{analyticsData.averageResponseTime.toFixed(1)} minutes</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-emergency-green h-2 rounded-full" 
                  style={{ width: `${Math.min((analyticsData.averageResponseTime / 10) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Active Emergencies</span>
                <span className="font-medium">{analyticsData.activeEmergencies}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-emergency-orange h-2 rounded-full" 
                  style={{ width: `${Math.min((analyticsData.activeEmergencies / totalEmergencies) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Resolution Rate</span>
                <span className="font-medium">{analyticsData.resolutionRate.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-emergency-green h-2 rounded-full" 
                  style={{ width: `${analyticsData.resolutionRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Trends</h2>
        <div className="grid grid-cols-12 gap-2 h-32 items-end">
          {analyticsData.monthlyTrends.map((trend, index) => {
            const maxCount = Math.max(...analyticsData.monthlyTrends.map(t => t.count));
            const heightPercentage = maxCount > 0 ? (trend.count / maxCount) * 100 : 0;
            return (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className="w-full bg-emergency-blue rounded-t"
                  style={{ height: `${heightPercentage}%` }}
                ></div>
                <span className="text-xs text-gray-500 mt-1">{trend.month}</span>
              </div>
            );
          })}
        </div>
        <div className="text-center text-sm text-gray-600 mt-2">Month</div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Priority Distribution</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(analyticsData.emergenciesByPriority).map(([priority, count]) => {
            if (count === 0) return null;
            const priorityColors = {
              [EmergencyPriority.LOW]: 'bg-green-500',
              [EmergencyPriority.MEDIUM]: 'bg-yellow-500',
              [EmergencyPriority.HIGH]: 'bg-orange-500',
              [EmergencyPriority.CRITICAL]: 'bg-red-500'
            };
            const priorityLabels = {
              [EmergencyPriority.LOW]: 'Low',
              [EmergencyPriority.MEDIUM]: 'Medium',
              [EmergencyPriority.HIGH]: 'High',
              [EmergencyPriority.CRITICAL]: 'Critical'
            };
            return (
              <div key={priority} className="text-center">
                <div className={`w-16 h-16 ${priorityColors[priority as EmergencyPriority]} rounded-full flex items-center justify-center mx-auto mb-2`}>
                  <span className="text-white font-bold text-lg">{count}</span>
                </div>
                <p className="text-sm font-medium text-gray-900">{priorityLabels[priority as EmergencyPriority]}</p>
                <p className="text-xs text-gray-500">{((count / totalEmergencies) * 100).toFixed(1)}%</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentReports.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent emergency reports</p>
          ) : (
            recentReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 ${getEmergencyTypeColor(report.type)} rounded-lg`}>
                    {getEmergencyTypeIcon(report.type)}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{report.title}</h3>
                    <p className="text-sm text-gray-600">{report.type} • {report.priority} priority</p>
                    <p className="text-xs text-gray-500">
                      {report.createdAt.toLocaleDateString()} at {report.createdAt.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    report.status === 'acknowledged' ? 'bg-blue-100 text-blue-800' :
                    report.status === 'responding' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {report.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage; 