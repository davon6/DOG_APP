import React, { useState, useEffect } from 'react';
import MapView, { Marker, Callout } from 'react-native-maps';
import { View, Text, ActivityIndicator, Modal, TouchableWithoutFeedback } from 'react-native';
import UserInfoPopup from './UserInfoPopUp';
import Icon from 'react-native-vector-icons/FontAwesome';

const MapComponent = ({ location, users, zone, shouldFocusMap, onRadiusChange, users2, username  }) => {

    const [previousRegion, setPreviousRegion] = useState(null);
const [loadingUsers, setLoadingUsers] = useState(true);
const [selectedUser, setSelectedUser] = useState(null);

const handleMapPress = () => {
    setSelectedUser(null); // Close popup when tapping on the map
  };

  useEffect(() => {
    // If users array is populated, set loading state to false after a short delay
    if (users2 && users2.length > 0) {
/*
        console.log("--------------->>>>>>>>>>>>>>>>>>>>>>>>>>> users2 in mapComponenet ",users2)

console.log(users2[0].username);
console.log(users2[0].dog.dogColor)
console.log("User coordinates:", users2[0].lat, users2[0].long);
*/
      setLoadingUsers(false);
    }
  }, [users2]);
  const calculateZone = (region) => {
    const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
    return {
      north: latitude + latitudeDelta / 2,
      south: latitude - latitudeDelta / 2,
      east: longitude + longitudeDelta / 2,
      west: longitude - longitudeDelta / 2,
    };
  };

  const [viewZone, setViewZone] = useState(() =>
    calculateZone({
      latitude: 37.78825, // Default region if location is unavailable
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    })
  );

  const [mapRegion, setMapRegion] = useState(() =>
    location
      ? {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }
      : {
          latitude: 37.78825, // Default to San Francisco if location is unavailable
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }
  );

  // Handle region change on user interaction
  const handleRegionChangeComplete = (region) => {


const radiusKm = calculateRadiusFromRegion(region);

onRadiusChange(radiusKm);
      const isRegionSignificantChange =
          !previousRegion ||
          Math.abs(region.latitude - previousRegion.latitude) > 0.001 ||
          Math.abs(region.longitude - previousRegion.longitude) > 0.001 ||
          Math.abs(region.latitudeDelta - previousRegion.latitudeDelta) > 0.001 ||
          Math.abs(region.longitudeDelta - previousRegion.longitudeDelta) > 0.001;

        if (isRegionSignificantChange) {




    const newZone = calculateZone(region);

    // Calculate the visible map area in kilometers
    const heightKm = region.latitudeDelta * 111; // Latitude: ~111 km per degree
    const widthKm =
      region.longitudeDelta * (111 * Math.cos((region.latitude * Math.PI) / 180)); // Longitude depends on latitude

    // Log if the visible map area is smaller than 1 km²
    if (heightKm < 1 && widthKm < 1) {
      console.log('Zoom level is high. Map area is smaller than 1 km².');
    }

    //console.log('Visible map area (km):', { heightKm, widthKm });

   // console.log('New view zone:', newZone);
    setViewZone(newZone);
    setMapRegion(region); // Update the current map region
    setPreviousRegion(region);
  }

  };


   const calculateRadiusFromRegion = (region: {
      latitude: number;
      longitude: number;
      latitudeDelta: number;
      longitudeDelta: number;
    }): number => {
      const heightKm = region.latitudeDelta * 111; // Latitude: ~111 km per degree
      const widthKm =
        region.longitudeDelta * (111 * Math.cos((region.latitude * Math.PI) / 180)); // Longitude depends on latitude

      // Calculate the diagonal of the visible area (Pythagorean theorem)
      const radiusKm = Math.sqrt(heightKm ** 2 + widthKm ** 2) / 2;

      // Optional: Log if the visible map area is smaller than 1 km²
      if (heightKm < 1 && widthKm < 1) {
        console.log('Zoom level is high. Map area is smaller than 1 km².');
      }
 //console.log("--------------------> our radius "+ radiusKm);
      return radiusKm;
      // Return the calculated radius in kilometers
    };

 // console.log("--------------------> our radius "+calculateRadiusFromRegion());


  // Set map focus when `shouldFocusMap` is true
  React.useEffect(() => {
    if (shouldFocusMap && location) {
      setMapRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  }, [shouldFocusMap, location]);

return (
  <View style={{ flex: 1 }}>
    <MapView
      style={{ flex: 1 }}
      region={mapRegion} // Controlled region state
      showsUserLocation={true}
      onRegionChangeComplete={handleRegionChangeComplete}
      onPress={handleMapPress}
    >
      {/* User's Current Location
      {location && <Marker coordinate={location} />}
*/}



      {/* Render User Markers with Custom Icons */}
             {!loadingUsers &&
               users2.map((user) => (
                 <Marker
                   key={user.username}
                   coordinate={{ latitude: user.lat, longitude: user.long }}
                   onPress={() => setSelectedUser(user)} // Show popup when marker is pressed
                 >
                   <View style={{ alignItems: 'center' }}>
                     {/* Awesome Icon */}
                     <Icon name="paw" size={45} color="orange" />
                     <Text style={{ fontSize: 12 }}>{user.dog.dogName}</Text>
                   </View>
                 </Marker>
               ))}
    </MapView>

    {/* Loader
    {loadingUsers && (
      <View style={{ position: 'absolute', top: '50%', left: '50%' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )}*/}

    {/* User Info Popup */}
    <Modal
           visible={!!selectedUser}
           transparent
           animationType="fade"
           onRequestClose={() => setSelectedUser(null)} // Handle back press for Android
         >
           <TouchableWithoutFeedback onPress={() => setSelectedUser(null)}>
             <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
               {selectedUser && (
                 <UserInfoPopup
                   user={selectedUser}
                   onClose={() => setSelectedUser(null)} // Close button inside the popup
                   username ={username}
                 />
               )}
             </View>
           </TouchableWithoutFeedback>
         </Modal>
  </View>
);


};

export default MapComponent;
