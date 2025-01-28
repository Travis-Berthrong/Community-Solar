import React, { useState } from 'react';
import { TextInput, View, Text, Alert, TouchableOpacity, KeyboardTypeOptions, FlatList } from 'react-native';
import { Button } from '@rneui/themed';
import { router } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';
import { signup } from '../services/auth';
import { signupStyles } from '../styles/signupStyles';

export default function Signup() {
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const GEOAPIFY_API_KEY = '9fac2d72553e436c9f1ff95e27cf3362';

  const fields = [
    { label: 'Email', value: email, setValue: setEmail, placeholder: 'Enter your email', keyboardType: 'email-address' },
    {
      label: 'Password',
      value: password,
      setValue: setPassword,
      placeholder: 'Create a password',
      secureTextEntry: !showPassword,
      renderRightIcon: () => (
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
        </TouchableOpacity>
      ),
    },
    { label: 'First Name', value: firstName, setValue: setFirstName, placeholder: 'Enter your first name' },
    { label: 'Last Name', value: lastName, setValue: setLastName, placeholder: 'Enter your last name' },
    { label: 'Phone Number', value: phoneNumber, setValue: setPhoneNumber, placeholder: 'Enter your phone number', keyboardType: 'phone-pad' },
    { label: 'Address', value: address, setValue: setAddress, placeholder: 'Enter your address', isAddress: true },
  ];

  const fetchAddressSuggestions = async (query: string) => {
    if (!query) {
      setAddressSuggestions([]);
      return;
    }

    setIsFetching(true);

    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&apiKey=${GEOAPIFY_API_KEY}`
      );
      const data = await response.json();
      setAddressSuggestions(data.features.map((feature: any) => feature.properties.formatted));
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSignup = async () => {
    if (fields.some(field => !field.value)) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await signup({
        Email: email,
        Password: password,
        FirstName: firstName,
        LastName: lastName,
        PhoneNumber: phoneNumber,
        Address: address,
      });

      if (response.status === 201) {
        Alert.alert('Success', 'Account created successfully');
        router.replace('/login');
      } else {
        throw new Error('Signup failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={signupStyles.container}>
      <View style={signupStyles.card}>
        <Text style={signupStyles.title}>Sign Up</Text>
        <Text style={signupStyles.subtitle}>Please enter your information to create your account</Text>

        <View style={signupStyles.inputContainer}>
          {fields[currentStep].isAddress ? (
            <>
              <TextInput
                style={[signupStyles.input, focusedField === 'Address' && signupStyles.focusedInput]}
                placeholder="Enter your address"
                value={address}
                onChangeText={(text) => {
                  setAddress(text);
                  fetchAddressSuggestions(text);
                }}
                onFocus={() => setFocusedField('Address')}
                onBlur={() => setFocusedField(null)}
              />
              {isFetching && <Text style={signupStyles.suggestionText}>Loading...</Text>}
              <FlatList
                data={addressSuggestions}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={signupStyles.suggestionItem}
                    onPress={() => {
                      setAddress(item);
                      setAddressSuggestions([]);
                    }}
                  >
                    <Text>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </>
          ) : (
            <TextInput
              style={[signupStyles.input, focusedField === fields[currentStep].label && signupStyles.focusedInput]}
              placeholder={fields[currentStep].placeholder}
              value={fields[currentStep].value}
              onChangeText={fields[currentStep].setValue}
              keyboardType={(fields[currentStep].keyboardType as KeyboardTypeOptions) || 'default'}
              secureTextEntry={fields[currentStep].secureTextEntry || false}
              onFocus={() => setFocusedField(fields[currentStep].label)}
              onBlur={() => setFocusedField(null)}
            />
          )}

          {fields[currentStep].renderRightIcon && (
            <View style={signupStyles.iconContainer}>{fields[currentStep].renderRightIcon()}</View>
          )}
        </View>

        <View style={signupStyles.buttonContainer}>
          {currentStep > 0 && (
            <Button
              title="Previous"
              onPress={() => setCurrentStep(currentStep - 1)}
              buttonStyle={signupStyles.navButton}
              titleStyle={signupStyles.navButtonText}
            />
          )}

          {currentStep < fields.length - 1 && (
            <Button
              title="Next"
              onPress={() => {
                if (fields[currentStep].value) {
                  setCurrentStep(currentStep + 1);
                } else {
                  Alert.alert('Error', 'Please fill in the current field before proceeding.');
                }
              }}
              buttonStyle={[signupStyles.navButton, currentStep === 0 && signupStyles.centeredNextButton]}
              titleStyle={signupStyles.navButtonText}
            />
          )}

          {currentStep === fields.length - 1 && (
            <Button
              title="Sign Up"
              onPress={handleSignup}
              loading={isLoading}
              buttonStyle={signupStyles.signupButton}
              titleStyle={signupStyles.buttonText}
              disabled={isLoading}
            />
          )}
        </View>

        <View style={signupStyles.footer}>
          <Text style={signupStyles.footerText}>Already have an account?</Text>
          <Button
            title="Login"
            onPress={() => router.push('/login')}
            type="clear"
            titleStyle={signupStyles.loginText}
          />
        </View>
      </View>
    </View>
  );
}
