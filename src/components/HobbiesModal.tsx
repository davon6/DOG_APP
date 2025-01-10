import React from 'react';
import {
      StyleSheet,
  Modal,
  Text,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


interface HobbiesModalProps {
  hobbies: string[];
  selectedHobbies: number[];
  handleHobbyToggle: (index: number) => void;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedHobbies: React.Dispatch<React.SetStateAction<number[]>>;
}

const HobbiesModal: React.FC<HobbiesModalProps> = ({
  hobbies,
  selectedHobbies,
  handleHobbyToggle,
  setModalVisible,
  setSelectedHobbies,
}) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={true}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.overlayBackground}
          onPress={() => setModalVisible(false)}
        />
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select Hobbies</Text>
          <ScrollView contentContainerStyle={styles.hobbiesList}>
            {hobbies.map((hobby, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.hobbyItem,
                  selectedHobbies.includes(index) && styles.hobbySelected,
                ]}
                onPress={() => handleHobbyToggle(index)}
              >
                <Icon
                  name={
                    selectedHobbies.includes(index)
                      ? 'check-circle'
                      : 'circle-thin'
                  }
                  size={24}
                  color={selectedHobbies.includes(index) ? '#6200ee' : 'gray'}
                />
                <Text style={styles.hobbyText}>{hobby}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.validateButton}
            onPress={() => setModalVisible(false)}
          >
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  hobbiesList: {
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  hobbyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    width: '100%',
    backgroundColor: '#f9f9f9',
  },
  hobbySelected: {
    backgroundColor: '#e6e6ff',
  },
  hobbyText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
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
});
export default HobbiesModal;
