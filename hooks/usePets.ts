import { useState } from 'react';

interface Pet {
  id: string;
  image: any;
}

interface GroupMember {
  userId: string;
  role: 'leader' | 'member';
}

const PET_IMAGES = [
  require('../assets/images/items/demo.png'),
  require('../assets/images/items/Demo2.png'),
  require('../assets/images/items/demo3.png'),
  // Add more as needed
];

export const usePets = (groupId: string | null, currentUserId: string | null, members: GroupMember[]) => {
  const [showDebugPerimeter, setShowDebugPerimeter] = useState<boolean>(true);

  const getPetImage = (userId: string): any => {
    if (!userId) return require('../assets/images/items/demo.png');
  
    // Create a simple hash from the userId to pick an image consistently
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = (hash << 5) - hash + userId.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    
    const index = Math.abs(hash) % PET_IMAGES.length;
    return PET_IMAGES[index];
  };

  // Pet data - you would normally get this from your state/backend
  const myPet: Pet | null = currentUserId ? {
    id: `pet-${currentUserId}`,
    image: getPetImage(currentUserId)
  } : null;
  
  // Create friend pets based on group members, excluding current user
  const friendPets: Pet[] = members
    .filter(member => member.userId !== currentUserId)
    .map(member => ({
      id: `pet-${member.userId}`,
      image: getPetImage(member.userId)
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