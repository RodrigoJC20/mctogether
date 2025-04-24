import { useState, useEffect, useCallback } from 'react';
import { groupApi } from '../api/client';
import { useAuth } from './useAuth';

interface GroupMember {
  userId: string;
}

export const useGroup = (currentUserId: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const { user } = useAuth();

  // Effect to sync with user's group status
  useEffect(() => {
    let mounted = true;
    
    if (user?.groupId) {
      if (mounted) setGroupId(user.groupId);
    } else {
      if (mounted) {
        setGroupId(null);
        setMembers([]);
      }
    }

    return () => {
      mounted = false;
    };
  }, [user?.groupId]);

  const fetchGroupMembers = useCallback(async () => {
    if (!groupId) {
      setMembers([]);
      return;
    }
    
    try {
      const group = await groupApi.getGroup(groupId);
      // Map members to simple objects with just userId
      const allMembers = group.members.map((userId: string) => ({ userId }));
      
      setMembers(allMembers);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching group members:', err);
      // If group not found, clear group state
      if (err?.response?.status === 404) {
        setGroupId(null);
        setMembers([]);
        setError('Group no longer exists');
      } else {
        setError('Failed to sync group members');
      }
    }
  }, [groupId]);

  // Effect for keeping members in sync
  useEffect(() => {
    let mounted = true;
    
    if (!groupId) {
      if (mounted) setMembers([]);
      return;
    }

    const syncMembers = async () => {
      if (!mounted) return;
      await fetchGroupMembers();
    };

    syncMembers();

    return () => {
      mounted = false;
    };
  }, [groupId, fetchGroupMembers]);

  const leaveCurrentGroup = async (userId: string) => {
    try {
      console.log('useGroup: Leaving current group for userId:', userId);
      
      let groupIdToLeave = groupId;
      
      // If we don't have a groupId stored, fetch user info to get their group
      if (!groupIdToLeave) {
        const userInfo = await groupApi.getUser(userId);
        groupIdToLeave = userInfo.groupId;
      }
      
      // Clear local state immediately to prevent stale UI
      setGroupId(null);
      setMembers([]);
      setError(null);
      
      if (groupIdToLeave) {
        try {
          await groupApi.leaveGroup(groupIdToLeave, userId);
        } catch (err: any) {
          // If the group doesn't exist, that's fine - just continue
          if (err?.response?.status !== 404) {
            throw err;
          }
        }
      }

      // After leaving, fetch fresh user info to ensure UI updates
      await groupApi.getUser(userId);
    } catch (err) {
      console.error('useGroup: Error leaving group:', err);
      throw err;
    }
  };

  // Effect to cleanup stale group data
  useEffect(() => {
    const cleanup = async () => {
      if (groupId && !user?.groupId) {
        // If we have a local groupId but user doesn't have one, clear local state
        setGroupId(null);
        setMembers([]);
        setError(null);
      }
    };
    
    cleanup();
  }, [groupId, user?.groupId]);

  const createGroup = async (userId: string, name?: string) => {
    try {
      console.log('useGroup: Creating group with userId:', userId);
      setLoading(true);
      setError(null);

      // Create the group
      const response = await groupApi.createGroup(userId, name);
      console.log('useGroup: Group created successfully:', response);
      
      // Update local state
      setGroupId(response._id);
      
      // Set initial members list immediately for quick UI update
      setMembers([{ userId }]);

      // Fetch fresh group data to ensure we have the latest state
      await fetchGroupMembers();

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
          
          // Update local state
          setGroupId(response._id);
          setMembers([{ userId }]);

          // Fetch fresh group data
          await fetchGroupMembers();
          
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

      // Join the group
      const response = await groupApi.joinGroup(groupId, userId);
      console.log('useGroup: Joined group successfully:', response);
      
      // Update local state
      setGroupId(groupId);
      
      // Fetch fresh group data to get the latest members list
      await fetchGroupMembers();

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
          
          // Update local state
          setGroupId(groupId);
          
          // Fetch fresh group data
          await fetchGroupMembers();
          
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