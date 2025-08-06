
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export default function useLocation() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission denied');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);

      const reverseGeocode = await Location.reverseGeocodeAsync(loc.coords);
      if (reverseGeocode && reverseGeocode?.length > 0) {
        setCity(reverseGeocode[0].city || reverseGeocode[0].region || 'Unknown');
      }
    })();
  }, []);

  return { location, city, errorMsg };
}
