import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native'; // Importar o hook

export default function Relatorios() {
  const screenWidth = Dimensions.get('window').width;
  const [quantidades, setQuantidades] = useState([]);

  // Recarregar dados ao focar na tela
  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        const storedProducts = await AsyncStorage.getItem('products');
        const products = storedProducts ? JSON.parse(storedProducts) : [];
        const quantities = products.map(p => p.quantity);
        setQuantidades(quantities); // Atualizar os dados
      }
      fetchData(); // Atualiza os dados quando a tela for exibida
    }, [])
  );

  const data = {
    labels: quantidades.map((_, index) => `P${index + 1}`), // P1, P2, P3...
    datasets: [
      {
        data: quantidades,
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // Cor do gráfico
        strokeWidth: 2,
      },
    ],
    legend: ['Quantidade de Produtos'], // Legenda do gráfico
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Relatórios</Text>

      {quantidades.length > 0 ? (
        <LineChart
          data={data}
          width={screenWidth - 40}
          height={260}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      ) : (
        <Text style={styles.noData}>Nenhum produto cadastrado!</Text>
      )}
    </ScrollView>
  );
}

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#ffa726',
  },
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noData: {
    fontSize: 18,
    marginTop: 50,
  },
});
