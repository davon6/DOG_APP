import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import notificationTemplates from './notifications.json';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store'; // Import RootState
import { updateNotificationResponse } from '@/redux/slices/notificationsSlice';

const { width } = Dimensions.get('window');

const NewsFeedMenu = ({ isOpen, toggleMenu }) => {
  const [menuAnim] = useState(new Animated.Value(width));
  const MENU_WIDTH = 300; // Define the open menu width

  const dispatch = useDispatch(); // Access Redux dispatch

  // Fetch notifications directly from Redux store
  const notifications = useSelector((state: RootState) => state.notifications.list);
  console.log('Notifications from Redux store:', notifications);

  useEffect(() => {
    if (isOpen) {
      Animated.timing(menuAnim, {
        toValue: width - MENU_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(menuAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen]);

  // Friend request response handler
  const handleFriendRequestResponse = (notificationId: number, response: 'accept' | 'decline') => {
    const notification = notifications.find((n) => n.id === notificationId);
    if (!notification) return;

    const newText =
      response === 'accept'
        ? notificationTemplates.friend_accepted.replace('{demanding_user}', notification.relatedUsername)
        : notificationTemplates.friend_declined.replace('{demanding_user}', notification.relatedUsername);

    dispatch(updateNotificationResponse({ notificationId, response, newText }));
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ translateX: menuAnim }] }]}>
      {/* Menu Handle */}
      <TouchableOpacity style={styles.handle} onPress={toggleMenu}>
        <Text style={styles.handleText}>{isOpen ? '>' : '<'}</Text>
      </TouchableOpacity>

      {/* Menu Content */}
      <View style={[styles.menuContent, { width: MENU_WIDTH }]}>
        <Text style={styles.placeholderText}>NewsFeed</Text>

        {/* Display notifications */}
       <ScrollView style={styles.notificationList}>
         {notifications.length === 0 ? (
           <Text style={styles.noNotifications}>No notifications yet.</Text>
         ) : (
           notifications.map((notification) => {
             const notificationTemplate = notificationTemplates[notification.type];
             if (notificationTemplate) {
               // Use the updated text from Redux or fall back to the template
               const notificationText =
                 notification.text ||
                 notificationTemplate.replace('{demanding_user}', notification.relatedUsername);

               let responseButtons = null;

               // Check if the notification is a friend request and not already responded
               if (notification.type === 'friend_request' && !notification.responded) {
                 responseButtons = (
                   <View style={styles.responseButtons}>
                     <TouchableOpacity
                       style={[styles.button, styles.acceptButton]}
                       onPress={() => handleFriendRequestResponse(notification.id, 'accept')}
                     >
                       <Text style={styles.buttonText}>Accept</Text>
                     </TouchableOpacity>
                     <TouchableOpacity
                       style={[styles.button, styles.declineButton]}
                       onPress={() => handleFriendRequestResponse(notification.id, 'decline')}
                     >
                       <Text style={styles.buttonText}>Decline</Text>
                     </TouchableOpacity>
                   </View>
                 );
               }

               return (
                 <View key={notification.id} style={styles.notificationItem}>
                   <Text style={styles.notificationText}>{notificationText}</Text>
                   {responseButtons}
                   <Text style={styles.timestamp}>{notification.createdAt}</Text>
                 </View>
               );
             }
             return null;
           })
         )}
       </ScrollView>

      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: width, // Full screen width to enable sliding effect
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent background
  },
  handle: {
    position: 'absolute',
    left: -30, // Position handle outside the closed menu
    top: '50%',
    width: 30,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  handleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuContent: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  placeholderText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  notificationList: {
    flex: 1,
    marginTop: 20,
  },
  notificationItem: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  notificationText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  noNotifications: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  responseButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  declineButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default NewsFeedMenu;
