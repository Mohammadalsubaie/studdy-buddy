import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { auth } from '../services/firebase';
import { getStudySessions, calculateProgress } from '../services/progressService';
import { Ionicons } from '@expo/vector-icons';

export default function ProgressScreen() {
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({
    totalTime: 0,
    subjects: {},
    dailyAverage: 0,
    streak: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      setLoading(true);
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const userSessions = await getStudySessions(userId);
      setSessions(userSessions);
      setStats(calculateProgress(userSessions));
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={loadProgress} />
      }
    >
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="time-outline" size={32} color="#007AFF" />
          <Text style={styles.statValue}>{formatTime(stats.totalTime)}</Text>
          <Text style={styles.statLabel}>Total Study Time</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="flame-outline" size={32} color="#FF3B30" />
          <Text style={styles.statValue}>{stats.streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="calendar-outline" size={32} color="#34C759" />
          <Text style={styles.statValue}>{formatTime(stats.dailyAverage)}</Text>
          <Text style={styles.statLabel}>Daily Average</Text>
        </View>
      </View>

      <View style={styles.subjectsContainer}>
        <Text style={styles.sectionTitle}>Subject Distribution</Text>
        {Object.entries(stats.subjects).map(([subject, time]) => (
          <View key={subject} style={styles.subjectItem}>
            <Text style={styles.subjectName}>{subject}</Text>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${(time / stats.totalTime) * 100}%` }
                ]}
              />
            </View>
            <Text style={styles.subjectTime}>{formatTime(time)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.recentSessions}>
        <Text style={styles.sectionTitle}>Recent Sessions</Text>
        {sessions.slice(0, 5).map(session => (
          <View key={session.id} style={styles.sessionItem}>
            <Text style={styles.sessionSubject}>{session.subject || 'General'}</Text>
            <Text style={styles.sessionTime}>
              {formatTime(session.duration)} • {new Date(session.timestamp.toDate()).toLocaleDateString()}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#fff',
  },
  statCard: {
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  subjectsContainer: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  subjectItem: {
    marginBottom: 15,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 5,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  subjectTime: {
    fontSize: 12,
    color: '#666',
  },
  recentSessions: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 20,
  },
  sessionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sessionSubject: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  sessionTime: {
    fontSize: 14,
    color: '#666',
  },
});