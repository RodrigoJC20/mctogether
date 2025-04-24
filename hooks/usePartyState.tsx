import React, { createContext, useContext, useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import { groupApi } from '../api/client';

interface PartyMember {
  userId: string;
  username: string;
  role: 'leader' | 'member';
}

type PartyMode = 'menu' | 'scan' | 'qr';

interface PartyState {
  groupId: string | null;
  members: PartyMember[];
  loading: boolean;
  error: string | null;
  mode: PartyMode;
}

interface PartyContextType extends PartyState {
  setMode: (mode: PartyMode) => void;
  setMembers: (members: PartyMember[]) => void;
  clearPartyState: () => void;
  createParty: (userId: string, name?: string) => Promise<void>;
  joinParty: (groupId: string, userId: string) => Promise<void>;
  leaveParty: (userId: string) => Promise<void>;
  fetchPartyMembers: (groupId: string) => Promise<void>;
}

const initialState: PartyState = {
  groupId: null,
  members: [],
  loading: false,
  error: null,
  mode: 'menu',
};

const PartyContext = createContext<PartyContextType | null>(null);

interface ProviderProps {
  children: ReactNode;
}

export function PartyProvider({ children }: ProviderProps): JSX.Element {
  const [state, setState] = useState<PartyState>(initialState);

  const setMode = useCallback((mode: PartyMode) => {
    setState(prev => ({ ...prev, mode }));
  }, []);

  const setMembers = useCallback((members: PartyMember[]) => {
    setState(prev => ({ ...prev, members }));
  }, []);

  const clearPartyState = useCallback(() => {
    setState(initialState);
  }, []);

  const createParty = useCallback(async (userId: string, name?: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await groupApi.createGroup(userId, name || 'New Party');
      const memberDetails = await Promise.all(
        response.members.map(async (id: string) => {
          const userDetails = await groupApi.getUser(id);
          return {
            userId: id,
            username: userDetails.username,
            role: id === userId ? 'leader' : 'member'
          };
        })
      );
      setState(prev => ({ 
        ...prev,
        groupId: response._id,
        members: memberDetails,
        mode: 'qr',
      }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to create party' }));
      throw err;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const joinParty = useCallback(async (groupId: string, userId: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await groupApi.joinGroup(groupId, userId);
      const memberDetails = await Promise.all(
        response.members.map(async (id: string) => {
          const userDetails = await groupApi.getUser(id);
          return {
            userId: id,
            username: userDetails.username,
            role: 'member'
          };
        })
      );
      setState(prev => ({ 
        ...prev,
        groupId,
        members: memberDetails,
        mode: 'qr',
      }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to join party' }));
      throw err;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const leaveParty = useCallback(async (userId: string) => {
    if (!state.groupId) return;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await groupApi.leaveGroup(state.groupId, userId);
      clearPartyState();
    } catch (err: any) {
      if (err?.response?.status === 404) {
        clearPartyState();
      } else {
        setState(prev => ({ ...prev, error: 'Failed to leave party' }));
        throw err;
      }
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [state.groupId, clearPartyState]);

  const fetchPartyMembers = useCallback(async (groupId: string) => {
    if (!groupId) return;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const group = await groupApi.getGroup(groupId);
      if (group?.members) {
        const memberDetails = await Promise.all(
          group.members.map(async (id: string) => {
            const userDetails = await groupApi.getUser(id);
            return {
              userId: id,
              username: userDetails.username,
              role: 'member'
            };
          })
        );
        setState(prev => ({ 
          ...prev,
          members: memberDetails
        }));
      }
    } catch (err: any) {
      if (err?.response?.status === 404) {
        clearPartyState();
      } else {
        setState(prev => ({ ...prev, error: 'Failed to fetch party members' }));
      }
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [clearPartyState]);

  const value: PartyContextType = {
    ...state,
    setMode,
    setMembers,
    clearPartyState,
    createParty,
    joinParty,
    leaveParty,
    fetchPartyMembers,
  };

  return (
    <PartyContext.Provider value={value}>
      {children}
    </PartyContext.Provider>
  );
}

export function usePartyState(): PartyContextType {
  const context = useContext(PartyContext);
  if (!context) {
    throw new Error('usePartyState must be used within a PartyProvider');
  }
  return context;
} 