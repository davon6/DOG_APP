import 'react-native-gesture-handler';
import React , { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MMKV } from 'react-native-mmkv';
import { UserProvider } from '@/services/Context';
import { ThemeProvider } from '@/theme';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message'; // Import Toast
import { toastConfig } from '@/services/notification'; // Custom Toast Config
import store from '@/redux/store';

import ApplicationNavigator from './navigators/Application';
import './translations';


export const queryClient = new QueryClient();
export const storage = new MMKV();

function App() {
/*
     useEffect(() => {
       setTimeout(() => {
         Toast.show({
           type: 'success',
           text1: 'Test Toast!',
           text2: 'This is a test notification.',
         });
       }, 1000);
     }, []);
*/
  return (
    <UserProvider>
      {/* Toast should be within the UserProvider if you need access to user context */}

      <QueryClientProvider client={queryClient}>
        <ThemeProvider storage={storage}>
          <Provider store={store}>
            <ApplicationNavigator />
            <Toast config={toastConfig} />
          </Provider>
        </ThemeProvider>
      </QueryClientProvider>
    </UserProvider>
  );
}

export default App;
