import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState, useCallback } from 'react';

import { View, Text, FlatList, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function SaleScreen() {

  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [quantitySold, setQuantitySold] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [])
  );
  

  const loadProducts = async () => {
    const stored = await AsyncStorage.getItem('products');
    if (stored) setProducts(JSON.parse(stored));
  };

  const saveProducts = async (updatedList) => {
    setProducts(updatedList);
    await AsyncStorage.setItem('products', JSON.stringify(updatedList));
  };

  const saveSale = async (sale) => {
    const stored = await AsyncStorage.getItem('sales');
    const sales = stored ? JSON.parse(stored) : [];
    sales.push(sale);
    await AsyncStorage.setItem('sales', JSON.stringify(sales));
  };

  const registerSale = () => {
    if (!selectedId || !quantitySold) {
      Alert.alert('Selecione o produto e informe a quantidade!');
      Alert.alert('Venda registrada com sucesso!', '', [
        { text: 'OK', onPress: () => navigation.navigate('Home') }
      ]);
      
      return;
    }

    const index = products.findIndex(p => p.id === selectedId);
    if (index === -1) return;

    const product = products[index];
    const qtd = parseInt(quantitySold);

    if (qtd > product.quantity) {
      Alert.alert('Estoque insuficiente!');
      return;
    }

    const updatedProduct = { ...product, quantity: product.quantity - qtd };
    const updatedList = [...products];
    updatedList[index] = updatedProduct;

    const sale = {
      id: Date.now().toString(),
      productId: product.id,
      name: product.name,
      quantity: qtd,
      total: qtd * product.price,
      date: new Date().toISOString(),
    };

    saveProducts(updatedList);
    saveSale(sale);
    setQuantitySold('');
    setSelectedId(null);
    Alert.alert('Venda registrada com sucesso!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Venda</Text>

      <Text style={styles.subtitle}>Selecione um Produto:</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text
            style={[
              styles.item,
              selectedId === item.id && styles.selected,
            ]}
            onPress={() => setSelectedId(item.id)}
          >
            {item.name} - {item.quantity} und - R${item.price.toFixed(2)}
          </Text>
        )}
      />

      <TextInput
        placeholder="Quantidade Vendida"
        value={quantitySold}
        onChangeText={setQuantitySold}
        keyboardType="numeric"
        style={styles.input}
      />

      <Button title="Confirmar Venda" onPress={registerSale} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ 
    marginTop: 30, 
    marginBottom: 30 
  },
  title:{ 
    fontSize: 22, 
    marginBottom: 10 
  },
  subtitle:{ 
    fontSize: 16, 
    marginVertical: 10 
  },
  input:{ 
    borderWidth: 1, 
    padding: 8, 
    marginVertical: 10 
  },
  item:{ 
    padding: 10, 
    borderBottomWidth: 1 
  },
  selected:{ 
    backgroundColor: '#d0f0c0' 
  },
});
