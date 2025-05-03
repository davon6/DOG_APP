import React, { useState, useContext } from 'react';
import { View, TextInput, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Button, Snackbar, Avatar, Switch  } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker'; // Native Picker for dropdowns
import { UserContext } from '@/services/Context';
import Icon from 'react-native-vector-icons/FontAwesome';
import { WheelPicker } from '@gregfrench/react-native-wheel-picker';

const races = [
  'Labrador', 'Bulldog', 'Poodle', 'Golden Retriever', 'Beagle',
  'German Shepherd', 'Chihuahua', 'Rottweiler', 'Dachshund', 'Husky',
  'Boxer', 'Great Dane', 'Pug', 'Doberman', 'Shih Tzu'
];

const sizes = [
  { label: 'Tiny (< 50 cm)', value: 'tiny' },
  { label: 'Small (50 cm - 1m)', value: 'small' },
  { label: 'Medium (1m - 1.5m)', value: 'medium' },
  { label: 'Large (1.5m - 2m)', value: 'large' },
  { label: 'Huge (> 2m)', value: 'huge' },
];

const personalities = [
  'Playful', 'Calm', 'Energetic', 'Curious', 'Friendly', 'Loyal',
  'Aggressive', 'Shy', 'Protective', 'Gentle'
];

const hobbies = [
  'Playing Fetch', 'Running', 'Swimming', 'Digging', 'Chewing Toys',
  'Tug-of-War', 'Hide and Seek', 'Agility Training', 'Playing with Balls',
  'Socializing with Other Dogs', 'Hiking', 'Napping', 'Chasing Squirrels',
  'Frisbee', 'Cuddling', 'Obstacle Courses', 'Exploring New Places',
  'Learning Tricks', 'Playing in the Water', 'Walking on Leash'
];

interface SignUpScreenProps {
  navigation: any;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [race, setRace] = useState<string>('');
  const [age, setAge] = useState<number>(1); // For number input (initialized to 1)
  const [ageUnit, setAgeUnit] = useState<string>('month');
  const [size, setSize] = useState<string>('');
  const [personality, setPersonality] = useState<string>('');
  const [selectedHobbies, setSelectedHobbies] = useState<number[]>([]);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [dog_name, setDog_name] = useState<string>('');
  const [weight, setWeight] = useState<number>(10); // For weight input (initialized to 10)
  const [color, setColor] = useState<string>('');
  const [weightUnit, setWeightUnit] = useState<string>('pounds');
  const weightOptions = Array.from({ length: 200 }, (_, i) => (i + 1).toString());

  const { user, updateUser } = useContext(UserContext);
  const [dogSex, setDogSex] = useState<string>('Male');


   const handleHobbyToggle = (index: number) => {
            setSelectedHobbies((prev) =>
              prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
            );
          };


   const ageUnits = ['month', 'year'];

  const handleSignUp = () => {

 const selectedHobbyNames = selectedHobbies.map(index => hobbies[index]);

       if (!dog_name || dog_name.length < 2) {
          setError('Dog name must be at least 2 characters long.');
          return;
        }
    if (!dog_name || !weight || !color || !race || !age || !size || !personality || selectedHobbies.length === 0) {
      setError('Please fill all the fields and select at least one hobby.');
      return;
    }

const sex = dogSex=="Male"? 1: 0;
 const finalAge = ageUnit === 'year' ? age : age / 12;

    // Log the results for now
    console.log({
      dog_name,
      sex,
      weight: `${weight} ${weightUnit}`,
      color,
      race,
      age: finalAge,
      size,
      personality,
      hobbies: selectedHobbies.join('; ')
    });

    updateUser({
      userName: "none",
      dogName: dog_name,
      dogWeight: `${weight} ${weightUnit}`,
      dogColor: color,
      dogRace: race,
      dogSex: sex,
      dogAge: finalAge,
      dogSize: size,
      dogPersonality: personality,
      dogHobbies: selectedHobbies.join('; ')
    });

    navigation.navigate('SignUp_2');

    setSuccessMessage('Dog info submitted successfully!');
    setError('');
  };

