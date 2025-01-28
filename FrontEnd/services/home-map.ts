import { LocationObjectCoords } from 'expo-location';

interface MapResponse {
  message: string;
  data: any; // The map data including user location and projects
}

export const fetchMapData = async (coords: LocationObjectCoords): Promise<MapResponse> => {
  try {
    console.log('Fetching map data...');
    const response = await fetch('http://localhost:3000/api/home-map', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userLocation: {
          latitude: coords.latitude,
          longitude: coords.longitude,
        },
      }),
    });
    console.log('Response:', response);
    if (!response.ok) {
      throw new Error('Failed to fetch map');
    }

    const data = await response.json();
    return { message: data.message, data: data.data }; // Return message and data (user location and projects)
  } catch (error) {
    console.error('Error fetching map:', error);
    throw error; // Propagate the error to handle it in the component
  }
};
