import React from 'react';
import { View, ImageBackground, StyleSheet, Image, TouchableOpacity, Text, Modal, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useGroup } from './hooks/useGroup';
import { QRCodeComponent } from './components/QRCode';
import { groupApi } from './api/client';

export default function Home() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [mode, setMode] = useState<'scan' | 'display'>('display');
  const [currentUserId, setCurrentUserId] = useState(1);
  const { loading, error, groupId, createGroup, joinGroup } = useGroup();

  const handleCreateParty = async () => {
    try {
      await createGroup(currentUserId);
      setMode('display');
      setShowQR(true);
    } catch (err) {
      console.error('Failed to create party:', err);
    }
  };

  const handleJoinParty = () => {
    setMode('scan');
    setShowQR(true);
  };

  const handleQRScanned = async (data: string) => {
    try {
      // Get the group info first to check if the group is active
      const group = await groupApi.getGroup(data);
      
      if (group.status === 'disbanded') {
        Alert.alert(
          'Group Disbanded',
          'This group has been disbanded. Would you like to create a new group?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Create New Group',
              onPress: handleCreateParty,
            },
          ]
        );
        return;
      }

      if (group.leaderId === currentUserId) {
        Alert.alert('Error', 'You cannot join your own group!');
        return;
      }
      
      await joinGroup(data, currentUserId);
      setShowQR(false);
      setModalVisible(false);
    } catch (err: any) {
      console.error('Failed to join party:', err);
      if (err.response?.data?.message === 'Group is not active') {
        Alert.alert(
          'Group Not Active',
          'This group is no longer active. Would you like to create a new group?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Create New Group',
              onPress: handleCreateParty,
            },
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to join the group. Please try again.');
      }
    }
  };

  const renderUserSelector = () => (
    <ScrollView 
      horizontal 
      style={styles.userSelectorContainer}
      contentContainerStyle={styles.userSelectorContent}
      showsHorizontalScrollIndicator={false}
    >
      {[1, 2, 3, 4, 5].map((userId) => (
        <TouchableOpacity
          key={userId}
          style={[
            styles.userButton,
            currentUserId === userId && styles.userButtonActive
          ]}
          onPress={() => setCurrentUserId(userId)}
        >
          <FontAwesome5 
            name="user" 
            size={16} 
            color={currentUserId === userId ? 'white' : '#666'} 
          />
          <Text style={[
            styles.userButtonText,
            currentUserId === userId && styles.userButtonTextActive
          ]}>
            User {userId}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <ImageBackground source={require('../assets/images/bg.jpeg')} style={styles.background}>
      {renderUserSelector()}
      
      {/* Currency */}
      <View style={styles.topRight}>
        <FontAwesome5 name="coins" size={20} color="white" />
        <Text style={styles.currencyText}>1234</Text>
      </View>

      {/* Shop Button */}
      <TouchableOpacity style={styles.topLeftButton} onPress={() => router.push('/shop')}>
        <FontAwesome5 name="shopping-bag" size={24} color="white" />
      </TouchableOpacity>

      {/* Pet Image */}
      <View style={styles.petContainer}>
        <Image source={require('../assets/images/pet.png')} style={styles.petImage} />
      </View>

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
                  {mode === 'display' ? 'Share this QR code!' : 'Scan a QR code to join!'}
                </Text>
                <QRCodeComponent 
                  mode={mode}
                  groupId={groupId || undefined}
                  onScan={handleQRScanned}
                />
              </>
            )}
            <TouchableOpacity 
              onPress={() => {
                setModalVisible(false);
                setShowQR(false);
                setMode('display');
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
  userSelectorContainer: {
    position: 'absolute',
    top: 50,  // Moved down to avoid notch
    left: 0,
    right: 0,
    zIndex: 1,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  userSelectorContent: {
    paddingHorizontal: 10,
    gap: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  userButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginHorizontal: 5,
    gap: 6,
  },
  userButtonActive: {
    backgroundColor: 'skyblue',
  },
  userButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: 'bold',
  },
  userButtonTextActive: {
    color: 'white',
  },
  topLeftButton: {
    position: 'absolute',
    top: 120,  // Adjusted to account for new user selector position
    left: 20,
    backgroundColor: '#00000088',
    borderRadius: 20,
    padding: 10,
  },
  topRight: {
    position: 'absolute',
    top: 120,  // Adjusted to account for new user selector position
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
  petContainer: {
    alignItems: 'center',
  },
  petImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
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
    position: 'relative',
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
    position: 'absolute',
    top: -50,
    right: 0,
    backgroundColor: '#444',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    zIndex: 1,
  },
  closeText: {
    color: 'skyblue',
    fontWeight: 'bold',
  },
});