# Government Emergency Humanitarian Assistance Plan Management and Predictive System

A modern, responsive web application designed to provide real-time emergency reporting, coordination, and response for communities in crisis-prone areas such as the Northwest Region of Cameroon.

## 🌟 Features

### Core Functionality
- **Real-time Emergency Reporting** - Report emergencies with geolocation and detailed information
- **Interactive Map** - View all emergency reports on an interactive map using Leaflet.js
- **Role-based Access** - Different interfaces for Public Users, Responders, and Administrators
- **Push Notifications** - Real-time alerts for nearby emergencies
- **Admin Dashboard** - Comprehensive management interface for responders and officials
- **Data Analytics** - Charts and insights for emergency planning and resource allocation

### User Roles
- **Public Users** - Report emergencies and view updates
- **Emergency Responders** - Manage responses and coordinate with teams
- **Administrators** - Full system access and analytics

### Emergency Types
- Fire outbreaks
- Medical emergencies
- Armed conflicts
- Natural disasters
- Accidents
- Floods
- Other emergencies

## 🚀 Tech Stack

- **Frontend**: React.js with TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Cloud Functions)
- **Maps**: Leaflet.js with OpenStreetMap
- **Notifications**: Web Push API
- **Icons**: Heroicons
- **Routing**: React Router DOM

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- Modern web browser

## 🛠️ Installation

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
1. Register an account or sign in
2. Use the "Report Emergency" button to report incidents
3. View emergency map and updates
4. Receive notifications about nearby emergencies

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

## 🎨 Design System

The application uses a consistent design system with:
- Emergency color coding (Red, Orange, Yellow, Green, Blue)
- Responsive design for mobile and desktop
- Accessible UI components
- Modern, clean interface

## 🔧 Customization

### Adding New Emergency Types
1. Update the `EmergencyType` enum in `src/types/index.ts`
2. Add corresponding icons and colors
3. Update form components and display logic

### Customizing Colors
Edit the emergency colors in `tailwind.config.js`:
```javascript
colors: {
  emergency: {
    red: '#DC2626',
    orange: '#EA580C',
    yellow: '#CA8A04',
    green: '#16A34A',
    blue: '#2563EB',
  }
}
```

## 🚀 Deployment

### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login to Firebase: `firebase login`
3. Initialize Firebase: `firebase init`
4. Build the project: `npm run build`
5. Deploy: `firebase deploy`

### Other Platforms
The application can be deployed to any static hosting platform:
- Vercel
- Netlify
- AWS S3
- GitHub Pages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Northwest Region of Cameroon communities
- Emergency response teams
- Open source contributors
- Firebase team for backend services

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- Mobile app development
- AI-powered emergency prediction
- Integration with government systems
- Multi-language support
- Offline functionality
- Advanced analytics and reporting

---

**Built with ❤️ for the safety and well-being of communities in crisis-prone areas.**
