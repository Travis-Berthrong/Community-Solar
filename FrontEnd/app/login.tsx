import React, { useState } from 'react';
import { View, TextInput, Alert, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { Button } from '@rneui/themed';
import { router } from 'expo-router';
import { login } from '../services/auth';
import { loginStyles } from '../styles/loginStyles';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    try {
      await login(email, password);
      router.replace('/home');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Login failed. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={loginStyles.container}
    >
      <View style={loginStyles.card}>
        <Text style={loginStyles.title}>Welcome Back</Text>
        <TextInput
          style={loginStyles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={loginStyles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button 
          title="Login" 
          onPress={handleLogin}
          buttonStyle={loginStyles.loginButton}
          titleStyle={loginStyles.buttonText}
        />
        <Button 
          title="Sign Up" 
          onPress={() => router.push('/signup')} 
          type="clear"
          titleStyle={loginStyles.signUpText}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
