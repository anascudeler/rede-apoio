import { View, Text, StyleSheet } from 'react-native';

export default function Apoiado() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Apoiado</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
  },
});