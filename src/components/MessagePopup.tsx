import React, { useEffect, useState, useMemo, useRef  } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux';
import {
  messagingSelectors,
  sendMessage,
  fetchMessages,
  startConversation,
  markMessagesAsRead,
  updateMessagesAsReadAPI
} from '@/redux/slices/messagingSlice';
import { RootState } from '@/redux/store';
//msgSliceTest

import { selectMessagesForConversation, selectHasMoreForConversation } from '@/redux/selectorsTest';
import styles from '@/theme/popupStyle'

interface MessagePopupProps {
  conversationId?: string; // Optional for new chat mode
  senderUsername: string;
  receiverUsername?: string; // Optional for new chat mode
  onClose: () => void;
}

const MessagePopup: React.FC<MessagePopupProps> = ({
  conversationId,
  senderUsername,
  receiverUsername,
  onClose,
}) => {
  const [messageText, setMessageText] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);
  const [newReceiverUsername, setNewReceiverUsername] = useState(receiverUsername || '');
  const [newChatMode, setNewChatMode] = useState(!conversationId);
  const dispatch = useDispatch();

   const flatListRef = useRef<FlatList>(null);

  // Use normalized selector for messages
const messagesSelector = useMemo(() => selectMessagesForConversation(conversationId), [conversationId]);
const messages = useSelector(messagesSelector);

/*
useEffect(() => {
  console.log('------------------->>>>>>>>>>>>>>>>>>Messages:', messages);
}, [messages]);
*/

const hasMore = useSelector((state) =>
  conversationId
    ? selectHasMoreForConversation(conversationId)(state)
    : false
);
/*
useEffect(() => {
  console.log('Has More:', hasMore);
}, [hasMore]);

*/
  // Sort messages by timestamp
  const sortedMessages = React.useMemo(
    () => messages.slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
    [messages]
  );

  // Fetch messages when component mounts or conversationId changes
  const handleSendMessage = async () => {
    if (messageText.trim() === '') return;

    try {
      if (newChatMode) {
        // Start a new conversation
        const newConversationId = await dispatch(startConversation(senderUsername, newReceiverUsername));
        if (newConversationId) {
          setNewChatMode(false);
          setNewReceiverUsername('');
        }
      }
  console.log("-------------<<<<<<< yes here >>>>>>>-------------")

      // Send a message in the current conversation
      await dispatch(sendMessage(conversationId || '', senderUsername, messageText));
      setMessageText('');

       setTimeout(() => {
            flatListRef.current?.scrollToOffset({
              offset: 0, // Scroll to the top of the data (visually the bottom for inverted lists)
              animated: true,
            });
          }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Failed to send message');
    }
  };
const handleLoadMore = async () => {
  if (hasMore && !loadingMore) {
    setLoadingMore(true);
    try {

    //console.log("-------------<<<<<<< yes here >>>>>>>-------------")

      await dispatch(fetchMessages(conversationId || '', messages.length, 20,senderUsername ));
    } catch (error) {
      console.error('Error loading more messages:', error);
      Alert.alert('Failed to load more messages');
    } finally {
      setLoadingMore(false);
    }
 }
};

/* has worked very well !!!! just a virtualised log
  const MessageItem = React.memo(({ item, isOwnMessage }) => (
    <View style={[styles.messageContainer, isOwnMessage ? styles.ownMessage : styles.otherMessage]}>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.timestampText}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
    </View>
  ));
  */

 const MessageItem = React.memo(({ text, timestamp, isOwnMessage, isRead }) => (
   <View
     style={[
       styles.messageContainer,
       isOwnMessage ? styles.ownMessage : styles.otherMessage,
     ]}
   >
     <Text
       style={[
         styles.messageText,
        /* !isRead && { fontWeight: 'bold' }, */// Bold if the message is unread
       ]}
     >
       {text}
     </Text>
     <Text style={styles.timestampText}>
       {new Date(timestamp).toLocaleTimeString()}
     </Text>
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

useEffect(() => {
  if (conversationId) {

//console.log("----------->>> workflow message as read ",JSON.stringify(messages),"  ", senderUsername)

    // Filter for messages that are received and not read
    const unreadReceivedMessages = messages.filter(
      (msg) => !msg.isRead && msg.senderUsername !== senderUsername // Ensure the message was sent by the other user
    );

     // Optional: Update hasUnread in the Redux state
          dispatch({
            type: 'messaging/updateHasUnread', // Add this action in your slice
            payload: { conversationId, hasUnread: false },
          });
      // Mark the messages as read in the local state
dispatch(markMessagesAsRead(conversationId));

    if (unreadReceivedMessages.length > 0) {
      // Update the server to mark messages as read
      dispatch(updateMessagesAsReadAPI(conversationId));
    }
  }
}, [conversationId, messages, dispatch, senderUsername]);


  return (
    <View style={styles.popupContainer}>
      <View style={styles.popupHeader}>
        <Text style={styles.headerText}>
          {newChatMode ? 'Start a New Conversation' : `Conversation with ${receiverUsername}`}
        </Text>
        <TouchableOpacity onPress={onClose}>
          <Icon name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {newChatMode ? (
        <View style={styles.newChatContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter username to start chat"
            value={newReceiverUsername}
            onChangeText={setNewReceiverUsername}
          />
        </View>
      ) : (
        <FlatList
        ref={flatListRef}
            data={sortedMessages || []} // Ensure data is always an array
            keyExtractor={(item, index) => (item?.id ? item.id.toString() : index.toString())}

         // solution a re-render ? keyExtractor={(item) => item.id}
          /* same works well !
          renderItem={({ item }) => (
            <MessageItem item={item} isOwnMessage={item.senderUsername === senderUsername} />
          )}
          */
           // When passing data:
          renderItem={({ item }) =>
            item ? (
              <MessageItem
                text={item.text}
                timestamp={item.timestamp}
                isOwnMessage={item.senderUsername === senderUsername}
                isRead={item.isRead}
              />
            ) : null // Safeguard: If item is undefined or null, render nothing
          }


          contentContainerStyle={styles.messagesContainer}
          inverted
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
        //  windowSize={10}
          windowSize={15}
       //   getItemLayout={(data, index) => ({ length: 60, offset: 60 * index, index })}
       getItemLayout={(data, index) => ({
         length: 80, // Adjust based on your `styles.messageContainer`
         offset: 80 * index,
         index,
       })}
        />
      )}

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

export default MessagePopup;
