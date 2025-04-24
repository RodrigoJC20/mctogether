import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useAuth } from './useAuth';
import Constants from 'expo-constants';
import { groupApi } from '../api/client';

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl || 'http://localhost:3000';

interface ApiError {
  response?: {
    status: number;
  };
}

type PartyMode = 'menu' | 'scan' | 'qr';

export const useQRCode = () => {
  const [mode, setMode] = useState<PartyMode>('menu');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [members, setMembers] = useState<string[]>([]);
  const { user, token, refreshUser } = useAuth();

  // Effect to reset state when user is not in a group
  useEffect(() => {
    let mounted = true;
    
    if (!user?.groupId) {
      if (mounted) {
        // Complete state reset when leaving group
        setMembers([]);
        setMode('menu');
        setError(null);
        setLoading(false);
      }
    } else if (mounted) {
      // When in a group, always show QR
      setMode('qr');
    }

    return () => {
      mounted = false;
    };
  }, [user?.groupId]);

  // Derive showQR directly from user's group status and mode
  const showQR = !!user?.groupId && mode === 'qr';

  const fetchGroupMembers = useCallback(async () => {
    // Don't fetch if we're not in a group
    if (!token || !user?.groupId) {
      setMembers([]);
      return;
    }

    try {
      const group = await groupApi.getGroup(user.groupId);
      if (group?.members) {
        setMembers(group.members);
      }
    } catch (err) {
      console.error('Error fetching group members:', err);
      const apiError = err as ApiError;
      if (apiError?.response?.status === 404) {
        // Complete state reset on 404
        setMembers([]);
        setMode('menu');
        setError(null);
        setLoading(false);
        await refreshUser();
      }
    }
  }, [token, user?.groupId, refreshUser]);

  const handleLeaveGroup = async (groupId: string, userId: string) => {
    try {
      setLoading(true);
      await groupApi.leaveGroup(groupId, userId);
      // Complete state reset after leaving
      setMembers([]);
      setMode('menu');
      setError(null);
      await refreshUser();
    } catch (err) {
      console.error('Error leaving group:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleQRScanned = async (data: string) => {
    try {
      if (!token || !user) {
        throw new Error('No authentication token or user available');
      }
      setLoading(true);
      setError(null);
      
      // Get fresh user state first
      const freshUserInfo = await groupApi.getUser(user._id);
      
      if (freshUserInfo.groupId) {
        Alert.alert(
          'Leave Current Group?',
          'You are already in a group. Would you like to leave it and join this one?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Leave & Join New',
              onPress: async () => {
                try {
                  setLoading(true);
                  // Use handleLeaveGroup for consistent cleanup
                  await handleLeaveGroup(freshUserInfo.groupId, user._id);
                  await joinGroup(data);
                } catch (err) {
                  console.error('Error leaving group and joining new:', err);
                  Alert.alert('Error', 'Failed to leave group and join new one. Please try again.');
                } finally {
                  setLoading(false);
                }
              },
            },
          ]
        );
        return false;
      }

      return await joinGroup(data);
    } catch (err: any) {
      console.error('Failed to handle QR scan:', err);
      Alert.alert('Error', 'Failed to process QR code. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleCreateParty = async () => {
    try {
      console.log('handleCreateParty called');
      if (!token || !user?._id) {
        console.log('No token or user available');
        throw new Error('No authentication token or user available');
      }

      setLoading(true);
      setError(null);

      // Get fresh user state first
      const freshUserInfo = await groupApi.getUser(user._id);
      
      if (freshUserInfo.groupId) {
        console.log('User is already in group:', freshUserInfo.groupId);
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
                  setLoading(true);
                  await groupApi.leaveGroup(freshUserInfo.groupId, user._id);
                  // Clear state immediately
                  setMembers([]);
                  setMode('menu');
                  await refreshUser();
                  await createNewGroup();
                } catch (err) {
                  console.error('Error leaving group and creating new:', err);
                  Alert.alert('Error', 'Failed to leave group and create new one. Please try again.');
                } finally {
                  setLoading(false);
                }
              },
            },
          ]
        );
        return;
      }

      await createNewGroup();
    } catch (err: any) {
      console.error('Failed to create party:', err);
      Alert.alert(
        'Error',
        'Failed to create party. Please try again.',
        [{ text: 'OK', style: 'cancel' }]
      );
      setError('Failed to create party. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const createNewGroup = async () => {
    try {
      if (!token || !user) {
        throw new Error('No authentication token or user available');
      }
      
      setLoading(true);
      setError(null);
      
      const response = await groupApi.createGroup(user._id, user.username ? `${user.username}'s Party` : 'New Party');
      console.log('Party creation response:', response);
      
      // Update members immediately with the response
      setMembers(response.members || []);
      setMode('qr');
      
      // Refresh user state to get updated groupId
      await refreshUser();
      
      return response;
    } catch (err) {
      console.error('Failed to create party in createNewGroup:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleJoinParty = () => {
    setMode('scan');
  };

  const joinGroup = async (groupId: string) => {
    try {
      if (!token || !user) {
        throw new Error('No authentication token or user available');
      }

      // Get the group info first
      const group = await groupApi.getGroup(groupId);
      
      // Join the group
      const updatedGroup = await groupApi.joinGroup(groupId, user._id);
      setMembers(updatedGroup.members || []);
      setMode('qr');
      
      // Refresh user state to get updated groupId
      await refreshUser();
      
      return true;
    } catch (err) {
      console.error('Failed to join group:', err);
      throw err;
    }
  };

  return {
    showQR,
    mode,
    setMode,
    loading,
    error,
    members,
    handleCreateParty,
    handleJoinParty,
    handleQRScanned,
    fetchGroupMembers,
  };
}; 