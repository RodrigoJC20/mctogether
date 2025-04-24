import { Stack, Slot } from 'expo-router';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import { PartyProvider } from '../hooks/usePartyState';
import React, { useEffect } from 'react';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    return <Slot />;
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