   const handleSexToggle = () => {
      setDogSex((prev) => (prev === 'Male' ? 'Female' : 'Male'));
    };
/*
  const handleHobbyToggle = (hobby: string) => {
    setSelectedHobbies((prev) =>
      prev.includes(hobby) ? prev.filter((h) => h !== hobby) : [...prev, hobby]
    );
  };*/

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Funky Header */}
      <Text style={styles.headerText}>Welcome to the Pawpal Finder! 🐾</Text>

      <Avatar.Icon
        size={100}
        icon={() => <Icon name="paw" size={100} color="#FFFFFF" />}
        style={styles.avatar}
      />

      <TextInput
        placeholder="🐾 Doggy Name"
        onChangeText={setDog_name}
        value={dog_name}
        style={styles.input}
      />
      <TextInput
        placeholder="Doggy Color"
        onChangeText={setColor}
        value={color}
        style={styles.input}
      />

        {/* Dog Sex Toggle */}
            <View style={styles.fieldContainer}>

              <View style={styles.switchContainer}>
                <Icon
                  name={dogSex === 'Male' ? 'mars' : 'venus'}
                  size={24}
                  color={dogSex === 'Male' ? '#4CAF50' : '#FFC0CB'}
                  style={styles.icon}
                />
                <Switch
                  value={dogSex === 'Male'}
                  onValueChange={handleSexToggle}
                  thumbColor={dogSex === 'Male' ? '#4CAF50' : '#FFC0CB'}
                  trackColor={{ true: '#A5D6A7', false: '#FFCDD2' }}
                   style={styles.sexSwitch}
                />
                <Text style={styles.menuText}>{dogSex}</Text>
              </View>
            </View>

      {/* Weight and Age on Same Row */}
      <View style={styles.weightAgeContainer}>
        {/* Weight Picker */}
        <View style={styles.weightContainer}>
          <Text style={styles.label}>Weight</Text>
          <WheelPicker
            selectedItem={weight - 1} // Use index for selected weight
            data={weightOptions} // Weight options as strings
            onItemSelected={(index) => setWeight(parseInt(weightOptions[index], 10))} // Update state
            style={styles.wheel}
            itemTextSize={20} // Adjust text size
            selectedItemTextSize={24} // Highlight selected item size
            selectedItemTextColor="#FF4500" // Highlight color
            indicatorColor="#FF4500" // Line color
            itemTextColor="#000000" // Regular text color
          />
        </View>

      {/* Age Picker */}
      <View style={styles.ageContainer}>
        <Text style={styles.label}>Age</Text>
        <WheelPicker
          selectedItem={age - 1} // Adjusted index for selected item
          data={Array.from({ length: 20 }, (_, i) => (i + 1).toString())} // Age options (1-20)
          onItemSelected={(index) => setAge(index + 1)} // Adjusted index for selected age
          style={styles.wheel}
          itemTextSize={20} // Adjust text size
          selectedItemTextSize={24} // Highlight selected item size
          selectedItemTextColor="#FF4500" // Highlight color
          indicatorColor="#FF4500" // Line color
          itemTextColor="#000000" // Regular text color
        />
      </View>

      {/* Age Unit Picker */}
      <View style={styles.ageContainer}>
        <Text style={styles.label}>Unit</Text>
        <WheelPicker
          selectedItem={ageUnits.indexOf(ageUnit)} // Ensure index is correct for unit
          data={ageUnits} // Months or Years
          onItemSelected={(index) => setAgeUnit(ageUnits[index])} // Update age unit
          style={styles.wheelUnit}
          itemTextSize={20} // Adjust text size
          selectedItemTextSize={24} // Highlight selected item size
          selectedItemTextColor="#FF4500" // Highlight color
          indicatorColor="#FF4500" // Line color
          itemTextColor="#000000" // Regular text color
        />
      </View>
      </View>



      {/* Race Dropdown */}
      <Text style={styles.label}>Race</Text>
      <Picker selectedValue={race} onValueChange={setRace} style={styles.picker}>
        <Picker.Item label="Select Dog Race" value="" />
        {races.map((r) => (
          <Picker.Item key={r} label={r} value={r} />
        ))}
      </Picker>

      {/* Size Dropdown */}
      <Text style={styles.label}>Size</Text>
      <Picker selectedValue={size} onValueChange={setSize} style={styles.picker}>
        <Picker.Item label="Select Size" value="" />
        {sizes.map((s) => (
          <Picker.Item key={s.value} label={s.label} value={s.value} />
        ))}
      </Picker>

      {/* Personality Dropdown */}
      <Text style={styles.label}>Personality</Text>
      <Picker selectedValue={personality} onValueChange={setPersonality} style={styles.picker}>
        <Picker.Item label="Select Personality" value="" />
        {personalities.map((p) => (
          <Picker.Item key={p} label={p} value={p} />
        ))}
      </Picker>

      {/* Hobbies/Activities Selection */}

   <Text style={styles.label}>Hobbies/Activities</Text>
       <View style={styles.hobbiesContainer}>
         {hobbies.map((hobby, index) => (
           <View key={index} style={styles.checkboxWrapper}>
             <TouchableOpacity
               style={styles.checkboxContainer}
               onPress={() => handleHobbyToggle(index)} // Pass index here
             >
               <Icon
                 name={selectedHobbies.includes(index) ? 'check-circle' : 'circle-thin'}
                 size={24}
                 color={selectedHobbies.includes(index) ? '#6200ee' : 'gray'}
               />
               <Text style={styles.labelHobbies}>{hobby}</Text>
             </TouchableOpacity>
           </View>
         ))}

