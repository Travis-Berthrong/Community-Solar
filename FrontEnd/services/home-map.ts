import { LocationObjectCoords } from 'expo-location';

interface MapResponse {
  message: string;
  mapHtml: string;
}

export const fetchMapData = async (coords: LocationObjectCoords): Promise<MapResponse> => {
  try {
    const response = await fetch('http://your-server-address/home-map', {
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

    if (!response.ok) {
      throw new Error('Failed to fetch map');
    }

    const data = await response.json();
    return data; // Return the message and map HTML from the backend
  } catch (error) {
    console.error('Error fetching map:', error);
    throw error; // Propagate the error to handle it in the component
  }
};
