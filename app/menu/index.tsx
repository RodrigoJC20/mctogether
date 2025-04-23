import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import menuData from '../../assets/data/menu.json';
import { useState } from 'react';

interface MenuItem {
  id: string;
  name: string;
  price: string;
  imageName: string;
}

// Get fallback image
const FALLBACK_IMAGE = require('../../assets/images/menu/null.png');

// Function to safely get image with fallback
const getMenuImage = (imageName: string) => {
  const imageMap: { [key: string]: any } = {
    'bigmac': require('../../assets/images/menu/bigmac.png'),
    //'mcfeast': require('../../assets/images/menu/bigmac.png'),
    'mcchicken': require('../../assets/images/menu/mcchicken.png'),
    'mcfries': require('../../assets/images/menu/mcfries.png'),
  };
  return imageMap[imageName] || FALLBACK_IMAGE;
  //return FALLBACK_IMAGE;
};

export default function Menu() {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState('1');
  
  const handleQuantityChange = (value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    const newQuantity = parseInt(quantity) + 1;
    setQuantity(newQuantity.toString());
  };

  const decrementQuantity = () => {
    const newQuantity = parseInt(quantity) - 1;
    if (newQuantity > 0) {
      setQuantity(newQuantity.toString());
    }
  };

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
          <TouchableOpacity 
            key={item.id} 
            style={styles.menuItem}
            onPress={() => setSelectedItem(item)}
          >
            <View style={styles.imageContainer}>
              <Image source={getMenuImage(item.imageName)} style={styles.itemImage} />
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.priceText}>${item.price}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        visible={!!selectedItem}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedItem(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                <Image 
                  source={getMenuImage(selectedItem.imageName)} 
                  style={styles.modalImage} 
                />
                <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                <Text style={styles.modalPrice}>${selectedItem.price}</Text>
                
                <View style={styles.quantityContainer}>
                  <Text style={styles.quantityLabel}>Quantity:</Text>
                  <View style={styles.quantityControls}>
                    <TouchableOpacity 
                      style={styles.quantityButton}
                      onPress={decrementQuantity}
                    >
                      <Ionicons name="remove" size={20} color="#000000" />
                    </TouchableOpacity>
                    <TextInput
                      style={styles.quantityInput}
                      value={quantity}
                      onChangeText={handleQuantityChange}
                      keyboardType="numeric"
                    />
                    <TouchableOpacity 
                      style={styles.quantityButton}
                      onPress={incrementQuantity}
                    >
                      <Ionicons name="add" size={20} color="#000000" />
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={() => {
                    // Add to cart functionality will be implemented later
                    setSelectedItem(null);
                  }}
                >
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setSelectedItem(null)}
                >
                  <Ionicons name="close" size={24} color="#000000" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalPrice: {
    fontSize: 20,
    color: '#FF0000',
    marginBottom: 20,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    padding: 8,
    backgroundColor: '#ffbc0d',
  },
  quantityInput: {
    width: 40,
    padding: 8,
    textAlign: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#000000',
  },
  addButton: {
    backgroundColor: '#ffbc0d',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 10,
  },
  addButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
}); 