import { Platform, StyleSheet } from 'react-native';

export const getStyles = (isDarkMode: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
    },
    contentContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: '100%',
        maxWidth: 600, // Adjust this value for web compatibility
        backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 20,
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
      paddingVertical: Platform.OS === 'ios' ? 12 : 10,
      paddingHorizontal: 15,
      borderRadius: 8,
      fontSize: 16,
      height: 50,
      marginBottom: 15,
      shadowColor: Platform.OS === 'ios' ? '#000' : 'transparent',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
  },
  inputFocused: {
      borderColor: isDarkMode ? '#4CAF50' : '#1E90FF',
  },
  
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
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    section: {
        marginTop: 20,
        padding: 15,
        backgroundColor: isDarkMode ? '#2e2e2e' : '#ffffff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: isDarkMode ? '#ffffff' : '#000000',
    },
    text: {
        fontSize: 16,
        color: isDarkMode ? '#ffffff' : '#000000',
    },
    errorText: {
        color: '#ff6b6b',
        marginBottom: 15,
    },
});