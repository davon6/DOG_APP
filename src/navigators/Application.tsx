import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Example, Welcome, SignIn, SignUp, SignUp_2 } from '@/screens';
import { useTheme } from '@/theme';

import { navigationRef } from './navigationHelper'; // Correct import of global navigation ref
import type { RootStackParamList } from '@/types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

function ApplicationNavigator() {
  const { variant, navigationTheme } = useTheme();

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef} theme={navigationTheme}>
        <Stack.Navigator key={variant} screenOptions={{ headerShown: false }} initialRouteName="Welcome">
          <Stack.Screen name="Example" component={Example} />
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="SignUp_2" component={SignUp_2} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default ApplicationNavigator;
