import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Updated import

const UserInfoPopup = ({ user, onClose }) => {
  // Mock functions for the actions
  const handleAddFriend = () => {
    Alert.alert('Friend Request Sent', `You sent a friend request to ${user.username}`);
  };

  const handleSendMessage = () => {
    Alert.alert('Message Sent', `You sent a message to ${user.username}`);
  };

  return (
    <View style={styles.container}>
      {/* Header with Action Icons */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleAddFriend} style={styles.iconButton}>
          <Icon name="user-plus" size={24} color="green" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSendMessage} style={styles.iconButton}>
          <Icon name="envelope" size={24} color="blue" />
        </TouchableOpacity>
      </View>

      {/* User Details */}
      <View style={styles.content}>
        <Text style={styles.title}>{user.dog.dogName}</Text>
        <Text style={styles.field}>Doggy Color: {user.dog.dogColor}</Text>
        <Text style={styles.field}>Doggy Weight: {user.dog.dogWeight}</Text>
        <Text style={styles.field}>Doggy Race: {user.dog.dogRace}</Text>
        <Text style={styles.field}>Doggy Vibe: {user.dog.dogPersonality}</Text>
        <Text style={styles.field}>Mum or Dad: {user.username}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '70%',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  iconButton: {
    marginHorizontal: 10,
  },
  content: {
    marginTop: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  field: {
    fontSize: 16,
    marginVertical: 2,
  },
});

export default UserInfoPopup;
