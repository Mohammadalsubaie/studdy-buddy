# StuddyBuddy Documentation

## Table of Contents
1. [Installation Instructions](#installation-instructions)
2. [Feature Descriptions](#feature-descriptions)
3. [API Documentation](#api-documentation)
4. [User Guide](#user-guide)

## Installation Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Setup Steps

1. **Clone the Repository**
   ```bash
   git clone [repository-url]
   cd studdyBuddy-master
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Download the `google-services.json` file
   - Place it in the `android/app` directory
   - For iOS, download `GoogleService-Info.plist` and add it to your Xcode project

4. **Environment Setup**
   - Create a `.env` file in the root directory
   - Add your Firebase configuration:
     ```
     FIREBASE_API_KEY=your_api_key
     FIREBASE_AUTH_DOMAIN=your_auth_domain
     FIREBASE_PROJECT_ID=your_project_id
     FIREBASE_STORAGE_BUCKET=your_storage_bucket
     FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     FIREBASE_APP_ID=your_app_id
     ```

5. **Run the Application**
   ```bash
   # Start the development server
   npm start
   # or
   yarn start
   
   # For Android
   npm run android
   
   # For iOS
   npm run ios
   ```

## Feature Descriptions

### 1. User Authentication
- **Sign Up**: New users can create an account using email/password or social login
- **Sign In**: Existing users can log in to their accounts
- **Password Recovery**: Users can reset their forgotten passwords
- **Profile Management**: Users can update their profile information

### 2. Study Groups
- **Create Groups**: Users can create study groups with specific subjects
- **Join Groups**: Users can join existing study groups
- **Group Management**: Group admins can manage members and settings
- **Group Chat**: Real-time messaging within study groups

### 3. Study Tools
- **Study Timer**: Pomodoro-style timer for focused study sessions
- **Task Management**: Create and track study tasks
- **Progress Tracking**: Monitor study progress and achievements
- **Resource Sharing**: Share study materials within groups

### 4. Study Schedule
- **Calendar Integration**: View and manage study sessions
- **Reminders**: Set reminders for study sessions
- **Availability Status**: Show when you're available for study
- **Session Planning**: Plan study sessions with group members

## API Documentation

### Authentication API

#### Sign Up
```javascript
POST /api/auth/signup
Body: {
  email: string,
  password: string,
  displayName: string
}
Response: {
  user: User,
  token: string
}
```

#### Sign In
```javascript
POST /api/auth/signin
Body: {
  email: string,
  password: string
}
Response: {
  user: User,
  token: string
}
```

### Study Groups API

#### Create Group
```javascript
POST /api/groups
Body: {
  name: string,
  subject: string,
  description: string,
  maxMembers: number
}
Response: {
  group: Group
}
```

#### Join Group
```javascript
POST /api/groups/:groupId/join
Response: {
  success: boolean,
  group: Group
}
```

### Study Tools API

#### Create Study Session
```javascript
POST /api/sessions
Body: {
  duration: number,
  subject: string,
  groupId?: string
}
Response: {
  session: Session
}
```

#### Track Progress
```javascript
POST /api/progress
Body: {
  subject: string,
  duration: number,
  completedTasks: string[]
}
Response: {
  progress: Progress
}
```

## User Guide

### Getting Started

1. **Account Creation**
   - Open the StuddyBuddy app
   - Tap "Sign Up"
   - Enter your email and create a password
   - Complete your profile information

2. **Joining Study Groups**
   - Navigate to the "Groups" tab
   - Browse available study groups
   - Tap "Join" on a group you're interested in
   - Wait for group admin approval

3. **Creating Study Sessions**
   - Go to the "Study" tab
   - Tap "New Session"
   - Set your study duration
   - Choose a subject
   - Start the session

### Key Features

#### Study Timer
1. Set your desired study duration
2. Choose between different timer modes (Pomodoro, Custom)
3. Start the timer and focus on your study
4. Take breaks when prompted

#### Group Study
1. Create or join a study group
2. Schedule study sessions with group members
3. Use the group chat for discussions
4. Share study materials and resources

#### Progress Tracking
1. View your study statistics in the "Progress" tab
2. Track time spent on different subjects
3. Monitor completed tasks
4. View achievement badges

### Tips for Effective Use

1. **Regular Study Sessions**
   - Schedule regular study sessions
   - Use the timer to maintain focus
   - Take regular breaks to avoid burnout

2. **Group Study**
   - Coordinate study times with group members
   - Share resources and notes
   - Help each other with difficult topics

3. **Progress Tracking**
   - Set realistic study goals
   - Track your progress regularly
   - Celebrate achievements

### Troubleshooting

1. **Login Issues**
   - Check your internet connection
   - Verify your email and password
   - Use the "Forgot Password" feature if needed

2. **App Performance**
   - Clear app cache if experiencing slowdowns
   - Update to the latest version
   - Restart the app if experiencing issues

3. **Group Issues**
   - Contact group admin for membership issues
   - Check group settings for permissions
   - Verify your internet connection for chat features

### Support

For additional support:
- Email: support@studdybuddy.com
- In-app help center
- FAQ section in the app settings 