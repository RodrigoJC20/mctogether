import React, { useEffect } from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';
import PetsArea from '../components/PetsArea';
import { useUIState } from '../hooks/useUIState';
import { usePartyState } from '../hooks/usePartyState';
import { useAuth } from '../hooks/useAuth';

export default function Home() {
  const { user } = useAuth();
  const { setModalVisible } = useUIState();
  const {
    mode,
    groupId,
    members,
  } = usePartyState();
  
  // Close modal only when completing a join (transitioning from scan to qr)
  useEffect(() => {
    const isJoining = mode === 'qr' && groupId;
    const wasScanning = mode === 'scan';
    if (isJoining && wasScanning) {
      setModalVisible(false);
    }
  }, [groupId, mode, setModalVisible]);

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/images/bg2.png')} style={styles.background}>
      <PetsArea
        myPet={user?._id ? {
          id: `pet-${user._id}`,
          name: 'me',
          type: 0,
          hat: 2,
          eyes: 0,
          mouth: 0,
        } : null}
        friendPets={members
          .filter(member => member.userId !== user?._id)
          .map(member => ({
            id: `pet-${member.userId}`,
            name: 'other',
            type: 1,
            hat: 1,
            eyes: 1,
            mouth: 1,
          }))}
      />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
});