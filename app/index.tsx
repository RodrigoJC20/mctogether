import React, { useEffect } from 'react';
import { View, ImageBackground, StyleSheet, TouchableOpacity, Text, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { QRCodeComponent } from './components/QRCode';
import PetsArea from './components/PetsArea';
import { useUIState } from './hooks/useUIState';
import { useQRCode } from './hooks/useQRCode';
import { usePets } from './hooks/usePets';
import { useAuth } from './hooks/useAuth';

export default function Home() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { modalVisible, setModalVisible } = useUIState();
  const { showQR, setShowQR, mode, setMode, loading, error, groupId, members, handleCreateParty, handleJoinParty, handleQRScanned } = useQRCode();
  const { myPet, friendPets, showDebugPerimeter, toggleDebugPerimeter } = usePets(
    groupId || null, 
    user?._id || null, 
    members.map(memberId => ({ userId: memberId, role: 'member' })) || []
  );

  // Close modal when joining a group (but not when creating one)
  useEffect(() => {
    if (groupId && modalVisible && mode === 'scan') {
      setModalVisible(false);
    }
  }, [groupId, modalVisible, mode]);

  const handleQRScannedWrapper = async (data: string) => {
    const success = await handleQRScanned(data);
    if (success) {
      setModalVisible(false); // Close the main party menu modal
    }
  };

  const handleLogout = async () => {
    await logout();
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
        {/* User Info and Logout */}
        <View style={styles.topRight}>
          <Text style={styles.usernameText}>{user?.username}</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Currency */}
        <View style={styles.currencyContainer}>
          <FontAwesome5 name="coins" size={20} color="white" />
          <Text style={styles.currencyText}>{user?.currency || 0}</Text>
        </View>

        {/* Menu Button */}
        <TouchableOpacity style={styles.menuButton} onPress={() => router.push('/menu')}>
          <MaterialIcons name="restaurant-menu" size={24} color="white" />
        </TouchableOpacity>

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
                {groupId ? (
                  <TouchableOpacity 
                    style={styles.modalButton} 
                    onPress={() => {
                      setMode('display');
                      setShowQR(true);
                    }}
                  >
                    <Text style={styles.buttonText}>View QR Code</Text>
                  </TouchableOpacity>
                ) : (
                  <>
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
                )}
              </>
            ) : (
              <>
                <Text style={styles.modalText}>
                  {groupId ? 'Scan this QR code to join!' : 'Scan a QR code to join a party!'}
                </Text>
                <QRCodeComponent 
                  groupId={groupId || ''} 
                  mode={mode}
                  onScan={handleQRScannedWrapper}
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
    color: 'white',
    fontSize: 14,
  },
  menuButton: {
    position: 'absolute',
    top: 120,
    left: 80, // Position it to the right of the shop button
    backgroundColor: '#00000088',
    borderRadius: 20,
    padding: 10,
  },
});