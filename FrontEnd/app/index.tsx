import { Redirect } from 'expo-router';
import { getToken } from '../services/auth';
import React, { useState } from 'react';

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

    React.useEffect(() => {
        checkLoginStatus();
    }, []);

    async function checkLoginStatus() {
    const token = await getToken();
    setIsLoggedIn(!!token);
    }

  return <Redirect href={isLoggedIn ? '/home' : '/login'} />;
}