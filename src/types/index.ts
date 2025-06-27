export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  createdAt: Date;
  lastActive: Date;
}

export enum UserRole {
  PUBLIC = 'public',
  RESPONDER = 'responder',
  ADMIN = 'admin'
}

export enum EmergencyType {
  FIRE = 'fire',
  FLOOD = 'flood',
  ARMED_CONFLICT = 'armed_conflict',
  MEDICAL = 'medical',
  ACCIDENT = 'accident',
  NATURAL_DISASTER = 'natural_disaster',
  OTHER = 'other'
}

export enum EmergencyPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum EmergencyStatus {
  REPORTED = 'reported',
  ACKNOWLEDGED = 'acknowledged',
  RESPONDING = 'responding',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

export interface EmergencyReport {
  id: string;
  type: EmergencyType;
  priority: EmergencyPriority;
  status: EmergencyStatus;
  title: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  reporter: {
    id: string;
    name: string;
    phone?: string;
  };
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
  acknowledgedBy?: string;
  resolvedBy?: string;
  resolvedAt?: Date;
  notes?: string[];
}

export interface EmergencyResponse {
  id: string;
  emergencyId: string;
  responderId: string;
  responderName: string;
  status: 'en_route' | 'on_scene' | 'completed';
  estimatedArrival?: Date;
  actualArrival?: Date;
  completionTime?: Date;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'emergency' | 'update' | 'system';
  read: boolean;
  createdAt: Date;
  data?: any;
}

export interface AnalyticsData {
  totalEmergencies: number;
  emergenciesByType: Record<EmergencyType, number>;
  emergenciesByPriority: Record<EmergencyPriority, number>;
  averageResponseTime: number;
  resolutionRate: number;
  activeEmergencies: number;
  monthlyTrends: {
    month: string;
    count: number;
  }[];
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
} 