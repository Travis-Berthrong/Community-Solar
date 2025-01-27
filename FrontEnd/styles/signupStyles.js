import { StyleSheet } from 'react-native';

export const signupStyles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f4f5f7',
      padding: 20,
    },
    card: {
      width: '100%',
      maxWidth: 400,
      backgroundColor: '#ffffff',
      borderRadius: 15,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      marginBottom: 30,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: '#555',
      marginBottom: 20,
      textAlign: 'center',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderColor: '#ddd',
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 15,
      backgroundColor: '#f9f9f9',
      paddingHorizontal: 10,
    },
    input: {
      flex: 1,
      height: 48,
      fontSize: 16,
    },
    focusedInput: {
      borderColor: '#4CAF50',  // Change border color on focus
      borderWidth: 2,  // Optional: Add a thicker border for focused state
    },
    iconContainer: {
      paddingHorizontal: 10,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 20,
    },
    navButton: {
      backgroundColor: '#4CAF50',
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    centeredNextButton: {
      marginLeft: 'auto',
      marginRight: 0,
    },
    navButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
    signupButton: {
      backgroundColor: '#4CAF50',
      borderRadius: 8,
      paddingVertical: 14,
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 18,
      fontWeight: '700',
    },
    footer: {
      marginTop: 20,
      alignItems: 'center',
    },
    footerText: {
      fontSize: 14,
      color: '#666',
    },
    loginText: {
      fontSize: 14,
      color: '#4CAF50',
      marginLeft: 5,
    },
  });
  