import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet, useColorScheme, Dimensions } from 'react-native';

const CreateProjectForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [landSize, setLandSize] = useState('');
  const [fundingGoal, setFundingGoal] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const addressInputRef = useRef(null);

  const GEOAPIFY_API_KEY = '9fac2d72553e436c9f1ff95e27cf3362';

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const styles = getStyles(isDarkMode);

  const fetchAddressSuggestions = async (query: string) => {
    if (!query) {
      setAddressSuggestions([]);
      setDropdownVisible(false);
      return;
    }

    setIsFetching(true);
    setDropdownVisible(true);

    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&apiKey=${GEOAPIFY_API_KEY}`
      );
      const data = await response.json();
      
    interface GeoapifyFeature {
        properties: {
            formatted: string;
        };
    }

    interface GeoapifyResponse {
        features: GeoapifyFeature[];
    }

    // Modified code with types
    setAddressSuggestions((data as GeoapifyResponse).features.map(feature => feature.properties.formatted));
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

  const fetchCoordinates = async (address: string) => {
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${GEOAPIFY_API_KEY}`
      );
      const data = await response.json();

      if ("features" in data && data.features.length > 0) {
        const { lon, lat } = data.features[0].properties;
        setLongitude(lon.toString());
        setLatitude(lat.toString());
      } else {
        console.error('No coordinates found for the given address.');
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  };

  const handleSubmit = async () => {
    await fetchCoordinates(address);

    const projectData = {
      title,
      description,
      address,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      landSize: parseFloat(landSize),
      fundingGoal: parseFloat(fundingGoal),
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
            fetchAddressSuggestions(value);
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

      <Text style={styles.label}>Funding Goal ($)</Text>
      <TextInput
        value={fundingGoal}
        onChangeText={setFundingGoal}
        placeholder="Enter funding goal"
        placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
        keyboardType="numeric"
        style={styles.input}
      />

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

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  addressContainer: {
    position: 'relative',
    zIndex: 1000,
  },
  dropdownContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: isDarkMode ? '#888888' : '#cccccc',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxHeight: 200,
  },
  suggestionList: {
    flexGrow: 0,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? '#333333' : '#eeeeee',
  },
  suggestionText: {
    color: isDarkMode ? '#ffffff' : '#000000',
    fontSize: 14,
  },
  fetchingText: {
    padding: 12,
    color: isDarkMode ? '#aaaaaa' : '#555555',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: isDarkMode ? '#ffffff' : '#000000',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: isDarkMode ? '#888888' : '#cccccc',
    backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
    color: isDarkMode ? '#ffffff' : '#000000',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  suggestion: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? '#555555' : '#dddddd',
    color: isDarkMode ? '#ffffff' : '#000000',
  },
});

export default CreateProjectForm;
