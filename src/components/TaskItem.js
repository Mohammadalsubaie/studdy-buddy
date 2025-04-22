import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { toggleTaskCompletion, deleteTask } from '../services/taskService';

export default function TaskItem({ task, onTaskUpdate, onTaskDelete }) {
  const handleToggleComplete = async () => {
    try {
      await toggleTaskCompletion(task.id, !task.completed);
      onTaskUpdate(task.id, { completed: !task.completed });
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task.id);
      onTaskDelete(task.id);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.checkbox} 
        onPress={handleToggleComplete}
      >
        <Ionicons 
          name={task.completed ? "checkmark-circle" : "ellipse-outline"} 
          size={24} 
          color={task.completed ? "#4CAF50" : "#666"} 
        />
      </TouchableOpacity>
      
      <View style={styles.taskInfo}>
        <Text style={[
          styles.taskTitle,
          task.completed && styles.completedTask
        ]}>
          {task.title}
        </Text>
        {task.description && (
          <Text style={styles.taskDescription}>{task.description}</Text>
        )}
        <Text style={[
          styles.dueDate,
          isOverdue && styles.overdue
        ]}>
          Due: {isOverdue ? 'Overdue' : formatDate(task.dueDate)}
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={handleDelete}
      >
        <Ionicons name="trash-outline" size={20} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  checkbox: {
    marginRight: 15,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dueDate: {
    fontSize: 12,
    color: '#FF3B30',
  },
  deleteButton: {
    padding: 8,
  },
  overdue: {
    color: '#ff3b30',
    fontWeight: '500',
  },
});