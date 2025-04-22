import React, { useState } from 'react';
import { View, ImageBackground, StyleSheet, TouchableOpacity, Text, Modal, ImageSourcePropType } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useGroup } from './hooks/useGroup';
import { QRCodeComponent } from './components/QRCode';
import PetsArea from './components/PetsArea';

interface Pet {
  id: string | number;
  image: ImageSourcePropType;
}

export default function Home() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [showQR, setShowQR] = useState<boolean>(false);
  const [showDebugPerimeter, setShowDebugPerimeter] = useState<boolean>(true); // Debug toggle state
  const { loading, error, groupId, createGroup, joinGroup } = useGroup();

  // Pet data - you would normally get this from your state/backend
  const myPet: Pet = {
    id: 'my-pet-1',
    image: require('../assets/images/pet.png')
  };
  
  // Mock data for friend pets (for demonstration)
  const friendPets: Pet[] = [
    // This will be populated when friends join your party
    // Example: { id: 'friend-pet-1', image: require('../assets/images/friend-pet.png') }
  ];

  const handleCreateParty = async () => {
    try {
      await createGroup(1); // Hardcoded user ID 1
      setShowQR(true);
    } catch (err) {
      console.error('Failed to create party:', err);
    }
  };

  const handleJoinParty = () => {
    setShowQR(true);
  };

  // Toggle debug perimeter visibility
  const toggleDebugPerimeter = () => {
    setShowDebugPerimeter(prev => !prev);
  };

  return (
    <ImageBackground source={require('../assets/images/bg.jpeg')} style={styles.background}>
      {/* Pets Area - This will handle all pet movement and rendering */}
      <PetsArea 
        myPet={myPet} 
        friendPets={friendPets} 
        showDebugPerimeter={showDebugPerimeter} 
      />
      
      {/* UI Elements - These will always be on top */}
      <View style={styles.uiLayer}>
        {/* Currency */}
        <View style={styles.topRight}>
          <FontAwesome5 name="coins" size={20} color="white" />
          <Text style={styles.currencyText}>1234</Text>
        </View>

        {/* Shop Button */}
        <TouchableOpacity style={styles.topLeftButton} onPress={() => router.push('/shop')}>
          <FontAwesome5 name="shopping-bag" size={24} color="white" />
        </TouchableOpacity>

        {/* Medals Button */}
        <TouchableOpacity style={styles.bottomLeftButton} onPress={() => router.push('/medals')}>
          <FontAwesome5 name="trophy" size={24} color="white" />
        </TouchableOpacity>

        {/* Items Button */}
        <TouchableOpacity style={styles.bottomRightButton} onPress={() => router.push('/items')}>
          <MaterialIcons name="pets" size={28} color="white" />
        </TouchableOpacity>

        {/* Party Button */}
        <TouchableOpacity style={styles.partyButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.partyText}>Party</Text>
        </TouchableOpacity>

        {/* Debug Toggle Button */}
        <TouchableOpacity 
          style={styles.debugButton}
          onPress={toggleDebugPerimeter}
        >
          <Text style={styles.debugButtonText}>
            {showDebugPerimeter ? "Hide Debug" : "Show Debug"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Party Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {!showQR ? (
              <>
                <Text style={styles.modalText}>🎉 Party Time! 🎉</Text>
                <TouchableOpacity 
                  style={styles.modalButton} 
                  onPress={handleCreateParty}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>Create Party</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.modalButton} 
                  onPress={handleJoinParty}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>Join Party</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.modalText}>
                  {groupId ? 'Scan this QR code to join!' : 'Scan a QR code to join a party!'}
                </Text>
                <QRCodeComponent groupId={groupId || ''} mode="display" />
              </>
            )}
            <TouchableOpacity 
              onPress={() => {
                setModalVisible(false);
                setShowQR(false);
              }} 
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    zIndex: 2, // Higher than pets layer
  },
  topLeftButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#00000088',
    borderRadius: 20,
    padding: 10,
  },
  topRight: {
    position: 'absolute',
    top: 40,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00000088',
    borderRadius: 20,
    padding: 10,
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
  partyText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  debugButton: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 120, 255, 0.7)',
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 15,
  },
  debugButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#222',
    padding: 30,
    borderRadius: 25,
    alignItems: 'center',
    width: '80%',
  },
  modalText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: 'skyblue',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#444',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  closeText: {
    color: 'skyblue',
    fontWeight: 'bold',
  },
});