import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
} from 'react-native';
import { signOut as signOutUser } from '@/api/apiService';


interface SignOutPopupProps {
  onClose: () => void;
}

const SignOutPopup: React.FC<SignOutPopupProps> = ({ onClose, closeMenu, handleLogout, name }) => {

     closeMenu();

  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Trigger the zoom-in animation when the component mounts
    Animated.timing(scaleAnim, {
      toValue: 1, // Scale up to full size
      duration: 200, // 0.5 seconds
      useNativeDriver: true, // Use native driver for better performance
    }).start();
  }, [scaleAnim]);

  const handleSignOut = async () => {
 var response = await signOutUser(name);

 //console.log(response.status)
    handleLogout()
    onClose(); // Close the popup after the alert
  };

  return (
    <Animated.View
      style={[
        styles.popupContainer,
        { transform: [{ scale: scaleAnim }] }, // Apply scaling animation
      ]}
    >
      <View style={styles.popupContent}>
        <Text style={styles.messageText}>Time has come, yeah? 😊</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.noButton} onPress={onClose}>
            <Text style={styles.noButtonText}>No</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.yesButton} onPress={handleSignOut}>
            <Text style={styles.yesButtonText}>Yes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  popupContainer: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    zIndex: 2000,
  },
  popupContent: {
    alignItems: 'center',
  },
  messageText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  noButton: {
    flex: 1,
    padding: 10,
    marginRight: 5,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
    alignItems: 'center',
  },
  noButtonText: {
    fontSize: 16,
    color: '#333',
  },
  yesButton: {
    flex: 1,
    padding: 10,
    marginLeft: 5,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    alignItems: 'center',
  },
  yesButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default SignOutPopup;
