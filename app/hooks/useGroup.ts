import { useState } from 'react';
import { groupApi } from '../api/client';

export const useGroup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groupId, setGroupId] = useState<string | null>(null);

  const leaveCurrentGroup = async (userId: number) => {
    try {
      console.log('useGroup: Leaving current group for userId:', userId);
      if (groupId) {
        await groupApi.leaveGroup(groupId, userId);
      } else {
        // If we don't have a groupId stored, we need to fetch user info to get their group
        const userInfo = await groupApi.getUser(userId);
        if (userInfo.groupId) {
          await groupApi.leaveGroup(userInfo.groupId, userId);
        }
      }
      setGroupId(null);
    } catch (err) {
      console.error('useGroup: Error leaving group:', err);
      throw err;
    }
  };

  const createGroup = async (userId: number, name?: string) => {
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

  const joinGroup = async (groupId: string, userId: number) => {
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
    createGroup,
    joinGroup,
    leaveCurrentGroup,
  };
}; 