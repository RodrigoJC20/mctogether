export interface Medal {
  id: string;
  name: string;
  image: string;
  description: string;
  earned: boolean;
}

/*
export const sampleMedals: Medal[] = [
  {
    id: '1',
    name: 'First Steps',
    image: require('../../assets/images/medals/first-steps.png'),
    description: 'Complete your first task',
    earned: true
  },
  {
    id: '2',
    name: 'Social Butterfly',
    image: require('../../assets/images/medals/social-butterfly.png'),
    description: 'Join your first group',
    earned: true
  },
  {
    id: '3',
    name: 'Task Master',
    image: require('../../assets/images/medals/task-master.png'),
    description: 'Complete 10 tasks',
    earned: false
  },
  {
    id: '4',
    name: 'Group Leader',
    image: require('../../assets/images/medals/group-leader.png'),
    description: 'Create your first group',
    earned: false
  }
]; 
*/