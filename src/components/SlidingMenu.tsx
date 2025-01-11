import React, { useEffect, useContext, useState } from 'react';
import {Alert} from 'react-native';
import { View, Text, StyleSheet, Animated, TouchableWithoutFeedback,TouchableOpacity, PanResponder, Dimensions, ScrollView, TextInput, } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RootState } from '@/redux/store';
import { UserContext } from '@/services/Context';
import NewDoggiePopup from './NewDoggiePopup';
import {updateUser as updtU }  from '@/api/apiService';
import { Toast } from 'react-native-toast-message';
import DogProfile from './DogProfile';
import Conversations from './Conversations';

import { selectConversationsList } from '@/redux/selectors';

const { width } = Dimensions.get('window');

interface SlidingMenuProps {
  activeMenu: string;
  menuAnim: Animated.Value;
  closeMenu: () => void;
}

const SlidingMenu: React.FC<SlidingMenuProps> = ({ activeMenu, menuAnim, closeMenu, data, handleLogout,    triggerSignOutPopup, friends }) => {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const { user, updateUser, clearUser } = useContext(UserContext);
    const dispatch = useDispatch();
    const users = useSelector((state: RootState) => state.messaging.users);
    const [showDoggiePopup, setShowDoggiePopup] = useState(false);
    const handleSelectDoggie = (doggieName: string) => {
    console.log(`Selected doggie: ${doggieName}`);
    setShowDoggiePopup(false);
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
         setShowDoggiePopup(false);
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

    switch (activeMenu) {
	     case 'user':
               return (
                     <DogProfile user={user} updateUser={updateUser}
                           style={[styles.menuContent, { backgroundColor: 'rgba(255, 192, 203, 0.8)' }]}
                         />
                    );
          case 'msg':
            return (
                <Conversations
                    user={user}
                    friends={friends}
                  />
            );
   case 'search':
        return (
          <View style={[styles.menuContent, { backgroundColor: 'rgba(144, 238, 144, 0.8)' }]}>
            <Text style={styles.menuTitle}>Search Options</Text>
          <TouchableOpacity
                   style={styles.startChatButton}
                   onPress={() => setShowDoggiePopup(true)}
                 >
                   <Text style={styles.buttonText}>New Doggie Friends</Text>
                 </TouchableOpacity>
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

      {/* Buttons for Logout and Signout */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.logoutButton}   onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signoutButton} onPress={() => console.log('Signout pressed')}>
          <Text style={styles.buttonText} onPress={triggerSignOutPopup}>Signout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
      default:
        return null;
    }
  };

  return (
    <Animated.View style={[styles.menu, { transform: [{ translateX: menuAnim }] }]} {...panResponder.panHandlers}>
      {renderMenuContent()}

         {showDoggiePopup && (
           <NewDoggiePopup
             onClose={() => setShowDoggiePopup(false)}
             onSelectDoggie={handleSelectDoggie}
             userName={user.userName}
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
    width: '65%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Default white background with slight opacity
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
  menuText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: '#FF6347', // Tomato red
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  signoutButton: {
    backgroundColor: '#4682B4', // Steel blue
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
});

export default SlidingMenu;
