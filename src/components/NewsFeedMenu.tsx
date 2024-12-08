import React, { useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import notificationTemplates from './notifications.json';

const notificationText = notificationTemplates['friend_request']
    .replace('{demanding_user}', 'John Doe');
console.log(notificationText);

const { width } = Dimensions.get('window');

const NewsFeedMenu = () => {
  const [menuAnim] = useState(new Animated.Value(width));
  const [isOpen, setIsOpen] = useState(false);

  const MENU_WIDTH = 300; // Define the open menu width

  const toggleMenu = () => {
    if (isOpen) {
      Animated.timing(menuAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsOpen(false));
    } else {
      Animated.timing(menuAnim, {
        toValue: width - MENU_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsOpen(true));
    }
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ translateX: menuAnim }] }]}>
      {/* Menu Handle */}
      <TouchableOpacity style={styles.handle} onPress={toggleMenu}>
        <Text style={styles.handleText}>{isOpen ? '>' : '<'}</Text>
      </TouchableOpacity>

      {/* Menu Content */}
      <View style={[styles.menuContent, { width: MENU_WIDTH }]}>
        <Text style={styles.placeholderText}>
          This is where all the mechanic will be implemented. The content will now fully fit within the menu's width and wrap as necessary.
        </Text>
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
    paddingHorizontal: 20, // Padding inside the menu for text
    backgroundColor: 'white', // Optional: solid background for better visibility
    alignSelf: 'flex-start', // Prevent centering the menu content outside the menu
    justifyContent: 'center', // Center content vertically
  },
  placeholderText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'left', // Align text to the left for better reading
    lineHeight: 22, // Adjust for better readability
  },
});

export default NewsFeedMenu;
