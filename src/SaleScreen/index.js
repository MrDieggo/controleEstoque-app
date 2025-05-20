import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      Alert.alert('Erro', 'Selecione o produto e informe a quantidade!');
      return;
    }

    const index = products.findIndex((p) => p.id === selectedId);
    if (index === -1) return;

    const product = products[index];
    const qtd = parseInt(quantitySold);

    if (qtd > product.quantity) {
      Alert.alert('Erro', 'Estoque insuficiente!');
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
    Alert.alert('Sucesso', 'Venda registrada com sucesso!', [
      { text: 'OK', onPress: () => navigation.navigate('Home') },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📦 Registrar Venda</Text>
      <Text style={styles.subtitle}>Selecione um Produto:</Text>

      {products.map((item) => (
        <Pressable key={item.id} onPress={() => setSelectedId(item.id)}>
          <View
            style={[
              styles.item,
              selectedId === item.id && styles.selected,
            ]}
          >
            <Text style={styles.itemText}>
              {item.name} - {item.quantity} und - R${item.price.toFixed(2)}
            </Text>
          </View>
        </Pressable>
      ))}

      <Text style={styles.subtitle}>Quantidade Vendida:</Text>
      <TextInput
        placeholder="Digite a quantidade"
        value={quantitySold}
        onChangeText={setQuantitySold}
        keyboardType="numeric"
        style={styles.input}
      />

      <Pressable style={styles.button} onPress={registerSale}>
        <Text style={styles.buttonText}>Confirmar Venda</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  item: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  selected: {
    backgroundColor: '#d0f0c0',
    borderColor: '#4CAF50',
  },
  itemText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
