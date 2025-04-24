import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image, ScrollView } from 'react-native';
import { useState } from 'react';
import { BoxOpening } from '../../components/BoxOpening';

// Temporary items for testing
const ITEMS = {
  classic: ['Toy Car', 'Action Figure', 'Stuffed Animal'],
  epic: ['Special Edition Toy', 'Collector Item', 'Limited Edition'],
  exotic: ['Rare Collectible', 'Exclusive Item', 'Legendary Toy']
};

export default function Shop() {
  const [showBoxOpening, setShowBoxOpening] = useState(false);
  const [selectedBoxType, setSelectedBoxType] = useState<'common' | 'rare' | 'exclusive' | null>(null);

  const handleBoxPress = (boxType: 'common' | 'rare' | 'exclusive') => {
    setSelectedBoxType(boxType);
    setShowBoxOpening(true);
  };

  return (
    <ImageBackground 
      source={require('../../assets/images/shop-bg.jpg')} 
      style={styles.container}
    >
      {/* Shop Sign */}
      <Image 
        source={require('../../assets/images/shop-sign.jpg')}
        style={styles.shopSign}
      />

      <ScrollView contentContainerStyle={styles.boxesContainer}>
        {/* Happy Meal Boxes */}
        <View style={styles.boxesContainer}>
          {/* Common Box */}
          <TouchableOpacity 
            style={styles.boxContainer}
            onPress={() => handleBoxPress('common')}
          >
            <Image 
              source={require('../../assets/images/box.png')}
              style={styles.boxImage}
            />
            <Text style={styles.boxTitle}>Common Box</Text>
            <Text style={styles.boxPrice}>100 coins</Text>
          </TouchableOpacity>

          {/* Rare Box */}
          <TouchableOpacity 
            style={styles.boxContainer}
            onPress={() => handleBoxPress('rare')}
          >
            <Image 
              source={require('../../assets/images/box.png')}
              style={styles.boxImage}
            />
            <Text style={styles.boxTitle}>Rare Box</Text>
            <Text style={styles.boxPrice}>500 coins</Text>
          </TouchableOpacity>

          {/* Exclusive Box */}
          <TouchableOpacity 
            style={styles.boxContainer}
            onPress={() => handleBoxPress('exclusive')}
          >
            <Image 
              source={require('../../assets/images/box.png')}
              style={styles.boxImage}
            />
            <Text style={styles.boxTitle}>Exclusive Box</Text>
            <Text style={styles.boxPrice}>1000 coins</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Box Opening Animation */}
      {showBoxOpening && selectedBoxType && (
        <BoxOpening 
          boxType={selectedBoxType}
          onClose={() => {
            setShowBoxOpening(false);
            setSelectedBoxType(null);
          }}
        />
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  shopSign: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20
  },
  boxesContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 40,
    paddingTop: 20
  },
  boxContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  boxImage: {
    width: 180,
    height: 180,
    resizeMode: 'contain'
  },
  boxTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FD5D51',
    marginTop: 15,
    textAlign: 'center'
  },
  boxPrice: {
    fontSize: 18,
    color: '#ADBD50',
    marginTop: 8,
    fontWeight: '600'
  }
});