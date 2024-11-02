import 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MMKV } from 'react-native-mmkv';
import { UserProvider } from '@/services/Context';
import { ThemeProvider } from '@/theme';
import { Provider } from 'react-redux';

//import store from '@/src/redux/store';
//import store from '@/redux';
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
                						<ApplicationNavigator />
                					</Provider>
			</ThemeProvider>
		</QueryClientProvider>
		  </UserProvider>
	);
}

export default App;
