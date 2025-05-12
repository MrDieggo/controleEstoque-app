import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PieChart  } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const chartColors = [
  '#4caf50', '#81c784', '#a5d6a7', '#c8e6c9', '#e8f5e9',
  '#66bb6a', '#388e3c', '#2e7d32', '#1b5e20', '#9ccc65',
];



export default function HomeScreen({ navigation }) {
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
      const month = date.toLocaleString('default', { month: 'short' });
      if (!monthMap[month]) {
        monthMap[month] = 0;
      }
      monthMap[month] += sale.total;
    });

    setTotal(totalValue);
    setSalesByProduct(productMap);
    setSalesByMonth(monthMap);
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.titleText}>Painel</Text>

      {/* Card com o 'Total' */}
      <View style={styles.row}>
        <View style={styles.cardMini}>
          <Text style={styles.cardTitle}>💰 Total</Text>
          <Text style={styles.total}>R$ {total.toFixed(2)}</Text>
        </View>
      </View>

      {/* Card com os 'Produtos' e 'Meses' */}
      <View style={styles.row}>
        <View style={styles.cardMini}>
          <Text style={styles.cardTitleSmall}>📦 Produtos</Text>
          {Object.entries(salesByProduct)
            .slice(0, 3)
            .map(([name, qty]) => (
              <Text key={name} style={styles.miniItem}>{name}: {qty}</Text>
            ))}
        </View>
        <View style={styles.cardMini}>
          <Text style={styles.cardTitleSmall}>📅 Receita</Text>
          {Object.entries(salesByMonth)
            .slice(0, 3)
            .map(([month, value]) => (
              <Text key={month} style={styles.miniItem}>
                {month}: R$ {value.toFixed(0)}
              </Text>
            ))}
        </View>
      </View>

      {/* Navegação */}
      <View style={styles.graphCard}>
        <Text style={styles.cardTitleSmall}>📊 Receita por Mês</Text>
        <PieChart
          data={Object.keys(salesByMonth).map((month, index) => ({
            name: month,
            population: salesByMonth[month],
            color: chartColors[index % chartColors.length],
            legendFontColor: '#333',
            legendFontSize: 12,
          }))}
          width={Dimensions.get('window').width - 40}
          height={180}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="0"
          absolute
        />
      </View>


      <View style={styles.navButtons}>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Produtos')}>
          <Ionicons style={styles.icones} name="cube-outline" size={20} />
          <Text style={styles.btnText}>Produtos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Vendas')}>
          <Ionicons style={styles.icones} name="cart-outline" size={20} />
          <Text style={styles.btnText}>Vendas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Relatorios')}>
          <Ionicons style={styles.icones} name="pie-chart-outline" size={20} />
          <Text style={styles.btnText}>Relatórios</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardMini: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  cardTitleSmall: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  miniItem: {
    fontSize: 13,
    paddingVertical: 2,
  },
  navButtons: {
    marginTop: 15,
    marginBottom: 30,
  },
  btn: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginVertical: 6,
    alignItems: 'center',
    elevation: 1,
  },
  icones: {
    marginRight: 10,
    color: '#007AFF',
  },
  btnText: {
    fontSize: 15,
    fontWeight: '500',
  },
  graphCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    alignItems: 'center',
    elevation: 2,
  },
  cardTitleSmall: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },  
});
