import React from 'react';
import { View, Modal, TouchableOpacity, Text, Switch, StyleSheet } from 'react-native';
import { WheelPicker } from 'react-native-wheel-pick';
import Icon from 'react-native-vector-icons/FontAwesome';

const PickerModal = ({
  showPicker,
  pickerType,
  ageUnit,
  setAgeUnit,
  selectedValue,
  setSelectedValue,
  numbers,
  handleBackdropPress,
  handleValidateSelection,
}) => {
  return (
    <Modal transparent={true} animationType="fade" visible={showPicker}>
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.overlayBackground}
          onPress={handleBackdropPress}
        />

        <View style={styles.pickerContainer}>
          {/* Display Current Unit (Months or Years) */}
          {pickerType === 'dogAge' && (
            <View style={styles.switchWrapper}>
              {/* Toggle Unit */}
              <View style={styles.switchContainer}>
                <Text style={styles.toggleText}>
                  {ageUnit === 'years' ? 'Years' : 'Months'}
                </Text>
                <Switch
                  value={ageUnit === 'years'}
                  onValueChange={(value) => setAgeUnit(value ? 'years' : 'months')}
                  thumbColor={ageUnit === 'years' ? '#4CAF50' : '#FFC0CB'}
                  trackColor={{ true: '#A5D6A7', false: '#FFCDD2' }}
                  style={styles.ageSwitch}
                />
              </View>
            </View>
          )}

          {/* Wheel Picker */}
          <WheelPicker
            selectedItem={selectedValue - 1} // Adjust for zero-based index
            data={numbers.map(String)} // Numbers as strings
            onItemSelected={(index) => setSelectedValue(index + 1)} // Update temporary value
            style={styles.wheel}
          />

          {/* Validation Icon */}
          <TouchableOpacity onPress={handleValidateSelection} style={styles.validateButton}>
            <Icon name="check" size={24} color="green" />
            <Text style={styles.validateText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
  },
  overlayBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(128, 128, 128, 0.5)', // Grayed-out background
  },
  pickerContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  toggleText: {
    fontSize: 16,
    marginRight: 10,
  },
  validateButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  validateText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  wheel: {
    width: 250,
    height: 250,
  },
});

export default PickerModal;
