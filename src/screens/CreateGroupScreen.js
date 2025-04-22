import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../services/firebase';
import { useNavigation } from '@react-navigation/native';

const CreateGroupScreen = () => {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [maxMembers, setMaxMembers] = useState('10');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleCreateGroup = async () => {
    if (!name || !subject || !description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const groupsRef = collection(db, 'groups');
      const newGroup = {
        name,
        subject,
        description,
        maxMembers: parseInt(maxMembers),
        createdBy: auth.currentUser.uid,
        createdAt: new Date(),
        members: [auth.currentUser.uid],
        admins: [auth.currentUser.uid],
      };

      // Add the group to Firestore and get the reference
      const docRef = await addDoc(groupsRef, newGroup);
      console.log('Group created with ID:', docRef.id);
      
      // Show success message and navigate with refresh parameter
      Alert.alert('Success', 'Group created successfully', [
        {
          text: 'OK',
          onPress: () => {
            // Pass refresh: true to trigger refresh on the groups list screen
            navigation.navigate('GroupsList', { refresh: true });
          }
        }
      ]);
    } catch (error) {
      console.error('Error creating group:', error);
      Alert.alert('Error', 'Failed to create group: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Group Name *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter group name"
        />

        <Text style={styles.label}>Subject *</Text>
        <TextInput
          style={styles.input}
          value={subject}
          onChangeText={setSubject}
          placeholder="Enter subject"
        />

        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter group description"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Maximum Members</Text>
        <TextInput
          style={styles.input}
          value={maxMembers}
          onChangeText={setMaxMembers}
          placeholder="Enter maximum number of members"
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateGroup}
          disabled={loading}
        >
          <Text style={styles.createButtonText}>
            {loading ? 'Creating...' : 'Create Group'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  createButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateGroupScreen;