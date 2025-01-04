import React, { useRef, useEffect, useState, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Dimensions, Alert, ActivityIndicator } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useExampleLogic } from '@/hooks/useExampleLogic';
import MapComponent from '@/components/MapComponent';
import SlidingMenu from '@/components/SlidingMenu';
import NewsFeedMenu from '@/components/NewsFeedMenu';
import { ToastContainer, toast } from '@/services/react-toastify';
import { notifyFriendRequest, toastConfig } from "@/services/notification"
import { RootState } from '@/redux/store'; // Import RootState
import { useSelector, useDispatch } from 'react-redux';
import LogOut from '@/components/LogOut'
import SignOutPopup from '@/components/SignOut';
import { useLogOut } from '@/services';
import { useWebSocket } from '@/services/wsSocket';
const { width } = Dimensions.get('window');

const App = (data) => {

    const [location, setLocation] = useState(null);
    const [activeMenu, setActiveMenu] = useState(null);
    const [menuAnim] = useState(new Animated.Value(-width));
    const [newsFeedMenuOpen, setNewsFeedMenuOpen] = useState(false);
    //const notifications = useSelector((state: RootState) => state.notifications.list);
    const dispatch = useDispatch(); // Use dispatch here
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const { users, loading } = useExampleLogic();
    const { logOut } = useLogOut();
    const [showSignOutPopup, setShowSignOutPopup] = useState(false);


 const username = data.route.params[0];
  const { isConnected, closeWebSocket, friend } = useWebSocket(
    'wss://e9e3-2a04-cec0-105d-76e2-9932-f67a-e713-120f.ngrok-free.app',
    username
  );
const [friends, setFriends] = useState(data.route.params[1] || {});

const [notifications, setNotifications] = useState(data.route.params[2] || {});


useEffect(() => {
  if (data) {

      console.log("oving slooowly --->"+JSON.stringify(notifications));

    // Call notifyFriendRequest only once
    notifyFriendRequest(dispatch, data.route.params[0], notifications);}
}, [dispatch, data.route.params[0], notifications]);

console.log("so this is the start"+ JSON.stringify(friends));

useEffect(() => {

  if (friend) {
    setFriends((prevFriends) => {
      // Avoid adding duplicates
      const isDuplicate = prevFriends.some((f) => f.username === friend);
      if (isDuplicate) return prevFriends;

      // Add the new friend
      return [...prevFriends, { username: friend }];
    });
    console.log("Updated friends: ", JSON.stringify({ friends }));
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
/*
useEffect(() => {
  if (data) {

      console.log("oving slooowly --->"+JSON.stringify(notifications));

    // Call notifyFriendRequest only once
   // notifyFriendRequest(dispatch, data.route.params[0], notifications);


         console.log("and the friends --->"+JSON.stringify(data.route.params[1]));
  }


  if(friend){friends={
                     ...friends,
                     friend
                   };

               console.log(" the mess "+ JSON.stringify(friends))
               };
}, [dispatch, data.route.params[0], notifications]);
*/

  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        Alert.alert("Error", "Unable to fetch location: " + error.message);
      },
      { enableHighAccuracy: true, distanceFilter: 10, interval: 10000 }
    );

    return () => Geolocation.clearWatch(watchId);
  }, []);

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
      <MapComponent location={location} users={users} />

      {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}

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
