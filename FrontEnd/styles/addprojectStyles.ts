import { StyleSheet } from 'react-native';

export const getStyles = (isDarkMode: boolean) => StyleSheet.create({
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
      centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      section: {
        marginTop: 20,
        padding: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 8,
      },
      sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#ffffff',
      },
      text: {
        fontSize: 16,
        color: '#ffffff',
      },
      errorText: {
        color: '#ff6b6b',
        marginBottom: 15,
      }
  });