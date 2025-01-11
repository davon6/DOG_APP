import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const LogOut = ({ isLoggingOut }: { isLoggingOut: boolean }) => {

       //   console.log("in logout componenet");

  if (!isLoggingOut) return null; // If not logging out, don't render anything

  return (
    <View style={styles.overlay}>
      <Text style={styles.text}>Goodbye! 🐾</Text>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99999,
  },
  text: {
    color: 'white',
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
});

export default LogOut;
