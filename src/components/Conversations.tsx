import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveConversation, startConversation } from '@/redux/slices/messagingSlice';
import { selectConversationsList } from '@/redux/selectors';
import { RootState } from '@/redux/store';
import MessagePopup from './MessagePopup';
import Icon from 'react-native-vector-icons/FontAwesome';

interface ConversationsProps {
  user: any; // Replace with your User type if available
  friends: any[]; // Replace with your Friends type if available
}

const Conversations: React.FC<ConversationsProps> = ({ user, friends }) => {
  const dispatch = useDispatch();
  const conversations = useSelector(selectConversationsList);
  const messages = useSelector((state: RootState) => state.messaging.messages);
/*
   useEffect(() => {
      console.log("Conversations updated:", conversations);
    }, [conversations]);

    useEffect(() => {
      console.log("Messages updated:", messages);
    }, [messages]);*/

//console.log("jesssssuuuuusssssss"+JSON.stringify(messages));

  const [showNewChatPopup, setShowNewChatPopup] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [newChatReceiver, setNewChatReceiver] = useState<string | null>(null);

  const openPopup = (conversationId?: string, receiverUsername?: string) => {
     console.log("---------------------->>>>>> we pen our openPopup",conversationId, receiverUsername)

    if (conversationId) {




      dispatch(setActiveConversation({ conversationId, otherUser: receiverUsername }));
      setCurrentConversationId(conversationId);
      setNewChatReceiver(receiverUsername);


    } else if (receiverUsername) {
      setNewChatReceiver(receiverUsername);
    }
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setCurrentConversationId(null);
    setNewChatReceiver(null);
  };

  const initiateConversation = async (username: string) => {
    if (!showPopup) {
 console.log("--------------------->>>>>>>>>>>>>>>   yes we have a conversation")

      const conversationId = await dispatch(startConversation(user.userName, username));
      if (conversationId) {


        openPopup(conversationId, username);
        setShowNewChatPopup(false);
      } else {
        setShowNewChatPopup(false);
        openPopup(undefined, username);
      }
    }
  };

  const NewChatPopup: React.FC<{ onClose: () => void; onSelectUser: (username: string) => void }> = ({ onClose, onSelectUser }) => (
    <View style={styles.popupContainer}>
      <View style={styles.popupHeader}>
        <Text style={styles.headerText}>Start a New Chat</Text>
        <TouchableOpacity onPress={onClose}>
          <Icon name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {friends && friends.length > 0 ? (
        friends.map((friend) => (
          <TouchableOpacity
            key={friend.username}
            style={styles.userButton}
            onPress={() => onSelectUser(friend.username)}
          >
            <Text style={styles.buttonText}>{friend.username}</Text>
          </TouchableOpacity>
        ))
      ) : (
        Alert.alert("No doggy friends yet, go on make some new.")
      )}
    </View>
  );

  const conversationList = Object.values(conversations);

  return (
    <View style={[styles.menuContent, { backgroundColor: 'rgba(173, 216, 230, 0.8)' }]}>
      <Text style={styles.menuTitle}>Messages</Text>
      <TouchableOpacity style={styles.startChatButton} onPress={() => setShowNewChatPopup(true)}>
        <Text style={styles.buttonText}>Start New Chat</Text>
      </TouchableOpacity>

      {conversationList.length > 0 ? (
        <ScrollView style={styles.conversationList}>
           {conversationList
               .filter((conversation) =>
                  Array.isArray(conversation.messages) && // Ensure it's an array
                  conversation.messages.length > 0 && // Ensure the array is not empty
                  conversation.messages.some((msg) => msg !== undefined)
                  )
                .map((conversation) => {
            const participantName = conversation.otherUser || 'Unknown User';
            const lastMessageId = conversation.messages[conversation.messages.length - 1];
             const lastMessage = conversation.messages
                    .map((msgId) => messages[msgId]) // Map message IDs to message objects
                    .filter((msg) => !!msg) // Filter out any undefined messages
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]; // Sort by timestamp (descending)

            if (!lastMessage) return null;

            return (
              <TouchableOpacity
                key={conversation.id}
                onPress={() => openPopup(conversation.id, participantName)}
              >
                <View style={styles.conversationItem}>
                  <Text style={styles.placeholderText}>Chat with {participantName}</Text>
                  <Text
                    style={[
                      styles.latestMessageText,
                      conversation.hasUnread && { fontWeight: 'bold' },
                    ]}
                  >
                    {lastMessage.text || 'No message text'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : (
        <Text style={styles.noConversationText}>No conversations yet</Text>
      )}

      {showPopup && (
        <MessagePopup
          conversationId={currentConversationId || undefined}
          senderUsername={user.userName}
          receiverUsername={newChatReceiver || undefined}
          onClose={closePopup}
        />
      )}
      {showNewChatPopup && (
        <NewChatPopup
          onClose={() => setShowNewChatPopup(false)}
          onSelectUser={(username) => initiateConversation(username)}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  menuContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-evenly',
  },
  menuTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  startChatButton: {
    backgroundColor: '#4682B4',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  conversationItem: {
    backgroundColor: '#ADD8E6',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#fff',
  },
  placeholderText: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  latestMessageText: {
    color: '#555',
    fontSize: 14,
    marginTop: 5,
  },
  noConversationText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
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
  userButton: {
    backgroundColor: '#87CEEB',
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
  },
});



export default Conversations;