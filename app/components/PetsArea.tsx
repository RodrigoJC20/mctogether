// components/PetsArea.tsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, Image, StyleSheet, Dimensions, ImageSourcePropType, Animated, Easing, Text } from 'react-native';

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
  showDebugPerimeter?: boolean; // Toggle to show/hide debug perimeter
}

const PetsArea: React.FC<PetsAreaProps> = ({ 
  myPet, 
  friendPets = [],
  showDebugPerimeter = true // Default to showing the perimeter for debugging
}) => {
  // Memoize allPets to prevent recreation on every render
  const allPets = useMemo(() => [myPet, ...friendPets], [myPet, friendPets]);
  
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
  const petsRef = useRef(pets);
  
  // Update pets ref when pets state changes
  useEffect(() => {
    petsRef.current = pets;
  }, [pets]);
  
  // Update pets when allPets changes
  useEffect(() => {
    // Get current pets' state
    const currentPetsState = petsRef.current.reduce((acc, pet) => {
      acc[pet.id] = {
        x: pet.x,
        y: pet.y,
        direction: pet.direction,
        speed: pet.speed,
        isMoving: pet.isMoving,
        walkValue: pet.walkValue,
      };
      return acc;
    }, {} as Record<string | number, Omit<PetState, 'id' | 'image' | 'moveTimeout'>>);

    // Update pets array with new pets while preserving state for existing pets
    setPets(allPets.map(pet => ({
      id: pet.id,
      image: pet.image,
      x: currentPetsState[pet.id]?.x ?? SCREEN_WIDTH / 2 - 50,
      y: currentPetsState[pet.id]?.y ?? SCREEN_HEIGHT / 2 - 50,
      direction: currentPetsState[pet.id]?.direction ?? Math.random() * 2 * Math.PI,
      speed: currentPetsState[pet.id]?.speed ?? 0.5 + Math.random() * 1.5,
      moveTimeout: null,
      isMoving: currentPetsState[pet.id]?.isMoving ?? false,
      walkValue: currentPetsState[pet.id]?.walkValue ?? new Animated.Value(0)
    })));
  }, [allPets]);
  
  // Initialize pet movement
  useEffect(() => {
    let mounted = true;
    
    // Start movement loop for each pet
    petsRef.current.forEach((_, index) => {
      if (mounted) {
        startMovement(index);
      }
    });
    
    // Start animation frame loop
    startAnimationLoop();
    
    return () => {
      mounted = false;
      // Cleanup on unmount
      petsRef.current.forEach(pet => {
        if (pet.moveTimeout) clearTimeout(pet.moveTimeout);
        pet.walkValue.stopAnimation();
      });
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [allPets]); // Re-initialize when pets change
  
  // Start the walking animation for a specific pet
  const startWalkingAnimation = useCallback((index: number) => {
    const pet = petsRef.current[index];
    if (!pet) return;
    
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
  }, []);
  
  // Stop the walking animation for a specific pet
  const stopWalkingAnimation = useCallback((index: number) => {
    const pet = petsRef.current[index];
    if (!pet) return;
    
    // Animate back to 0 (neutral position)
    Animated.timing(pet.walkValue, {
      toValue: 0,
      duration: 150,
      easing: Easing.linear,
      useNativeDriver: true
    }).start();
  }, []);
  
  const startAnimationLoop = useCallback(() => {
    let lastUpdate = Date.now();
    const FPS = 60;
    const frameInterval = 1000 / FPS;
    
    const updatePositions = () => {
      const now = Date.now();
      const delta = now - lastUpdate;
      
      if (delta > frameInterval) {
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
        lastUpdate = now;
      }
      
      animationRef.current = requestAnimationFrame(updatePositions);
    };
    
    animationRef.current = requestAnimationFrame(updatePositions);
  }, []);
  
  const startMovement = useCallback((petIndex: number) => {
    const moveDuration = 2000 + Math.random() * 5000; // Move for 2-7 seconds
    const pauseDuration = 1000 + Math.random() * 3000; // Pause for 1-4 seconds
    
    // Start moving
    setPets(currentPets => {
      const newPets = [...currentPets];
      if (newPets[petIndex]) {
        newPets[petIndex] = {
          ...newPets[petIndex],
          isMoving: true,
          direction: Math.random() * 2 * Math.PI,
          speed: 0.5 + Math.random() * 1.5,
        };
      }
      return newPets;
    });
    
    // Start walking animation
    startWalkingAnimation(petIndex);
    
    // Schedule stop
    const moveTimeout = setTimeout(() => {
      // Stop moving
      setPets(currentPets => {
        const newPets = [...currentPets];
        if (newPets[petIndex]) {
          newPets[petIndex] = {
            ...newPets[petIndex],
            isMoving: false,
          };
        }
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
        if (newPets[petIndex]) {
          newPets[petIndex] = {
            ...newPets[petIndex],
            moveTimeout: pauseTimeout,
          };
        }
        return newPets;
      });
    }, moveDuration);
    
    // Update timeout reference
    setPets(currentPets => {
      const newPets = [...currentPets];
      if (newPets[petIndex]) {
        newPets[petIndex] = {
          ...newPets[petIndex],
          moveTimeout: moveTimeout,
        };
      }
      return newPets;
    });
  }, [startWalkingAnimation, stopWalkingAnimation]);

  // Calculate perimeter dimensions based on boundaries
  const perimeterStyle = useMemo(() => ({
    top: BOUNDARIES.top,
    left: BOUNDARIES.left,
    width: SCREEN_WIDTH - BOUNDARIES.left - BOUNDARIES.right,
    height: SCREEN_HEIGHT - BOUNDARIES.top - BOUNDARIES.bottom,
  }), []);

  return (
    <View style={styles.container}>
      {/* Debug perimeter to show boundaries */}
      {showDebugPerimeter && (
        <View style={[styles.debugPerimeter, perimeterStyle]}>
          {/* Pet area label */}
          <Text style={styles.debugLabel}>Pet Area</Text>
        </View>
      )}
      
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
  debugPerimeter: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(0, 120, 255, 0.5)', // Semi-transparent blue
    borderStyle: 'dashed',
    backgroundColor: 'rgba(0, 120, 255, 0.1)', // Very light blue background
    justifyContent: 'center',
    alignItems: 'center',
  },
  debugLabel: {
    color: 'rgba(0, 120, 255, 0.7)',
    fontWeight: 'bold',
    fontSize: 16,
  }
});

export default React.memo(PetsArea);