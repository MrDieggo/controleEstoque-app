import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProductScreen() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [])
  );

  const loadProducts = async () => {
    const stored = await AsyncStorage.getItem('products');
    if (stored) {
      const parsed = JSON.parse(stored).map(product => ({
        ...product,
        price: typeof product.price === 'number' ? product.price : 0,
      }));
      setProducts(parsed);
    }
  };

  const saveProducts = async (newList) => {
    setProducts(newList);
    await AsyncStorage.setItem('products', JSON.stringify(newList));
  };

  const addProduct = () => {
    if (parseInt(quantity) <= 0 || parseFloat(price.replace(',', '.')) <= 0) {
      Alert.alert('Quantidade e preço devem ser maiores que zero!');
      return;
    }

    const newProduct = {
      id: Date.now().toString(),
      name,
      quantity: parseInt(quantity),
      price: parseFloat(price.replace(',', '.')),
    };

    const updatedList = [...products, newProduct];
    saveProducts(updatedList);
    setName('');
    setQuantity('');
    setPrice('');
  };

  const deleteProduct = (id) => {
    const updatedList = products.filter((p) => p.id !== id);
    saveProducts(updatedList);
  };

  const handleSaveEdit = () => {
    if (!editingProduct?.name || isNaN(editingProduct?.quantity) || isNaN(parseFloat(editingProduct?.price))) {
      Alert.alert('Preencha todos os campos com valores válidos!');
      return;
    }

    const priceToSave = parseFloat(editingProduct.price);
    if (isNaN(priceToSave)) {
      Alert.alert('O preço deve ser um número válido!');
      return;
    }

    const updatedList = products.map((p) =>
      p.id === editingProduct.id ? { ...editingProduct, price: priceToSave } : p
    );
    saveProducts(updatedList);
    setIsModalVisible(false);
    setEditingProduct(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Produto</Text>
      <TextInput placeholder="Nome" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Quantidade" value={quantity} onChangeText={setQuantity} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Preço" value={price} onChangeText={setPrice} keyboardType="numbers-and-punctuation" style={styles.input} />
      
      <TouchableOpacity style={styles.addButton} onPress={addProduct}>
        <Text style={styles.addButtonText}>+ Adicionar Produto</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Produtos Cadastrados</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSubtitle}>Qtd: {item.quantity} | R${item.price?.toFixed(2)}</Text>
            </View>
            <View style={styles.cardButtons}>
              <TouchableOpacity onPress={() => {
                setEditingProduct(item);
                setIsModalVisible(true);
              }}>
                <Text style={styles.editButton}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteProduct(item.id)}>
                <Text style={styles.deleteButton}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Editar Produto</Text>
            {editingProduct && (
              <>
                <TextInput
                  placeholder="Nome"
                  value={editingProduct.name}
                  onChangeText={(text) => setEditingProduct({ ...editingProduct, name: text })}
                  style={styles.input}
                />
                <TextInput
                  placeholder="Quantidade"
                  value={editingProduct.quantity?.toString()}
                  onChangeText={(text) => setEditingProduct({ ...editingProduct, quantity: parseInt(text) })}
                  keyboardType="numeric"
                  style={styles.input}
                />
                <TextInput
                  placeholder="Preço"
                  value={editingProduct.price?.toString().replace('.', ',')}
                  onChangeText={(text) => {
                    const formattedText = text.replace(/[^0-9,]/g, '');
                    setEditingProduct({ ...editingProduct, price: formattedText.replace(',', '.') });
                  }}
                  keyboardType="numbers-and-punctuation"
                  style={styles.input}
                />
                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit}>
                    <Text style={styles.saveButtonText}>Salvar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cancelButton} onPress={() => {
                    setIsModalVisible(false);
                    setEditingProduct(null);
                  }}>
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  title: { fontSize: 22, fontWeight: 'bold', marginVertical: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  cardButtons: {
    flexDirection: 'row',
    gap: 10,
    marginLeft: 10,
  },
  editButton: {
    fontSize: 20,
    color: '#007bff',
    marginHorizontal: 5,
  },
  deleteButton: {
    fontSize: 20,
    color: '#d9534f',
    marginHorizontal: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '85%',
  },
  modalTitle: {
    fontSize: 22,
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#aaa',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
