import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: "AIzaSyAr4Zg1EGBgkgQU_HfPtYstRFwpUt0pp2I",
  authDomain: "emergency-response-syste-2a5f4.firebaseapp.com",
  projectId: "emergency-response-syste-2a5f4",
  storageBucket: "emergency-response-syste-2a5f4.firebasestorage.app",
  messagingSenderId: "713368352413",
  appId: "1:713368352413:web:8e25a34817c7d374808674",
  measurementId: "G-YRHMGNEKWN"
};

// Check if Firebase config is properly set
if (firebaseConfig.apiKey === "YOUR_API_KEY_HERE") {
  console.warn('⚠️ Firebase configuration not set! Please update src/config/firebase.ts with your Firebase credentials.');
  console.warn('📖 See README.md for setup instructions.');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize messaging (optional - for push notifications)
let messaging: any = null;
try {
  messaging = getMessaging(app);
} catch (error) {
  console.log('Messaging not supported in this environment');
}

export { messaging };

// Request notification permission and get token
export const requestNotificationPermission = async () => {
  if (!messaging) return null;
  
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY || 'YOUR_VAPID_KEY'
      });
      return token;
    }
    return null;
  } catch (error) {
    console.error('Error getting notification permission:', error);
    return null;
  }
};

// Handle foreground messages
export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) {
      resolve(null);
      return;
    }
    
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export default app; 