# 🚨 Emergency Response System

A comprehensive emergency response management system built with React, TypeScript, and Firebase. This application allows users to report emergencies, track response teams, and manage emergency situations in real-time.

## ✨ Features

### 🚨 Emergency Reporting
- **Real-time emergency reporting** with location detection
- **Multiple emergency types**: Fire, Medical, Armed Conflict, Natural Disasters, etc.
- **Priority levels**: Low, Medium, High, Critical
- **Image upload support** for visual documentation
- **Automatic location detection** using GPS
- **Database storage** using Firebase Firestore

### 🗺️ Interactive Map
- **Real-time emergency visualization** on interactive map
- **Emergency markers** with different colors based on priority
- **Detailed popup information** for each emergency
- **Location-based filtering** and search

### 📊 Dashboard & Analytics
- **Comprehensive statistics** and metrics
- **Emergency type distribution** charts
- **Response time tracking**
- **Real-time updates** and notifications

### 🔐 Authentication & Security
- **User registration and login** with Firebase Auth
- **Role-based access control** (Public, Responder, Admin)
- **Secure data storage** with Firestore security rules

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd emergency-response-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project
   - Enable Authentication, Firestore, and Cloud Functions
   - Get your Firebase configuration
   - Update `src/config/firebase.ts` with your Firebase credentials

4. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📱 Usage

### For Public Users
1. **Register an account** or sign in
2. **Use the "Report Emergency" button** to report incidents
3. **View emergency map** and updates
4. **Receive notifications** about nearby emergencies

### Testing Emergency Reporting
1. **Sign in** to your account
2. **Click "Report Emergency"** in the navigation
3. **Fill out the emergency form**:
   - Select emergency type (Fire, Medical, etc.)
   - Choose priority level
   - Enter title and description
   - Allow location access or enter manually
   - Optionally upload photos
4. **Submit the report** - it will be saved to Firebase Firestore
5. **View the report** on the map page
6. **Check the dashboard** to see the reported emergency

### For Responders
1. Sign in with responder credentials
2. Access the Response Dashboard
3. View and manage active emergencies
4. Update response status and add notes

### For Administrators
1. Sign in with admin credentials
2. Access Analytics Dashboard
3. View comprehensive statistics and trends
4. Manage user accounts and system settings

## 🗺️ Map Integration

The application uses Leaflet.js with OpenStreetMap for displaying emergency locations. The map shows:
- Emergency markers with different colors based on priority
- Popup information for each emergency
- Real-time updates of emergency locations

## 🔔 Notifications

The system supports:
- Web push notifications for new emergencies
- In-app notifications for updates
- Email notifications (configurable)
- SMS notifications (requires additional setup)

## 📊 Analytics

The analytics dashboard provides:
- Emergency type distribution
- Response time metrics
- Monthly trends
- Resolution rates
- Geographic distribution

## 🛠️ Technical Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Firebase (Firestore, Auth, Storage)
- **Maps**: Leaflet.js with OpenStreetMap
- **State Management**: React Context API
- **Build Tool**: Create React App

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   └── layout/         # Layout components (Navbar, Sidebar)
├── config/             # Configuration files
│   └── firebase.ts     # Firebase configuration
├── contexts/           # React Context providers
│   ├── AuthContext.tsx # Authentication context
│   └── NotificationContext.tsx # Notifications context
├── pages/              # Page components
│   ├── EmergencyReportPage.tsx # Emergency reporting form
│   ├── MapPage.tsx     # Interactive map
│   ├── DashboardPage.tsx # Dashboard with statistics
│   └── ...            # Other pages
├── services/           # API and service functions
│   └── emergencyService.ts # Emergency data operations
└── types/              # TypeScript type definitions
    └── index.ts        # Main type definitions
```

## 🔧 Development

### Adding New Features
1. Create new components in `src/components/`
2. Add new pages in `src/pages/`
3. Update types in `src/types/index.ts`
4. Add services in `src/services/`

### Database Schema
The application uses Firebase Firestore with the following collections:
- `users` - User profiles and authentication data
- `emergencies` - Emergency reports and status
- `notifications` - User notifications

### Security Rules
Firestore security rules ensure:
- Users can only read/write their own data
- Emergency reports are publicly readable but require authentication to create
- Notifications are user-specific

## 🐛 Troubleshooting

### Emergency Reports Not Saving
1. **Check Firebase configuration** in `src/config/firebase.ts`
2. **Verify Firestore rules** allow write access
3. **Check browser console** for error messages
4. **Ensure user is authenticated** before reporting

### Map Not Loading
1. **Check internet connection**
2. **Verify OpenStreetMap tiles** are accessible
3. **Check browser console** for Leaflet errors

### Authentication Issues
1. **Verify Firebase Auth** is enabled
2. **Check Firebase configuration** is correct
3. **Clear browser cache** and try again

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the troubleshooting section

## 🔮 Future Enhancements

- Mobile app development
- AI-powered emergency prediction
- Integration with government systems
- Multi-language support
- Offline functionality
- Advanced analytics and reporting

---

**Built with ❤️ for the safety and well-being of communities in crisis-prone areas.**
