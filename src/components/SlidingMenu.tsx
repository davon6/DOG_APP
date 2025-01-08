import React, { useEffect, useContext, useState } from 'react';
import {Alert} from 'react-native';
import { View, Text, StyleSheet, Animated, TouchableWithoutFeedback,TouchableOpacity, PanResponder, Dimensions, ScrollView, TextInput, Modal, Switch } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { setActiveConversation, startConversation } from '@/redux/slices/messagingSlice';
import { RootState } from '@/redux/store';
import { UserContext } from '@/services/Context';
import MessagePopup from './MessagePopup';
import NewDoggiePopup from './NewDoggiePopup';
import {updateUser as updtU }  from '@/api/apiService';
import { Toast } from 'react-native-toast-message';
import { WheelPicker } from 'react-native-wheel-picker-android';

import { selectConversationsList } from '@/redux/selectors';

const { width } = Dimensions.get('window');

interface SlidingMenuProps {
  activeMenu: string;
  menuAnim: Animated.Value;
  closeMenu: () => void;
}

const SlidingMenu: React.FC<SlidingMenuProps> = ({ activeMenu, menuAnim, closeMenu, data, handleLogout,    triggerSignOutPopup, friends }) => {
    const [showNewChatPopup, setShowNewChatPopup] = useState(false);
    const [editableField, setEditableField] = useState(null); // Track which field is being edited
    const [tempValue, setTempValue] = useState(''); // Temporary value for editing
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const { user, updateUser, clearUser } = useContext(UserContext);
    const dispatch = useDispatch();


    const [showPicker, setShowPicker] = useState(false); // Controls wheel visibility
    const [pickerType, setPickerType] = useState(''); // Type of the field being modified ('age' or 'weight')
    const [age, setAge] = useState(5);
    const [weight, setWeight] = useState(10);
    const [selectedValue, setSelectedValue] = useState(5); // Temporary value for picker selection
    const numbers = Array.from({ length: 100 }, (_, i) => i + 1);
    const [ageUnit, setAgeUnit] = useState('years'); // Default to 'years'

    const [selectedHobbies, setSelectedHobbies] = useState<number[]>([]);
    const [modalVisible, setModalVisible] = useState(false);

 const handleOpenPicker = (field) => {
   setPickerType(field);
   setShowPicker(true);
 };

const handleSelect = (value) => {
  if (pickerType === 'dogAge') {
    if (ageUnit === 'years') {
      setAge(value); // Age in years
    } else {
      setAge(value / 12); // Convert to years if in months
    }
    setUser({ ...user, dogAge: value });
  } else if (pickerType === 'dogWeight') {
    setUser({ ...user, dogWeight: value });
  }
  setShowPicker(false);
  setEditableField(null); // Close the editing mode
};

const handleAgeUnitChange = (unit) => {
  setAgeUnit(unit);
  setShowPicker(true); // Reopen the picker after unit change
};

const handleHobbyToggle = (index) => {
  setSelectedHobbies((prevSelected) =>
    prevSelected.includes(index)
      ? prevSelected.filter((hobbyIndex) => hobbyIndex !== index) // Remove if already selected
      : [...prevSelected, index] // Add if not selected
  );
};


const formatAge = (ageInYears) => {
  // Convert decimal years into years and months
  const years = Math.floor(ageInYears); // Extract whole years
  const months = Math.round((ageInYears - years) * 12); // Convert remaining decimal to months

  // Format based on the values
  if (years > 0 && months > 0) {
    return `${years} years and ${months} months`;
  } else if (years > 0) {
    return `${years} years`;
  } else if (months > 0) {
    return `${months} months`;
  } else {
    return `0 months`; // In case of no age data
  }
};



const renderAgePicker = () => (
  <View>
    <Text>Age in {ageUnit}</Text>
    <TouchableOpacity onPress={() => handleAgeUnitChange(ageUnit === 'years' ? 'months' : 'years')}>
      <Text>{ageUnit === 'years' ? 'Switch to months' : 'Switch to years'}</Text>
    </TouchableOpacity>
  </View>
);

  // Handle when the user validates their selection (picker)
// Handle when the user validates their selection (picker)
const handleValidateSelection = () => {
  console.log("Selected value: " + selectedValue);

  if (pickerType === 'dogAge') {
    // Handle the age unit conversion for months/years
    const convertedValue = ageUnit === 'years' ? selectedValue : selectedValue / 12;
    setTempValue(convertedValue.toFixed(1)); // Store as string with 1 decimal if necessary
  } else if (pickerType === 'dogWeight') {
    setTempValue(selectedValue.toString() + " pounds");
  }

  // Close the picker and save the value
  setShowPicker(false);
    setTimeout(() => handleSave(pickerType), 0)// Call handleSave to save the value after picker selection
};




    const handleBackdropPress = () => {
         setShowPicker(false); // Close the picker if backdrop is pressed
       };
/*
  const handleLogout = async () => {

      console.log("up for some loggout");
    setIsLoggingOut(true);

         console.log("up for some loggout2");

    await logOut();
    setTimeout(() => setIsLoggingOut(false), 2000); // Show overlay for 2 seconds
  };*/


  const NewChatPopup: React.FC<{ onClose: () => void; onSelectUser: (username: string) => void }> = ({ onClose, onSelectUser }) => (
    <View style={styles.popupContainer}>
      <View style={styles.popupHeader}>
        <Text style={styles.headerText}>Start a New Chat</Text>
        <TouchableOpacity onPress={onClose}>
          <Icon name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {/*tempUsersPull.map((username) => (
        <TouchableOpacity key={username} style={styles.userButton} onPress={() => onSelectUser(username)}>
          <Text style={styles.buttonText}>{username}</Text>
        </TouchableOpacity>
      ))*/}


        {/*
          data[1] && data[1].length > 0 ? (
            data[1].map((user) => (
              <TouchableOpacity
                key={user.username}
                style={styles.userButton}
                onPress={() => onSelectUser(user.username)}
              >
                <Text style={styles.buttonText}>{user.username}</Text>
              </TouchableOpacity>
            ))
          ) */
          friends && friends.length > 0 ? (
                      friends.map((user) => (
                        <TouchableOpacity
                          key={user.username}
                          style={styles.userButton}
                          onPress={() => onSelectUser(user.username)}
                        >
                          <Text style={styles.buttonText}>{user.username}</Text>
                        </TouchableOpacity>
                      ))

  )
          : (
            Alert.alert("No doggy friends yet, go on make some new.")
             //setShowNewChatPopup(false)
          )
        }
    </View>
  );
/*Alert.alert("No doggy friends yet, go on make some new.")
  const tempUsersPull = ['rivka', 'jean', 'james', 'marvin','g','m','r','u', 'eric'];

  console.log("ready to replace "+ JSON.stringify(data[1]));
*/

  const [showPopup, setShowPopup] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [newChatReceiver, setNewChatReceiver] = useState<string | null>(null);
  //const { user } = useContext(UserContext);


  // Get conversations as an object and users as an object
  //const conversations = useSelector((state: RootState) => state.messaging.conversations);
  //const conversations = useSelector((state) => Object.values(state.messaging.conversations));

const conversations = useSelector(selectConversationsList);

  const users = useSelector((state: RootState) => state.messaging.users);
  const messages = useSelector((state: RootState) => state.messaging.messages);


  const [showDoggiePopup, setShowDoggiePopup] = useState(false);

  const handleSelectDoggie = (doggieName: string) => {
    console.log(`Selected doggie: ${doggieName}`);
    setShowDoggiePopup(false);
  };

const hobbies = [
  'Playing Fetch', 'Running', 'Swimming', 'Digging', 'Chewing Toys',
  'Tug-of-War', 'Hide and Seek', 'Agility Training', 'Playing with Balls',
  'Socializing with Other Dogs', 'Hiking', 'Napping', 'Chasing Squirrels',
  'Frisbee', 'Cuddling', 'Obstacle Courses', 'Exploring New Places',
  'Learning Tricks', 'Playing in the Water', 'Walking on Leash'
];

  const openPopup = (conversationId?: string, receiverUsername?: string) => {

    if (conversationId) {


console.log("READY TO DISPATCH SETACTIVE CONV->"+receiverUsername);


      dispatch(setActiveConversation({conversationId, otherUser:receiverUsername}));
      setCurrentConversationId(conversationId);
      setNewChatReceiver(receiverUsername);
    } else if (receiverUsername) {

        console.log("new conversation ID , no exisitn so ->"+receiverUsername);

      setNewChatReceiver(receiverUsername);
    }
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setCurrentConversationId(null);
    setNewChatReceiver(null);
  };

  useEffect(() => {
    closePopup();
  }, [activeMenu]);
/*
  useEffect(() => {
    console.log(conversations); // Verify that each conversation has `otherUser` populated correctly here
  }, [conversations]);

*/
  const initiateConversation = async (username: string) => {
    if (!showPopup) {
      const conversationId = await dispatch(startConversation(user.userName, username));
      if (conversationId) {


          console.log("we always go to conversationId acquired");
        openPopup(conversationId, username);
		  setShowNewChatPopup(false);//DAVID
      } else {
	   setShowNewChatPopup(false);//DAVID
        openPopup(undefined, username); // New chat mode
      }
    }
  };

    // Handle initiating edit mode
    const handleEdit = (field, value) => {
      if (field === 'dogAge' || field === 'dogWeight') {
        handleOpenPicker(field); // Directly open the picker for these fields
      } else if (field === 'dogHobbies') {
            setEditableField(field); // Set hobbies to editable mode
            setSelectedHobbies(value ? value.split(';').map(Number) : []); // Parse existing hobbies into an array of numbers
            setModalVisible(true); // Open hobbies modal
          }else {
        setEditableField(field); // Set the field to editable mode for other fields
        setTempValue(value);
      }
    };


const handleSave = async (field) => {
  // Use the correct value for hobbies or other fields
  const updatedValue = field === 'dogHobbies' ? selectedHobbies.join('; ') : tempValue;

  // Check for invalid values
  if (!updatedValue || updatedValue.trim() === "") {
    console.log("Invalid value to save");
    return; // Prevent saving if the value is invalid
  }

  console.log(`Saving field "${field}" with value: ${updatedValue}`);

  // Update the user object locally
  const updatedUser = { ...user, [field]: updatedValue };
  updateUser(updatedUser); // Update the local state
  console.log("Updated user locally:", updatedUser);

  // Send the update to the server
  try {
    const response = await updtU(user.userName, { [field]: updatedValue });

    if (response.success) {
      console.log(`Successfully updated user: ${field}`);
    } else {
      console.error("Error updating user:", response.message || "Unknown error");
    }
  } catch (error) {
    console.error("Error updating user:", error);
  }

  // Exit edit mode after saving
  setEditableField(null);
  setTempValue(''); // Reset temp value
};

/*
const handleSave = async (field) => {
  console.log("soooooo do we update? " + field + " " + tempValue);

  if (tempValue === undefined || tempValue === "") {
    console.log("Invalid value to save");
    return; // Prevent saving if the value is invalid
  }

  // Update user locally
  const updatedUser = { ...user, [field]: tempValue };
  updateUser(updatedUser); // Update the local state
  console.log("Updated user locally:", updatedUser);

  // Send update to the server
  try {
    const response = await updtU(user.userName, { [field]: tempValue });

    if (response.success) {
      console.log("Successfully updated user: " + field);
    } else {
      console.error("Error updating user:", response.message || "Unknown error");
    }
  } catch (error) {
    console.error("Error updating user:", error);
  }

  setEditableField(null); // Exit edit mode after saving
};
*/


// In the renderField method, check for dogAge and show picker accordingly
const renderField = ( field) => {
  const isPickerField = field === 'dogAge' || field === 'dogWeight';
  const isEditing = editableField === field;

    const renderHobbies = (hobbiesString) => {
      if (!hobbiesString) return 'No hobbies specified';
      return hobbiesString
        .split(';') // Split the string by semicolons
        .map(index => hobbies[parseInt(index.trim(), 10)]) // Convert each index to an integer and map to the hobbies array
        .filter(Boolean) // Remove invalid indices (e.g., out of range)
        .join(', '); // Join the hobbies back into a readable string
    };


  return (
    <View style={styles.fieldContainer}>


      {isPickerField && isEditing ? (
        // If editing age/weight, show the picker
        <TouchableOpacity onPress={() => handleOpenPicker(field)}>
          <Text style={[styles.menuText, { color: 'blue' }]}>
            {field === 'dogAge' ? `${user[field]} ${ageUnit === 'years' ? 'years' : 'months'}` : `${user[field]} kg`}
          </Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.menuText}>
          {field === 'dogHobbies'
                       ? renderHobbies(user[field]) // Render hobbies if field is dogHobbies
                       : field === 'dogAge'
                         ? formatAge(user[field])
                         : user[field] || 'Not specified'}

        </Text>
      )}

      {/* Edit/Save Icons */}
      {isEditing ? (
        <TextInput
          style={styles.inputField}
          placeholder={user[field]}
          value={tempValue}
          onChangeText={setTempValue}
        />
      ) : null}

      {isEditing ? (
        <TouchableOpacity onPress={() => handleSave(field)}>
          <Icon name="check" size={20} color="green" style={styles.icon} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => handleEdit(field, user[field])}>
          <Icon name="pencil" size={20} color="blue" style={styles.icon} />
        </TouchableOpacity>
      )}
    </View>
  );
};



  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dx < -20,
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dx < 0) {
        menuAnim.setValue(gestureState.dx);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx < -width * 0.02) {
        closeMenu();
         setShowDoggiePopup(false);
      } else {
        Animated.timing(menuAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    },
  });


  useEffect(() => {
    if (pickerType === 'dogAge') {
      const formattedAge =
        ageUnit === 'years' ? selectedValue : selectedValue / 12; // Convert months to years if needed
      setTempValue(formattedAge);
    } else if (pickerType === 'dogWeight') {
      setTempValue(`${selectedValue} pounds`);
    }
  }, [selectedValue, pickerType, ageUnit]);

  const renderMenuContent = () => {
    // Convert conversations object to an array using Object.values()
    const conversationList = Object.values(conversations);

    switch (activeMenu) {
	     case 'user':
               return (
                 <View style={[styles.menuContent, { backgroundColor: 'rgba(255, 192, 203, 0.8)' }]}>
                   <Text style={styles.menuTitle}>Doggie Profile</Text>
                   {/*renderField('Username', 'userName')*/}
                   {renderField( 'dogName')}
                    {renderField( 'dogAge')}
                   {renderField( 'dogColor')}
                   {renderField( 'dogWeight')}
                   {renderField('dogRace')}
                   {renderField( 'dogSize')}
                   {renderField('dogPersonality')}
                   {renderField('dogHobbies')}
                 </View>
               );
      case 'msg':
        return (
          <View style={[styles.menuContent, { backgroundColor: 'rgba(173, 216, 230, 0.8)' }]}>
            <Text style={styles.menuTitle}>Messages</Text>

            <TouchableWithoutFeedback style={styles.startChatButton} onPress={() =>/* setShowPopup(true)*/setShowNewChatPopup(true)}>
              <Text style={styles.buttonText}>Start New Chat</Text>
            </TouchableWithoutFeedback>

            {conversationList.length > 0 ? (
              <ScrollView style={styles.conversationList}>
                {conversationList.map((conversation) => {
                  // Get the participant user ID(s) from the conversation
                  const participantIds = conversation.participants.filter((id) => id !== user.id);

//console.log("feeling lost "+ JSON.stringify(conversation));

                  // Get the participant's name from the users state using the ID
                  const participantName = conversation.otherUser || 'Unknown User';
                // const participantName = conversation.participants[1] || 'Unknown User';

                  // Get the last message for the conversation
                  const lastMessageId = conversation.messages[conversation.messages.length - 1];
                  const lastMessage = messages[lastMessageId];

                  // Only display conversations that have messages
                  if (!lastMessage) return null;

                  return (
                    <TouchableWithoutFeedback key={conversation.id} onPress={() => openPopup(conversation.id, participantName, )}>
                      <View style={styles.conversationItem}>
                        <View style={styles.chatHeader}>
                          {/* Light blue background for "Chat with [User]" */}
                          <Text style={styles.placeholderText}>Chat with {participantName}</Text>
                        </View>

                        {/* Last message text aligned to the left */}
                        <Text style={styles.latestMessageText}>
                          {lastMessage.text || 'No message text'}
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  );
                })}
              </ScrollView>
            ) : (
              <Text style={styles.noConversationText}>No conversations yet</Text>
            )}
          </View>
        );
   case 'search':
        return (
          <View style={[styles.menuContent, { backgroundColor: 'rgba(144, 238, 144, 0.8)' }]}>
            <Text style={styles.menuTitle}>Search Options</Text>
          <TouchableOpacity
                   style={styles.startChatButton}
                   onPress={() => setShowDoggiePopup(true)}
                 >
                   <Text style={styles.buttonText}>New Doggie Friends</Text>
                 </TouchableOpacity>
                 <Text style={styles.menuText}>Lost Items</Text>
                 <Text style={styles.menuText}>Event Creation/Sharing</Text>
                 <Text style={styles.menuText}>Forum</Text>
                 <Text style={styles.menuText}>Business</Text>

          </View>
        );

case 'gear':
  return (
    <View style={[styles.menuContent, { backgroundColor: 'rgba(255, 165, 0, 0.8)' }]}>
      <Text style={styles.menuTitle}>Settings</Text>
      <Text style={styles.menuText}>App Skin Choice</Text>
      <Text style={styles.menuText}>Language</Text>
      <Text style={styles.menuText}>Password & Email Management</Text>

      {/* Buttons for Logout and Signout */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.logoutButton}   onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signoutButton} onPress={() => console.log('Signout pressed')}>
          <Text style={styles.buttonText} onPress={triggerSignOutPopup}>Signout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
      default:
        return null;
    }
  };

  return (
    <Animated.View style={[styles.menu, { transform: [{ translateX: menuAnim }] }]} {...panResponder.panHandlers}>
      {renderMenuContent()}
      {showPopup && (
        <MessagePopup
          conversationId={currentConversationId || undefined}
          senderUsername={user.userName}
          receiverUsername={newChatReceiver || undefined}
          onClose={closePopup}
        />
      )}
	   {showNewChatPopup && (
         <NewChatPopup
           onClose={() => setShowNewChatPopup(false)}
           onSelectUser={(username) => initiateConversation(username)}
         />
       )}

         {showDoggiePopup && (
           <NewDoggiePopup
             onClose={() => setShowDoggiePopup(false)}
             onSelectDoggie={handleSelectDoggie}
             userName={user.userName}

           />
         )}

{showPicker && (
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
)}

<Modal
  transparent={true}
  animationType="fade"
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)} // Close modal on back button press
>
  <View style={styles.overlay}>
    {/* Background Overlay */}
    <TouchableOpacity
      style={styles.overlayBackground}
      onPress={() => setModalVisible(false)} // Close modal when tapping outside
    />

    {/* Popup Container */}
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>Select Hobbies</Text>

      {/* Hobbies List */}
      <ScrollView contentContainerStyle={styles.hobbiesList}>
        {hobbies.map((hobby, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.hobbyItem,
              selectedHobbies.includes(index) && styles.hobbySelected,
            ]}
            onPress={() => handleHobbyToggle(index)} // Toggle hobby selection
          >
            <Icon
              name={selectedHobbies.includes(index) ? 'check-circle' : 'circle-thin'}
              size={24}
              color={selectedHobbies.includes(index) ? '#6200ee' : 'gray'}
            />
            <Text style={styles.hobbyText}>{hobby}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Confirm Button */}
 <TouchableOpacity
   style={styles.validateButton}
   onPress={() => {
     // Save hobbies to selectedHobbies
     const updatedHobbies = selectedHobbies.join('; '); // Convert to string if needed
     setTempValue(updatedHobbies); // Optionally update tempValue if needed for other purposes
     setModalVisible(false); // Close the modal

     // Update selectedHobbies state (this will trigger a UI re-render)
     setSelectedHobbies(selectedHobbies);
   }}
 >
   <Icon name="check" size={24} color="green" />
   <Text style={styles.validateText}>Confirm</Text>
 </TouchableOpacity>

    </View>
  </View>
