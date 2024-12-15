// src/screens/SignInScreen.tsx
import axios from 'axios';
import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '@/services/Context';
import { useDispatch } from 'react-redux';
import { fetchAllConversations, fetchUsers } from '@/redux/slices/messagingSlice';
import { fetchNotifications } from '@/redux/slices/notificationsSlice';  // Import the fetchNotifications action

interface SignInScreenProps {
  navigation: any; // Adjust type as necessary based on your navigation setup
}

const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { updateUser } = useContext(UserContext);
  const dispatch = useDispatch();

  const handleSignIn = async () => {
    try {
      const response = await axios.post('http://192.168.30.1:3000/api/users/signin', { username, password });

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
        USER_NAME: username,
      };

      updateUser(finalUser);

      // Dispatch the actions after successful sign-in
      dispatch(fetchUsers());
      dispatch(fetchAllConversations(username));
      // Fetch notifications after sign-in
      dispatch(fetchNotifications(username));  // Fetch notifications for the user

      // Navigate to the home screen or wherever you want to go
      navigation.navigate('Example',  username ); // Adjust this based on your navigation structure
    } catch (error) {
      setError('Invalid username or password');
    }
  };

  return (
    <View style={styles.container}>
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
      <Button title="Sign In" onPress={handleSignIn} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});

export default SignInScreen;
