import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, useColorScheme} from 'react-native';
import { fetchAddressSuggestions, fetchCoordinates } from '@/utils/geoUtils';
import { getStyles } from '@/styles/addprojectStyles';

const CreateProjectForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [landSize, setLandSize] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const addressInputRef = useRef(null);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const styles = getStyles(isDarkMode);

  const displayAddressSuggestions = async (query: string) => {
    if (!query) {
      setAddressSuggestions([]);
      setDropdownVisible(false);
      return;
    }

    setIsFetching(true);
    setDropdownVisible(true);

    try {
        const suggestions = await fetchAddressSuggestions(query);
        setAddressSuggestions(suggestions);
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      setAddressSuggestions([]);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSelectAddress = (selectedAddress: string) => {
    setAddress(selectedAddress);
    setDropdownVisible(false);
    fetchCoordinates(selectedAddress);
  };

  const handleSubmit = async () => {
    const { latitude, longitude } = await fetchCoordinates(address);
    if (!latitude || !longitude) {
      console.error('Invalid coordinates:', latitude, longitude);
      return;
    }

    const projectData = {
      title,
      description,
      address,
      latitude: latitude,
      longitude: longitude,
      landSize: parseFloat(landSize),
    };
    console.log('Project Data:', projectData);
    //TODO switch to forecast screen, sending projectData as props
  };

  const AddressSuggestionsDropdown = () => {
    if (!dropdownVisible || (!isFetching && addressSuggestions.length === 0)) {
      return null;
    }

    return (
      <View style={styles.dropdownContainer}>
        {isFetching ? (
          <Text style={styles.fetchingText}>Fetching address suggestions...</Text>
        ) : (
          <FlatList
            data={addressSuggestions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSelectAddress(item)}
              >
                <Text style={styles.suggestionText}>{item}</Text>
              </TouchableOpacity>
            )}
            style={styles.suggestionList}
            keyboardShouldPersistTaps="handled"
          />
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.label}>Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Enter project title"
        placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
        style={styles.input}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Enter project description"
        placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
        multiline
        style={styles.input}
      />
      <View style={styles.addressContainer}>
        <Text style={styles.label}>Address</Text>
        <TextInput
          ref={addressInputRef}
          value={address}
          onChangeText={(value) => {
            setAddress(value);
            displayAddressSuggestions(value);
          }}
          onFocus={() => {
            if (address && addressSuggestions.length > 0) {
              setDropdownVisible(true);
            }
          }}
          placeholder="Enter project address"
          placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
          style={styles.input}
        />
        <AddressSuggestionsDropdown />
      </View>

      <Text style={styles.label}>Land Size (sq meters)</Text>
      <TextInput
        value={landSize}
        onChangeText={setLandSize}
        placeholder="Enter land size"
        placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
        keyboardType="numeric"
        style={styles.input}
      />

      {/* <Text style={styles.label}>Funding Goal ($)</Text>
      <TextInput
        value={fundingGoal}
        onChangeText={setFundingGoal}
        placeholder="Enter funding goal"
        placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
        keyboardType="numeric"
        style={styles.input}
      /> */}

      {/* <Text style={styles.label}>Estimated Electricity Output (kWh)</Text>
      <TextInput
        value={estimatedElectricityOutput}
        onChangeText={setEstimatedElectricityOutput}
        placeholder="Enter estimated electricity output"
        placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Estimated CO2 Savings (tons)</Text>
      <TextInput
        value={estimatedCO2Savings}
        onChangeText={setEstimatedCO2Savings}
        placeholder="Enter estimated CO2 savings"
        placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Estimated Revenue ($)</Text>
      <TextInput
        value={estimatedRevenue}
        onChangeText={setEstimatedRevenue}
        placeholder="Enter estimated revenue"
        placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Estimated ROI (%)</Text>
      <TextInput
        value={estimatedROI}
        onChangeText={setEstimatedROI}
        placeholder="Enter estimated ROI"
        placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
        keyboardType="numeric"
        style={styles.input}
      /> */}

      <Button title="Submit Project" onPress={handleSubmit} color={isDarkMode ? '#4CAF50' : '#1E90FF'} />      
    </KeyboardAvoidingView>
  );
};



export default CreateProjectForm;
