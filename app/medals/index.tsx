import { View, Text, StyleSheet } from 'react-native';
export default function Medals() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Medals Screen Placeholder</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111' },
  text: { color: 'white', fontSize: 18 },
});