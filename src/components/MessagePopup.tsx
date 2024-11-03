// src/components/MessagePopup.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux';
import { messagingSelectors, sendMessage, fetchMessages } from '@/redux/slices/messagingSlice';

interface MessagePopupProps {
  conversationId: string;
  senderUsername: string;
  receiverUsername: string;
  onClose: () => void;
}

const MessagePopup: React.FC<MessagePopupProps> = ({ conversationId, senderUsername, receiverUsername, onClose }) => {
  const [messageText, setMessageText] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);
  const dispatch = useDispatch();

  const messages = useSelector(state => messagingSelectors.selectMessagesForConversation(conversationId)(state) || []);
  const hasMore = useSelector(state => messagingSelectors.selectHasMoreForConversation(state, conversationId));

 // Sort messages by timestamp
  const sortedMessages = messages.slice().sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  useEffect(() => {
    if (messages.length === 0) {
      dispatch(fetchMessages(conversationId, 0, 20));
    }
  }, [conversationId, dispatch, messages.length]);

  const handleSendMessage = async () => {
    if (messageText.trim() === '') return;
    try {
      await dispatch(sendMessage(conversationId, senderUsername, messageText));
      setMessageText('');
        dispatch(fetchMessages(conversationId, 0, 20));
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("Failed to send message");
    }
  };

  const handleLoadMore = async () => {
    if (hasMore && !loadingMore) {
      setLoadingMore(true);
      try {
        await dispatch(fetchMessages(conversationId, messages.length, 20));
      } catch (error) {
        console.error("Error loading more messages:", error);
        Alert.alert("Failed to load more messages");
      } finally {
        setLoadingMore(false);
      }
    }
  };

  // Optimized component for rendering each message
  const MessageItem = React.memo(({ item, isOwnMessage }) => (
    <View style={[styles.messageContainer, isOwnMessage ? styles.ownMessage : styles.otherMessage]}>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.timestampText}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
    </View>
  ));

  const renderFooter = () => {
    if (!hasMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#4CAF50" />
      </View>
    );
  };

  return (
    <View style={styles.popupContainer}>
      <View style={styles.popupHeader}>
        <Text style={styles.headerText}>Conversation with {receiverUsername}</Text>
        <TouchableOpacity onPress={onClose}>
          <Icon name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortedMessages.reverse()}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <MessageItem item={item} isOwnMessage={item.senderUsername === senderUsername} />
        )}
        contentContainerStyle={styles.messagesContainer}
        inverted
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={10}
        getItemLayout={(data, index) => ({ length: 60, offset: 60 * index, index })}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={messageText}
          onChangeText={setMessageText}
          onSubmitEditing={handleSendMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  popupContainer: {
    position: 'absolute',
    top: '10%',
    left: '5%',
    width: '90%',
    height: '80%',
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
    flexGrow: 1,
    paddingVertical: 10,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
  },
  ownMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#f1f1f1',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  timestampText: {
    fontSize: 10,
    color: '#666',
    alignSelf: 'flex-end',
    marginTop: 2,
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
  footer: {
    paddingVertical: 10,
  },
});

export default MessagePopup;
