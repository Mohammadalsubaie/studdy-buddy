import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db, auth } from '../services/firebase';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const GroupDetailsScreen = () => {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { groupId } = route.params;

  useEffect(() => {
    fetchGroupDetails();
  }, [groupId]);

  const fetchGroupDetails = async () => {
    try {
      const groupRef = doc(db, 'groups', groupId);
      const groupDoc = await getDoc(groupRef);
      
      if (groupDoc.exists()) {
        const groupData = groupDoc.data();
        setGroup(groupData);
        setIsMember(groupData.members.includes(auth.currentUser.uid));
        setIsAdmin(groupData.admins.includes(auth.currentUser.uid));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch group details');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    if (!group) return;

    if (group.members.length >= group.maxMembers) {
      Alert.alert('Error', 'Group is full');
      return;
    }

    try {
      const groupRef = doc(db, 'groups', groupId);
      await updateDoc(groupRef, {
        members: arrayUnion(auth.currentUser.uid)
      });
      setIsMember(true);
      Alert.alert('Success', 'Joined group successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to join group');
    }
  };

  const handleLeaveGroup = async () => {
    try {
      const groupRef = doc(db, 'groups', groupId);
      await updateDoc(groupRef, {
        members: arrayRemove(auth.currentUser.uid),
        admins: arrayRemove(auth.currentUser.uid)
      });
      setIsMember(false);
      setIsAdmin(false);
      Alert.alert('Success', 'Left group successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to leave group');
    }
  };

  const renderMemberItem = ({ item }) => (
    <View style={styles.memberItem}>
      <Ionicons name="person-circle" size={24} color="#666" />
      <Text style={styles.memberName}>{item}</Text>
      {group.admins.includes(item) && (
        <Text style={styles.adminBadge}>Admin</Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!group) {
    return (
      <View style={styles.container}>
        <Text>Group not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.groupName}>{group.name}</Text>
        <Text style={styles.groupSubject}>{group.subject}</Text>
      </View>

      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>{group.description}</Text>
      </View>

      <View style={styles.membersContainer}>
        <Text style={styles.sectionTitle}>
          Members ({group.members.length}/{group.maxMembers})
        </Text>
        <FlatList
          data={group.members}
          renderItem={renderMemberItem}
          keyExtractor={(item) => item}
        />
      </View>

      <View style={styles.actionsContainer}>
        {!isMember ? (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleJoinGroup}
          >
            <Text style={styles.actionButtonText}>Join Group</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.actionButton, styles.leaveButton]}
            onPress={handleLeaveGroup}
          >
            <Text style={styles.actionButtonText}>Leave Group</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  groupName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  groupSubject: {
    fontSize: 16,
    color: '#666',
  },
  descriptionContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  membersContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 8,
  },
  memberName: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  adminBadge: {
    backgroundColor: '#007AFF',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
  },
  actionsContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  leaveButton: {
    backgroundColor: '#FF3B30',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GroupDetailsScreen; 