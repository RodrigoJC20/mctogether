import React, { useEffect } from 'react';
import { View, ImageBackground, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import PetsArea from '../components/PetsArea';
import { useUIState } from '../hooks/useUIState';
import { usePartyState } from '../hooks/usePartyState';
import { useAuth } from '../hooks/useAuth';
import { PartyModal } from '../components/PartyModal';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { modalVisible, setModalVisible } = useUIState();
  const { 
    mode, 
    groupId, 
    members,
  } = usePartyState();

  // Close modal only when completing a join (transitioning from scan to qr)
  useEffect(() => {
    const isJoining = mode === 'qr' && groupId && modalVisible;
    const wasScanning = mode === 'scan';
    if (isJoining && wasScanning) {
      setModalVisible(false);
    }
  }, [groupId, modalVisible, mode]);

  const handleLogout = async () => {
    await logout();
  };

  const handlePartyButton = () => {
    setModalVisible(true);
  };
  
  return (
    <ImageBackground source={require('../assets/images/bg.jpeg')} style={styles.background}>
      <PetsArea 
        myPet={user?._id ? {
          id: `pet-${user._id}`,
          image: require('../assets/images/pet.png')
        } : null} 
        friendPets={members
          .filter(member => member.userId !== user?._id)
          .map(member => ({
            id: `pet-${member.userId}`,
            image: require('../assets/images/pet.png')
          }))} 
      />
      
      <View style={styles.uiLayer}>
        <View style={styles.topRight}>
          <Text style={styles.usernameText}>{user?.username}</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.currencyContainer}>
          <FontAwesome5 name="coins" size={20} color="white" />
          <Text style={styles.currencyText}>{user?.currency || 0}</Text>
        </View>

        <TouchableOpacity style={styles.menuButton} onPress={() => router.push('/menu')}>
          <MaterialIcons name="restaurant-menu" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.topLeftButton} onPress={() => router.push('/shop')}>
          <FontAwesome5 name="shopping-bag" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomLeftButton} onPress={() => router.push('/medals')}>
          <FontAwesome5 name="trophy" size={24} color="white" />
        </TouchableOpacity>

        {/* Coupons Button */}
        <TouchableOpacity style={styles.couponsButton} onPress={() => router.push('/coupons')}>
          <FontAwesome5 name="ticket-alt" size={24} color="white" />
        </TouchableOpacity>

        {/* Items Button */}
        <TouchableOpacity style={styles.bottomRightButton} onPress={() => router.push('/items')}>
          <MaterialIcons name="pets" size={28} color="white" />
        </TouchableOpacity>

        {/* Party Button - Shows QR code when in a party */}
        <TouchableOpacity style={styles.partyButton} onPress={handlePartyButton}>
          {groupId ? (
            <View style={styles.partyButtonContent}>
              <Ionicons name="qr-code" size={24} color="white" />
              <Text style={styles.partyText}>Party</Text>
            </View>
          ) : (
            <Text style={styles.partyText}>Party</Text>
          )}
        </TouchableOpacity>
      </View>

      <PartyModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  uiLayer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 2,
  },
  topLeftButton: {
    position: 'absolute',
    top: 120,
    left: 20,
    backgroundColor: '#00000088',
    borderRadius: 20,
    padding: 10,
  },
  topRight: {
    position: 'absolute',
    top: 50,
    right: 20,
    flexDirection: 'column',
    alignItems: 'flex-end',
    backgroundColor: '#00000088',
    borderRadius: 20,
    padding: 10,
    marginBottom: 20,
  },
  usernameText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  logoutText: {
    color: 'white',
    fontSize: 12,
  },
  currencyContainer: {
    position: 'absolute',
    top: 120,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00000088',
    borderRadius: 20,
    padding: 10,
    marginTop: 20,
  },
  currencyText: {
    color: 'white',
    marginLeft: 5,
  },
  bottomLeftButton: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    backgroundColor: '#00000088',
    borderRadius: 20,
    padding: 10,
  },
  couponsButton: {
    position: 'absolute',
    bottom: 40,
    left: 80,
    backgroundColor: '#00000088',
    borderRadius: 20,
    padding: 10,
  },
  bottomRightButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: '#00000088',
    borderRadius: 20,
    padding: 10,
  },
  partyButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: 'skyblue',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  partyButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  partyText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuButton: {
    position: 'absolute',
    top: 120,
    left: 80,
    backgroundColor: '#00000088',
    borderRadius: 20,
    padding: 10,
  },
});