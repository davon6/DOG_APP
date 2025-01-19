import 'react-native-gesture-handler';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MMKV } from 'react-native-mmkv';
import { UserProvider } from '@/services/Context';
import { ThemeProvider } from '@/theme';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message'; // Import Toast
import { toastConfig } from '@/services/notification'; // Custom Toast Config
import { MessagePopupProvider } from '@/services/MessagePopupContext'; // Import MessagePopupProvider
import store from '@/redux/store';

import ApplicationNavigator from './navigators/Application';
import './translations';

export const queryClient = new QueryClient();
export const storage = new MMKV();

function App() {
  return (
    <UserProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider storage={storage}>
          <Provider store={store}>
            {/* Wrap ApplicationNavigator with MessagePopupProvider */}
            <MessagePopupProvider>
              <ApplicationNavigator />
              <Toast config={toastConfig} />
            </MessagePopupProvider>
          </Provider>
        </ThemeProvider>
      </QueryClientProvider>
    </UserProvider>
  );
}

export default App;
