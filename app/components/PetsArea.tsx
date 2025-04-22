// components/PetsArea.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Dimensions, ImageSourcePropType, Animated, Easing } from 'react-native';

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
interface Pet {
  id: string | number;
  image: ImageSourcePropType;
}

interface PetState extends Pet {
  x: number;
  y: number;
  direction: number;
  speed: number;
  moveTimeout: NodeJS.Timeout | null;
  isMoving: boolean;
  walkValue: Animated.Value; // For the walking animation
}

interface PetsAreaProps {
  myPet: Pet;
  friendPets?: Pet[];
}

const PetsArea: React.FC<PetsAreaProps> = ({ myPet, friendPets = [] }) => {
  // Combine my pet with friend pets for unified handling
  const allPets = [myPet, ...friendPets];
  
  // Track the position and movement of each pet
  const [pets, setPets] = useState<PetState[]>(() => 
    allPets.map((pet, index) => ({
      id: pet.id,
      image: pet.image,
      x: SCREEN_WIDTH / 2 - 50, // Start in center
      y: SCREEN_HEIGHT / 2 - 50, // Start in center
      direction: Math.random() * 2 * Math.PI, // Random direction in radians
      speed: 0.5 + Math.random() * 1.5, // Random speed
      moveTimeout: null,
      isMoving: false,
      walkValue: new Animated.Value(0) // Initialize animation value
    }))
  );
  
  // Animation frame reference for smooth movement
  const animationRef = useRef<number | null>(null);
  
  // Initialize pet movement
  useEffect(() => {
    // Start movement loop for each pet
    pets.forEach((_, index) => {
      startMovement(index);
    });
    
    // Start animation frame loop
    startAnimationLoop();
    
    return () => {
      // Cleanup on unmount
      pets.forEach(pet => {
        if (pet.moveTimeout) clearTimeout(pet.moveTimeout);
      });
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Start the walking animation for a specific pet
  const startWalkingAnimation = (index: number) => {
    const pet = pets[index];
    
    // Stop any existing animations
    pet.walkValue.stopAnimation();
    
    // Reset to 0
    pet.walkValue.setValue(0);
    
    // Create a sequence that loops between -1 and 1 (for slight tilting)
    Animated.loop(
      Animated.sequence([
        Animated.timing(pet.walkValue, {
          toValue: 1,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true
        }),
        Animated.timing(pet.walkValue, {
          toValue: -1,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true
        })
      ])
    ).start();
  };
  
  // Stop the walking animation for a specific pet
  const stopWalkingAnimation = (index: number) => {
    const pet = pets[index];
    
    // Animate back to 0 (neutral position)
    Animated.timing(pet.walkValue, {
      toValue: 0,
      duration: 150,
      easing: Easing.linear,
      useNativeDriver: true
    }).start();
  };
  
  const startAnimationLoop = () => {
    const updatePositions = () => {
      setPets(currentPets => 
        currentPets.map(pet => {
          if (!pet.isMoving) return pet;
          
          // Calculate new position
          let newX = pet.x + Math.cos(pet.direction) * pet.speed;
          let newY = pet.y + Math.sin(pet.direction) * pet.speed;
          
          // Boundary checks
          if (newX < BOUNDARIES.left) {
            newX = BOUNDARIES.left;
            pet.direction = Math.PI - pet.direction;
          } else if (newX > SCREEN_WIDTH - BOUNDARIES.right - 100) {
            newX = SCREEN_WIDTH - BOUNDARIES.right - 100;
            pet.direction = Math.PI - pet.direction;
          }
          
          if (newY < BOUNDARIES.top) {
            newY = BOUNDARIES.top;
            pet.direction = 2 * Math.PI - pet.direction;
          } else if (newY > SCREEN_HEIGHT - BOUNDARIES.bottom - 100) {
            newY = SCREEN_HEIGHT - BOUNDARIES.bottom - 100;
            pet.direction = 2 * Math.PI - pet.direction;
          }
          
          return { ...pet, x: newX, y: newY };
        })
      );
      
      animationRef.current = requestAnimationFrame(updatePositions);
    };
    
    animationRef.current = requestAnimationFrame(updatePositions);
  };
  
  const startMovement = (petIndex: number) => {
    const moveDuration = 2000 + Math.random() * 5000; // Move for 2-7 seconds
    const pauseDuration = 1000 + Math.random() * 3000; // Pause for 1-4 seconds
    
    // Start moving
    setPets(currentPets => {
      const newPets = [...currentPets];
      newPets[petIndex] = {
        ...newPets[petIndex],
        isMoving: true,
        direction: Math.random() * 2 * Math.PI,
        speed: 0.5 + Math.random() * 1.5,
      };
      return newPets;
    });
    
    // Start walking animation
    startWalkingAnimation(petIndex);
    
    // Schedule stop
    const moveTimeout = setTimeout(() => {
      // Stop moving
      setPets(currentPets => {
        const newPets = [...currentPets];
        newPets[petIndex] = {
          ...newPets[petIndex],
          isMoving: false,
        };
        return newPets;
      });
      
      // Stop walking animation
      stopWalkingAnimation(petIndex);
      
      // Schedule next movement
      const pauseTimeout = setTimeout(() => {
        startMovement(petIndex);
      }, pauseDuration);
      
      // Update timeout reference
      setPets(currentPets => {
        const newPets = [...currentPets];
        newPets[petIndex] = {
          ...newPets[petIndex],
          moveTimeout: pauseTimeout,
        };
        return newPets;
      });
    }, moveDuration);
    
    // Update timeout reference
    setPets(currentPets => {
      const newPets = [...currentPets];
      newPets[petIndex] = {
        ...newPets[petIndex],
        moveTimeout: moveTimeout,
      };
      return newPets;
    });
  };
  
  return (
    <View style={styles.container}>
      {pets.map((pet, index) => {
        // Create rotation transform based on walking animation
        const rotateInterpolation = pet.walkValue.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: ['-3deg', '0deg', '3deg'], // Subtle rotation for walking effect
          extrapolate: 'clamp'
        });
        
        // Create vertical bounce transform for more natural walking
        const translateYInterpolation = pet.walkValue.interpolate({
          inputRange: [-1, -0.5, 0, 0.5, 1],
          outputRange: [0, -2, 0, -2, 0], // Subtle bounce up and down
          extrapolate: 'clamp'
        });
        
        return (
          <Animated.Image
            key={pet.id}
            source={pet.image}
            style={[
              styles.petImage,
              { 
                left: pet.x, 
                top: pet.y,
                transform: [
                  { scaleX: Math.cos(pet.direction) < 0 ? -1 : 1 }, // Flip image based on direction
                  { rotate: rotateInterpolation }, // Apply walking rotation
                  { translateY: translateYInterpolation } // Apply vertical bounce
                ]
              }
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1, // Lower than UI elements
  },
  petImage: {
    position: 'absolute',
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
});

export default PetsArea;