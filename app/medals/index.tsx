import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import medalsData from '../../assets/data/medals.json';
import { useState } from 'react';
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';

interface MedalRequirement {
  type: string;
  count?: number;
  time?: string;
}

interface Medal {
  id: string;
  name: string;
  image: string;
  description: string;
  earned: boolean;
  requirements: MedalRequirement;
}

const MedalIcon = ({ size, earned = true }: { size: number; earned?: boolean }) => {
  const gradientId = `goldGradient-${earned ? 'earned' : 'locked'}`;
  const ribbonColor = earned ? "#d32f2f" : "#888";

  return (
    <Svg width={size} height={size} viewBox="0 0 100 130">
      <Defs>
        <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          {earned ? (
            [
              <Stop key="0" offset="0%" stopColor="#FFD700" />,
              <Stop key="1" offset="50%" stopColor="#FFCC33" />,
              <Stop key="2" offset="100%" stopColor="#F1C232" />
            ]
          ) : (
            [
              <Stop key="0" offset="0%" stopColor="#aaa" />,
              <Stop key="1" offset="100%" stopColor="#bbb" />
            ]
          )}
        </LinearGradient>
      </Defs>

      {/* Ribbon */}
      <Path
        d="M40 0 L50 30 L60 0 Z"
        fill={ribbonColor}
      />
      <Path
        d="M50 30 L40 60 L60 60 Z"
        fill={ribbonColor}
      />

      {/* Medal body */}
      <Circle
        cx="50"
        cy="90"
        r="30"
        fill={`url(#${gradientId})`}
        stroke={earned ? '#8B4513' : '#666'}
        strokeWidth="4"
      />

      {/* Inner star or detail */}
      {earned && (
        <Path
          d="M50 68 L54 82 L68 82 L56 90 L60 104 L50 96 L40 104 L44 90 L32 82 L46 82 Z"
          fill="#8B4513"
        />
      )}
    </Svg>
  );
};


export default function Medals() {
  const router = useRouter();
  const medals: Medal[] = medalsData.medals;
  const [selectedMedal, setSelectedMedal] = useState<Medal | null>(null);
  
  const renderMedal = (medal: Medal) => (
    <TouchableOpacity 
      key={medal.id} 
      style={styles.medalContainer}
      onPress={() => setSelectedMedal(medal)}
    >
      <View style={[styles.medalImageContainer, !medal.earned && styles.lockedMedal]}>
      <MedalIcon size={80} earned={medal.earned} />
        {!medal.earned && (
          <View style={styles.lockOverlay}>
            <Ionicons name="lock-closed" size={24} color="white" />
          </View>
        )}
      </View>
      <Text style={styles.requirementText}>
        {formatRequirement(medal.requirements)}
      </Text>
    </TouchableOpacity>
  );

  const formatRequirement = (requirement: MedalRequirement): string => {
    switch (requirement.type) {
      case 'task_completion':
        return `Complete ${requirement.count} task${requirement.count === 1 ? '' : 's'}`;
      case 'group_join':
        return 'Join a group';
      case 'group_creation':
        return 'Create a group';
      case 'group_task_completion':
        return `Complete ${requirement.count} group task${requirement.count === 1 ? '' : 's'}`;
      case 'time_based':
        return `Complete task before ${requirement.time}`;
      default:
        return '';
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>
        <Text style={styles.logoTextMc}>Mc</Text>
        <Text style={styles.logoTextTogether}>Medals</Text>
      </Text>
      
      <ScrollView contentContainerStyle={styles.medalsGrid}>
        {medals.map(renderMedal)}
      </ScrollView>

      <Modal
        visible={!!selectedMedal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedMedal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedMedal && (
              <>
                <View style={styles.modalMedalImageContainer}>
                <MedalIcon size={150} earned={selectedMedal.earned} />
                  {!selectedMedal.earned && (
                    <View style={styles.modalLockOverlay}>
                      <Ionicons name="lock-closed" size={32} color="white" />
                    </View>
                  )}
                </View>
                <Text style={styles.modalMedalName}>{selectedMedal.name}</Text>
                <Text style={styles.modalMedalDescription}>{selectedMedal.description}</Text>
                <Text style={styles.modalRequirementText}>
                  {formatRequirement(selectedMedal.requirements)}
                </Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setSelectedMedal(null)}
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
  medalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
  },
  medalContainer: {
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
  medalImageContainer: {
    width: 80,
    height: 80,
    marginBottom: 5,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
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
  lockedMedal: {
    opacity: 0.8,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  requirementText: {
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
  modalMedalImageContainer: {
    width: 150,
    height: 150,
    marginBottom: 15,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalLockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalMedalName: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalMedalDescription: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  modalRequirementText: {
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