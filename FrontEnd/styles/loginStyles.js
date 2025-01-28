import { StyleSheet } from 'react-native';

export const loginStyles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: '#f0f4f8',
    },
    card: {
      width: '100%',
      maxWidth: 400,
      backgroundColor: '#ffffff',
      borderRadius: 15,
      padding: 25,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: '#333',
      marginBottom: 10,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: '#555',
      marginBottom: 20,
      textAlign: 'center',
    },
    input: {
      height: 48,
      borderColor: '#e0e0e0',
      borderWidth: 1,
      marginBottom: 15,
      paddingHorizontal: 15,
      borderRadius: 8,
      fontSize: 16,
      backgroundColor: '#f9f9f9',
    },
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderColor: '#e0e0e0',
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 15,
      backgroundColor: '#f9f9f9',
    },
    passwordInput: {
      flex: 1,
      height: 48,
      paddingHorizontal: 15,
      fontSize: 16,
    },
    iconContainer: {
      paddingHorizontal: 10,
    },
    loginButton: {
      backgroundColor: '#4CAF50',
      borderRadius: 8,
      paddingVertical: 14,
      marginTop: 10,
    },
    buttonText: {
      fontSize: 18,
      fontWeight: '600',
      color: '#ffffff',
    },
    footer: {
      marginTop: 20,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    footerText: {
      fontSize: 14,
      color: '#666',
    },
    signUpText: {
      fontSize: 14,
      color: '#4CAF50',
      marginLeft: 5,
    },
  });
  