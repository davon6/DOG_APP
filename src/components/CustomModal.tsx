import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CustomModal = ({ visible, title, content, onClose }) => {
  return (

    <Modal
      transparent={true} // Allows background transparency
      animationType="fade" // Fade-in effect
      visible={visible}
    >

      <TouchableOpacity style={styles.overlay} onPress={onClose}>
      {/* Overlay background */}
      <View style={styles.overlay}>
        {/* Modal Content */}
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>

          {Array.isArray(content) ? (
            content.map((item, index) => (
              <Text key={index} style={styles.modalText}>
                {item}
              </Text>
            ))
          ) : (
            <Text style={styles.modalText}>{content}</Text>
          )}

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
       </TouchableOpacity>
    </Modal>

  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    //backgroundColor: 'rgba(0, 0, 0, 0.15)', // Grayed-out background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    elevation: 10, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomModal;
