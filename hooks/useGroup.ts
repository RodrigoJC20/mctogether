import { useState, useEffect, useCallback } from 'react';
import { groupApi } from '../api/client';
import { useAuth } from './useAuth';

interface GroupMember {
  userId: string;
  role: 'leader' | 'member';
}

export const useGroup = (currentUserId: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const { user } = useAuth();

  // Effect to sync with user's group status
  useEffect(() => {
    if (user?.groupId) {
      setGroupId(user.groupId);
    } else {
      setGroupId(null);
      setMembers([]);
    }
  }, [user?.groupId]);

  const fetchGroupMembers = useCallback(async () => {
    if (!groupId) return;
    
    try {
      const group = await groupApi.getGroup(groupId);
      // Include all members, including the current user
      const allMembers = group.members
        .map((userId: string) => ({
          userId,
          role: userId === group.leaderId ? 'leader' : 'member'
        }));
      
      setMembers(allMembers);
      setError(null);
    } catch (err) {
      console.error('Error fetching group members:', err);
      setError('Failed to sync group members');
    }
  }, [groupId, currentUserId]);

  // Set up polling for group members
  useEffect(() => {
    if (!groupId) {
      setMembers([]);
      return;
    }

    // Initial fetch
    fetchGroupMembers();

    // Set up polling interval
    const interval = setInterval(fetchGroupMembers, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [groupId, fetchGroupMembers]);

  const leaveCurrentGroup = async (userId: string) => {
    try {
      console.log('useGroup: Leaving current group for userId:', userId);
      if (groupId) {
        await groupApi.leaveGroup(groupId, userId);
        // Clear local state immediately after successful leave
        setGroupId(null);
        setMembers([]);
      } else {
        // If we don't have a groupId stored, we need to fetch user info to get their group
        const userInfo = await groupApi.getUser(userId);
        if (userInfo.groupId) {
          await groupApi.leaveGroup(userInfo.groupId, userId);
          // Clear local state
          setGroupId(null);
          setMembers([]);
        }
      }
    } catch (err) {
      console.error('useGroup: Error leaving group:', err);
      throw err;
    }
  };

  const createGroup = async (userId: string, name?: string) => {
    try {
      console.log('useGroup: Creating group with userId:', userId);
      setLoading(true);
      setError(null);
      const response = await groupApi.createGroup(userId, name);
      console.log('useGroup: Group created successfully:', response);
      setGroupId(response._id);
      return response;
    } catch (err: any) {
      console.error('useGroup: Error creating group:', err);
      // Check if the error is because user is already in a group
      if (err?.response?.data?.message === 'User is already in a group') {
        console.log('useGroup: User is already in a group, attempting to leave and create new');
        try {
          await leaveCurrentGroup(userId);
          // Try creating the group again
          const response = await groupApi.createGroup(userId, name);
          console.log('useGroup: Group created successfully after leaving:', response);
          setGroupId(response._id);
          return response;
        } catch (retryErr) {
          console.error('useGroup: Error in retry after leaving group:', retryErr);
          const errorMessage = retryErr instanceof Error ? retryErr.message : 'Failed to create group after leaving';
          setError(errorMessage);
          throw retryErr;
        }
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create group';
        setError(errorMessage);
        throw err;
      }
    } finally {
      setLoading(false);
    }
  };

  const joinGroup = async (groupId: string, userId: string) => {
    try {
      console.log('useGroup: Joining group:', { groupId, userId });
      setLoading(true);
      setError(null);
      const response = await groupApi.joinGroup(groupId, userId);
      console.log('useGroup: Joined group successfully:', response);
      setGroupId(groupId);
      return response;
    } catch (err: any) {
      console.error('useGroup: Error joining group:', err);
      // Check if the error is because user is already in a group
      if (err?.response?.data?.message === 'User is already in a group') {
        console.log('useGroup: User is already in a group, attempting to leave and join new');
        try {
          await leaveCurrentGroup(userId);
          // Try joining the group again
          const response = await groupApi.joinGroup(groupId, userId);
          console.log('useGroup: Group joined successfully after leaving:', response);
          setGroupId(groupId);
          return response;
        } catch (retryErr) {
          console.error('useGroup: Error in retry after leaving group:', retryErr);
          const errorMessage = retryErr instanceof Error ? retryErr.message : 'Failed to join group after leaving';
          setError(errorMessage);
          throw retryErr;
        }
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Failed to join group';
        setError(errorMessage);
        throw err;
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    groupId,
    members,
    createGroup,
    joinGroup,
    leaveCurrentGroup,
    fetchGroupMembers,
  };
}; 