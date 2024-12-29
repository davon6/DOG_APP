import React, { useState, useEffect, useContext } from 'react';
import {View,Text,StyleSheet,TouchableOpacity,Animated,Easing,TextInput,} from 'react-native';
import LinearGradientComponent from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '@/services/Context';
import { useDispatch } from 'react-redux';
import { fetchAllConversations, fetchUsers } from '@/redux/slices/messagingSlice';
import { fetchNotifications } from '@/redux/slices/notificationsSlice';
import { getFriends as getFri } from '@/api/apiService';

const Welcome: React.FC = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { updateUser } = useContext(UserContext);
  const dispatch = useDispatch();
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  const [treeMovement] = useState(new Animated.Value(0)); // For horizontal movement of trees
  const [treeScale] = useState(new Animated.Value(1)); // For scaling trees to create depth

  useEffect(() => {
    if (password && typingTimeout) {
      clearTimeout(typingTimeout);
    }

    if (password) {
      const timeout = setTimeout(() => {
        handleSubmit();
      }, 2000); // 2 seconds delay after typing stops
      setTypingTimeout(timeout);
    }
  }, [password]);


   useEffect(() => {
     // Animate trees in the background for a parallax effect
     Animated.loop(
       Animated.sequence([
         Animated.timing(treeMovement, {
           toValue: 1,
           duration: 10000,
           easing: Easing.linear,
           useNativeDriver: true,
         }),
         Animated.timing(treeMovement, {
           toValue: 0,
           duration: 0,
           useNativeDriver: true,
         }),
       ])
     ).start();

     // Animate the scaling of trees to simulate 3D depth
     Animated.loop(
       Animated.sequence([
         Animated.timing(treeScale, {
           toValue: 1.2,
           duration: 3000,
           easing: Easing.ease,
           useNativeDriver: true,
         }),
         Animated.timing(treeScale, {
           toValue: 1,
           duration: 3000,
           easing: Easing.ease,
           useNativeDriver: true,
         }),
       ])
     ).start();
   }, []);

     const treeStyle = {
       transform: [
         { translateX: treeMovement.interpolate({ inputRange: [0, 1], outputRange: [0, -500] }) },
         { scale: treeScale },
       ],
     };

  const handleSubmit = async () => {
    console.log('Form submitted', { username, password });
     try {



          const response = await axios.post('http://172.20.10.2:3000/api/users/signin', { username, password });

          try {
            await AsyncStorage.setItem('userToken', response.data.token);
            await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
            await AsyncStorage.setItem('user_info', JSON.stringify(response.data.dogInfo));

            console.log('Tokens stored successfully');
          } catch (storageError) {
            console.error('Failed to store the token:', storageError);
          }

          const finalUser = {
            ...response.data.dogInfo,
            userName: username,
          };

          updateUser(finalUser);

          // Dispatch the actions after successful sign-in
          dispatch(fetchUsers());
          dispatch(fetchAllConversations(username));
          // Fetch notifications after sign-in
          dispatch(fetchNotifications(username));  // Fetch notifications for the user



          const friends = await getFri(username) ;

          console.log("messing with firends now");
          console.log("---> ",friends);
    console.log("here problem")

    let data = [username, friends];

          // Navigate to the home screen or wherever you want to go
          navigation.navigate('Example',  data); // Adjust this based on your navigation structure
        } catch (error) {
          setError('Invalid username or password');
        }
  };

  return (
    <View style={styles.container}>
      {/* Trees on the left */}
      <View style={styles.leftContainer}>
       {/* Background Trees */}
       <Animated.View style={[styles.tree, treeStyle]}>
         {/* Add more trees as needed */}
         <View style={[styles.treeElement, { left: 50, top: 100 }]}>
           <Text style={styles.treeText}>🌳</Text>
         </View>
         <View style={[styles.treeElement, { left: 200, top: 150 }]}>
           <Text style={styles.treeText}>🌲</Text>
         </View>
       </Animated.View>
      </View>

      {/* Center section */}
      <View style={styles.centerContainer}>
        <TextInput
          placeholder="Username"
          onChangeText={setUsername}
          value={username}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
          style={styles.input}
        />

        <View style={styles.linkContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.linkText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.linkText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Dog animation on the right */}
      <View style={styles.rightContainer}>
        <LottieView
          source={require('./dog.json')} // Replace with your Lottie JSON file
          autoPlay
          loop
          style={styles.dogAnimation}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  leftContainer: {
    flex: 1,
    alignItems: 'center',
  },
  centerContainer: {
    flex: 2,
    alignItems: 'center',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'center',
  },
  treeText: {
    fontSize: 50,
    color: '#228B22',
  },
  dogAnimation: {
    width: 200,
    height: 200,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 25,
    width: 300,
    fontSize: 16,
    height : 80
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
  },
  linkText: {
    color: '#00b4d8',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default Welcome;
