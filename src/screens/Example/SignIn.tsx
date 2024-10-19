// src/screens/SignInScreen.tsx

import axios from 'axios';
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SignInScreenProps {
  navigation: any; // Adjust type as necessary based on your navigation setup
}

const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSignIn = async () => {
    try {
      const response = await axios.post('http://172.20.10.8:3000/api/users/signin', { username, password });



      const { token } = response.data;

      //console.log("token 1 "+ response.data.token);
     // console.log("token 2 "+ response.data.refreshToken);

      //JSON.stringify(response.data)

//console.log("alors alors --->"+ JSON.stringify(response.data.user_info));

      try {
         await AsyncStorage.setItem('userToken', response.data.token);
         await AsyncStorage.setItem('refreshToken', response.data.refreshToken);

         await AsyncStorage.setItem('user_info', JSON.stringify(response.data.user_info));


         console.log('Tokens stored successfully'); // Log success
       } catch (storageError) {
         console.error('Failed to store the token:', storageError); // Log the error
       }



      // Navigate to the home screen or wherever you want to go
      navigation.navigate('Example'); // Adjust this based on your navigation structure



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