</Modal>





    </Animated.View>
  );



};

/*  { onPress={() => handleAgeUnitChange(ageUnit === 'years' ? 'months' : 'years')}
                     style={styles.toggleButton}}*/

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '65%',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    zIndex: 1000,
  },
  menuContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-evenly',
  },
    fieldContainer: {
      flexDirection: 'row', // Arrange key, value, and icon horizontally
      alignItems: 'center', // Vertically center the items
      justifyContent: 'space-between', // Distribute space between elements
      marginBottom: 10, // Add spacing between rows
    },
  menuText: {
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1, // Allow the label to occupy its space proportionally
    textAlign: 'left', // Align label to the left
  },
  valueText: {
    fontSize: 16,
    flex: 2, // Give more space to the value text
    textAlign: 'left',
  },
  inputField: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
    flex: 2,
  },
  icon: {
    marginLeft: 10, // Add a little spacing between the value/input and the icon
  },
  menuTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  conversationItem: {
    backgroundColor: '#ADD8E6', // Light blue background for the entire item
    padding: 12, // Smaller padding for a cleaner look
    borderRadius: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#fff', // White border to differentiate items
  },
  chatHeader: {
    backgroundColor: '#ADD8E6', // Light blue for the header
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 5,
  },
  placeholderText: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center', // Keeping header text centered
  },
  latestMessageText: {
    color: '#555',
    fontSize: 14,
    textAlign: 'left', // Align last message text to the left
    marginTop: 5,
  },
  noConversationText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  conversationList: {
    flex: 1,
    marginTop: 20,
  },
  startChatButton: {
    backgroundColor: '#4682B4',
    padding: 8, // Smaller button
    borderRadius: 8,
    marginVertical: 8,
    alignSelf: 'center',
	},
  popupContainer: {
    position: 'absolute',
    top: '10%',
    left: '5%',
    width: '90%',
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    zIndex: 2000,
  },
  popupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
   userButton: {
    backgroundColor: '#87CEEB',
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
  },
   buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      marginTop: 20,
    },
    logoutButton: {
      backgroundColor: '#FF6347', // Tomato red
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
    },
    signoutButton: {
      backgroundColor: '#4682B4', // Steel blue
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
    },















  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  /*
  fieldContainer: {
    marginBottom: 20,
  },
  */
  label: {
    fontSize: 18,
  },
  /*

  buttonText: {
    color: '#1E90FF',
    fontSize: 16,
    marginTop: 5,
  },


  */



