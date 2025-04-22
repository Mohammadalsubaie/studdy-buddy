import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import TasksScreen from '../screens/TasksScreen';
import ProgressScreen from '../screens/ProgressScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import ProfileScreen from '../screens/ProfileScreen';
import GroupsScreen from '../screens/GroupsScreen';
import CreateGroupScreen from '../screens/CreateGroupScreen';
import GroupDetailsScreen from '../screens/GroupDetailsScreen';
import StudyTimerScreen from '../screens/StudyTimerScreen';

const FallbackScreen = ({ route }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Screen {route.name} not implemented yet</Text>
  </View>
);

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const GroupsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="GroupsList" 
        component={GroupsScreen}
        options={{ title: 'Study Groups' }}
      />
      <Stack.Screen 
        name="CreateGroup" 
        component={CreateGroupScreen}
        options={{ title: 'Create Group' }}
      />
      <Stack.Screen 
        name="GroupDetails" 
        component={GroupDetailsScreen}
        options={{ title: 'Group Details' }}
      />
    </Stack.Navigator>
  );
};

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeMain" 
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Stack.Screen 
        name="StudyTimer" 
        component={StudyTimerScreen}
        options={{ title: 'Study Timer' }}
      />
    </Stack.Navigator>
  );
};

export default function MainNavigator() {
  const HomeComponent = HomeStack;
  const TasksComponent = TasksScreen ?? FallbackScreen;
  const ProgressComponent = ProgressScreen ?? FallbackScreen;
  const ScheduleComponent = ScheduleScreen ?? FallbackScreen;
  const ProfileComponent = ProfileScreen ?? FallbackScreen;
  const GroupsComponent = GroupsStack;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Tasks') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Progress') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          } else if (route.name === 'Schedule') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Groups') {
            iconName = focused ? 'people' : 'people-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeComponent} />
      <Tab.Screen name="Groups" component={GroupsComponent} />
      <Tab.Screen name="Tasks" component={TasksComponent} />
      <Tab.Screen name="Progress" component={ProgressComponent} />
      <Tab.Screen name="Schedule" component={ScheduleComponent} />
      <Tab.Screen name="Profile" component={ProfileComponent} />
    </Tab.Navigator>
  );
}