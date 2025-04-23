import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Order() {
  const router = useRouter();

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
        {/* Order items will be displayed here */}
        <Text style={styles.emptyText}>Your cart is empty</Text>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: $0.00</Text>
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
}); 