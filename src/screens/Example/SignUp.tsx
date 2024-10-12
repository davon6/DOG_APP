// src/screens/SignUpScreen.tsx

import axios from 'axios';
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';

interface SignUpScreenProps {
  navigation: any; // Adjust type as necessary based on your navigation setup
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleSignUp = async () => {
    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

console.log("show me   "+username+ email+password);

    try {
      // Send the sign-up request to the backend
      const response = await axios.post('http://172.20.10.8:3000/api/users/signup', {
        username,
        email,
        password},
        {
                  headers: {
                    'Content-Type': 'application/json',  // Ensure this header is present
                  }
                });

      if (response.status === 201) {
        setSuccessMessage('Account created successfully! You can now log in.');
        // Optionally, navigate to the sign-in screen after success
        // navigation.navigate('SignInScreen');

        navigation.navigate('Example');
      }
    } catch (error) {
      setError('Error creating account. Please try again.');
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
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
        style={styles.input}
      />
      <TextInput
        placeholder="Confirm Password"
        secureTextEntry
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        style={styles.input}
      />
      <Button title="Sign Up" onPress={handleSignUp} />

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {successMessage ? <Text style={styles.success}>{successMessage}</Text> : null}
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
  success: {
    color: 'green',
    marginTop: 10,
  },
});

export default SignUpScreen;
