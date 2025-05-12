import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState, useCallback } from 'react';

import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarChart } from 'react-native-chart-kit';

export default function ReportScreen() {
  const [sales, setSales] = useState([]);
  const [total, setTotal] = useState(0);
  const [salesByProduct, setSalesByProduct] = useState({});
  const [salesByMonth, setSalesByMonth] = useState({});

  useFocusEffect(
    useCallback(() => {
      loadSales();
    }, [])
  );
  

  const loadSales = async () => {
    const stored = await AsyncStorage.getItem('sales');
    const parsed = stored ? JSON.parse(stored) : [];

    setSales(parsed);
    calculateTotals(parsed);
  };

  const calculateTotals = (salesList) => {
    let totalValue = 0;
    const productMap = {};
    const monthMap = {};

    salesList.forEach((sale) => {
      totalValue += sale.total;

      if (!productMap[sale.name]) {
        productMap[sale.name] = 0;
      }
      productMap[sale.name] += sale.quantity;

      const date = new Date(sale.date);
      const month = date.toLocaleString('default', { month: 'long' });
      if (!monthMap[month]) {
        monthMap[month] = 0;
      }
      monthMap[month] += sale.total;
    });

    setTotal(totalValue);
    setSalesByProduct(productMap);
    setSalesByMonth(monthMap);
  };

  const screenWidth = Dimensions.get('window').width;

  const chartData = {
    labels: Object.keys(salesByMonth),
    datasets: [{ data: Object.values(salesByMonth) }],
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.7,
    decimalPlaces: 2,
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📊 Relatórios de Vendas</Text>

      {/* Total vendido */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>💰 Total Vendido</Text>
        <Text style={styles.total}>R$ {total.toFixed(2)}</Text>
      </View>

      {/* Gráfico de vendas por mês */}
      {Object.keys(salesByMonth).length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📆 Vendas por Mês</Text>
          <BarChart
            data={chartData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            verticalLabelRotation={30}
          />
        </View>
      )}

      {/* Produtos mais vendidos */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📦 Produtos Mais Vendidos</Text>
        {Object.entries(salesByProduct).map(([name, qty]) => (
          <Text key={name} style={styles.item}>
            {name} - {qty} und
          </Text>
        ))}
      </View>

      {/* Receita por mês */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📅 Receita por Mês</Text>
        {Object.entries(salesByMonth).map(([month, value]) => (
          <Text key={month} style={styles.item}>
            {month} - R$ {value.toFixed(2)}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{ 
    marginTop: 25, 
    backgroundColor: '#f5f5f5' 
  },
  title:{ 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20 
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle:{ 
    fontSize: 18, 
    fontWeight: '600', 
    marginBottom: 10 
  },
  total:{ 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#2e7d32' 
  },
  item: {
    fontSize: 16,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  chart: {
    borderRadius: 10,
    marginTop: 10,
  },
});
