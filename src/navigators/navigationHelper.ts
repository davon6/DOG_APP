import { createNavigationContainerRef } from '@react-navigation/native';

// Create the navigation reference
export const navigationRef = createNavigationContainerRef();

// Function to navigate to any screen
export function navigate(name: string, params?: object) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  } else {
    console.error('Navigation reference is not ready');
  }
}
