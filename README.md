# Study Buddy

A comprehensive mobile application designed to enhance your study experience with features like study groups, task management, progress tracking, and a Pomodoro timer.

## Table of Contents
- [Installation](#installation)
- [Features](#features)
- [API Documentation](#api-documentation)
- [User Guide](#user-guide)
- [Contributing](#contributing)
- [License](#license)

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Firebase account (for backend services)

### Setup Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/study-buddy.git
   cd study-buddy
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure Firebase:
   - Create a new Firebase project
   - Enable Authentication and Firestore
   - Update the Firebase configuration in `src/services/firebase.js`

4. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

5. Run the app:
   - Scan the QR code with Expo Go app (mobile)
   - Press 'w' for web version
   - Press 'a' for Android emulator
   - Press 'i' for iOS simulator

## Features

### 1. Study Groups
- Create and join study groups
- Real-time chat functionality
- Group study schedules
- Resource sharing

### 2. Task Management
- Create and organize study tasks
- Set deadlines and priorities
- Track task completion
- Categorize tasks by subject

### 3. Progress Tracking
- Log study sessions
- Track study time by subject
- View study statistics
- Monitor daily/weekly progress

### 4. Study Timer (Pomodoro)
- 25-minute focus sessions
- 5-minute short breaks
- 15-minute long breaks
- Customizable timer settings
- Session logging and tracking

### 5. User Authentication
- Email/password login
- Google authentication
- Password reset functionality
- Profile management

## API Documentation

### Authentication
```javascript
// Sign up
const signUp = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

// Sign in
const signIn = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// Sign out
const signOut = async () => {
  return await auth.signOut();
};
```

### Study Groups
```javascript
// Create group
const createGroup = async (groupData) => {
  return await addDoc(collection(db, 'groups'), groupData);
};

// Join group
const joinGroup = async (groupId, userId) => {
  return await updateDoc(doc(db, 'groups', groupId), {
    members: arrayUnion(userId)
  });
};
```

### Task Management
```javascript
// Create task
const createTask = async (taskData) => {
  return await addDoc(collection(db, 'tasks'), taskData);
};

// Update task
const updateTask = async (taskId, updates) => {
  return await updateDoc(doc(db, 'tasks', taskId), updates);
};
```

### Progress Tracking
```javascript
// Log study session
const logStudySession = async (sessionData) => {
  return await addDoc(collection(db, 'studySessions'), sessionData);
};

// Get study sessions
const getStudySessions = async (userId) => {
  const q = query(
    collection(db, 'studySessions'),
    where('userId', '==', userId)
  );
  return await getDocs(q);
};
```

## Implementation Code

### Project Structure
```
study-buddy/
├── src/
│   ├── assets/
│   │   └── notification.mp3
│   ├── components/
│   │   ├── StudyTimer.js
│   │   ├── TaskList.js
│   │   └── ProgressChart.js
│   ├── screens/
│   │   ├── HomeScreen.js
│   │   ├── StudyTimerScreen.js
│   │   ├── TaskScreen.js
│   │   └── ProgressScreen.js
│   ├── services/
│   │   ├── firebase.js
│   │   ├── authService.js
│   │   ├── taskService.js
│   │   └── progressService.js
│   └── navigation/
│       └── AppNavigator.js
├── app.json
├── package.json
└── README.md
```

### Core Files

#### 1. App Configuration (app.json)
```json
{
  "expo": {
    "name": "Study Buddy",
    "slug": "study-buddy",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

#### 2. Package Dependencies (package.json)
```json
{
  "name": "study-buddy",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~49.0.0",
    "expo-status-bar": "~1.6.0",
    "react": "18.2.0",
    "react-native": "0.72.6",
    "firebase": "^10.7.0",
    "expo-av": "~13.6.0",
    "react-native-paper": "^5.11.1",
    "react-native-chart-kit": "^6.12.0",
    "react-native-vector-icons": "^10.0.0"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0"
  },
  "private": true
}
```

#### 3. Firebase Configuration (src/services/firebase.js)
```javascript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
```

#### 4. Navigation Setup (src/navigation/AppNavigator.js)
```javascript
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import StudyTimerScreen from '../screens/StudyTimerScreen';
import TaskScreen from '../screens/TaskScreen';
import ProgressScreen from '../screens/ProgressScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Timer" component={StudyTimerScreen} />
      <Tab.Screen name="Tasks" component={TaskScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
    </Tab.Navigator>
  );
}
```

#### 5. Study Timer Component (src/components/StudyTimer.js)
```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Vibration } from 'react-native';
import { Audio } from 'expo-av';

export default function StudyTimer({ onComplete }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sound, setSound] = useState();

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      handleTimerComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleTimerComplete = async () => {
    setIsActive(false);
    Vibration.vibrate([500, 500, 500]);
    await playSound();
    onComplete();
  };

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/notification.mp3')
    );
    setSound(sound);
    await sound.playAsync();
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleTimer}>
          <Text style={styles.buttonText}>{isActive ? 'Pause' : 'Start'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={resetTimer}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  timerText: {
    fontSize: 72,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    width: '40%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
```

#### 6. Progress Service (src/services/progressService.js)
```javascript
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';

export const logStudySession = async (sessionData) => {
  try {
    const sessionsRef = collection(db, 'studySessions');
    await addDoc(sessionsRef, sessionData);
    return true;
  } catch (error) {
    console.error('Error logging study session:', error);
    return false;
  }
};

export const getStudySessions = async (userId) => {
  try {
    const sessionsRef = collection(db, 'studySessions');
    const q = query(
      sessionsRef,
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const sessions = [];
    
    querySnapshot.forEach((doc) => {
      sessions.push({ id: doc.id, ...doc.data() });
    });
    
    return sessions.sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate());
  } catch (error) {
    console.error('Error getting study sessions:', error);
    return [];
  }
};
```

### Additional Components and Services

For the complete implementation, you'll also need:

1. **Task Management Components**
   - TaskList.js
   - TaskForm.js
   - TaskItem.js

2. **Study Group Components**
   - GroupList.js
   - GroupChat.js
   - GroupSchedule.js

3. **Authentication Services**
   - authService.js
   - userService.js

4. **UI Components**
   - CustomButton.js
   - CustomInput.js
   - ProgressChart.js

Would you like me to provide the implementation code for any of these additional components or would you like to see more details about any of the existing components?

## User Guide

### Getting Started
1. Create an account or sign in
2. Set up your profile
3. Explore the main features

### Using Study Groups
1. Create a new group or join an existing one
2. Invite friends to join
3. Schedule study sessions
4. Share resources and chat

### Managing Tasks
1. Add new tasks
2. Set deadlines and priorities
3. Mark tasks as complete
4. Organize by subject

### Tracking Progress
1. Start the study timer
2. Log your study sessions
3. View your progress dashboard
4. Analyze study patterns

### Using the Study Timer
1. Select a subject (optional)
2. Start the timer
3. Focus for 25 minutes
4. Take a 5-minute break
5. Repeat for 4 sessions
6. Take a 15-minute long break

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.
