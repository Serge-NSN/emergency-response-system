import React from 'react';
import { ChartBarIcon, FireIcon, HeartIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline';

const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600">Comprehensive emergency response analytics and insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-emergency-red rounded-lg">
              <FireIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Fire Incidents</p>
              <p className="text-2xl font-bold text-gray-900">45</p>
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
              <p className="text-2xl font-bold text-gray-900">67</p>
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
              <p className="text-2xl font-bold text-gray-900">23</p>
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
              <p className="text-2xl font-bold text-gray-900">21</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Emergency Types Distribution</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-emergency-red rounded-full"></div>
                <span className="text-sm text-gray-600">Fire</span>
              </div>
              <span className="text-sm font-medium">45 (28.8%)</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-emergency-red rounded-full"></div>
                <span className="text-sm text-gray-600">Medical</span>
              </div>
              <span className="text-sm font-medium">67 (42.9%)</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-emergency-orange rounded-full"></div>
                <span className="text-sm text-gray-600">Security</span>
              </div>
              <span className="text-sm font-medium">23 (14.7%)</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-emergency-blue rounded-full"></div>
                <span className="text-sm text-gray-600">Other</span>
              </div>
              <span className="text-sm font-medium">21 (13.5%)</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Response Time Metrics</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Average Response Time</span>
                <span className="font-medium">4.2 minutes</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-emergency-green h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Critical Response Time</span>
                <span className="font-medium">2.1 minutes</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-emergency-red h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Resolution Rate</span>
                <span className="font-medium">94.2%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-emergency-green h-2 rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Trends</h2>
        <div className="grid grid-cols-12 gap-2 h-32 items-end">
          {[12, 15, 18, 14, 22, 19, 25, 28, 24, 21, 18, 16].map((value, index) => (
            <div key={index} className="flex flex-col items-center">
              <div 
                className="w-full bg-emergency-blue rounded-t"
                style={{ height: `${(value / 28) * 100}%` }}
              ></div>
              <span className="text-xs text-gray-500 mt-1">{index + 1}</span>
            </div>
          ))}
        </div>
        <div className="text-center text-sm text-gray-600 mt-2">Month</div>
      </div>
    </div>
  );
};

export default AnalyticsPage; 