import { useState } from 'react';
import { groupApi } from '../api/client';

export const useGroup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groupId, setGroupId] = useState<string | null>(null);

  const createGroup = async (userId: number, name?: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await groupApi.createGroup(userId, name);
      setGroupId(response._id);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create group');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const joinGroup = async (groupId: string, userId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await groupApi.joinGroup(groupId, userId);
      setGroupId(groupId);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join group');
      throw err;
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
  };
}; 