</View>
      {/* Error Message */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Sign Up Button */}
      <Button mode="contained" onPress={handleSignUp}>
        Register Doggy 🎉
      </Button>

      {/* Success Message */}
      <Snackbar
        visible={!!successMessage}
        onDismiss={() => setSuccessMessage('')}
        action={{ label: 'OK' }}
        style={styles.snackbar}
      >
        {successMessage}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F8F8FF',
  },
  headerText: {
    fontSize: 28,
    color: '#FF4500',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  avatar: {
    alignSelf: 'center',
    backgroundColor: '#FF6F61',
    marginBottom: 20,
  },
  picker: {
    height: 50,
    backgroundColor: '#FFF0F5',
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'gray',
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 10,
    fontSize: 18,
    backgroundColor: '#FFF0F5',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    marginLeft: 10,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  snackbar: {
    backgroundColor: '#32CD32',
    marginTop: 20,
  },
  weightAgeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  weightContainer: {
    flex: 1,
    marginRight: 10,
  },
  ageContainer: {
    flex: 1,
    marginLeft: 10,
  },
   checkboxContainer: {
     flexDirection: 'row',
     alignItems: 'center',
     marginBottom: 10, // Adds spacing between items
   },
    container: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: '#F8F8FF',
    },
    headerText: {
      fontSize: 28,
      color: '#FF4500',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
    },
    avatar: {
      alignSelf: 'center',
      backgroundColor: '#FF6F61',
      marginBottom: 20,
    },
    picker: {
      height: 50,
      backgroundColor: '#FFF0F5',
      marginBottom: 15,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: 'gray',
    },
    input: {
      flex: 1,
      height: 50,
      borderColor: 'gray',
      borderWidth: 1,
      paddingHorizontal: 10,
      borderRadius: 10,
      fontSize: 18,
      backgroundColor: '#FFF0F5',
    },
    label: {
      fontSize: 21,
      fontWeight: 'bold',
      marginBottom: 5,
    },
labelHobbies : {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
      marginLeft: 10,
    },

    error: {
      color: 'red',
      textAlign: 'center',
      marginBottom: 10,
    },
    snackbar: {
      backgroundColor: '#32CD32',
      marginTop: 20,
    },
    weightAgeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 15,
      width: '100%',
    },
    weightContainer: {
      flex: 1, // Ensures each picker takes equal space
      marginRight: 10, // Space between the weight and age pickers
    },
    ageContainer: {
      flex: 1, // Ensures each picker takes equal space
      marginLeft: 10, // Space between the weight and age pickers
    },
    wheel: {
      height: 150,  // Adjust the height to make it more visible
      width: '100%', // Make the wheel picker take full width of its container
    },


 wheelUnit: {
      height: 150,  // Adjust the height to make it more visible
      width: 100, // Make the wheel picker take full width of its container
    },
  hobbiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
    checkboxWrapper: {
      width: '48%', // Two columns, each takes roughly half the space
      marginBottom: 10, // Adds some spacing between rows
    },

  fieldContainer: {
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    marginRight: 10,
  },
  sexSwitch: {
      transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
      height:100
      },
});

export default SignUpScreen;
