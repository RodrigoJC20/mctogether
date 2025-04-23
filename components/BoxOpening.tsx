import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

interface BoxOpeningProps {
  boxType: 'common' | 'rare' | 'exclusive';
  onClose: () => void;
}

const ITEMS = {
  classic: ['Toy Car', 'Action Figure', 'Stuffed Animal'],
  epic: ['Special Edition Toy', 'Collector Item', 'Limited Edition'],
  exotic: ['Rare Collectible', 'Exclusive Item', 'Legendary Toy']
};

const RARITY_COLORS = {
  classic: '#ADBD50', // Green
  epic: '#FFD751',    // Yellow
  exotic: '#FD5D51'   // Red
};

export const BoxOpening: React.FC<BoxOpeningProps> = ({ boxType, onClose }) => {
  const [showResult, setShowResult] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const [itemRarity, setItemRarity] = useState<'classic' | 'epic' | 'exotic'>('classic');
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    // Simulate box opening animation
    const timer = setTimeout(() => {
      // Randomly select an item and rarity
      const rarities = ['classic', 'epic', 'exotic'] as const;
      const selectedRarity = rarities[Math.floor(Math.random() * rarities.length)];
      const items = ITEMS[selectedRarity];
      const randomItem = items[Math.floor(Math.random() * items.length)];
      
      setItemRarity(selectedRarity);
      setSelectedItem(randomItem);
      setShowResult(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showResult) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [showResult]);

  return (
    <TouchableOpacity 
      style={styles.container} 
      activeOpacity={1} 
      onPress={onClose}
    >
      <View style={styles.content}>
        {!showResult ? (
          <View style={styles.loadingContainer}>
            <FontAwesome5 name="box-open" size={100} color="#FECB94" />
            <Text style={styles.loadingText}>Opening Box...</Text>
          </View>
        ) : (
          <Animated.View 
            style={[
              styles.resultContainer,
              { opacity: fadeAnim }
            ]}
          >
            <Text style={[styles.itemName, { color: RARITY_COLORS[itemRarity] }]}>
              {selectedItem}
            </Text>
            <FontAwesome5 name="gift" size={80} color={RARITY_COLORS[itemRarity]} />
            <Text style={[styles.rarityText, { color: RARITY_COLORS[itemRarity] }]}>
              {itemRarity.toUpperCase()}
            </Text>
          </Animated.View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '80%',
    height: '60%',
    backgroundColor: '#FEF8EB',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 24,
    color: '#FD5D51',
    fontWeight: 'bold',
  },
  resultContainer: {
    alignItems: 'center',
  },
  itemName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  rarityText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
}); 