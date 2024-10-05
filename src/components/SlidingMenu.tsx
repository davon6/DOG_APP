import React from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, PanResponder, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window'); // Add this to define 'width'

const SlidingMenu = ({ activeMenu, menuAnim, closeMenu }) => {

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dx < -20,
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dx < 0) {
        menuAnim.setValue(gestureState.dx);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx < -width * 0.02) {  // Now 'width' is correctly defined
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
                    <Text style={styles.menuText}>Username: JohnDoe</Text>
                    <Text style={styles.menuText}>Doggy Name: Max</Text>
                    <Text style={styles.menuText}>Doggy Color: Brown</Text>
                    <Text style={styles.menuText}>Doggy Weight: 15 kg</Text>
                    <Text style={styles.menuText}>Doggy Race: Golden Retriever</Text>
                    <Text style={styles.menuText}>Doggy Vibe: Playful</Text>
                  </View>
                );
      case 'msg':
              return (
                <View style={[styles.menuContent, { backgroundColor: 'rgba(173, 216, 230, 0.8)' }]}>
                  <Text style={styles.menuTitle}>Messages</Text>
                  <Text style={styles.menuText}>Group Chat</Text>
                  <Text style={styles.menuText}>Individual Contacts</Text>
                </View>
              );
            case 'search':
              return (
                <View style={[styles.menuContent, { backgroundColor: 'rgba(144, 238, 144, 0.8)' }]}>
                  <Text style={styles.menuTitle}>Search Options</Text>
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
    <Animated.View
      style={[styles.menu, { transform: [{ translateX: menuAnim }] }]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity onPress={closeMenu} style={styles.closeButton}>
        <Icon name="close" size={30} color="#fff" />
      </TouchableOpacity>
      {renderMenuContent()}
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
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
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
});

export default SlidingMenu;
