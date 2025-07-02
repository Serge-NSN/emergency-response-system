import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  doc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Notification } from '../types';

// Create a notification
export const createNotification = async (
  userId: string,
  title: string,
  message: string,
  type: 'emergency' | 'update' | 'system' = 'update',
  data?: any
): Promise<string> => {
  try {
    const notificationData = {
      userId,
      title,
      message,
      type,
      read: false,
      createdAt: serverTimestamp(),
      data
    };

    const docRef = await addDoc(collection(db, 'notifications'), notificationData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw new Error('Failed to create notification');
  }
};

// Get notifications for a user
export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const notifications: Notification[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      notifications.push({
        id: doc.id,
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type,
        read: data.read,
        createdAt: data.createdAt?.toDate() || new Date(),
        data: data.data
      });
    });
    
    return notifications;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw new Error('Failed to fetch notifications');
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, {
      read: true
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw new Error('Failed to mark notification as read');
  }
};

// Mark all notifications as read for a user
export const markAllNotificationsAsRead = async (userId: string): Promise<void> => {
  try {
    const notifications = await getUserNotifications(userId);
    const unreadNotifications = notifications.filter(n => !n.read);
    
    const updatePromises = unreadNotifications.map(notification =>
      markNotificationAsRead(notification.id)
    );
    
    await Promise.all(updatePromises);
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw new Error('Failed to mark all notifications as read');
  }
};

// Create emergency action notifications
export const createEmergencyActionNotification = async (
  emergencyId: string,
  emergencyTitle: string,
  action: 'acknowledged' | 'responded' | 'resolved' | 'closed',
  actorName: string,
  reporterId: string
): Promise<void> => {
  try {
    const actionMessages = {
      acknowledged: `Emergency "${emergencyTitle}" has been acknowledged by ${actorName}`,
      responded: `Emergency "${emergencyTitle}" is now being responded to by ${actorName}`,
      resolved: `Emergency "${emergencyTitle}" has been resolved by ${actorName}`,
      closed: `Emergency "${emergencyTitle}" has been closed by ${actorName}`
    };

    const message = actionMessages[action];
    
    // Notify the reporter
    await createNotification(
      reporterId,
      `Emergency ${action.charAt(0).toUpperCase() + action.slice(1)}`,
      message,
      'emergency',
      { emergencyId, action }
    );

    // You could also notify other responders or admins here
    console.log(`Created notification for emergency action: ${action}`);
  } catch (error) {
    console.error('Error creating emergency action notification:', error);
    // Don't throw error to avoid breaking the main action flow
  }
}; 