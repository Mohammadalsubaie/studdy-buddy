import React, { useState, useContext } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Alert, 
  ScrollView,
  Switch,
  TextInput,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  signOut, 
  updateProfile, 
  updatePassword, 
  reauthenticateWithCredential, 
  EmailAuthProvider 
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { ThemeContext } from '../contexts/ThemeContext';
import { lightTheme, darkTheme } from '../utils/theme';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [editNameModalVisible, setEditNameModalVisible] = useState(false);
  const [editPasswordModalVisible, setEditPasswordModalVisible] = useState(false);
  const [newName, setNewName] = useState(auth.currentUser?.displayName || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const theme = isDarkMode ? darkTheme : lightTheme;

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      Alert.alert("Error", "Failed to log out");
    }
  };

  const handleUpdateName = async () => {
    if (newName.trim() === '') {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }

    try {
      await updateProfile(auth.currentUser, {
        displayName: newName
      });
      
      Alert.alert("Success", "Name updated successfully");
      setEditNameModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Failed to update name");
    }
  };

  const handleUpdatePassword = async () => {
    if (currentPassword === '' || newPassword === '' || confirmPassword === '') {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    try {
      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      );
      
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // Update password
      await updatePassword(auth.currentUser, newPassword);
      
      Alert.alert("Success", "Password updated successfully");
      setEditPasswordModalVisible(false);
      
      // Clear fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        Alert.alert("Error", "Current password is incorrect");
      } else {
        Alert.alert("Error", "Failed to update password");
      }
    }
  };

  return (
    <ScrollView style={[styles.container, {backgroundColor: theme.background}]}>
      <View style={[styles.header, {backgroundColor: theme.primary}]}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      
      <View style={[styles.profileSection, {backgroundColor: theme.card}]}>
        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {auth.currentUser?.displayName ? auth.currentUser.displayName.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <View style={styles.nameContainer}>
            <Text style={[styles.userName, {color: theme.text}]}>{auth.currentUser?.displayName || 'User'}</Text>
            <Text style={[styles.userEmail, {color: theme.secondaryText}]}>{auth.currentUser?.email}</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={[styles.editButton, {backgroundColor: isDarkMode ? '#333' : '#f0f0f0'}]}
          onPress={() => setEditNameModalVisible(true)}
        >
          <Text style={[styles.editButtonText, {color: theme.primary}]}>Edit</Text>
        </TouchableOpacity>
      </View>
      
      <View style={[styles.section, {backgroundColor: theme.card}]}>
        <Text style={[styles.sectionTitle, {color: theme.text, borderBottomColor: theme.border}]}>Account</Text>
        <TouchableOpacity 
          style={[styles.menuItem, {borderBottomColor: theme.border}]}
          onPress={() => setEditPasswordModalVisible(true)}
        >
          <View style={styles.menuItemLeft}>
            <Ionicons name="lock-closed-outline" size={22} color={theme.primary} />
            <Text style={[styles.menuItemText, {color: theme.text}]}>Change Password</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={theme.secondaryText} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => {
            Alert.alert(
              "Logout",
              "Are you sure you want to log out?",
              [
                {
                  text: "Cancel",
                  style: "cancel"
                },
                { 
                  text: "Logout", 
                  onPress: handleLogout,
                  style: "destructive"
                }
              ]
            );
          }}
        >
          <View style={styles.menuItemLeft}>
            <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
            <Text style={[styles.menuItemText, styles.logoutText]}>Logout</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      <View style={[styles.section, {backgroundColor: theme.card}]}>
        <Text style={[styles.sectionTitle, {color: theme.text, borderBottomColor: theme.border}]}>Settings</Text>
        <View style={[styles.menuItem, {borderBottomColor: theme.border}]}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="notifications-outline" size={22} color={theme.primary} />
            <Text style={[styles.menuItemText, {color: theme.text}]}>Notifications</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: "#ccc", true: theme.primary }}
          />
        </View>
        
        <View style={[styles.menuItem, {borderBottomColor: theme.border}]}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="moon-outline" size={22} color={theme.primary} />
            <Text style={[styles.menuItemText, {color: theme.text}]}>Dark Mode</Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: "#ccc", true: theme.primary }}
          />
        </View>
      </View>
      
      <View style={[styles.section, {backgroundColor: theme.card}]}>
        <Text style={[styles.sectionTitle, {color: theme.text, borderBottomColor: theme.border}]}>About</Text>
        <TouchableOpacity style={[styles.menuItem, {borderBottomColor: theme.border}]}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="information-circle-outline" size={22} color={theme.primary} />
            <Text style={[styles.menuItemText, {color: theme.text}]}>Help & Support</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={theme.secondaryText} />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.menuItem, {borderBottomColor: theme.border}]}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="document-text-outline" size={22} color={theme.primary} />
            <Text style={[styles.menuItemText, {color: theme.text}]}>Terms & Conditions</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={theme.secondaryText} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="shield-outline" size={22} color={theme.primary} />
            <Text style={[styles.menuItemText, {color: theme.text}]}>Privacy Policy</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={theme.secondaryText} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.footer}>
        <Text style={[styles.footerText, {color: theme.secondaryText}]}>
          CS475 - Mobile Development
        </Text>
        <Text style={[styles.footerText, {color: theme.secondaryText}]}>
        Mohammad Alsubaie
        </Text>
       
      </View>
      
     
      <Modal
        animationType="slide"
        transparent={true}
        visible={editNameModalVisible}
        onRequestClose={() => setEditNameModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={[styles.modalView, {backgroundColor: theme.card}]}>
            <View style={[styles.modalHeader, {borderBottomColor: theme.border}]}>
              <Text style={[styles.modalTitle, {color: theme.text}]}>Edit Name</Text>
              <TouchableOpacity onPress={() => setEditNameModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalContent}>
              <Text style={[styles.inputLabel, {color: theme.text}]}>Name</Text>
              <TextInput
                style={[styles.input, {
                  backgroundColor: isDarkMode ? '#333' : '#f9f9f9',
                  borderColor: theme.border,
                  color: theme.text
                }]}
                placeholder="Your name"
                placeholderTextColor={theme.secondaryText}
                value={newName}
                onChangeText={setNewName}
              />
              
              <TouchableOpacity 
                style={[styles.saveButton, {backgroundColor: theme.primary}]}
                onPress={handleUpdateName}
              >
                <Text style={styles.saveButtonText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
     
      <Modal
        animationType="slide"
        transparent={true}
        visible={editPasswordModalVisible}
        onRequestClose={() => setEditPasswordModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={[styles.modalView, {backgroundColor: theme.card}]}>
            <View style={[styles.modalHeader, {borderBottomColor: theme.border}]}>
              <Text style={[styles.modalTitle, {color: theme.text}]}>Change Password</Text>
              <TouchableOpacity onPress={() => setEditPasswordModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalContent}>
              <Text style={[styles.inputLabel, {color: theme.text}]}>Current Password</Text>
              <TextInput
                style={[styles.input, {
                  backgroundColor: isDarkMode ? '#333' : '#f9f9f9',
                  borderColor: theme.border,
                  color: theme.text
                }]}
                placeholder="Current password"
                placeholderTextColor={theme.secondaryText}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
              />
              
              <Text style={[styles.inputLabel, {color: theme.text}]}>New Password</Text>
              <TextInput
                style={[styles.input, {
                  backgroundColor: isDarkMode ? '#333' : '#f9f9f9',
                  borderColor: theme.border,
                  color: theme.text
                }]}
                placeholder="New password"
                placeholderTextColor={theme.secondaryText}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />
              
              <Text style={[styles.inputLabel, {color: theme.text}]}>Confirm New Password</Text>
              <TextInput
                style={[styles.input, {
                  backgroundColor: isDarkMode ? '#333' : '#f9f9f9',
                  borderColor: theme.border,
                  color: theme.text
                }]}
                placeholder="Confirm new password"
                placeholderTextColor={theme.secondaryText}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
              
              <TouchableOpacity 
                style={[styles.saveButton, {backgroundColor: theme.primary}]}
                onPress={handleUpdatePassword}
              >
                <Text style={styles.saveButtonText}>Update Password</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
  nameContainer: {
    justifyContent: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  editButtonText: {
    fontWeight: '500',
  },
  section: {
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 15,
    borderBottomWidth: 1,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 15,
  },
  logoutText: {
    color: '#FF3B30',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    marginBottom: 5,
  },
  versionText: {
    fontSize: 12,
    marginTop: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalView: {
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  saveButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});