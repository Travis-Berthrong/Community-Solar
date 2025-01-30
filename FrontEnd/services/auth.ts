import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://authservice-enbjagg9d6enh5gg.uksouth-01.azurewebsites.net/api/User';

export const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Email: email, Password: password }),
    });
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid credentials');
      }
      throw new Error('Login failed');
    }
    const token = await response.text();
    await setToken(token);
    return token;
  };
  

export const signup = async (userData: any) => {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Signup failed');
    return response;
  };
  

export const setToken = async (token: string) => {
  await AsyncStorage.setItem('userToken', token);
};

export const getToken = async () => {
  return await AsyncStorage.getItem('userToken');
};

export const removeToken = async () => {
  await AsyncStorage.removeItem('userToken');
};
