import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Dimensions, Alert, PanResponder, ActivityIndicator } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useExampleLogic } from '@/hooks/useExampleLogic';
import MapComponent from '@components/MapComponent';
import SlidingMenu from '@components/SlidingMenu';

const { width } = Dimensions.get('window');

const App = () => {
  const [location, setLocation] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [menuAnim] = useState(new Animated.Value(-width));
  const { users, loading } = useExampleLogic();

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

  const handleIconPress = (menuType) => {
    setActiveMenu(menuType);
    Animated.timing(menuAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(menuAnim, {
      toValue: -width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setActiveMenu(null));
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dx < -20,
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dx < 0) {
        menuAnim.setValue(gestureState.dx);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx < -width * 0.02) {
        closeMenu();
      } else {
        Animated.timing(menuAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  return (
    <View style={styles.container}>
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
      <SlidingMenu menuAnim={menuAnim} activeMenu={activeMenu} closeMenu={closeMenu} {...panResponder.panHandlers} />
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
