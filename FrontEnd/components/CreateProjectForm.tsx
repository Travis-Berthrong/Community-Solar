import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, useColorScheme} from 'react-native';
import { fetchAddressSuggestions, fetchCoordinates } from '@/utils/geoUtils';
import { getStyles } from '@/styles/addprojectStyles';
import { IProjectInfo } from '@/types/IProjectInfo';

interface CreateProjectFormProps {
  onSubmit: (data: IProjectInfo) => void;
  initialData?: IProjectInfo | null;
}

const CreateProjectForm: React.FC<CreateProjectFormProps> = ({ onSubmit, initialData }) => {
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [address, setAddress] = useState(initialData?.address ?? '');
  const [landSize, setLandSize] = useState(initialData?.landSize?.toString() ?? '');
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
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
    try {
      if (!title || !description || !address || !landSize) {
        console.error('All fields are required');
        return;
      }

      const { latitude, longitude } = await fetchCoordinates(address);
      
      if (!latitude || !longitude) {
        console.error('Invalid coordinates:', latitude, longitude);
        return;
      }

      const projectInfo: IProjectInfo = {
        title,
        description,
        address,
        latitude,
        longitude,
        landSize: parseFloat(landSize)
      };

      onSubmit(projectInfo);

    } catch (error) {
      console.error('Error submitting project:', error);
    }
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
        contentContainerStyle={styles.contentContainer}
    >
        <View style={styles.card}>
            <Text style={styles.label}>Title</Text>
            <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Enter project title"
                placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
                style={[styles.input, focusedInput === 'title' && styles.inputFocused]}
                onFocus={() => setFocusedInput('title')}
                onBlur={() => setFocusedInput(null)}
            />


            <Text style={styles.label}>Description</Text>
            <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Enter project description"
                multiline
                placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
                style={[styles.input, focusedInput === 'description' && styles.inputFocused]}
                onFocus={() => setFocusedInput('description')}
                onBlur={() => setFocusedInput(null)}
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
                        setFocusedInput('address');
                        if (address && addressSuggestions.length > 0) {
                            setDropdownVisible(true);
                        }
                    }}
                    onBlur={() => {
                        setFocusedInput(null);
                    }}
                    placeholder="Enter project address"
                    placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
                    style={[styles.input, focusedInput === 'address' && styles.inputFocused]}
                    />
                <AddressSuggestionsDropdown />
            </View>

            <Text style={styles.label}>Land Size (sq meters)</Text>
            <TextInput
                value={landSize}
                onChangeText={setLandSize}
                placeholder="Enter land size"
                keyboardType="numeric"
                placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
                style={[styles.input, focusedInput === 'landsize' && styles.inputFocused]}
                onFocus={() => setFocusedInput('landsize')}
                onBlur={() => setFocusedInput(null)}
            />

            <Button title="View Forecast" onPress={handleSubmit} color={'#4CAF50'} />
        </View>
    </KeyboardAvoidingView>
);
};

export default CreateProjectForm