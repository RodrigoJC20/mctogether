import { Stack, Slot } from 'expo-router';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import { PartyProvider } from '../hooks/usePartyState';
import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      // Use replace to avoid adding to navigation history
      router.replace('/auth');
    }
  }, [user, isLoading]);

  if (isLoading) {
    return <Stack screenOptions={{ headerShown: false }} />;
  }

  return <>{children}</>;
}

export default function Layout() {
  return (
    <AuthProvider>
      <PartyProvider>
        <AuthGuard>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </AuthGuard>
      </PartyProvider>
    </AuthProvider>
  );
}