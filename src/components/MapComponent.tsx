import React, { useState } from 'react';
import MapView, { Marker, Callout, Polygon } from 'react-native-maps';
import { View, Text } from 'react-native';

const MapComponent = ({ location, users, zone, shouldFocusMap }) => {
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
    const newZone = calculateZone(region);

    // Calculate the visible map area in kilometers
    const heightKm = region.latitudeDelta * 111; // Latitude: ~111 km per degree
    const widthKm =
      region.longitudeDelta * (111 * Math.cos((region.latitude * Math.PI) / 180)); // Longitude depends on latitude

    // Log if the visible map area is smaller than 1 km²
    if (heightKm < 1 && widthKm < 1) {
      console.log('Zoom level is high. Map area is smaller than 1 km².');
    }

    console.log('Visible map area (km):', { heightKm, widthKm });

    console.log('New view zone:', newZone);
    setViewZone(newZone);
    setMapRegion(region); // Update the current map region
  };

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
    <MapView
      style={{ flex: 1 }}
      region={mapRegion} // Controlled region state
      showsUserLocation={true}
      onRegionChangeComplete={handleRegionChangeComplete}
    >
      {/* User Markers */}
      {users.map((user, index) => (
        <Marker
          key={index}
          coordinate={{
            latitude: user.LAST_LOCAT_LAT,
            longitude: user.LAST_LOCAT_LONG,
          }}
          title={user.userName}
          description={`Tap to view more details`}
        >
          <Callout>
            <View>
              <Text style={{ fontWeight: 'bold' }}>{user.userName}</Text>
              <Text>Doggy Name: {user.DOG_NAME}</Text>
              <Text>Doggy Color: {user.D_COLOR}</Text>
              <Text>Doggy Weight: {user.D_WEIGHT}</Text>
              <Text>Doggy Race: {user.D_RACE}</Text>
              <Text>Doggy Vibe: {user.D_VIBE}</Text>
            </View>
          </Callout>
        </Marker>
      ))}

      {/* User's Current Location */}
      {location && <Marker coordinate={location} />}

      {/* Blue Zone: Static Zone */}
      {zone && (
        <Polygon
          coordinates={[
            { latitude: zone.north, longitude: zone.west },
            { latitude: zone.north, longitude: zone.east },
            { latitude: zone.south, longitude: zone.east },
            { latitude: zone.south, longitude: zone.west },
          ]}
          fillColor="rgba(0, 150, 255, 0.3)"
          strokeColor="blue"
          strokeWidth={2}
        />
      )}

      {/* Yellow Zone: Map View Zone */}
      {viewZone && viewZone.north && viewZone.south && viewZone.east && viewZone.west && (
        <Polygon
          coordinates={[
            { latitude: viewZone.north, longitude: viewZone.west },
            { latitude: viewZone.north, longitude: viewZone.east },
            { latitude: viewZone.south, longitude: viewZone.east },
            { latitude: viewZone.south, longitude: viewZone.west },
          ]}
          fillColor="rgba(255, 255, 0, 0.3)"
          strokeColor="orange"
          strokeWidth={2}
        />
      )}
    </MapView>
  );
};

export default MapComponent;
