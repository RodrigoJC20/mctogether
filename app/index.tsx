import React, { useEffect } from 'react';
import { View, ImageBackground, StyleSheet, TouchableOpacity, Text, Modal, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { QRCodeComponent } from '../components/QRCode';
import PetsArea from '../components/PetsArea';
import { useUIState } from '../hooks/useUIState';
import { useQRCode } from '../hooks/useQRCode';
import { usePets } from '../hooks/usePets';
import { useAuth } from '../hooks/useAuth';
import { useGroup } from '@/hooks/useGroup';
import { Ionicons } from '@expo/vector-icons';

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
    console.log('Members length:', members.length);
    await logout();
  };

  const handlePartyButton = () => {
    console.log('Members length: ', members.length);
    console.log('Members: ', members);
    setModalVisible(true);
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

        {/* Coupons Button */}
        <TouchableOpacity style={styles.couponsButton} onPress={() => router.push('/coupons')}>
          <FontAwesome5 name="ticket-alt" size={24} color="white" />
        </TouchableOpacity>

        {/* Items Button */}
        <TouchableOpacity style={styles.bottomRightButton} onPress={() => router.push('/items')}>
          <MaterialIcons name="pets" size={28} color="white" />
        </TouchableOpacity>

        {/* Party Button */}
        <TouchableOpacity style={styles.partyButton} onPress={handlePartyButton}>
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
            <TouchableOpacity 
              style={styles.closeCrossButton}
              onPress={() => {
                setModalVisible(false);
                setShowQR(false);
              }}
            >
              <Text style={styles.closeCrossText}>×</Text>
            </TouchableOpacity>
            {!showQR ? (
              <>
                <Text style={styles.modalText}>Party with your friends</Text>
                <Image 
                  source={require('../assets/images/modalParty.png')}
                  style={styles.modalImage}
                />
                <TouchableOpacity 
                  style={[styles.modalButton, styles.createButton]} 
                  onPress={handleCreateParty}
                  disabled={loading}
                >
                  <View style={styles.buttonContent}>
                    <Text style={styles.buttonText}>Create Party</Text>
                    <Ionicons name="qr-code" size={20} color="black" style={styles.buttonIcon}/>
                  </View>
                </TouchableOpacity>
                <View style={styles.orContainer}>
                  <View style={styles.orLine} />
                  <Text style={styles.orText}>OR</Text>
                  <View style={styles.orLine} />
                </View>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.joinButton]} 
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
                  onScan={handleQRScannedWrapper}
                />
              </>
            )}
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
  couponsButton: {
    position: 'absolute',
    bottom: 40,
    left: 80, // Position it to the right of the medals button
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
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#f7f7f7',
    padding: 30,
    alignItems: 'center',
    width: '80%',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    borderTopColor: 'rgba(255, 255, 255, 0.7)',
    borderLeftColor: 'rgba(255, 255, 255, 0.7)',
    borderRightColor: 'rgba(0, 0, 0, 0.15)',
    borderBottomColor: 'rgba(0, 0, 0, 0.15)',
    borderWidth: 2.5,
  },
  modalText: {
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    borderWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 0.5)',
    borderLeftColor: 'rgba(255, 255, 255, 0.5)',
    borderRightColor: 'rgba(0, 0, 0, 0.2)',
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
    shadowColor: '#2d2d2d',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  createButton: {
    backgroundColor: '#FFBC0D',
  },
  joinButton: {
    backgroundColor: '#fff',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginLeft: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeCrossButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 5,
  },
  closeCrossText: {
    color: 'black',
    fontSize: 30,
    fontWeight: 'bold',
    width: 30,
    height: 30,
    textAlign: 'center',
    lineHeight: 30,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'black',
    opacity: 0.5,
  },
  orText: {
    color: 'black',
    marginHorizontal: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
  menuButton: {
    position: 'absolute',
    top: 120,
    left: 80, // Position it to the right of the shop button
    backgroundColor: '#00000088',
    borderRadius: 20,
    padding: 10,
  },
  modalImage: {
    width: 250,
    height: 125,
    resizeMode: 'contain',
    marginVertical: 20,
  },
});