import { View, ImageBackground, StyleSheet, Image, TouchableOpacity, Text, Modal } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';

export default function Home() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <ImageBackground source={require('../assets/images/bg.jpeg')} style={styles.background}>
      {/* Currency */}
      <View style={styles.topRight}>
        <FontAwesome5 name="coins" size={20} color="white" />
        <Text style={styles.currencyText}>1234</Text>
      </View>

      {/* Shop Button */}
      <TouchableOpacity style={styles.topLeftButton} onPress={() => router.push('/shop')}>
        <FontAwesome5 name="shopping-bag" size={24} color="white" />
      </TouchableOpacity>

      {/* Pet Image */}
      <View style={styles.petContainer}>
        <Image source={require('../assets/images/pet.png')} style={styles.petImage} />
      </View>

      {/* Medals Button */}
      <TouchableOpacity style={styles.bottomLeftButton} onPress={() => router.push('/medals')}>
        <FontAwesome5 name="trophy" size={24} color="white" />
      </TouchableOpacity>

      {/* Items Button */}
      <TouchableOpacity style={styles.bottomRightButton} onPress={() => router.push('/items')}>
        <MaterialIcons name="pets" size={28} color="white" />
      </TouchableOpacity>

      {/* Party Button */}
      <TouchableOpacity style={styles.partyButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.partyText}>Party</Text>
      </TouchableOpacity>

      {/* Party Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>🎉 Party Time! 🎉</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  topLeftButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#00000088',
    borderRadius: 20,
    padding: 10,
  },
  topRight: {
    position: 'absolute',
    top: 40,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00000088',
    borderRadius: 20,
    padding: 10,
  },
  currencyText: {
    color: 'white',
    marginLeft: 5,
  },
  bottomLeftButton: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    backgroundColor: '#00000088',
    borderRadius: 20,
    padding: 10,
  },
  bottomRightButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: '#00000088',
    borderRadius: 20,
    padding: 10,
  },
  partyButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: 'skyblue',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  partyText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  petContainer: {
    alignItems: 'center',
  },
  petImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#222',
    padding: 30,
    borderRadius: 25,
    alignItems: 'center',
  },
  modalText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#444',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  closeText: {
    color: 'skyblue',
    fontWeight: 'bold',
  },
});