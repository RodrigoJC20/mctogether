import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useState } from 'react';
import { BoxOpening } from '../../components/BoxOpening';

// Temporary items for testing
const ITEMS = {
  classic: ['Toy Car', 'Action Figure', 'Stuffed Animal'],
  epic: ['Special Edition Toy', 'Collector Item', 'Limited Edition'],
  exotic: ['Rare Collectible', 'Exclusive Item', 'Legendary Toy']
};

export default function Shop() {
  const router = useRouter();
  const [currency] = useState(1234); // This will be connected to your state management later
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
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      {/* Currency Display */}
      <View style={styles.currencyContainer}>
        <Image 
          source={require('../../assets/images/coin.png')} 
          style={styles.coinIcon}
        />
        <Text style={styles.currencyText}>{currency}</Text>
      </View>

      {/* Shop Sign */}
      <Image 
        source={require('../../assets/images/shop-sign.jpg')}
        style={styles.shopSign}
      />

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
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#00000088',
    borderRadius: 20,
    padding: 10,
    zIndex: 10
  },
  currencyContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00000088',
    borderRadius: 20,
    padding: 10,
    zIndex: 10
  },
  coinIcon: {
    width: 24,
    height: 24,
    marginRight: 5
  },
  currencyText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  shopSign: {
    width: '80%',
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 100
  },
  boxesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 20
  },
  boxContainer: {
    alignItems: 'center',
    backgroundColor: '#FEF8EB',
    borderRadius: 15,
    padding: 15,
    width: '100%',
    maxWidth: 300
  },
  boxImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain'
  },
  boxTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FD5D51',
    marginTop: 10
  },
  boxPrice: {
    fontSize: 16,
    color: '#ADBD50',
    marginTop: 5
  }
});