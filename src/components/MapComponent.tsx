import React from 'react';
import MapView, { Marker, Callout } from 'react-native-maps';
import { View, Text } from 'react-native';

const MapComponent = ({ location, users }) => {
  return (
    <MapView
      style={{ flex: 1 }}
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
      {users.map((user, index) => (
        <Marker
          key={index}
          coordinate={{
            latitude: user.LAST_LOCAT_LAT,
            longitude: user.LAST_LOCAT_LONG,
          }}
          title={user.USER_NAME}
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
      {location && <Marker coordinate={location} />}
    </MapView>
  );
};

export default MapComponent;
