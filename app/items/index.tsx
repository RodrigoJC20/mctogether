import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

const AVATARS = [
  { id: 1, source: require('../../assets/images/items/demo.png') },
  { id: 2, source: require('../../assets/images/items/Demo2.png') },
  { id: 3, source: require('../../assets/images/items/demo3.png') },
];

export default function Items() {
  const router = useRouter();
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);

  return (
    <View style={styles.container}>
      {/* Top section - Focused image */}
      <View style={styles.topSection}>
        <Image 
          source={selectedAvatar.source} 
          style={styles.focusedImage}
          resizeMode="contain"
        />
      </View>

      {/* Bottom section - Image grid */}
      <View style={styles.bottomSection}>
        <ScrollView 
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
        >
          {AVATARS.map((avatar) => (
            <TouchableOpacity
              key={avatar.id}
              style={[
                styles.avatarItem,
                selectedAvatar.id === avatar.id && styles.selectedAvatar
              ]}
              onPress={() => setSelectedAvatar(avatar)}
            >
              <Image 
                source={avatar.source} 
                style={styles.avatarImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f7f7f7' 
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
  topSection: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f7f7f7'
  },
  bottomSection: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.9,
    shadowRadius: 3,
  },
  focusedImage: {
    width: '100%',
    height: '100%',
  },
  logoText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  logoTextMc: {
    color: '#FFBC0D', // McDonald's yellow
  },
  logoTextTogether: {
    color: 'black',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    padding: 10,
  },
  avatarItem: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedAvatar: {
    borderColor: '#007AFF',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  }
});