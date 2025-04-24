import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text, Modal, Image, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { QRCodeComponent } from './QRCode';
import { useAuth } from '../hooks/useAuth';
import { useWebSocket } from '@/context/websocketContext';
import { usePartyState } from '../hooks/usePartyState';

interface PartyModalProps {
  visible: boolean;
  onClose: () => void;
}

export const PartyModal: React.FC<PartyModalProps> = ({
  visible,
  onClose,
}) => {
  const { user } = useAuth();
  const { connect, disconnect, isConnected, sendMessage } = useWebSocket();
  const { 
    groupId,
    members,
    loading,
    mode,
    setMode,
    createParty,
    joinParty,
    leaveParty,
    fetchPartyMembers,
  } = usePartyState();

  useEffect(() => {
    if (visible && mode === 'qr' && groupId) {
      fetchPartyMembers(groupId);
    }
  }, [visible, mode, groupId, fetchPartyMembers]);

  useEffect(() => {
    if (isConnected) {
      console.log("Connection established, sending test message");
      sendMessage("Hello from Party App!"); 
    }
  }, [isConnected, sendMessage]);

  const handleCreateParty = async () => {
    if (!user?._id) return;
    try {
      connect();
      await createParty(user._id);
    } catch (err) {
      console.error('Error creating party:', err);
    }
  };

  const handleLeaveParty = async () => {
    if (!user?._id) return;
    try {
      await leaveParty(user._id);
      onClose();
      disconnect();
    } catch (err) {
      console.error('Error leaving party:', err);
    }
  };

  const handleQRScanned = async (data: string): Promise<boolean> => {
    if (!user?._id) return false;
    try {
      await joinParty(data, user._id);
      return true;
    } catch (err) {
      console.error('Error joining party:', err);
      return false;
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity 
            style={styles.closeCrossButton}
            onPress={onClose}
          >
            <Text style={styles.closeCrossText}>×</Text>
          </TouchableOpacity>

          {mode === "scan" ? (
            <>
              <Text style={styles.modalText}>Scan QR Code</Text>
              <QRCodeComponent 
                mode="scan"
                onScan={handleQRScanned}
              />
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setMode('menu')}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : mode === 'qr' ? (
            <>
              <Text style={styles.modalText}>Your Party</Text>
              {groupId && (
                <QRCodeComponent 
                  groupId={groupId} 
                  mode="display"
                />
              )}
              <View style={styles.memberListContainer}>
                <Text style={styles.memberListTitle}>Party Members</Text>
                <ScrollView style={styles.memberList}>
                  {members.map((member) => (
                    <View key={member.userId} style={styles.memberItem}>
                      <Text style={styles.memberText}>
                        {member.username}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
              <TouchableOpacity 
                style={[styles.modalButton, styles.leaveButton]} 
                onPress={handleLeaveParty}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Leave Party</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.modalText}>Join or Create a Party</Text>
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
                onPress={() => setMode('scan')}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Join Party</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  leaveButton: {
    backgroundColor: '#ff4444',
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
  modalImage: {
    width: 250,
    height: 125,
    resizeMode: 'contain',
    marginVertical: 20,
  },
  memberListContainer: {
    width: '100%',
    marginVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  memberListTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  memberList: {
    maxHeight: 150,
  },
  memberItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  memberText: {
    fontSize: 16,
    color: '#333',
  },
  cancelButton: {
    backgroundColor: '#ff4444',
  },
}); 