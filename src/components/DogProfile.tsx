import React, { useState, useEffect, useRef } from 'react';
import { TextInput, View, Text, TouchableOpacity, Modal, Switch, StyleSheet, Animated } from 'react-native';
import { WheelPicker } from 'react-native-wheel-picker-android';
import HobbiesModal from './HobbiesModal';
import { updateUser as updtU } from '@/api/apiService';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomModal from './CustomModal';
import PickerModal from './pickerModal';

const DogProfile = ({ user, updateUser }) => {
  const hobbies = [
    'Playing Fetch', 'Running', 'Swimming', 'Digging', 'Chewing Toys',
    'Tug-of-War', 'Hide and Seek', 'Agility Training', 'Playing with Balls',
    'Socializing with Other Dogs', 'Hiking', 'Napping', 'Chasing Squirrels',
    'Frisbee', 'Cuddling', 'Obstacle Courses', 'Exploring New Places',
    'Learning Tricks', 'Playing in the Water', 'Walking on Leash',
  ];

    const [editableField, setEditableField] = useState(null); // Track which field is being edited
    const [tempValue, setTempValue] = useState(''); // Temporary value for editing
    const inputRef = useRef<TextInput>(null);
    const [showPicker, setShowPicker] = useState(false); // Controls wheel visibility
    const [pickerType, setPickerType] = useState(''); // Type of the field being modified ('age' or 'weight')
    const [age, setAge] = useState(5);
    const [weight, setWeight] = useState(10);
    const [selectedValue, setSelectedValue] = useState(5); // Temporary value for picker selection
    const numbers = Array.from({ length: 100 }, (_, i) => i + 1);
    const [ageUnit, setAgeUnit] = useState('years'); // Default to 'years'

    const [selectedHobbies, setSelectedHobbies] = useState<number[]>([]);
    const [modalVisible, setModalVisible] = useState(false);


      const [customModalVisible, setCustomModalVisible] = useState(false);
      const [customModalContent, setCustomModalContent] = useState(''); // Content for the modal
      const [customModalTitle, setCustomModalTitle] = useState(''); // Title for the modal



const handleOpenCustomModal = (title: string, content: string | string[]) => {
    setCustomModalTitle(title);
    setCustomModalContent(content);
    setCustomModalVisible(true);
  };

   const handleCloseCustomModal = () => {
      setCustomModalVisible(false);
    };

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
    //updateUser({ ...user, dogAge: value });
  } else if (pickerType === 'dogWeight') {
      console.log("so we now setUser");

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
  console.log("--------------->>>>>>Selected value: " + selectedValue);

  if (pickerType === 'dogAge') {
    // Handle the age unit conversion for months/years
    const convertedValue = ageUnit === 'years' ? selectedValue : selectedValue / 12;


      console.log("--------------->>>>>now we gonna tempSet: " + convertedValue);

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

     // Handle initiating edit mode
       const handleEdit = (field, value) => {
         if (field === 'dogAge' || field === 'dogWeight') {
           handleOpenPicker(field); // Directly open the picker for these fields
         } else if (field === 'dogHobbies') {
               //setEditableField(field); // Set hobbies to editable mode
               setSelectedHobbies(value ? value.split(';').map(Number) : []); // Parse existing hobbies into an array of numbers
               setModalVisible(true); // Open hobbies modal
             }else {
           setEditableField(field); // Set the field to editable mode for other fields
           setTempValue(value);

           if (inputRef.current) {
               inputRef.current.focus();
             }
         }
       };


   const handleSave = async (field) => {
 console.log(`Saving field "${field}" with value: ${updatedValue}`);


       console.log("do we get to handle save ?"+tempValue);
     // Use the correct value for hobbies or other fields
     const updatedValue = field === 'dogHobbies' ? selectedHobbies.join('; ') : tempValue;

  console.log("do we get to handle save ?"+updatedValue);
     console.log(`1Saving field "${field}" with value: ${updatedValue}`);
     // Check for invalid values


     /*

     if (!updatedValue || updatedValue.trim() === "") {
       console.log("Invalid value to save");
       return; // Prevent saving if the value is invalid
     }
*/

     //console.log(`2Saving field "${field}" with value: ${updatedValue}`);

     // Update the user object locally
     const updatedUser = { ...user, [field]: updatedValue };

     //  console.log(`3Saving field "${field}" with value: ${updatedValue}`);
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

   const handleHobbiesModalClose = () => {
     handleSave('dogHobbies'); // Save hobbies when the modal closes
     setModalVisible(false); // Close the modal
   };


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
                          ? <TouchableOpacity onPress={() =>

                           handleOpenCustomModal(
                                      field === 'dogHobbies' ? 'Dog Hobbies' : field.replace('dog', ''), // Dynamic title
                                      field === 'dogHobbies' ? renderHobbies(user[field]) : user[field] || 'Not specified' // Dynamic content
                                    )
                          }>
                              <Text
                                style={[styles.menuText, {maxWidth: 400  }]}
                                numberOfLines={1}
                                ellipsizeMode="tail"

                              >
                                {field === 'dogHobbies' ? renderHobbies(user[field]) : user[field] || 'Not specified'}
                              </Text>
                            </TouchableOpacity>// Render hobbies if field is dogHobbies
                          : field === 'dogAge'
                            ? formatAge(user[field])
                            : user[field] || 'Not specified'}

           </Text>
         )}

         {/* Edit/Save Icons */}
         {isEditing ? (
           <TextInput
           ref={inputRef}
             style={styles.inputField}
             placeholder={user[field]}
             value={tempValue}
             onChangeText={setTempValue}
             autoFocus={true}
           />
         ) : null}

         {isEditing ? (
             field === 'dogHobbies' ? null : (
           <TouchableOpacity onPress={() => handleSave(field)}>
             <Icon name="check" size={20} color="green" style={styles.icon} />
           </TouchableOpacity>
         )  ) : (
           <TouchableOpacity onPress={() => handleEdit(field, user[field])}>
             <Icon name="pencil" size={20} color="blue" style={styles.icon} />
           </TouchableOpacity>
         )}

            <CustomModal
                 visible={customModalVisible}
                 title={customModalTitle}
                 content={customModalContent}
                 onClose={handleCloseCustomModal}
               />
       </View>
     );
   };

