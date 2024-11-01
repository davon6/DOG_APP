import React, { useEffect, useContext, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, PanResponder, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { UserContext } from '@/services/Context';
import MessagePopup from '@/components/MessagePopup';

const { width } = Dimensions.get('window');

const SlidingMenu = ({ activeMenu, menuAnim, closeMenu }) => {
  const { user } = useContext(UserContext);
  const [showPopup, setShowPopup] = useState(false); // State to control the popup

  const openPopup = () => setShowPopup(true);
  const closePopup = () => setShowPopup(false);
			const hobbies = [
  'Playing Fetch', 'Running', 'Swimming', 'Digging', 'Chewing Toys',
  'Tug-of-War', 'Hide and Seek', 'Agility Training', 'Playing with Balls',
  'Socializing with Other Dogs', 'Hiking', 'Napping', 'Chasing Squirrels',
  'Frisbee', 'Cuddling', 'Obstacle Courses', 'Exploring New Places',
  'Learning Tricks', 'Playing in the Water', 'Walking on Leash'
];
/*
function fixHobbies () {

    return;
    };
*/														

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
                  if (user) {
                       return (
                         <View style={[styles.menuContent, { backgroundColor: 'rgba(255, 192, 203, 0.8)' }]}>
                           <Text style={styles.menuTitle}>User Profile</Text>
                           <Text style={styles.menuText}>Username: {user.userName}</Text>
                           <Text style={styles.menuText}>Doggy Name: {user.dogName}</Text>
                           <Text style={styles.menuText}>Doggy Age: {user.dogAge}</Text>
                           <Text style={styles.menuText}>Doggy Color: {user.dogColor}</Text>
                           <Text style={styles.menuText}>Doggy Size: {user.dogSize}</Text>
                           <Text style={styles.menuText}>Doggy Weight: {user.dogWeight}</Text>
                           <Text style={styles.menuText}>Doggy Race: {user.dogRace}</Text>
                           <Text style={styles.menuText}>Doggy Personality: {user.dogPersonality}</Text>
                           <Text style={styles.menuText}>Doggy Hobbies: {user.dogHobbies}</Text>
                         </View>
                       );
                     }
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
            <TouchableOpacity style={styles.conversationButton} onPress={openPopup}>
              <Text style={styles.buttonText}>Conversation with John Doe</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.conversationButton} onPress={openPopup}>
              <Text style={styles.buttonText}>Group Chat</Text>
            </TouchableOpacity>
          </View>
        );
		  case 'search':
              return (
                <View style={[styles.menuContent, { backgroundColor: 'rgba(144, 238, 144, 0.8)' }]}>
                  <Text style={styles.menuTitle}>Search Options</Text>
                   <Text style={styles.menuText}>New doggies friends</Text>
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
      {showPopup && <MessagePopup onClose={closePopup} />}
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
});

export default SlidingMenu;
