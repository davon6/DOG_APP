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
const { width } = Dimensions.get('window');

const App = (data) => {
    const [location, setLocation] = useState(null);
    const [activeMenu, setActiveMenu] = useState(null);
    const [menuAnim] = useState(new Animated.Value(-width));
    const [newsFeedMenuOpen, setNewsFeedMenuOpen] = useState(false);
    const notifications = useSelector((state: RootState) => state.notifications.list);
    const dispatch = useDispatch(); // Use dispatch here
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const { users, loading } = useExampleLogic();
    const { logOut } = useLogOut();
    const [showSignOutPopup, setShowSignOutPopup] = useState(false);

const ws = useRef(null);
  const reconnectTimeout = useRef(null);
  const heartbeatInterval = useRef(null);
  const connectionTimeout = useRef(null);

  const [isConnected, setIsConnected] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const username = data.route.params[0]; // Replace with your dynamic username or params
  const maxRetryLimit = 5; // Max number of reconnection attempts
  const backoffBase = 1000; // Initial delay for reconnection (in milliseconds)
  const maxBackoffDelay = 30000; // Maximum delay between retries (30 seconds)





   const connectWebSocket = () =>
   {
     if (ws.current && ws.current.readyState === WebSocket.OPEN) {
       console.log("WebSocket is already connected, skipping reconnect.");
       return; // Prevent redundant connections
     }

     console.log("Attempting to connect to WebSocket...");

     ws.current = new WebSocket(`wss://3723-2a04-cec0-10c3-3cf8-f5ab-57b3-4b6f-590f.ngrok-free.app?username=${username}`);

     // Set connection timeout (10 seconds)
     connectionTimeout.current = setTimeout(() => {
       if (ws.current && ws.current.readyState !== WebSocket.OPEN) {
         console.warn("Connection timeout reached, closing WebSocket.");
         ws.current.close(); // Force close if it didn't connect
       }
     }, 10000);

     ws.current.onopen = () => {
       console.log("WebSocket connected");
       setIsConnected(true);
       setRetryCount(0);

       // Clear connection timeout
       clearTimeout(connectionTimeout.current);

       // Start sending heartbeats every 15 seconds
       heartbeatInterval.current = setInterval(() => {
         if (ws.current.readyState === WebSocket.OPEN) {
           ws.current.send(JSON.stringify({ type: "heartbeat" }));
           console.log("Heartbeat sent");
         }
       }, 15000);
     };

     ws.current.onmessage = (event) => {
          const receivedData = JSON.parse(event.data);
       console.log("Received message:", event.data);
       // Handle incoming messages...
       if (receivedData.notification) {
                             notifyFriendRequest(dispatch, data.route.params[0], [receivedData.notification]);
                         }
                     };

     ws.current.onerror = (error) => {
       console.error("WebSocket error occurred:", error);
     };

     ws.current.onclose = (event) => {
       console.log(`WebSocket closed: Code ${event.code}, Reason: ${event.reason}`);
       setIsConnected(false);

       // Clear intervals and timeouts
       clearInterval(heartbeatInterval.current);
       clearTimeout(connectionTimeout.current);

       // Attempt to reconnect
       if (retryCount < maxRetryLimit) {
         const retryDelay = Math.min(backoffBase * Math.pow(2, retryCount), maxBackoffDelay);
         console.log(`Reconnecting in ${retryDelay / 1000} seconds... (Attempt ${retryCount + 1})`);
         reconnectTimeout.current = setTimeout(() => {
           setRetryCount((prev) => prev + 1);
           connectWebSocket();
         }, retryDelay);
       } else {
         console.error("Max reconnection attempts reached. Giving up.");
       }
     };
   };


useEffect(() => {
  connectWebSocket();

  return () => {
    // Cleanup on component unmount
    console.log("Cleaning up WebSocket resources...");
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
    if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    if (heartbeatInterval.current) clearInterval(heartbeatInterval.current);
    if (connectionTimeout.current) clearTimeout(connectionTimeout.current);
  };
}, []);
/*
 useEffect(() => {
    notifyFriendRequest(dispatch, username.route.params, notifications);
  }, [dispatch, username.route.params, notifications]);
*/
 const handleLogout = async () => {
    console.log("Starting logout process...");
    setIsLoggingOut(true);

    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate logout process
    console.log("Logout completed!");

 await logOut();
  await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoggingOut(false); // Hide the overlay after 2 seconds


  };

useEffect(() => {
  if (data) {

      console.log("oving slooowly --->"+JSON.stringify(notifications));

    // Call notifyFriendRequest only once
   // notifyFriendRequest(dispatch, data.route.params[0], notifications);


         console.log("and the friends --->"+JSON.stringify(data.route.params[1]));
  }
}, [dispatch, data.route.params[0], notifications]);


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
       triggerSignOutPopup={() => setShowSignOutPopup(true)} />

       <NewsFeedMenu isOpen={newsFeedMenuOpen} toggleMenu={toggleNewsFeedMenu}
        username={data.route.params[0]}  notifications={notifications} />

        <LogOut isLoggingOut={isLoggingOut} />

           {showSignOutPopup && (
                  <SignOutPopup onClose={() => setShowSignOutPopup(false)} closeMenu={closeMenu} handleLogout={handleLogout} name={data.route.params[0]}  />
                )}


    </View>
  );
};
// username={user.userName}
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
