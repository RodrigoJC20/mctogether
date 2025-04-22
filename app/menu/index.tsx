import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import menuData from '../../assets/data/menu.json';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  imageName: string;
}

// Get fallback image
const FALLBACK_IMAGE = require('../../assets/images/menu/null.png');

// Function to safely get image with fallback
const getMenuImage = (imageName: string) => {
  return FALLBACK_IMAGE;
};

export default function Menu() {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      
      <Text style={styles.title}>Menu</Text>
      
      <ScrollView contentContainerStyle={styles.menuGrid}>
        {menuData.menuItems.map((item: MenuItem) => (
          <View key={item.id} style={styles.menuItem}>
            <View style={styles.imageContainer}>
              <Image source={getMenuImage(item.imageName)} style={styles.itemImage} />
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.priceText}>${item.price.toFixed(2)}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 60,
  },
  title: {
    color: '#000000',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#000000',
    borderRadius: 20,
    padding: 10,
    zIndex: 10
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
  },
  menuItem: {
    width: '45%',
    margin: 10,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#FFD700', // Yellow background
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#ffffff',
  },
  itemName: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  priceText: {
    color: '#FF0000',
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 