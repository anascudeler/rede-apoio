import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>SafeKey</Text>

      <Text style={styles.subtitulo}>
        O que você deseja fazer?
      </Text>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate('Apoiando')}
      >
        <Text style={styles.textoBotao}>Apoiando</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate('Apoiado')}
      >
        <Text style={styles.textoBotao}>Apoiado</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
  },

  titulo: {
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },

  subtitulo: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 30,
  },

  botao: {
    backgroundColor: '#E91E63',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },

  textoBotao: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});