import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

interface RotatingBackgroundProps {
  color: string;
}

export const RotatingBackground: React.FC<RotatingBackgroundProps> = ({ color }) => {
  const spinValue = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  // Star path data
  const starPath = "M50 5L61.8 35.4L95.1 35.4L67.7 55.7L79.5 86.1L50 65.8L20.5 86.1L32.3 55.7L4.9 35.4L38.2 35.4Z";

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.rotatingContainer, { transform: [{ rotate: spin }] }]}>
        <Svg height="240" width="240" viewBox="0 0 100 100">
          <Path
            d={starPath}
            strokeWidth="2"
            fill={color}
            fillOpacity={0.2}
            strokeOpacity={0.4}
          />
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 240,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rotatingContainer: {
    position: 'absolute',
  },
}); 