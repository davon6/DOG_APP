import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '@/screens/HomeScreen';
import ExampleScreen from '@/screens/ExampleScreen'; // Replace with actual screen imports

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Stack.Screen
        name="Example"
        component={ExampleScreen}
        options={{ title: 'Example' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
