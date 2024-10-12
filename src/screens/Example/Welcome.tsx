import React from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
//import { Application } from '@navigators/Application';

const Welcome: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Button
        title="Sign In"
        onPress={() => navigation.navigate('SignIn')} // Navigate to SignIn screen
      />
      <Button
        title="Sign Up"
        onPress={() => navigation.navigate('SignUp')} // Navigate to SignUp screen
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
  },
  button: {
    marginVertical: 10,
  },
});

export default Welcome;
