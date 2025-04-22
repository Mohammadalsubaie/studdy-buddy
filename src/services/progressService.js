import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
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
    
    // Sort sessions by timestamp in memory
    return sessions.sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate());
  } catch (error) {
    console.error('Error getting study sessions:', error);
    return [];
  }
};

export const calculateProgress = (sessions) => {
  const stats = {
    totalTime: 0,
    subjects: {},
    dailyAverage: 0,
    streak: 0,
  };

  if (sessions.length === 0) return stats;

  // Calculate total time and subject distribution
  sessions.forEach(session => {
    stats.totalTime += session.duration || 0;
    if (session.subject) {
      stats.subjects[session.subject] = (stats.subjects[session.subject] || 0) + (session.duration || 0);
    }
  });

  // Calculate daily average
  const days = new Set(sessions.map(s => s.timestamp.toDate().toDateString())).size;
  stats.dailyAverage = stats.totalTime / (days || 1);

  // Calculate streak
  let currentStreak = 0;
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  for (let i = 0; i < sessions.length; i++) {
    const sessionDate = sessions[i].timestamp.toDate();
    if (sessionDate.toDateString() === today.toDateString()) {
      currentStreak++;
    } else if (sessionDate.toDateString() === yesterday.toDateString()) {
      currentStreak++;
      break;
    } else {
      break;
    }
  }

  stats.streak = currentStreak;

  return stats;
}; 