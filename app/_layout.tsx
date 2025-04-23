import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';
import React from 'react';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === ('auth' as string);

    if (!user && !inAuthGroup) {
      // Redirect to the auth page if not authenticated
      router.replace('/auth' as any);
    } else if (user && inAuthGroup) {
      // Redirect to the home page if authenticated
      router.replace('/');
    }
  }, [user, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return <>{children}</>;
}

export default function Layout() {
  return (
    <AuthProvider>
      <AuthGuard>
        <View style={{ flex: 1 }}>
          <Slot />
          <StatusBar style="light" />
        </View>
      </AuthGuard>
    </AuthProvider>
  );
}