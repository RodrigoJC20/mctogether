import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import medalsData from '../../assets/data/medals.json';

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
  
  const renderMedal = (medal: Medal) => (
    <View key={medal.id} style={styles.medalContainer}>
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
    </View>
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
  }
});