import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Coupon {
  id: string;
  name: string;
  description: string;
  validUntil: string;
  code: string;
}

// Mock data - replace with actual data from your backend
const mockCoupons: Coupon[] = [
  {
    id: '1',
    name: '5% Off',
    description: 'Get 5% off on any purchase at McDonalds',
    validUntil: '2024-12-31',
    code: 'MC005'
  },
  {
    id: '2',
    name: 'Get a Free McFlurry',
    description: 'Get a free McFlurry with any purchase',
    validUntil: '2024-10-31',
    code: 'MCFRY001'
  }
];

export default function Coupons() {
  const router = useRouter();
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  
  const renderCoupon = (coupon: Coupon) => (
    <TouchableOpacity 
      key={coupon.id} 
      style={styles.couponContainer}
      onPress={() => setSelectedCoupon(coupon)}
    >
      <View style={styles.couponImageContainer}>
        <Image 
          source={require('../../assets/images/medals/null.png')}
          style={styles.couponImage} 
        />
      </View>
      <Text style={styles.couponName}>{coupon.name}</Text>
      <Text style={styles.validUntilText}>
        Valid until: {new Date(coupon.validUntil).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>
        <Text style={styles.logoTextMc}>Mc</Text>
        <Text style={styles.logoTextTogether}>Coupons</Text>
      </Text>
      
      <ScrollView contentContainerStyle={styles.couponsGrid}>
        {mockCoupons.map(renderCoupon)}
      </ScrollView>

      <Modal
        visible={!!selectedCoupon}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedCoupon(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedCoupon && (
              <>
                <View style={styles.modalCouponImageContainer}>
                  <Image 
                    source={require('../../assets/images/medals/null.png')}
                    style={styles.modalCouponImage} 
                  />
                </View>
                <Text style={styles.modalCouponName}>{selectedCoupon.name}</Text>
                <Text style={styles.modalCouponDescription}>{selectedCoupon.description}</Text>
                <Text style={styles.modalCodeText}>Code: {selectedCoupon.code}</Text>
                <Text style={styles.modalValidUntilText}>
                  Valid until: {new Date(selectedCoupon.validUntil).toLocaleDateString()}
                </Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setSelectedCoupon(null)}
                >
                  <Ionicons name="close" size={24} color="white" />
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
    backgroundColor: '#f7f7f7',
    paddingTop: 60,
  },
  title: {
    color: 'black',
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
  couponsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
  },
  couponContainer: {
    width: '45%',
    margin: 10,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  couponImageContainer: {
    width: 80,
    height: 80,
    marginBottom: 5,
    position: 'relative',
  },
  couponImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  couponName: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  logoText: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  logoTextMc: {
    color: '#FFBC0D', // McDonald's yellow
  },
  logoTextTogether: {
    color: 'black',
  },
  validUntilText: {
    color: '#666',
    fontSize: 10,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalCouponImageContainer: {
    width: 150,
    height: 150,
    marginBottom: 15,
    position: 'relative',
  },
  modalCouponImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  modalCouponName: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalCouponDescription: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  modalCodeText: {
    color: '#FFBC0D',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalValidUntilText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#00000088',
    borderRadius: 20,
    padding: 8,
  },
}); 