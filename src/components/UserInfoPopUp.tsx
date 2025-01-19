import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useMessagePopup } from '@/services';
import { startConversation } from '@/redux/slices/messagingSlice';
import { useDispatch } from 'react-redux';

interface UserInfoPopupProps {
  user: any; // Replace with your user type
  onClose: () => void;
  username: string; // Added this explicitly for clarity
}

const UserInfoPopup: React.FC<UserInfoPopupProps> = ({ user, onClose, username }) => {
  const { showMessagePopup } = useMessagePopup();
  const dispatch = useDispatch();

  const handleOpenPopup = async () => {
    console.log('Opening message popup...',user.username, username);
      const conversationId = await dispatch(startConversation(username, user.username));

    console.log('Opening message popup...');
    showMessagePopup({
      senderUsername: username,
      receiverUsername: user.username,
      conversationId :conversationId,
      onClose: () => {
        console.log('Message popup closed');
      },
    });
 onClose();
  };

  const handleAddFriend = () => {
    Alert.alert('Friend Request Sent', `You sent a friend request to ${user.username}`);
  };

  return (
    <View style={styles.container}>
      {/* Header with Action Icons */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleAddFriend} style={styles.iconButton}>
          <Icon name="user-plus" size={24} color="green" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleOpenPopup} style={styles.iconButton}>
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
