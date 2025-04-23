import { useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from './useAuth';
import { fetchWithAuth } from '../api/authApi';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl || 'http://localhost:3000';

export const useQRCode = () => {
  const [showQR, setShowQR] = useState(false);
  const [mode, setMode] = useState<'scan' | 'display'>('display');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [members, setMembers] = useState<string[]>([]);
  const { user, token } = useAuth();

  const handleCreateParty = async () => {
    try {
      console.log('handleCreateParty called');
      if (!token) {
        console.log('No token available');
        throw new Error('No authentication token available');
      }

      // First check if user is already in a group by getting current state
      console.log('Checking current user state');
      const currentUser = await fetchWithAuth(`${API_BASE_URL}/auth/me`, token, {});
      console.log('Current user state:', currentUser);

      if (currentUser?.groupId) {
        console.log('User is already in group:', currentUser.groupId);
        Alert.alert(
          'Leave Current Group?',
          'You are already in a group. Would you like to leave it and create a new one?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Leave & Create New',
              onPress: async () => {
                try {
                  console.log('User confirmed leaving group');
                  setLoading(true);

                  // Leave the current group using the correct endpoint
                  console.log('Making DELETE request to:', `${API_BASE_URL}/groups/${currentUser.groupId}`);
                  await fetchWithAuth(`${API_BASE_URL}/groups/${currentUser.groupId}`, token, {
                    method: 'DELETE',
                  });
                  console.log('Successfully left group');

                  // Clear local state
                  setGroupId(null);
                  setMembers([]);

                  // Now create a new group
                  console.log('Creating new group after leaving');
                  try {
                    await createNewGroup();
                    console.log('Successfully created new group after leaving');
                  } catch (createErr) {
                    console.error('Failed to create new group after leaving:', createErr);
                    Alert.alert('Error', 'Failed to create new group after leaving. Please try again.');
                  }
                } catch (leaveErr) {
                  console.error('Failed to leave group:', leaveErr);
                  Alert.alert('Error', 'Failed to leave current group. Please try again.');
                } finally {
                  setLoading(false);
                }
              },
            },
          ]
        );
        return;
      }

      console.log('No existing group found, creating new one');
      await createNewGroup();
    } catch (err: any) {
      console.error('Failed to create party:', err);
      if (err.message?.includes('HTTP error! status: 400')) {
        console.log('Received 400 error with message:', err.message);
        Alert.alert(
          'Error',
          'Failed to create party. Please try again.',
          [
            {
              text: 'OK',
              style: 'cancel',
            },
          ]
        );
      } else {
        setError('Failed to create party. Please try again.');
      }
    }
  };

  const createNewGroup = async () => {
    try {
      console.log('createNewGroup called');
      if (!token) {
        console.log('No token available in createNewGroup');
        throw new Error('No authentication token available');
      }
      setLoading(true);
      setError(null);
      console.log('Creating party with token:', token);
      const response = await fetchWithAuth(`${API_BASE_URL}/groups`, token, {
        method: 'POST',
        body: JSON.stringify({
          name: user?.username ? `${user.username}'s Party` : 'New Party'
        }),
      });
      console.log('Party creation response:', response);
      setGroupId(response._id);
      setMembers(response.members);
      setMode('display');
      setShowQR(true);
      return response; // Return the response for error handling
    } catch (err) {
      console.error('Failed to create party in createNewGroup:', err);
      throw err; // Re-throw to be handled by the caller
    } finally {
      setLoading(false);
    }
  };

  const handleJoinParty = () => {
    setMode('scan');
    setShowQR(true);
  };

  const handleQRScanned = async (data: string) => {
    try {
      if (!token) {
        throw new Error('No authentication token available');
      }
      setLoading(true);
      setError(null);
      
      // Get the group info first to check if the group is active
      const group = await fetchWithAuth(`${API_BASE_URL}/groups/${data}`, token, {});
      
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
        return false;
      }

      if (group.leaderId === user?._id) {
        Alert.alert('Error', 'You cannot join your own group!');
        return false;
      }
      
      // Join the group
      const updatedGroup = await fetchWithAuth(`${API_BASE_URL}/groups/${data}/join`, token, {
        method: 'POST',
      });
      
      setGroupId(updatedGroup._id);
      setMembers(updatedGroup.members);
      setShowQR(false);
      setMode('display');
      return true; // Indicate successful join
    } catch (err: any) {
      console.error('Failed to join party:', err);
      if (err.message === 'Group is not active') {
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
    } finally {
      setLoading(false);
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