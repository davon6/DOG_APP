import React, { useEffect, useContext, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableWithoutFeedback,TouchableOpacity, PanResponder, Dimensions, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { setActiveConversation, startConversation } from '@/redux/slices/messagingSlice';
import { RootState } from '@/redux/store';
import { UserContext } from '@/services/Context';
import MessagePopup from './MessagePopup';

const { width } = Dimensions.get('window');

interface SlidingMenuProps {
  activeMenu: string;
  menuAnim: Animated.Value;
  closeMenu: () => void;
}

const SlidingMenu: React.FC<SlidingMenuProps> = ({ activeMenu, menuAnim, closeMenu }) => {
const [showNewChatPopup, setShowNewChatPopup] = useState(false);

  const NewChatPopup: React.FC<{ onClose: () => void; onSelectUser: (username: string) => void }> = ({ onClose, onSelectUser }) => (
    <View style={styles.popupContainer}>
      <View style={styles.popupHeader}>
        <Text style={styles.headerText}>Start a New Chat</Text>
        <TouchableOpacity onPress={onClose}>
          <Icon name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {tempUsersPull.map((username) => (
        <TouchableOpacity key={username} style={styles.userButton} onPress={() => onSelectUser(username)}>
          <Text style={styles.buttonText}>{username}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

    const tempUsersPull = ['rivka', 'jean', 'james', 'marvin','g','m','r','u', 'eric'];
  const { user } = useContext(UserContext);
  const [showPopup, setShowPopup] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [newChatReceiver, setNewChatReceiver] = useState<string | null>(null);
  //const { user } = useContext(UserContext);
  const dispatch = useDispatch();

  // Get conversations as an object and users as an object
  const conversations = useSelector((state: RootState) => state.messaging.conversations);
  const users = useSelector((state: RootState) => state.messaging.users);
  const messages = useSelector((state: RootState) => state.messaging.messages);

  const openPopup = (conversationId?: string, receiverUsername?: string) => {

    if (conversationId) {
      dispatch(setActiveConversation(conversationId));
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

  useEffect(() => {
    closePopup();
  }, [activeMenu]);

  const initiateConversation = async (username: string) => {
    if (!showPopup) {
      const conversationId = await dispatch(startConversation(user.userName, username));
      if (conversationId) {
        openPopup(conversationId);
      } else {
	   setShowNewChatPopup(false);//DAVID
        openPopup(undefined, username); // New chat mode
      }
    }
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dx < -20,
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dx < 0) {
        menuAnim.setValue(gestureState.dx);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx < -width * 0.02) {
        closeMenu();
      } else {
        Animated.timing(menuAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const renderMenuContent = () => {
    // Convert conversations object to an array using Object.values()
    const conversationList = Object.values(conversations);

    switch (activeMenu) {
	   case 'user':
        return (
          <View style={[styles.menuContent, { backgroundColor: 'rgba(255, 192, 203, 0.8)' }]}>
            <Text style={styles.menuTitle}>User Profile</Text>
            <Text style={styles.menuText}>Username: {user?.userName ?? 'JohnDoe'}</Text>
																										
            <Text style={styles.menuText}>Doggy Name: {user?.dogName ?? 'Max'}</Text>
            <Text style={styles.menuText}>Doggy Color: {user?.dogColor ?? 'Brown'}</Text>
            <Text style={styles.menuText}>Doggy Weight: {user?.dogWeight ?? '15 kg'}</Text>
            <Text style={styles.menuText}>Doggy Race: {user?.dogRace ?? 'Golden Retriever'}</Text>
            <Text style={styles.menuText}>Doggy Vibe: {user?.dogPersonality ?? 'Playful'}</Text>
            <Text style={styles.menuText}>Doggy Friends: {'None, looser'}</Text>
          </View>
        );
      case 'msg':
        return (
          <View style={[styles.menuContent, { backgroundColor: 'rgba(173, 216, 230, 0.8)' }]}>
            <Text style={styles.menuTitle}>Messages</Text>

            <TouchableWithoutFeedback style={styles.startChatButton} onPress={() =>/* setShowPopup(true)*/setShowNewChatPopup(true)}>
              <Text style={styles.buttonText}>Start New Chat</Text>
            </TouchableWithoutFeedback>

            {conversationList.length > 0 ? (
              <ScrollView style={styles.conversationList}>
                {conversationList.map((conversation) => {
                  // Get the participant user ID(s) from the conversation
                  const participantIds = conversation.participants.filter((id) => id !== user.id);

                  // Get the participant's name from the users state using the ID
                  const participantName = conversation.otherUser || 'Unknown User';

                  // Get the last message for the conversation
                  const lastMessageId = conversation.messages[conversation.messages.length - 1];
                  const lastMessage = messages[lastMessageId];

                  // Only display conversations that have messages
                  if (!lastMessage) return null;

                  return (
                    <TouchableWithoutFeedback key={conversation.id} onPress={() => openPopup(conversation.id, participantName, )}>
                      <View style={styles.conversationItem}>
                        <View style={styles.chatHeader}>
                          {/* Light blue background for "Chat with [User]" */}
                          <Text style={styles.placeholderText}>Chat with {participantName}</Text>
                        </View>

                        {/* Last message text aligned to the left */}
                        <Text style={styles.latestMessageText}>
                          {lastMessage.text || 'No message text'}
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  );
                })}
              </ScrollView>
            ) : (
              <Text style={styles.noConversationText}>No conversations yet</Text>
            )}
          </View>
        );
   case 'search':
        return (
          <View style={[styles.menuContent, { backgroundColor: 'rgba(144, 238, 144, 0.8)' }]}>
            <Text style={styles.menuTitle}>Search Options</Text>
            <Text style={styles.menuText}>New doggie friends</Text>
            <Text style={styles.menuText}>Lost Items</Text>
            <Text style={styles.menuText}>Event Creation/Sharing</Text>
            <Text style={styles.menuText}>Forum</Text>
            <Text style={styles.menuText}>Business</Text>
          </View>
        );

      case 'gear':
        return (
          <View style={[styles.menuContent, { backgroundColor: 'rgba(255, 165, 0, 0.8)' }]}>
            <Text style={styles.menuTitle}>Settings</Text>
            <Text style={styles.menuText}>App Skin Choice</Text>
            <Text style={styles.menuText}>Language</Text>
							 
											   
					
				   
						   
				 
            <Text style={styles.menuText}>Password & Email Management</Text>
            <Text style={styles.menuText}>Logout</Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <Animated.View style={[styles.menu, { transform: [{ translateX: menuAnim }] }]} {...panResponder.panHandlers}>
      {renderMenuContent()}
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
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '60%',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    zIndex: 1000,
  },
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
  conversationItem: {
    backgroundColor: '#ADD8E6', // Light blue background for the entire item
    padding: 12, // Smaller padding for a cleaner look
    borderRadius: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#fff', // White border to differentiate items
  },
  chatHeader: {
    backgroundColor: '#ADD8E6', // Light blue for the header
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 5,
  },
  placeholderText: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center', // Keeping header text centered
  },
  latestMessageText: {
    color: '#555',
    fontSize: 14,
    textAlign: 'left', // Align last message text to the left
    marginTop: 5,
  },
  noConversationText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  conversationList: {
    flex: 1,
    marginTop: 20,
  },
  startChatButton: {
    backgroundColor: '#4682B4',
    padding: 8, // Smaller button
    borderRadius: 8,
    marginVertical: 8,
    alignSelf: 'center',
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
headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
   userButton: {
    backgroundColor: '#87CEEB',
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
  },

});

export default SlidingMenu;
