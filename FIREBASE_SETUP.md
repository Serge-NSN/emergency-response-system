# 🔥 Firebase Setup Guide

This guide will help you set up Firebase for the Emergency Response System.

## 📋 Prerequisites

- A Google account
- Node.js and npm installed
- The emergency-response-system project cloned

## 🚀 Step-by-Step Setup

### Step 1: Create Firebase Project

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Click "Create a project"** or "Add project"
3. **Enter project name**: `emergency-response-system` (or your preferred name)
4. **Choose whether to enable Google Analytics** (recommended)
5. **Click "Create project"**

### Step 2: Enable Authentication

1. **In your Firebase project**, click on "Authentication" in the left sidebar
2. **Click "Get started"**
3. **Go to "Sign-in method" tab**
4. **Enable "Email/Password"** authentication
5. **Click "Save"**

### Step 3: Set up Firestore Database

1. **Click on "Firestore Database"** in the left sidebar
2. **Click "Create database"**
3. **Choose "Start in test mode"** (for development)
4. **Select a location** (choose the closest to Cameroon, like `europe-west1`)
5. **Click "Done"**

### Step 4: Get Your Firebase Configuration

1. **Click on the gear icon** (⚙️) next to "Project Overview"
2. **Select "Project settings"**
3. **Scroll down to "Your apps"** section
4. **Click the web icon** (</>)
5. **Register app** with name: `Emergency Response System`
6. **Copy the configuration object** (it looks like this):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### Step 5: Configure Your Project

#### Option A: Using Environment Variables (Recommended)

1. **Create a `.env` file** in the root of your project:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

2. **Replace the values** with your actual Firebase configuration

#### Option B: Direct Configuration

1. **Open `src/config/firebase.ts`**
2. **Replace the placeholder values** with your actual Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "your_actual_api_key",
  authDomain: "your_actual_auth_domain",
  projectId: "your_actual_project_id",
  storageBucket: "your_actual_storage_bucket",
  messagingSenderId: "your_actual_messaging_sender_id",
  appId: "your_actual_app_id"
};
```

### Step 6: Set up Firestore Security Rules

1. **Go to Firestore Database** in Firebase Console
2. **Click on "Rules" tab**
3. **Replace the rules** with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Emergency reports - public read, authenticated write
    match /emergencies/{emergencyId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Notifications - users can read their own notifications
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

### Step 7: Test Your Setup

1. **Start your development server**:
   ```bash
   npm start
   ```

2. **Open your browser** to `http://localhost:3000`

3. **Try to register a new account** - this will test your Firebase Authentication

4. **Check the browser console** for any Firebase-related errors

## 🔧 Troubleshooting

### Common Issues:

1. **"auth/api-key-not-valid" error**:
   - Make sure you copied the correct API key from Firebase Console
   - Check that your `.env` file is in the root directory
   - Restart your development server after changing environment variables

2. **"Firestore permission denied" error**:
   - Check your Firestore security rules
   - Make sure you're authenticated before accessing Firestore

3. **"Firebase not initialized" error**:
   - Check that your Firebase configuration is correct
   - Make sure all required fields are filled

### Getting Help:

- Check the Firebase Console for error messages
- Look at the browser console for detailed error information
- Refer to Firebase documentation: https://firebase.google.com/docs

## 🚀 Next Steps

Once Firebase is set up:

1. **Test user registration and login**
2. **Test emergency reporting functionality**
3. **Set up push notifications** (optional)
4. **Deploy to production**

## 📞 Support

If you encounter issues:

1. Check the Firebase Console for error messages
2. Look at the browser console for detailed errors
3. Refer to Firebase documentation
4. Create an issue in the project repository

---

**🎉 Congratulations! Your Firebase setup is complete!** 