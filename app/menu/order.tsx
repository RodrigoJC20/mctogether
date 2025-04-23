import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import menuData from '../../assets/data/menu.json';

interface CartItem {
  id: string;
  name: string;
  price: string;
  imageName: string;
  quantity: number;
}

// Get fallback image
const FALLBACK_IMAGE = require('../../assets/images/menu/null.png');

// Function to safely get image with fallback
const getMenuImage = (imageName: string) => {
  const imageMap: { [key: string]: any } = {
    'bigmac': require('../../assets/images/menu/bigmac.png'),
    'mcfeast': require('../../assets/images/menu/mcfeast.png'),
    'mcchicken': require('../../assets/images/menu/mcchicken.png'),
    'mcfries': require('../../assets/images/menu/mcfries.png'),
  };
  return imageMap[imageName] || FALLBACK_IMAGE;
};

export default function Order() {
  const router = useRouter();
  const { cart } = useLocalSearchParams<{ cart: string }>();
  const cartItems: CartItem[] = cart ? JSON.parse(cart) : [];

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (parseFloat(item.price) * item.quantity);
    }, 0).toFixed(2);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      
      <Text style={styles.title}>Order Summary</Text>
      
      <ScrollView style={styles.orderList}>
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <Image 
                source={getMenuImage(item.imageName)} 
                style={styles.orderItemImage} 
              />
              <View style={styles.orderItemDetails}>
                <Text style={styles.orderItemName}>{item.name}</Text>
                <Text style={styles.orderItemPrice}>${item.price} x {item.quantity}</Text>
                <Text style={styles.orderItemSubtotal}>
                  Subtotal: ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Your cart is empty</Text>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: ${calculateTotal()}</Text>
        <TouchableOpacity 
          style={styles.checkoutButton}
          onPress={() => {
            // TODO Checkout functionality will be implemented later
          }}
        >
          <Text style={styles.checkoutButtonText}>Checkout</Text>
        </TouchableOpacity>
      </View>
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
  orderList: {
    flex: 1,
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666666',
    fontSize: 16,
    marginTop: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  checkoutButton: {
    backgroundColor: '#ffbc0d',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  orderItemImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginRight: 15,
  },
  orderItemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  orderItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  orderItemPrice: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  orderItemSubtotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ff0000',
  },
}); 