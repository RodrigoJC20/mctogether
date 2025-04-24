import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CryptoJS from 'crypto-js';
import { useLocalSearchParams } from 'expo-router';
import menuData from '../../assets/data/menu.json';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';

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
  const { cart: cartParam } = useLocalSearchParams<{ cart: string }>();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [savedCards, setSavedCards] = useState<string[]>([]); // Mock saved cards

  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem('cart');
        if (storedCart) {
          setCartItems(JSON.parse(storedCart));
        } else if (cartParam) {
          setCartItems(JSON.parse(cartParam));
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    };

    loadCart();
  }, [cartParam]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (parseFloat(item.price) * item.quantity);
    }, 0).toFixed(2);
  };

  const clearCart = async () => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify([]));
      setCartItems([]);
      router.setParams({ cart: JSON.stringify([]) });
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const renderCheckoutModal = () => (
    <Modal
      visible={isCheckoutModalVisible}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Checkout</Text>
          <Text style={styles.modalAmount}>Amount to Pay: ${calculateTotal()}</Text>

          <Text style={styles.modalLabel}>Select a Card:</Text>
          <ScrollView style={styles.cardList}>
            {savedCards.map((card, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.cardItem,
                  selectedCard === card && styles.selectedCard,
                ]}
                onPress={() => setSelectedCard(card)}
              >
                <Text style={styles.cardText}>{card}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.addCardButton}
              onPress={() => {
                const newCard = `Card ending in **** ${Math.floor(Math.random() * 9000) + 1000}`;
                setSavedCards([...savedCards, newCard]);
                setSelectedCard(newCard);
              }}
            >
              <Text style={styles.addCardText}>+ Add New Card</Text>
            </TouchableOpacity>
          </ScrollView>

          <TouchableOpacity
            style={styles.payButton}
            onPress={async () => {
              console.log('Pay button pressed');
              //setIsLoading(true);

              const orderId = `order-${Date.now()}${cartItems.map(item => item.id).join('')}${Math.floor(Math.random() * 1000000000)}`;
              console.log('Debug 1');
              const orderIdHash = CryptoJS.SHA256(orderId).toString(CryptoJS.enc.Hex);
              console.log('Debug 2');
              //const { user } = useAuth(); // FIXME useAuth() is hanging
              console.log('Debug 3');
              const orderResponse = await axios.post(`http://192.168.100.16:3000/payments/make-order`,
                {
                  partyId: orderId, // TODO get from the friends group
                  orderId: orderIdHash,
                  restaurantId: "restaurant-123", // TODO get from the friends group
                  members: [{
                    userEmail: "test1@example.com", //user?.email,
                    items: cartItems.map(item => ({
                      menuItemId: item.id,
                      quantity: item.quantity,
                    })),
                  }]
                }
              )

              if (orderResponse.status !== 201) {
                console.error('Order returned non success status:', orderResponse.data);
              } else if (!orderResponse.data.success) {
                console.error('Order sent non success response:', orderResponse.data.message);
              } else {
                console.log('Order successful:', orderResponse.data);
              }

              const paymentResponse = await axios.post(`http://192.168.100.16:3000/payments/pay`,
                {
                  userEmail: "test1@example.com", //user?.email,
                  partyId: "party-123", // TODO get from the friends group
                  orderId: orderIdHash,
                  paymentAmount: calculateTotal(),
                  paymentMethod: "CARD",
                  cardToken: selectedCard,
                  cardExpiry: "12/25", // FIXME
                  cardVerificationToken: "123", // FIXME
                  cardName: "McDonalds User", //user?.username,
                },
                {
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }
              );

              if (paymentResponse.status !== 201) {
                console.error('Payment returned non sucess status:', paymentResponse.data);
              } else if (!paymentResponse.data.success) {
                console.error('Payment sent non success response:', paymentResponse.data.message);
              } else {
                console.log('Payment successful:', paymentResponse.data);
                // Clear cart after successful payment
                clearCart();
                // Show success message
                alert('Payment successful! Your order has been placed.');
              }

              setIsCheckoutModalVisible(false);
            }}
          >
            <Text style={styles.payButtonText}>Pay</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.closeModalButton}
            onPress={() => setIsCheckoutModalVisible(false)}
          >
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {renderCheckoutModal()}

      {isLoading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Processing Payment...</Text>
        </View>
      )}

      <TouchableOpacity 
        style={styles.backButton}
        onPress={async () => {
          router.back();
        }}
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
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={clearCart}
          >
            <Ionicons name="trash-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.checkoutButton}
            onPress={() => {
              console.log('Checkout button pressed');
              setIsCheckoutModalVisible(true);
            }}
          >
            <Text style={styles.checkoutButtonText}>Confirm order</Text>
          </TouchableOpacity>
        </View>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  clearButton: {
    backgroundColor: '#ff0000',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalAmount: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  cardList: {
    width: '100%',
    maxHeight: 150,
    marginBottom: 20,
  },
  cardItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedCard: {
    borderColor: '#007BFF',
    backgroundColor: '#E0F0FF',
  },
  cardText: {
    fontSize: 16,
  },
  addCardButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  addCardText: {
    color: '#fff',
    fontSize: 16,
  },
  payButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeModalButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});