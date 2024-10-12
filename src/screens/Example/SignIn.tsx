// src/screens/SignInScreen.tsx

import axios from 'axios';
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';

interface SignInScreenProps {
  navigation: any; // Adjust type as necessary based on your navigation setup
}

const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSignIn = async () => {
    try {
      const response = await axios.post('http://your-server-url/api/users/signin', { username, password });
      const { token } = response.data;

      // Store the token securely (we'll discuss this in the next section)
      // You can use AsyncStorage for local storage

      // Navigate to the home screen or wherever you want to go
      navigation.navigate('Welcome'); // Adjust this based on your navigation structure
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
