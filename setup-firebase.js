#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔥 Firebase Setup Helper for Emergency Response System');
console.log('=====================================================\n');

console.log('📋 Please follow these steps:');
console.log('1. Go to https://console.firebase.google.com/');
console.log('2. Create a new project or select existing one');
console.log('3. Enable Authentication (Email/Password)');
console.log('4. Create Firestore Database');
console.log('5. Get your Firebase configuration\n');

console.log('📝 Your Firebase configuration should look like this:');
console.log('const firebaseConfig = {');
console.log('  apiKey: "AIzaSyC...",');
console.log('  authDomain: "your-project.firebaseapp.com",');
console.log('  projectId: "your-project",');
console.log('  storageBucket: "your-project.appspot.com",');
console.log('  messagingSenderId: "123456789",');
console.log('  appId: "1:123456789:web:abc123"');
console.log('};\n');

console.log('🔧 To configure your project:');
console.log('1. Create a .env file in the root directory');
console.log('2. Add your Firebase configuration as environment variables');
console.log('3. Or directly update src/config/firebase.ts\n');

console.log('📖 For detailed instructions, see FIREBASE_SETUP.md\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('📄 Creating .env.example file...');
  const envExample = `# Firebase Configuration
# Replace these values with your actual Firebase config
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# Optional: VAPID Key for push notifications
REACT_APP_FIREBASE_VAPID_KEY=your_vapid_key_here
`;
  
  fs.writeFileSync(path.join(__dirname, '.env.example'), envExample);
  console.log('✅ Created .env.example file');
  console.log('📝 Copy .env.example to .env and update with your Firebase config\n');
} else {
  console.log('✅ .env file already exists');
}

console.log('🚀 After setup, run: npm start');
console.log('🌐 Open http://localhost:3000 to test your application\n');

console.log('📞 Need help? Check FIREBASE_SETUP.md for detailed instructions'); 