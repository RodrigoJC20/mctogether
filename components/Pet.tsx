import React, { useState, useEffect, useRef } from 'react';
import { Animated, Easing, Dimensions, StyleSheet, Image, View, Text } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const BOUNDARIES = {
  top: 100,
  bottom: 100,
  left: 20,
  right: 20,
};

interface PetProps {
  id: string;
  name: string;
  type: number;
  hat: number;
  eyes: number;
  mouth: number;
  isMyPet: boolean;
}

const TYPE_IMAGES: { [key: number]: any } = {
  0: require('../assets/images/pet/types/1.png'),
  1: require('../assets/images/pet/types/2.png'),
  2: require('../assets/images/pet/types/3.png'),
};

const EYES_IMAGES: { [key: number]: any } = {
  0: require('../assets/images/pet/eyes/1.png'),
  1: require('../assets/images/pet/eyes/2.png'),
  2: require('../assets/images/pet/eyes/3.png'),
};

const MOUTH_IMAGES: { [key: number]: any } = {
  0: require('../assets/images/pet/mouths/1.png'),
  1: require('../assets/images/pet/mouths/2.png'),
  2: require('../assets/images/pet/mouths/3.png'),
};

const HAT_IMAGES: { [key: number]: any } = {
  0: null, // No hat
  1: require('../assets/images/pet/hats/1.png'),
  2: require('../assets/images/pet/hats/2.png'),
  3: require('../assets/images/pet/hats/3.png'),
};

export const Pet: React.FC<PetProps> = ({ id, name, type, hat, eyes, mouth, isMyPet }) => {
  const [position, setPosition] = useState({
    x: SCREEN_WIDTH / 2 - 50,
    y: SCREEN_HEIGHT / 2 - 50,
  });
  const [direction, setDirection] = useState(Math.random() * 2 * Math.PI);
  const [speed] = useState(0.5 + Math.random() * 1.5);
  const [isMoving, setIsMoving] = useState(false);
  const walkValue = useRef(new Animated.Value(0)).current;
  const moveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Start/stop walking animation
  const startWalkingAnimation = () => {
    walkValue.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(walkValue, {
          toValue: 1,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true
        }),
        Animated.timing(walkValue, {
          toValue: -1,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true
        })
      ])
    ).start();
  };

  const stopWalkingAnimation = () => {
    Animated.timing(walkValue, {
      toValue: 0,
      duration: 150,
      easing: Easing.linear,
      useNativeDriver: true
    }).start();
  };

  // Movement logic
  const startMovement = () => {
    const moveDuration = 2000 + Math.random() * 5000;
    const pauseDuration = 1000 + Math.random() * 3000;

    setIsMoving(true);
    setDirection(Math.random() * 2 * Math.PI);
    startWalkingAnimation();

    moveTimeoutRef.current = setTimeout(() => {
      setIsMoving(false);
      stopWalkingAnimation();

      moveTimeoutRef.current = setTimeout(() => {
        startMovement();
      }, pauseDuration);
    }, moveDuration);
  };

  // Animation frame loop
  useEffect(() => {
    let lastUpdate = Date.now();
    const FPS = 60;
    const frameInterval = 1000 / FPS;

    const updatePosition = () => {
      const now = Date.now();
      const delta = now - lastUpdate;

      if (delta > frameInterval && isMoving) {
        let newX = position.x + Math.cos(direction) * speed;
        let newY = position.y + Math.sin(direction) * speed;

        // Boundary checks
        if (newX < BOUNDARIES.left) {
          newX = BOUNDARIES.left;
          setDirection(Math.PI - direction);
        } else if (newX > SCREEN_WIDTH - BOUNDARIES.right - 100) {
          newX = SCREEN_WIDTH - BOUNDARIES.right - 100;
          setDirection(Math.PI - direction);
        }

        if (newY < BOUNDARIES.top) {
          newY = BOUNDARIES.top;
          setDirection(2 * Math.PI - direction);
        } else if (newY > SCREEN_HEIGHT - BOUNDARIES.bottom - 100) {
          newY = SCREEN_HEIGHT - BOUNDARIES.bottom - 100;
          setDirection(2 * Math.PI - direction);
        }

        setPosition({ x: newX, y: newY });
        lastUpdate = now;
      }

      animationFrameRef.current = requestAnimationFrame(updatePosition);
    };

    animationFrameRef.current = requestAnimationFrame(updatePosition);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isMoving, direction, speed, position]);

  // Initialize movement
  useEffect(() => {
    startMovement();

    return () => {
      if (moveTimeoutRef.current) {
        clearTimeout(moveTimeoutRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      walkValue.stopAnimation();
    };
  }, []);

  // Animation interpolations
  const rotateInterpolation = walkValue.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-3deg', '0deg', '3deg'],
    extrapolate: 'clamp'
  });

  const translateYInterpolation = walkValue.interpolate({
    inputRange: [-1, -0.5, 0, 0.5, 1],
    outputRange: [0, -2, 0, -2, 0],
    extrapolate: 'clamp'
  });

  return (
    <Animated.View
      style={[
        styles.petContainer,
        {
          left: position.x,
          top: position.y,
        }
      ]}>
      <Animated.View
        style={{
          width: 100,
          height: 100,
          alignItems: 'center',
          justifyContent: 'center',
          transform: [
            { scaleX: Math.cos(direction) < 0 ? -1 : 1 },
            { rotate: rotateInterpolation },
            { translateY: translateYInterpolation }
          ]
        }}>

        <Image
          source={TYPE_IMAGES[type] || TYPE_IMAGES[0]}
          style={styles.petLayer}
        />

        <Image
          source={EYES_IMAGES[eyes] || EYES_IMAGES[0]}
          style={styles.petLayer}
        />

        <Image
          source={MOUTH_IMAGES[mouth] || MOUTH_IMAGES[0]}
          style={styles.petLayer}
        />

        {hat > 0 && HAT_IMAGES[hat] && (
          <Image
            source={HAT_IMAGES[hat]}
            style={styles.petLayer}
          />
        )}
      </Animated.View>

      <View style={[
        styles.nameTag,
        isMyPet ? styles.myPetNameTag : null
      ]}>
        <Text style={styles.nameText}>{name}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({

  petContainer: {
    position: 'absolute',
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },

  petLayer: {
    position: 'absolute',
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },

  nameTag: {
    position: 'absolute',
    bottom: -20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },

  myPetNameTag: {
    backgroundColor: 'rgba(230, 25, 25, 0.7)',
  },

  nameText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  }

});