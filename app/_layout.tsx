import { Stack, Slot } from 'expo-router';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import { PartyProvider } from '../hooks/usePartyState';
import { WebSocketProvider } from '@/context/websocketContext';
import React from 'react';

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
          <WebSocketProvider>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
          </WebSocketProvider>
        </AuthGuard>
      </PartyProvider>
    </AuthProvider>
  );
}