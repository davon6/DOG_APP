import React, { useRef, useEffect, useState, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Dimensions, Alert, ActivityIndicator } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/FontAwesome';
//import { useExampleLogic } from '@/hooks/useExampleLogic';
import MapComponent from '@/components/MapComponent';
import SlidingMenu from '@/components/SlidingMenu';
import NewsFeedMenu from '@/components/NewsFeedMenu';
import { ToastContainer, toast } from '@/services/react-toastify';
import { notifyFriendRequest, toastConfig } from "@/services/notification"
import { RootState } from '@/redux/store'; // Import RootState
import { useSelector, useDispatch } from 'react-redux';
import LogOut from '@/components/LogOut'
import SignOutPopup from '@/components/SignOut';
import { useLogOut, useMapLogic } from '@/services';
import { useWebSocket } from '@/services/wsSocket';
const { width } = Dimensions.get('window');

type Friend = {
  username: string;
};

const App = (data) => {

    const [activeMenu, setActiveMenu] = useState(null);
    const [menuAnim] = useState(new Animated.Value(-width));
    const [newsFeedMenuOpen, setNewsFeedMenuOpen] = useState(false);
    const dispatch = useDispatch(); // Use dispatch here
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    //const { users, loading } = useExampleLogic();
    const { logOut } = useLogOut();
    const [showSignOutPopup, setShowSignOutPopup] = useState(false);
    const [radius, setRadius] = useState<number>(0);

    const { location, zone, shouldFocusMap  } = useMapLogic();

     const handleRadiusUpdate = (newRadius: number) => {
        setRadius(newRadius);  // Set the radius in the parent state
      };
//wss://dog-server-oqyd.onrender.com
//ws://172.20.10.2:3000
//wss://6313-2a04-cec0-1004-a3cb-b49f-895a-88ea-8b4e.ngrok-free.app
 const username = data.route.params[0];
  const { isConnected, closeWebSocket, friend, users2 } = useWebSocket(
    'wss://dog-server-oqyd.onrender.com',
    username, location, radius
  );
  const [friends, setFriends] = useState<Friend[]>(
    Array.isArray(data.route.params?.[1]) ? data.route.params[1] : []
  );
const [notifications, setNotifications] = useState(data.route.params[2] || {});

useEffect(() => {
  if (data) {

    // Call notifyFriendRequest only once
    notifyFriendRequest(dispatch, data.route.params[0], notifications);}
}, [dispatch, data.route.params[0], notifications]);
useEffect(() => {
    if (friend) {
      setFriends((prevFriends) => {
        // Ensure prevFriends is always an array
        const friendsArray = Array.isArray(prevFriends) ? prevFriends : [];
        // Avoid adding duplicates
        const isDuplicate = friendsArray.some((f) => f.username === friend);
        if (isDuplicate) return friendsArray;

        // Add the new friend
        return [...friendsArray, { username: friend }];
      });
      console.log("Updated friends: ", JSON.stringify(friends));
    }
  }, [friend]);


  const handleLogout = async () => {
    console.log("Starting logout process...");
    setIsLoggingOut(true);

    closeWebSocket(); // Close WebSocket properly

    await logOut();
    setIsLoggingOut(false);
   // await new Promise((resolve) => setTimeout(resolve, 500));
  };

   const toggleNewsFeedMenu = () => {
      setNewsFeedMenuOpen(!newsFeedMenuOpen);
    };


  const handleIconPress = (menuType) => {
    setActiveMenu(menuType);
    Animated.timing(menuAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

 // Close NewsFeedMenu if open
    if (newsFeedMenuOpen) {
      setNewsFeedMenuOpen(false);
    }
  };

  const closeMenu = () => {
    Animated.timing(menuAnim, {
      toValue: -width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setActiveMenu(null));
  };

  return (
    <View style={styles.container}>

    {/*come on*/}
      <MapComponent location={location} zone ={zone} shouldFocusMap={shouldFocusMap }
       onRadiusChange={handleRadiusUpdate} users2={users2} username={username}/>

      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => handleIconPress('user')} style={styles.iconWrapper}>
          <Icon name="user" size={30} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleIconPress('msg')} style={styles.iconWrapper}>
          <Icon name="comment-o" size={30} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleIconPress('search')} style={styles.iconWrapper}>
          <Icon name="search" size={30} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleIconPress('gear')} style={styles.iconWrapper}>
          <Icon name="gear" size={30} color="#333" />
        </TouchableOpacity>
      </View>

    <SlidingMenu activeMenu={activeMenu} menuAnim={menuAnim} closeMenu={closeMenu} data={data.route.params} handleLogout={handleLogout}
       triggerSignOutPopup={() => setShowSignOutPopup(true)} friends={friends}  />

       <NewsFeedMenu isOpen={newsFeedMenuOpen} toggleMenu={toggleNewsFeedMenu}
        username={data.route.params[0]}  notifications={notifications} />

        <LogOut isLoggingOut={isLoggingOut} />

           {showSignOutPopup && (
                  <SignOutPopup onClose={() => setShowSignOutPopup(false)} closeMenu={closeMenu} handleLogout={handleLogout} name={data.route.params[0]}  />
                )}


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -20,
  },
  iconContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 20,
  },
  iconWrapper: {
    flex: 1,
    alignItems: 'center',
  },
});

export default App;