useEffect(() => {


    if (pickerType === 'dogAge') {
      const formattedAge =
        ageUnit === 'years' ? selectedValue : selectedValue / 12; // Convert months to years if needed
      //console.log("so indeed -----------    ------> formattedAge"+formattedAge);


      setTempValue(formattedAge);
    } else if (pickerType === 'dogWeight') {
      setTempValue(`${selectedValue} pounds`);
    }
  }, [selectedValue, pickerType, ageUnit]);

  return (
    <View  style={{ flex: 1 }}>

       <View style={[styles.menuContent, { flex: 1 ,backgroundColor: 'rgba(255, 192, 203, 0.8)'  }]}>
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

      {/* Hobbies */}
      <TouchableOpacity onPress={() => setModalVisible(true)}>

           </TouchableOpacity>

      {modalVisible && (
              <HobbiesModal
                hobbies={hobbies}
                selectedHobbies={selectedHobbies}
                handleHobbyToggle={handleHobbyToggle}
                setModalVisible={handleHobbiesModalClose}
                setSelectedHobbies={setSelectedHobbies}
              />
            )}



 <PickerModal
   showPicker={showPicker}
   pickerType={pickerType}
   ageUnit={ageUnit}
   setAgeUnit={setAgeUnit}
   selectedValue={selectedValue}
   setSelectedValue={setSelectedValue}
   numbers={numbers}
   handleBackdropPress={handleBackdropPress}
   handleValidateSelection={handleValidateSelection}
 />



    </View>
  );
};




const styles = StyleSheet.create({

    fieldContainer: {
      flexDirection: 'row', // Align text and input horizontally
      justifyContent: 'space-between',
      padding: 15, // Add more padding for spacing inside each field container
      marginBottom: 10, // Adds space between fields
      borderWidth: 1, // Border for each field
      borderColor: '#ccc', // Light gray color for the border
      borderRadius: 8, // Rounded corners for the border
      backgroundColor: '#f9f9f9', // Light background for the field container
      shadowColor: '#000', // Shadow for a lifted effect
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4, // Slight shadow for a more "card-like" look
    },
    menuText: {
      fontSize: 18,
      fontWeight: '500',
      color: 'black',
    },
    menuContent: {
      padding: 15,
      backgroundColor: 'white',
    },
    menuTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 15,
    },
    inputField: {
      borderBottomWidth: 1,
      borderColor: 'gray',
      width: 200,
      height: 40, // Adjust the height to make it more compact
      marginLeft: 10,
      paddingLeft: 5,
    },
    icon: {
      marginLeft: 10,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Overlay background for modal
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      width: '80%',
      alignItems: 'center',
    },
});

export default DogProfile;
