import React, { useState } from 'react';
import { TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button } from '@rneui/themed';
import { router } from 'expo-router';
import { signup } from '../services/auth';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    console.log('Signup button pressed');
    
    if (!email || !password || !firstName || !lastName || !phoneNumber || !address) {
      console.log('Form validation failed');
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
  
    setIsLoading(true);
    console.log('Attempting signup with:', { Email: email, FirstName: firstName, LastName: lastName });
  
    try {
      const response = await signup({
        Email: email,
        Password: password,
        FirstName: firstName,
        LastName: lastName,
        PhoneNumber: phoneNumber,
        Address: address
      });
      
      if (response.status === 201) {
        console.log('Signup successful');
        Alert.alert('Success', 'Account created successfully');
        console.log('Navigating to login page');
        router.replace('/login');
      } else {
        throw new Error('Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    console.log('Navigating to login page');
    router.replace('/login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        multiline
      />
      <Button 
        title="Sign Up" 
        onPress={handleSignup}
        loading={isLoading}
        disabled={isLoading}
      />
      <Button 
        title="Already have an account? Login" 
        onPress={navigateToLogin}
        type="clear"
        disabled={isLoading}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
