import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
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
    <View style={styles.container}>
      {/* Shop Sign */}
      <Text style={styles.logoText}>
        <Text style={styles.logoTextMc}>Mc</Text>
        <Text style={styles.logoTextTogether}>Shop</Text>
      </Text>
      {/* <Image 
        source={require('../../assets/images/shop-sign.jpg')}
        style={styles.shopSign}
      /> */}

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.boxesContainer}
      >
        {/* Happy Meal Boxes */}
        <View style={styles.boxesRow}>
          {/* Common Box */}
          <TouchableOpacity 
            style={styles.boxContainer}
            onPress={() => handleBoxPress('common')}
          >
            <Image 
              source={require('../../assets/images/box.png')}
              style={styles.boxImage}
            />
            <Text style={[styles.boxTitle, styles.commonBoxTitle]}>Common Box</Text>
            <View style={styles.currencyContainer}>
              <Image 
                source={require('@/assets/images/coin.png')} 
                style={styles.coinImage}
              />
              <Text style={styles.boxPrice}>100</Text>
            </View>
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
            <Text style={[styles.boxTitle, styles.rareBoxTitle]}>Rare Box</Text>
            <View style={styles.currencyContainer}>
              <Image 
                source={require('@/assets/images/coin.png')} 
                style={styles.coinImage}
              />
              <Text style={styles.boxPrice}>500</Text>
            </View>
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
            <Text style={[styles.boxTitle, styles.exclusiveBoxTitle]}>Exclusive Box</Text>
            <View style={styles.currencyContainer}>
              <Image 
                source={require('@/assets/images/coin.png')} 
                style={styles.coinImage}
              />
              <Text style={styles.boxPrice}>1000</Text>
            </View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 60,
  },
  shopSign: {
    width: '100%',
    //height: 120,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20
  },
  logoText: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 60
  },
  logoTextMc: {
    color: '#FFBC0D', // McDonald's yellow
  },
  logoTextTogether: {
    color: 'black',
  },
  boxesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20
  },
  boxesRow: {
    flexDirection: 'row',
    gap: 20
  },
  boxContainer: {
    alignItems: 'center',
    //backgroundColor: 'white',
    //borderRadius: 20,
    //padding: 20,
    //width: 280,
    //shadowColor: '#000',
    //shadowOffset: {
    //  width: 0,
    //  height: 2,
    //},
    //shadowOpacity: 0.25,
    //shadowRadius: 3.84,
    //elevation: 5
  },
  boxImage: {
    width: 180,
    height: 180,
    resizeMode: 'contain'
  },
  boxTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 15,
    textAlign: 'center'
  },
  commonBoxTitle: {
    color: '#264F36'
  },
  rareBoxTitle: {
    color: '#DB0007'
  },
  exclusiveBoxTitle: {
    color: '#FFBC0D'
  },
  currencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10
  },
  coinImage: {
    width: 24,
    height: 24,
  },
  currencyText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  boxPrice: {
    fontSize: 18,
    color: 'black',
    //marginTop: 8,
    fontWeight: '600'
  }
});