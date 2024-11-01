// MessagePopup.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const MessagePopup = ({ onClose }) => {
  // Sample hardcoded messages
  const messages = [
    { id: '1', text: 'Hello! How are you?' },
    { id: '2', text: 'I’m good, thanks! How about you?' },
    { id: '3', text: 'Doing well, thanks for asking.' },
  ];

  return (
    <View style={styles.popupContainer}>
      <View style={styles.popupHeader}>
        <Text style={styles.headerText}>Conversation</Text>
        <TouchableOpacity onPress={onClose}>
          <Icon name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text style={styles.messageText}>{item.text}</Text>}
        contentContainerStyle={styles.messagesContainer}
      />

      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="Type a message..." />
        <TouchableOpacity style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  popupContainer: {
    position: 'absolute',
    top: '25%',
    left: '10%',
    width: '80%',
    height: '50%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    zIndex: 2000,
  },
  popupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  messagesContainer: {
    paddingVertical: 10,
    flexGrow: 1,
  },
  messageText: {
    padding: 8,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
    marginVertical: 5,
    alignSelf: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginLeft: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default MessagePopup;
