const GEOAPIFY_API_KEY = '9fac2d72553e436c9f1ff95e27cf3362';

interface GeoapifyFeature {
    properties: {
        formatted: string;
    };
}

interface GeoapifyResponse {
    features: GeoapifyFeature[];
}


const fetchCoordinates = async (address: string): Promise<{ latitude: number | null; longitude: number | null; }> => {
    let latitude = null;
    let longitude = null;
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${GEOAPIFY_API_KEY}`
      );
      const data = await response.json();

      if ("features" in data && data.features.length > 0) {
        const { lon, lat } = data.features[0].properties;
        latitude = parseFloat(lat);
        longitude = parseFloat(lon);
        return { latitude, longitude };
      } else {
        console.error('No coordinates found for the given address.');
        return { latitude, longitude };
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      return { latitude, longitude };
    }
  };

  const fetchAddressSuggestions = async (query: string): Promise<string[]> => {
    if (!query) {
      return [];
    }

    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&apiKey=${GEOAPIFY_API_KEY}`
      );
      const data = await response.json();

      if ("features" in data) {
        return data.features.map((feature: GeoapifyFeature) => feature.properties.formatted);
      } else {
        console.error('No address suggestions found.');
        return [];
      }
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      return [];
    }
  };