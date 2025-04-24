// components/PetsArea.tsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, Image, StyleSheet, Dimensions, ImageSourcePropType, Animated, Easing, Text } from 'react-native';
import { Pet } from './Pet';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

// Define boundaries to avoid UI elements
const BOUNDARIES = {
  top: 100, // Stay below top UI elements
  bottom: 100, // Stay above bottom UI elements
  left: 50, // Stay away from left edge
  right: 50, // Stay away from right edge
};

// Type definitions
interface PetData {
  id: string;
  image: any;
}

interface PetsAreaProps {
  myPet: PetData | null;
  friendPets: PetData[];
}

const PetsArea: React.FC<PetsAreaProps> = ({ myPet, friendPets }) => {
  return (
    <View style={styles.container}>
      {/* Render my pet */}
      {myPet && (
        <Pet
          key={myPet.id}
          id={myPet.id}
          image={myPet.image}
          isMyPet={true}
        />
      )}

      {/* Render friend pets */}
      {friendPets.map((pet) => (
        <Pet
            key={pet.id}
          id={pet.id}
          image={pet.image}
          isMyPet={false}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
});

export default PetsArea;