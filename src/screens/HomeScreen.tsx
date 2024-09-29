import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/theme';

const HomeScreen = () => {
  const { layout, fonts } = useTheme();

  return (
    <View style={[layout.flex_1, layout.col, layout.itemsCenter, layout.justifyCenter]}>
      <Text style={[fonts.size_24, fonts.bold]}>Hello World!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
