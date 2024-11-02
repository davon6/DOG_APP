// src/components/SlidingMenu.tsx
import React, { useEffect, useContext, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, PanResponder, Dimensions } from 'react-native';
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
  const { user } = useContext(UserContext);
  const [showPopup, setShowPopup] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const dispatch = useDispatch();

  // Pull conversations from Redux state
  const conversations = useSelector((state: RootState) => state.messaging.conversations);

  // Open popup for a selected conversation
  const openPopup = (conversationId: string) => {
    dispatch(setActiveConversation(conversationId));
    setCurrentConversationId(conversationId);
    setShowPopup(true);
  };

  // Close the popup
  const closePopup = () => {
    setShowPopup(false);
    setCurrentConversationId(null);
  };

  useEffect(() => {
    // Close the popup if the active menu changes
    closePopup();
  }, [activeMenu]);

  const initiateConversation = async () => {
    // Example conversation initiation
    const conversationId = await dispatch(startConversation(user.userName, 'jean'));
    if (conversationId) {
      openPopup(conversationId);
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
          </View>
        );

      case 'msg':
        return (
          <View style={[styles.menuContent, { backgroundColor: 'rgba(173, 216, 230, 0.8)' }]}>
            <Text style={styles.menuTitle}>Messages</Text>

            {conversations.length > 0 ? (
              conversations.map((conversation) => (
                <TouchableOpacity
                  key={conversation.id}
                  style={styles.conversationButton}
                  onPress={() => openPopup(conversation.id)}
                >
                  <Text style={styles.buttonText}>Conversation with {conversation.participantName}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noConversationText}>No conversations yet</Text>
            )}

            <TouchableOpacity style={styles.conversationButton} onPress={initiateConversation}>
              <Text style={styles.buttonText}>Start Conversation with Rivka</Text>
            </TouchableOpacity>
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
      {showPopup && currentConversationId && (
        <MessagePopup conversationId={currentConversationId} onClose={closePopup} senderUsername={user.userName}/>
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
  conversationButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  noConversationText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
});

export default SlidingMenu;
