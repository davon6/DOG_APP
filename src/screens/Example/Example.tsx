import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Alert, PanResponder, ActivityIndicator } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useExampleLogic } from '@/hooks/useExampleLogic'; // Use the hook here

const { width } = Dimensions.get('window');

const App = () => {
  const [location, setLocation] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null); // Track the active menu (user, msg, search, gear)
  const [menuAnim] = useState(new Animated.Value(-width)); // Animation value for sliding menu

  // Destructure users and loading state from the hook
  const { users, loading, refetch } = useExampleLogic();

  useEffect(() => {
    // Fetch current user's location
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

  const handleIconPress = (menuType) => {
    setActiveMenu(menuType);
    Animated.timing(menuAnim, {
      toValue: 0, // Slide in from the left
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(menuAnim, {
      toValue: -width, // Slide out to the left
      duration: 300,
      useNativeDriver: true,
    }).start(() => setActiveMenu(null)); // Reset active menu after closing
  };

  // Add pan gesture support to swipe and close the menu
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dx < -20, // Detect left swipe
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dx < 0) {
        menuAnim.setValue(gestureState.dx); // Move with finger
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx < -width * 0.02) {
        closeMenu(); // Close the menu if swiped more than 30%
      } else {
        Animated.timing(menuAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(); // Slide back to original position if swipe is less than 30%
      }
    },
  });

  const renderMenuContent = () => {
    switch (activeMenu) {
      case 'user':
        return (
          <View style={[styles.menuContent, { backgroundColor: 'rgba(255, 192, 203, 0.8)' }]}>
            <Text style={styles.menuTitle}>User Profile</Text>
            <Text style={styles.menuText}>Username: JohnDoe</Text>
            <Text style={styles.menuText}>Doggy Name: Max</Text>
            <Text style={styles.menuText}>Doggy Color: Brown</Text>
            <Text style={styles.menuText}>Doggy Weight: 15 kg</Text>
            <Text style={styles.menuText}>Doggy Race: Golden Retriever</Text>
            <Text style={styles.menuText}>Doggy Vibe: Playful</Text>
          </View>
        );
      case 'msg':
        return (
          <View style={[styles.menuContent, { backgroundColor: 'rgba(173, 216, 230, 0.8)' }]}>
            <Text style={styles.menuTitle}>Messages</Text>
            <Text style={styles.menuText}>Group Chat</Text>
            <Text style={styles.menuText}>Individual Contacts</Text>
          </View>
        );
      case 'search':
        return (
          <View style={[styles.menuContent, { backgroundColor: 'rgba(144, 238, 144, 0.8)' }]}>
            <Text style={styles.menuTitle}>Search Options</Text>
            <Text style={styles.menuText}>Lost Items</Text>
            <Text style={styles.menuText}>Event Creation/Sharing</Text>
            <Text style={styles.menuText}>Forum</Text>
            <Text style={styles.menuText}>Business</Text>
          </View>
        );
      case 'gear':
        return (
          <View style={[styles.menuContent, { backgroundColor: 'rgba(255, 165, 0, 0.8)' }]}>
            <Text style={styles.menuTitle}>Settings</Text>
            <Text style={styles.menuText}>App Skin Choice</Text>
            <Text style={styles.menuText}>Language</Text>
            <Text style={styles.menuText}>Password & Email Management</Text>
            <Text style={styles.menuText}>Logout</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={location ? {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        } : {
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
      >
        {/* Display markers for other users */}
        {users.map((user, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: user.LAST_LOCAT_LAT,
              longitude: user.LAST_LOCAT_LONG,
            }}
            title={user.USER_NAME}  // Display username as marker title
            description={`Tap to view more details`}
          >
            <Callout>
              <View>
                <Text style={{ fontWeight: 'bold' }}>{user.USER_NAME}</Text>
                <Text>Doggy Name: {user.DOG_NAME}</Text>
                <Text>Doggy Color: {user.D_COLOR}</Text>
                <Text>Doggy Weight: {user.D_WEIGHT}</Text>
                <Text>Doggy Race: {user.D_RACE}</Text>
                <Text>Doggy Vibe: {user.D_VIBE}</Text>
              </View>
            </Callout>
          </Marker>
        ))}

        {/* Your own location marker */}
        {location && <Marker coordinate={location} />}
      </MapView>

      {/* Show the loader while fetching users */}
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

      {/* Sliding Menu */}
      <Animated.View
        style={[styles.menu, { transform: [{ translateX: menuAnim }] }]}
        {...panResponder.panHandlers} // Attach pan gesture responder to menu
      >
        <TouchableOpacity onPress={closeMenu} style={styles.closeButton}>
          <Icon name="close" size={30} color="#fff" />
        </TouchableOpacity>
        {renderMenuContent()}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
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
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Transparency effect
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 20,
  },
  iconWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  menu: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: width * 0.60, // 60% width for the sliding menu
    backgroundColor: 'rgba(255, 255, 255, 0.02)',//'#fff',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  menuContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-evenly', // Spread the content evenly
  },
  menuTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  menuText: {
    fontSize: 18,
    paddingVertical: 10,
  },
});

export default App;
