// app.js (modified)
import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, ActivityIndicator, LogBox, StatusBar } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { auth } from './src/services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import AuthNavigator from './src/navigation/AuthNavigator';
import MainNavigator from './src/navigation/MainNavigator';
import { ThemeProvider, ThemeContext } from './src/contexts/ThemeContext';
import { lightTheme, darkTheme } from './src/utils/theme';

// ignore specific warning if that happens by dependencies
LogBox.ignoreLogs(['Warning: ...']); 

// Simple loading component
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color="#007AFF" />
    <Text style={{ marginTop: 10 }}>Loading...</Text>
  </View>
);

const Stack = createStackNavigator();

const AppContent = () => {
  const { isDarkMode } = React.useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Create navigation theme based on dark mode setting
  const navigationTheme = {
    ...(isDarkMode ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDarkMode ? DarkTheme.colors : DefaultTheme.colors),
      primary: isDarkMode ? darkTheme.primary : lightTheme.primary,
      background: isDarkMode ? darkTheme.background : lightTheme.background,
      card: isDarkMode ? darkTheme.card : lightTheme.card,
      text: isDarkMode ? darkTheme.text : lightTheme.text,
      border: isDarkMode ? darkTheme.border : lightTheme.border,
    },
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user ? "user signed in" : "no user");
      setUser(user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor={isDarkMode ? darkTheme.background : lightTheme.background}
      />
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            <Stack.Screen name="Main" component={MainNavigator} />
          ) : (
            <Stack.Screen name="Auth" component={AuthNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}