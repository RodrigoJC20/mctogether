import { useState } from 'react';
import { ImageSourcePropType } from 'react-native';

interface Pet {
  id: string | number;
  image: ImageSourcePropType;
}

export const usePets = () => {
  const [showDebugPerimeter, setShowDebugPerimeter] = useState<boolean>(true);

  // Pet data - you would normally get this from your state/backend
  const myPet: Pet = {
    id: 'my-pet-1',
    image: require('../../assets/images/pet.png')
  };
  
  // Mock data for friend pets (for demonstration)
  const friendPets: Pet[] = [
    // This will be populated when friends join your party
    // Example: { id: 'friend-pet-1', image: require('../../assets/images/friend-pet.png') }
  ];

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