valueText: {
  fontSize: 16,
  flex: 2, // Allow value text to take more space
  textAlign: 'left',
  color: 'black', // Ensure the text color is visible
},






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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Grayed-out background
  },
  pickerContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheel: {
    width: 250,
    height: 250,
  },
  validateButton: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  validateText: {
    marginLeft: 8,
    fontSize: 16,
    color: 'green',
  },





   pickerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    toggleButton: {
      marginTop: 10,
      padding: 10,
      backgroundColor: '#f0f0f0',
      borderRadius: 5,
      alignItems: 'center',
    },
     toggleText: {
        fontSize: 16,
        marginRight: 10, // Add spacing between label and switch
      },
    validateButton: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    validateText: {
      marginLeft: 5,
      fontSize: 16,
      color: 'green',
    },


ageSwitch:{
        transform: [{ scale: 1.2 }],
    },

  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center the switch and label horizontally
    marginTop: 10,
  },










    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
      justifyContent: 'center', // Center vertically
      alignItems: 'center', // Center horizontally
    },
    overlayBackground: {
      ...StyleSheet.absoluteFillObject, // Cover the entire screen
    },
    modalContainer: {
      width: '80%',
      backgroundColor: '#fff', // White background
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5, // Android shadow
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    hobbiesList: {
      alignItems: 'flex-start', // Align text to the left
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
      backgroundColor: '#e6e6ff', // Highlight selected hobby
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

export default SlidingMenu;
