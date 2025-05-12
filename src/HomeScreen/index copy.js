import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState, useCallback } from 'react';

import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({navigation}) {

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
  }

  return (
    <View style={styles.container}>
        <StatusBar/>
        <Text style={styles.titleText}>Home</Text>
        
        <View style={styles.card}>
            <Text style={styles.cardTitle}>💰 Total Vendido</Text>
            <Text style={styles.total}>R$ {total.toFixed(2)}</Text>
        </View>

        <TouchableOpacity style={styles.btn} onPress={()=> navigation.navigate('Produtos')}> 
            <Ionicons style={styles.icones} name="home-outline" size={20}></Ionicons>
            <Text style={styles.btnText}>Gerenciar Produtos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={()=> navigation.navigate('Vendas')}>
            <Ionicons style={styles.icones} name="archive-outline" size={20}></Ionicons>
            <Text style={styles.btnText}>Registrar Venda</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={()=> navigation.navigate('Relatorios')}>
            <Ionicons style={styles.icones} name="pie-chart-outline" size={20}></Ionicons>
            <Text style={styles.btnText}>Relatórios</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={()=> navigation.navigate('Configuracoes')}>
            <Ionicons style={styles.icones} name="settings-outline" size={20}></Ionicons>
            <Text style={styles.btnText}>Configurações</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  titleText:{
    fontSize: 30,
    fontWeight:'bold',
    textAlign:'center',
    padding:30,
  },
  btn:{
    flexDirection: 'row',
    borderWidth: 1,
    padding: 20,
    margin: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset:{
        width:0,
        height: 1
    },
    alignItems:'center',
    justifyContent: 'center',
    alignContent: 'flex-start',
  },
  icones:{
    marginRight: 10,
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
});
