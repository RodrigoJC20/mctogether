import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

interface UserSelectorProps {
  currentUserId: number;
  onSelectUser: (userId: number) => void;
}

const styles = StyleSheet.create({
  userSelectorContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 1,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  userSelectorContent: {
    paddingHorizontal: 10,
    gap: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  userButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginHorizontal: 5,
    gap: 6,
  },
  userButtonActive: {
    backgroundColor: 'skyblue',
  },
  userButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: 'bold',
  },
  userButtonTextActive: {
    color: 'white',
  },
});

export const UserSelector: React.FC<UserSelectorProps> = ({ currentUserId, onSelectUser }) => {
  return (
    <ScrollView 
      horizontal 
      style={styles.userSelectorContainer}
      contentContainerStyle={styles.userSelectorContent}
      showsHorizontalScrollIndicator={false}
    >
      {[1, 2, 3, 4, 5].map((userId) => (
        <TouchableOpacity
          key={userId}
          style={[
            styles.userButton,
            currentUserId === userId && styles.userButtonActive
          ]}
          onPress={() => onSelectUser(userId)}
        >
          <FontAwesome5 
            name="user" 
            size={16} 
            color={currentUserId === userId ? 'white' : '#666'} 
          />
          <Text style={[
            styles.userButtonText,
            currentUserId === userId && styles.userButtonTextActive
          ]}>
            User {userId}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}; 