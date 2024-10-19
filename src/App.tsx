import 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MMKV } from 'react-native-mmkv';
import { UserProvider } from '@/services/Context';
import { ThemeProvider } from '@/theme';

import ApplicationNavigator from './navigators/Application';
import './translations';

export const queryClient = new QueryClient();

export const storage = new MMKV();

function App() {
	return (
        <UserProvider>
		<QueryClientProvider client={queryClient}>
			<ThemeProvider storage={storage}>
				<ApplicationNavigator />
			</ThemeProvider>
		</QueryClientProvider>
		  </UserProvider>
	);
}

export default App;
