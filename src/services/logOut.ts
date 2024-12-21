//import { Toast } from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { useContext } from 'react';
import { UserContext } from '@/services/Context';
import { logout as logoutMessaging } from '@/redux/slices/messagingSlice';
import { logout as logoutNotifications } from '@/redux/slices/notificationsSlice';
import { navigate } from '@/navigators/navigationHelper';

const useLogOut = () => {
  const dispatch = useDispatch();
  const { clearUser } = useContext(UserContext);

  const logOut = async () => {
    console.log("entering logout logic");
    try {
      // Show a goodbye message
     /* Toast.show({
        type: 'info',
        text1: 'Goodbye!',
        text2: 'See you soon 🐾',
        position: 'top',
        visibilityTime: 2000,
      });
  */

      // Clear AsyncStorage
      try {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('refreshToken');
        await AsyncStorage.removeItem('user_info');
        console.log('AsyncStorage cleared');
      } catch (e) {
        console.error('Failed to clear AsyncStorage:', e);
      }

 console.log(logoutMessaging);

      // Clear Redux slices
      dispatch(logoutMessaging());

      console.log(logoutNotifications);

      dispatch(logoutNotifications());

      // Clear User Context
      clearUser();




/*

 console.log('----- Debugging App State After Logout -----');
const { user } = useContext(UserContext); // Access the UserContext
  const messagingState = useSelector((state) => state.messaging); // Redux messaging slice
  const notificationsState = useSelector((state) => state.notifications); // Redux notifications slice

          // Check AsyncStorage
          const userToken = await AsyncStorage.getItem('userToken');
          const refreshToken = await AsyncStorage.getItem('refreshToken');
          const userInfo = await AsyncStorage.getItem('user_info');

          console.log('AsyncStorage contents:');
          console.log({ userToken, refreshToken, userInfo });

          // Check Redux states
          console.log('Redux Messaging State:', messagingState);
          console.log('Redux Notifications State:', notificationsState);

          // Check UserContext
          console.log('UserContext State:', user);

          console.log('------------------------------------------------');
*/


      navigate('Welcome'); // Redirect to the Welcome screen
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };




  return { logOut };
};

export default useLogOut;
