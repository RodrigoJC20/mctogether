import { useState } from 'react';
import { Alert } from 'react-native';
import { groupApi } from '../api/client';
import { useGroup } from './useGroup';

export const useQRCode = (currentUserId: number) => {
  const [showQR, setShowQR] = useState(false);
  const [mode, setMode] = useState<'scan' | 'display'>('display');
  const { loading, error, groupId, members, createGroup, joinGroup } = useGroup(currentUserId);

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
      setMode('display');
      return true; // Indicate successful join
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
      return false; // Indicate failed join
    }
  };

  return {
    showQR,
    setShowQR,
    mode,
    setMode,
    loading,
    error,
    groupId,
    members,
    handleCreateParty,
    handleJoinParty,
    handleQRScanned,
  };
}; 