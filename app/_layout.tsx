import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

export default function Layout() {
  return (
    <View style={{ flex: 1 }}>
      <Slot />
      <StatusBar style="light" />
    </View>
  );
}