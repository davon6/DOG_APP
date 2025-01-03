import React, { useState, useContext } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { Button, Snackbar, Avatar } from 'react-native-paper';
import Spinkit from 'react-native-animated-spinkit'; // Funky spinner
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { UserContext } from '@/services/Context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SignUp_2ScreenProps {
  navigation: any;
}

const SignUp_2Screen: React.FC<SignUp_2ScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

 const { user,updateUser } = useContext(UserContext);
  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }



    setLoading(true);



    try {


console.log("await axios.post('http://172.20.10.8:3000/api/users/signup'")

      const response = await axios.post('https://e9e3-2a04-cec0-105d-76e2-9932-f67a-e713-120f.ngrok-free.app/api/users/signup', {
        username,
        email,
        password,
        dogName:user.dogName,
        dogColor:user.dogColor,
        dogWeight:user.dogWeight,
        dogRace:user.dogRace,
        dogSize:user.dogSize,
        dogAge:user.dogAge,
        dogPersonality:user.dogPersonality,
        dogHobbies:user.dogHobbies
      },{
                          headers: {
                            'Content-Type': 'application/json',  // Ensure this header is present
                          }
                        });
/*

                 console.log("what is the matter-->");

                     console.log("what is the matter-->"   +JSON.stringify(response));
*/
      if (response.status === 201) {





        setSuccessMessage('Account created successfully!');

        updateUser({
                                    dogName:user.dogName,
                                    dogWeight:user.dogWeight,
                                    dogColor:user.dogColor,
                                    dogRace:user.dogRace,
                                    dogAge:user.dogAge,
                                    dogSize:user.dogSize,
                                    dogPersonality:user.dogPersonality,
                                    dogHobbies: user.dogHobbies,
                                    userName: username
           });



try {
         await AsyncStorage.setItem('userToken', response.data.token);
         await AsyncStorage.setItem('refreshToken', response.data.refreshToken);

         await AsyncStorage.setItem('user_info', JSON.stringify(user));


         console.log('Tokens stored successfully'); // Log success
       } catch (storageError) {
         console.error('Failed to store the token:', storageError); // Log the error
       }

   console.log("so our new user nqme is ", username);

   let data = [username, ""];

        navigation.navigate('Example',data); // Navigate after success
      }
    } catch (error) {

        console.log("signup error "+ error);

      setError('Something went wrong, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Funky Header */}
      <Text style={styles.headerText}>And now about you! 🐾</Text>

     <Avatar.Icon
       size={100}
       icon={() => <Icon name="user" size={100} color="#FFFFFF" />}
       style={styles.avatar}
     />
<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

    </View>
      {/* Username Input */}
      <TextInput
        placeholder="👤 Username"
        onChangeText={setUsername}
        value={username}
        style={styles.input}
      />

      {/* Email Input */}
      <TextInput
        placeholder="✉️ Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        style={styles.input}
      />

      {/* Password Input */}
      <TextInput
        placeholder="🔒 Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
        style={styles.input}
      />

      {/* Confirm Password Input */}
      <TextInput
        placeholder="🔑 Confirm Password"
        secureTextEntry
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        style={styles.input}
      />

      {/* Error Message */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Funky Spinner when loading
      {loading ? (
        <View style={styles.spinnerContainer}>
          <Spinkit type="Wave" color="#FFD700" size={50} />
        </View>
      ) : (
        <Button mode="contained" onPress={handleSignUp}>
          ready to register doggy 🎉
        </Button>
      )}
*/}
  <Button mode="contained" onPress={handleSignUp}>
          ready to register doggy 🎉
        </Button>

      {/* Success Message
      <Snackbar
        visible={!!successMessage}
        onDismiss={() => setSuccessMessage('')}
        action={{ label: 'OK' }}
        style={styles.snackbar}
      >
        {successMessage}
      </Snackbar>
      */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    fontSize: 18,
    backgroundColor: '#FFF0F5',
  },
  spinnerContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  snackbar: {
    backgroundColor: '#32CD32',
    marginTop: 20,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default SignUp_2Screen;
