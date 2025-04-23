import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, Modal, Image, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { QRCodeComponent } from './QRCode';
import { useGroup } from '../hooks/useGroup';
import { useAuth } from '../hooks/useAuth';
import { groupApi } from '../api/client';

interface PartyModalProps {
  visible: boolean;
  onClose: () => void;
  groupId: string | null;
  members: string[];
  showQR: boolean;
  onCreateParty: () => Promise<void>;
  onJoinParty: () => void;
  onQRScanned: (data: string) => Promise<boolean>;
  loading: boolean;
  mode: 'scan' | 'display';
}

export const PartyModal: React.FC<PartyModalProps> = ({
  visible,
  onClose,
  groupId,
  members,
  showQR,
  onCreateParty,
  onJoinParty,
  onQRScanned,
  loading,
  mode
}) => {
  const { user } = useAuth();
  const { leaveCurrentGroup, loading: leaveLoading, fetchGroupMembers } = useGroup(user?._id || '');
  const [currentUser, setCurrentUser] = useState(user);

  // Fetch fresh user info when modal opens
  useEffect(() => {
    const refreshUserInfo = async () => {
      if (visible && user?._id) {
        try {
          const freshUserInfo = await groupApi.getUser(user._id);
          setCurrentUser(freshUserInfo);
          
          // If user is in a group, fetch members
          if (freshUserInfo.groupId) {
            await fetchGroupMembers();
          }
        } catch (err) {
          console.error('Error refreshing user info:', err);
        }
      }
    };

    refreshUserInfo();
  }, [visible, user?._id, fetchGroupMembers]);

  const handleCreateParty = async () => {
    try {
      await onCreateParty();
      // Update local state immediately after successful party creation
      if (user?._id) {
        const freshUserInfo = await groupApi.getUser(user._id);
        setCurrentUser(freshUserInfo);
        await fetchGroupMembers();
      }
    } catch (err) {
      console.error('Error creating party:', err);
    }
  };

  const handleLeaveParty = async () => {
    if (user?._id) {
      await leaveCurrentGroup(user._id);
      setCurrentUser(null);
      onClose();
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

          {currentUser?.groupId ? (
            <>
              <Text style={styles.modalText}>Your Party</Text>
              {showQR && currentUser.groupId && (
                <QRCodeComponent 
                  groupId={currentUser.groupId} 
                  mode="display"
                />
              )}
              <ScrollView style={styles.memberList}>
                {members.map((memberId) => (
                  <View key={memberId} style={styles.memberItem}>
                    <Text style={styles.memberText}>{memberId}</Text>
                  </View>
                ))}
              </ScrollView>
              <TouchableOpacity 
                style={[styles.modalButton, styles.leaveButton]} 
                onPress={handleLeaveParty}
                disabled={leaveLoading}
              >
                <Text style={styles.buttonText}>Leave Party</Text>
              </TouchableOpacity>
            </>
          ) : mode === 'scan' ? (
            <>
              <Text style={styles.modalText}>Scan QR Code</Text>
              <QRCodeComponent 
                mode="scan"
                onScan={onQRScanned}
              />
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => onClose()}
              >
                <Text style={styles.buttonText}>Cancel</Text>
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
                onPress={onJoinParty}
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
  memberList: {
    maxHeight: 200,
    width: '100%',
    marginVertical: 20,
  },
  memberItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  memberText: {
    fontSize: 16,
    color: 'black',
  },
  cancelButton: {
    backgroundColor: '#ff4444',
  },
}); 