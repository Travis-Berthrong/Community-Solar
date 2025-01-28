import React, { useState } from 'react';
import { View, TextInput, Alert, KeyboardAvoidingView, Platform, Text, TouchableOpacity } from 'react-native';
import { Button } from '@rneui/themed';
import { Eye, EyeOff } from 'lucide-react-native';
import { router } from 'expo-router';
import { login } from '../services/auth';
import { loginStyles } from '../styles/loginStyles';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    try {
      const token = await login(email, password);
      console.log('Login successful, token:', token);
      router.replace('/home');
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={loginStyles.container}
    >
      <View style={loginStyles.card}>
        <Text style={loginStyles.title}>Let's Save the Planet!</Text>
        <Text style={loginStyles.subtitle}>
          Please login to your account to continue.
        </Text>
        <TextInput
          style={loginStyles.input}
          placeholder="Email Address"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <View style={loginStyles.passwordContainer}>
          <TextInput
            style={loginStyles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={loginStyles.iconContainer}>
            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </TouchableOpacity>
        </View>
        <Button
          title="Login"
          onPress={handleLogin}
          buttonStyle={loginStyles.loginButton}
          titleStyle={loginStyles.buttonText}
        />
        <View style={loginStyles.footer}>
          <Text style={loginStyles.footerText}>Don't have an account?</Text>
          <Button
            title="Sign Up"
            onPress={() => router.push('/signup')}
            type="clear"
            titleStyle={loginStyles.signUpText}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
