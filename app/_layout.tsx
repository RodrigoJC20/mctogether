import { Stack, Slot } from 'expo-router';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import { PartyProvider } from '@/hooks/usePartyState';
import React, { useEffect } from 'react';
import { WebSocketProvider } from '@/context/websocketContext';
import { useRouter } from 'expo-router';
import AppLayout from '../components/AppLayout';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading && !user) {
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
          <WebSocketProvider>
            <AppLayout>
              <Slot />
            </AppLayout>
          </WebSocketProvider>
        </AuthGuard>
      </PartyProvider>
    </AuthProvider>
  );
}