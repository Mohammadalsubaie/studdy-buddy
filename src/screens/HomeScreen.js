import React, { useState, useEffect, useContext } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import TaskItem from '../components/TaskItem';
import StudySessionCard from '../components/StudySessionCard';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../contexts/ThemeContext';
import { lightTheme, darkTheme } from '../utils/theme';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { isDarkMode } = useContext(ThemeContext);
  const theme = isDarkMode ? darkTheme : lightTheme;
  
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);

  const fetchData = async () => {
    if (!auth.currentUser) return;
    
    setLoading(true);
    try {
    
      const tasksRef = collection(db, "users", auth.currentUser.uid, "tasks");
      const tasksSnapshot = await getDocs(tasksRef);
      
      let tasks = [];
      let completed = 0;
      tasksSnapshot.forEach((doc) => {
        const task = { id: doc.id, ...doc.data() };
        if (task.completed) {
          completed++;
        } else {
          tasks.push(task);
        }
      });
      
      
      tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      setUpcomingTasks(tasks.slice(0, 3));
      setCompletedTasks(completed);
      setTotalTasks(tasks.length + completed);
      
    
      const sessionsRef = collection(db, "users", auth.currentUser.uid, "sessions");
      const sessionsSnapshot = await getDocs(sessionsRef);
      
      let sessions = [];
      sessionsSnapshot.forEach((doc) => {
        const session = { id: doc.id, ...doc.data() };
        if (new Date(session.date) >= new Date()) {
          sessions.push(session);
        }
      });
      
      // Sort by date and get only upcoming 2
      sessions.sort((a, b) => new Date(a.date) - new Date(b.date));
      setUpcomingSessions(sessions.slice(0, 2));
      
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const progressPercentage = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;

  return (
    <ScrollView 
      style={[styles.container, {backgroundColor: theme.background}]}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={fetchData} />
      }
    >
      <View style={[styles.header, {backgroundColor: theme.primary}]}>
        <Text style={styles.title}>Study Buddy</Text>
        <View style={[styles.teamInfo, {backgroundColor: 'rgba(255, 255, 255, 0.2)'}]}>
          <Text style={styles.teamTitle}>Team Members:</Text>
          <Text style={styles.memberName}>ABDULLAH ALHARBI</Text>
          <Text style={styles.memberName}>MOHAMMED ALSUBAIE</Text>
          <Text style={styles.memberName}>SALEH ALI</Text>
          <Text style={styles.crn}>CRN: 21088</Text>
        </View>
      </View>
      
      <View style={styles.progressSection}>
        <Text style={[styles.sectionTitle, {color: theme.text}]}>Your Progress</Text>
        <View style={[styles.progressCard, {backgroundColor: theme.card}]}>
          <View style={styles.progressInfo}>
            <Text style={[styles.progressPercentage, {color: theme.primary}]}>{progressPercentage}%</Text>
            <Text style={[styles.progressText, {color: theme.secondaryText}]}>
              {completedTasks} of {totalTasks} tasks completed
            </Text>
          </View>
          <View style={[styles.progressBarContainer, {backgroundColor: isDarkMode ? '#444' : '#e0e0e0'}]}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${progressPercentage}%`, backgroundColor: theme.primary }
              ]} 
            />
          </View>
        </View>
      </View>
      
      <View style={styles.tasksSection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, {color: theme.text}]}>Upcoming Tasks</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Tasks')}>
            <Text style={[styles.seeAllText, {color: theme.primary}]}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {upcomingTasks.length > 0 ? (
          upcomingTasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))
        ) : (
          <View style={[styles.emptyState, {backgroundColor: theme.card}]}>
            <Text style={[styles.emptyStateText, {color: theme.secondaryText}]}>No upcoming tasks</Text>
            <TouchableOpacity 
              style={[styles.addButton, {backgroundColor: theme.primary}]}
              onPress={() => navigation.navigate('Tasks')}
            >
              <Text style={styles.addButtonText}>Add Task</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      <View style={styles.sessionsSection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, {color: theme.text}]}>Study Sessions</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Schedule')}>
            <Text style={[styles.seeAllText, {color: theme.primary}]}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {upcomingSessions.length > 0 ? (
          upcomingSessions.map(session => (
            <StudySessionCard key={session.id} session={session} />
          ))
        ) : (
          <View style={[styles.emptyState, {backgroundColor: theme.card}]}>
            <Text style={[styles.emptyStateText, {color: theme.secondaryText}]}>No upcoming study sessions</Text>
            <TouchableOpacity 
              style={[styles.addButton, {backgroundColor: theme.primary}]}
              onPress={() => navigation.navigate('Schedule')}
            >
              <Text style={styles.addButtonText}>Schedule Session</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.featuresContainer}>
        <TouchableOpacity 
          style={[styles.featureCard, {backgroundColor: theme.card}]}
          onPress={() => navigation.navigate('StudyTimer')}
        >
          <Ionicons name="timer-outline" size={40} color={theme.primary} />
          <Text style={[styles.featureTitle, {color: theme.text}]}>Study Timer</Text>
          <Text style={[styles.featureDescription, {color: theme.secondaryText}]}>Start a focused study session with our Pomodoro timer</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.featureCard, {backgroundColor: theme.card}]}
          onPress={() => navigation.navigate('Groups')}
        >
          <Ionicons name="people-outline" size={40} color={theme.primary} />
          <Text style={[styles.featureTitle, {color: theme.text}]}>Study Groups</Text>
          <Text style={[styles.featureDescription, {color: theme.secondaryText}]}>Join or create study groups</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.featureCard, {backgroundColor: theme.card}]}
          onPress={() => navigation.navigate('Tasks')}
        >
          <Ionicons name="list-outline" size={40} color={theme.primary} />
          <Text style={[styles.featureTitle, {color: theme.text}]}>Tasks</Text>
          <Text style={[styles.featureDescription, {color: theme.secondaryText}]}>Manage your study tasks</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.featureCard, {backgroundColor: theme.card}]}
          onPress={() => navigation.navigate('Schedule')}
        >
          <Ionicons name="calendar-outline" size={40} color={theme.primary} />
          <Text style={[styles.featureTitle, {color: theme.text}]}>Schedule</Text>
          <Text style={[styles.featureDescription, {color: theme.secondaryText}]}>Plan your study sessions</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.footer, {borderTopColor: theme.border}]}>
        <Text style={[styles.footerText, {color: theme.secondaryText}]}>
          CS475 - Mobile Development
        </Text>
        <Text style={[styles.footerText, {color: theme.secondaryText}]}>
        Mohammad Alsubaie
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  teamInfo: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  teamTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  memberName: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5,
    textAlign: 'center',
  },
  crn: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  progressSection: {
    padding: 20,
  },
  progressCard: {
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  progressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 10,
  },
  progressText: {
    fontSize: 14,
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  tasksSection: {
    padding: 20,
  },
  sessionsSection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
  },
  emptyState: {
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyStateText: {
    fontSize: 14,
    marginBottom: 10,
  },
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
  },
  footerText: {
    fontSize: 14,
    marginBottom: 5,
  },
  featuresContainer: {
    padding: 20,
  },
  featureCard: {
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    alignItems: 'center',
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    textAlign: 'center',
  },
});