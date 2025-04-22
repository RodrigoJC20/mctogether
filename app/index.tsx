import React from 'react';
import { View, ImageBackground, StyleSheet, TouchableOpacity, Text, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { QRCodeComponent } from './components/QRCode';
import { UserSelector } from './components/UserSelector';
import PetsArea from './components/PetsArea';
import { useUIState } from './hooks/useUIState';
import { useQRCode } from './hooks/useQRCode';
import { usePets } from './hooks/usePets';

export default function Home() {
  const router = useRouter();
  const { modalVisible, setModalVisible, currentUserId, setCurrentUserId } = useUIState();
  const { showQR, setShowQR, mode, loading, error, groupId, members, handleCreateParty, handleJoinParty, handleQRScanned } = useQRCode(currentUserId);
  const { myPet, friendPets, showDebugPerimeter, toggleDebugPerimeter } = usePets(groupId, currentUserId, members);

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
        <UserSelector 
          currentUserId={currentUserId}
          onSelectUser={setCurrentUserId}
        />
        
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
                <QRCodeComponent 
                  groupId={groupId || ''} 
                  mode={mode}
                  onScan={handleQRScanned}
                />
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
    top: 120,
    left: 20,
    backgroundColor: '#00000088',
    borderRadius: 20,
    padding: 10,
  },
  topRight: {
    position: 'absolute',
    top: 120,
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