import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import medalsData from '../../assets/data/medals.json';
import { useState } from 'react';

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
        <Image 
          //source={getMedalImage(medal.image)} 
          source={require('../../assets/images/medals/null.png')}
          style={styles.medalImage} 
        />
        {!medal.earned && (
          <View style={styles.lockOverlay}>
            <Ionicons name="lock-closed" size={24} color="white" />
          </View>
        )}
      </View>
      <Text style={styles.medalName}>{medal.name}</Text>
      <Text style={styles.medalDescription}>{medal.description}</Text>
      <Text style={styles.requirementText}>
        {formatRequirement(medal.requirements)}
      </Text>
    </TouchableOpacity>
  );

  const getMedalImage = (imageName: string) => {
    /*
    try {
      // Map image names to actual image assets
      const imageMap: { [key: string]: any } = {
        'first-steps.png': require('../../assets/images/medals/first-steps.png'),
        'social-butterfly.png': require('../../assets/images/medals/social-butterfly.png'),
        'task-master.png': require('../../assets/images/medals/task-master.png'),
        'group-leader.png': require('../../assets/images/medals/group-leader.png'),
        'team-player.png': require('../../assets/images/medals/team-player.png'),
        'early-bird.png': require('../../assets/images/medals/early-bird.png'),
      };
      return imageMap[imageName] || require('../../assets/images/medals/null.png');
      */
    //} catch (error) {
      // If there's any error loading the image, return the placeholder
      return require('../../assets/images/medals/null.png');
    //}
  };

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
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      
      <Text style={styles.title}>Your Medals</Text>
      
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
                  <Image 
                    source={require('../../assets/images/medals/null.png')}
                    style={styles.modalMedalImage} 
                  />
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
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    padding: 15,
  },
  medalImageContainer: {
    width: 80,
    height: 80,
    marginBottom: 10,
    position: 'relative',
  },
  medalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  lockedMedal: {
    opacity: 0.5,
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
  medalName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  medalDescription: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 5,
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
  },
  modalMedalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
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