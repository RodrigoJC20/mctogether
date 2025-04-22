import { useState } from 'react';

interface Pet {
  id: string;
  image: any;
}

interface GroupMember {
  userId: number;
  role: 'leader' | 'member';
}

export const usePets = (groupId: string | null, currentUserId: number, members: GroupMember[]) => {
  const [showDebugPerimeter, setShowDebugPerimeter] = useState<boolean>(true);

  // Pet data - you would normally get this from your state/backend
  const myPet: Pet = {
    id: `pet-${currentUserId}`,
    image: require('../../assets/images/pet.png')
  };
  
  // Create friend pets based on group members, excluding current user
  const friendPets: Pet[] = members
    .filter(member => member.userId !== currentUserId)
    .map(member => ({
      id: `pet-${member.userId}`,
      image: require('../../assets/images/pet.png')
    }));

  const toggleDebugPerimeter = () => {
    setShowDebugPerimeter(prev => !prev);
  };

  return {
    myPet,
    friendPets,
    showDebugPerimeter,
    toggleDebugPerimeter,
  };
}; 