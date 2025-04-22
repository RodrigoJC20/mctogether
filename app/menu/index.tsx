import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: any;
}

// Get fallback image
const FALLBACK_IMAGE = require('../../assets/images/menu/null.png');

// Function to safely get image with fallback
const getMenuImage = (imageName: string) => {
  return FALLBACK_IMAGE;
};

const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'BigMac',
    price: 31.00,
    image: getMenuImage('bigmac')
  },
  {
    id: '2',
    name: 'McFeast',
    price: 35.00,
    image: getMenuImage('mcfeast')
  },
];

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
        {menuItems.map((item) => (
          <View key={item.id} style={styles.menuItem}>
            <View style={styles.imageContainer}>
              <Image source={item.image} style={styles.itemImage} />
            </View>
            <Text style={styles.itemName}>{item.name}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.priceText}>From R{item.price.toFixed(2)}</Text>
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>ADD</Text>
              </TouchableOpacity>
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
    backgroundColor: '#1a1a1a',
    paddingTop: 60,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
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
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
  },
  menuItem: {
    width: '45%',
    margin: 10,
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
  },
  imageContainer: {
    width: 120,
    height: 120,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  itemName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  priceContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  priceText: {
    color: '#4CAF50',
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#E23744',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
}); 