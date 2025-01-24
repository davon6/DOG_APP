import { useState, useEffect } from 'react';
import Geolocation from 'react-native-geolocation-service';
import { Alert } from 'react-native';

interface Location {
  latitude: number;
  longitude: number;
}

const useMapLogic = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [previousLocation, setPreviousLocation] = useState<Location | null>(null);
    const [zone, setZone] = useState<{ north: number; south: number; east: number; west: number } | null>(null);
const [shouldFocusMap, setShouldFocusMap] = useState(true);

  const haversine = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const toRadians = (value: number) => (value * Math.PI) / 180;
    const dlat = toRadians(lat2 - lat1);
    const dlon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dlat / 2) ** 2 +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dlon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // Convert to meters
  };

  const calculateZone = (center: Location, latitudeDelta: number, longitudeDelta: number) => {
    const { latitude, longitude } = center;
    return {
      north: latitude + latitudeDelta / 2,
      south: latitude - latitudeDelta / 2,
      east: longitude + longitudeDelta / 2,
      west: longitude - longitudeDelta / 2,
    };
  };

  // Helper to handle location updates
  const handleLocationUpdate = (position: Geolocation.GeoPosition, shouldFocusMap: boolean) => {
    const newLocation = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };

    setLocation(newLocation); // Update the location state
    updateZone(newLocation); // Update the zone

    if (shouldFocusMap) {
      setTimeout(() => setShouldFocusMap(false), 100); // Delay toggling focus map
    }
  };

  // Helper to update the zone
  const updateZone = (newLocation: Location) => {
    const currentZone = calculateZone(newLocation, 0.0922, 0.0421); // Adjust deltas if needed
    setZone(currentZone);
  };

  // Optional: Handle distance (if needed)
  const handleDistance = (newLocation: Location) => {
    if (previousLocation) {
      const distance = haversine(
        previousLocation.latitude,
        previousLocation.longitude,
        newLocation.latitude,
        newLocation.longitude
      );

      if (distance > 100) {
        console.log(`Moved over 100 meters! Distance: ${distance.toFixed(2)} meters`);
      }
    }
    setPreviousLocation(newLocation); // Update the previous location
  };
  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      (position) => {
        handleLocationUpdate(position, shouldFocusMap); // Delegate to the helper function
      },
      (error) => {
        Alert.alert("Error", `Unable to fetch location: ${error.message}`);
      },
      { enableHighAccuracy: true, distanceFilter: 10, interval: 10000 } // Adjust interval as needed
    );

    return () => Geolocation.clearWatch(watchId); // Cleanup watcher
  }, [shouldFocusMap]);



/*
  useEffect(() => {


      console.log("------------------------> indeed this is fullon",previousLocation,shouldFocusMap)

    const watchId = Geolocation.watchPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
//we removed
        if (previousLocation) {
          const distance = haversine(
            previousLocation.latitude,
            previousLocation.longitude,
            newLocation.latitude,
            newLocation.longitude
          );

          if (distance > 100) {
            console.log(`Moved over 100 meters! Distance: ${distance.toFixed(2)} meters`);
          }
        }
//til here
        setPreviousLocation(newLocation); // Update the previous location


        setLocation(newLocation); // Set the new location

        const currentZone = calculateZone(newLocation, 0.0922, 0.0421); // Adjust deltas if needed
        setZone(currentZone);

         if (shouldFocusMap) {
                  setShouldFocusMap(false); // Disable auto-focus for subsequent updates
                }

      },
      (error) => {
        Alert.alert("Error", `Unable to fetch location: ${error.message}`);
      },
      { enableHighAccuracy: true, distanceFilter: 10, interval: 10000 } // Adjust interval as needed
    );


    return () => Geolocation.clearWatch(watchId);
  }, [previousLocation,shouldFocusMap]);

  */

  return  { location , zone, shouldFocusMap };
};

export default useMapLogic;
