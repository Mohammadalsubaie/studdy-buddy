import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Vibration, TextInput } from 'react-native';
import { Audio } from 'expo-av';
import { auth } from '../services/firebase';
import { logStudySession } from '../services/progressService';

const POMODORO_TIME = 25 * 60; // 25 minutes in seconds
const SHORT_BREAK = 5 * 60; // 5 minutes in seconds
const LONG_BREAK = 15 * 60; // 15 minutes in seconds

export default function StudyTimerScreen() {
  const [timeLeft, setTimeLeft] = useState(POMODORO_TIME);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('pomodoro'); // 'pomodoro', 'shortBreak', 'longBreak'
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [sound, setSound] = useState();
  const [subject, setSubject] = useState('');
  const [showSubjectInput, setShowSubjectInput] = useState(false);

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

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/notification.mp3')
    );
    setSound(sound);
    await sound.playAsync();
  };

  const logSession = async (duration, type) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      await logStudySession({
        userId,
        duration: duration / 60, // Convert to minutes
        type,
        subject: subject || 'General',
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Error logging study session:', error);
    }
  };

  const handleTimerComplete = async () => {
    setIsActive(false);
    Vibration.vibrate([500, 500, 500]);
    await playSound();

    if (mode === 'pomodoro') {
      setPomodoroCount(prev => prev + 1);
      await logSession(POMODORO_TIME, 'pomodoro');
      if (pomodoroCount % 3 === 2) {
        setMode('longBreak');
        setTimeLeft(LONG_BREAK);
      } else {
        setMode('shortBreak');
        setTimeLeft(SHORT_BREAK);
      }
    } else {
      setMode('pomodoro');
      setTimeLeft(POMODORO_TIME);
      if (mode === 'longBreak') {
        await logSession(LONG_BREAK, 'longBreak');
      } else {
        await logSession(SHORT_BREAK, 'shortBreak');
      }
    }
  };

  const toggleTimer = () => {
    if (!isActive && mode === 'pomodoro') {
      setShowSubjectInput(true);
    } else {
      setIsActive(!isActive);
    }
  };

  const startTimer = () => {
    if (subject.trim()) {
      setShowSubjectInput(false);
      setIsActive(true);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setShowSubjectInput(false);
    if (mode === 'pomodoro') {
      setTimeLeft(POMODORO_TIME);
    } else if (mode === 'shortBreak') {
      setTimeLeft(SHORT_BREAK);
    } else {
      setTimeLeft(LONG_BREAK);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.modeText}>
        {mode === 'pomodoro' ? 'Focus Time' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
      </Text>
      <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>

      {showSubjectInput ? (
        <View style={styles.subjectInputContainer}>
          <TextInput
            style={styles.subjectInput}
            placeholder="Enter subject (optional)"
            value={subject}
            onChangeText={setSubject}
          />
          <TouchableOpacity
            style={styles.startButton}
            onPress={startTimer}
          >
            <Text style={styles.startButtonText}>Start</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleTimer}>
            <Text style={styles.buttonText}>{isActive ? 'Pause' : 'Start'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={resetTimer}>
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.pomodoroCount}>Pomodoros completed: {pomodoroCount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  modeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
  subjectInputContainer: {
    width: '80%',
    alignItems: 'center',
  },
  subjectInput: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  startButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pomodoroCount: {
    marginTop: 30,
    fontSize: 16,
    color: '#666',
  },
}); 