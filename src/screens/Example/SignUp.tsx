import React, { useState, useContext } from 'react';
import { View, TextInput, StyleSheet, Text, ScrollView } from 'react-native';
import { Button, Snackbar, Avatar, HelperText, Checkbox } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker'; // Native Picker for dropdowns
import { UserContext } from '@/services/Context';
import Icon from 'react-native-vector-icons/FontAwesome';

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
  const [age, setAge] = useState<string>(''); // For number input
  const [ageUnit, setAgeUnit] = useState<string>('month');
  const [size, setSize] = useState<string>('');
  const [personality, setPersonality] = useState<string>('');
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [dog_name, setDog_name] = useState<string>('');
const [weight, setWeight] = useState<string>('');
const [color, setColor] = useState<string>('');
const [weightUnit, setWeightUnit] = useState<string>('pounds');

 const { user,updateUser } = useContext(UserContext);
  const handleSignUp = () => {



    if (!dog_name ||!weight ||!color || !race || !age || !size || !personality || selectedHobbies.length === 0) {
      setError('Please fill all the fields and select at least one hobby.');
      return;
    }

    // Log the results for now
    console.log({
        dog_name,
        weight:`${weight} ${weightUnit}`,
        color,
        race,
        age: `${age} ${ageUnit}`,
        size,
        personality,
        hobbies: selectedHobbies.join('; ')
    });



updateUser({
    USER_NAME:"none",
                DOG_NAME:dog_name,
                D_WEIGHT:`${weight} ${weightUnit}`,
                D_COLOR:color,
                D_RACE:race,
                D_AGE:`${age} ${ageUnit}`,
                D_SIZE:size,
                D_PERSONALITY:personality,
                D_HOBBIES: selectedHobbies.join('; ')
               });





//console.log("fuck yeqh ueser is kinda up"+JSON.stringify(user));
navigation.navigate('SignUp_2');

    setSuccessMessage('Dog info submitted successfully!');
    setError('');
  };

  const handleHobbyToggle = (hobby: string) => {
    setSelectedHobbies((prev) =>
      prev.includes(hobby) ? prev.filter((h) => h !== hobby) : [...prev, hobby]
    );
  };

/*
    const handleHobbyToggle = (hobbyIndex: number) => {
      setSelectedHobbies((prev) =>
        prev.includes(hobbyIndex)
          ? prev.filter((index) => index !== hobbyIndex)
          : [...prev, hobbyIndex]
      );
    };
*/
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Funky Header */}
      <Text style={styles.headerText}>Welcome to the Pawpal Finder! 🐾</Text>

      {/*<Avatar.Icon size={100} icon="paw" style={styles.avatar} />*/}
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
        <Text style={styles.label}>Weight</Text>
            <View style={styles.ageContainer}>
              <TextInput
                placeholder="Weight"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
                style={styles.input}
              />
              <Picker
                selectedValue={weightUnit}
                onValueChange={(value) => setWeightUnit(value)}
                style={styles.weightPicker}
              >
                <Picker.Item label="pounds" value="pounds" />
                <Picker.Item label="kg" value="kg" />
              </Picker>
            </View>

      {/* Race Dropdown */}
      <Text style={styles.label}>Race</Text>


      <Picker
        selectedValue={race}
        onValueChange={(value) => setRace(value)}
        style={styles.picker}
      >
        <Picker.Item label="Select Dog Race" value="" />
        {races.map((r) => (
          <Picker.Item key={r} label={r} value={r} />
        ))}
      </Picker>

      {/* Age Input */}
      <Text style={styles.label}>Age</Text>
      <View style={styles.ageContainer}>
        <TextInput
          placeholder="Age"
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
          style={styles.input}
        />
        <Picker
          selectedValue={ageUnit}
          onValueChange={(value) => setAgeUnit(value)}
          style={styles.agePicker}
        >
          <Picker.Item label="Months" value="month" />
          <Picker.Item label="Years" value="year" />
        </Picker>
      </View>

      {/* Size Dropdown */}
      <Text style={styles.label}>Size</Text>
      <Picker
        selectedValue={size}
        onValueChange={(value) => setSize(value)}
        style={styles.picker}
      >
        <Picker.Item label="Select Size" value="" />
        {sizes.map((s) => (
          <Picker.Item key={s.value} label={s.label} value={s.value} />
        ))}
      </Picker>

      {/* Personality Dropdown */}
      <Text style={styles.label}>Personality</Text>
      <Picker
        selectedValue={personality}
        onValueChange={(value) => setPersonality(value)}
        style={styles.picker}
      >
        <Picker.Item label="Select Personality" value="" />
        {personalities.map((p) => (
          <Picker.Item key={p} label={p} value={p} />
        ))}
      </Picker>

      {/* Hobbies Tag Selection */}
      <Text style={styles.label}>Hobbies/Activities</Text>
      {hobbies.map((hobby) => (
        <View key={hobby} style={styles.checkboxContainer}>
          <Checkbox
            status={selectedHobbies.includes(hobby) ? 'checked' : 'unchecked'}
            onPress={() => handleHobbyToggle(hobby)}
          />
          <Text>{hobby}</Text>
        </View>
      ))}

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
  },
  ageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  agePicker: {
    flex: 1,
    marginLeft: 10,
  },
   weightPicker: {
      flex: 1,
      marginLeft: 10,
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
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
});

export default SignUpScreen;
