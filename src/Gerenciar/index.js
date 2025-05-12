import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity, Modal, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Gerenciar() {
  
  const [modalVisible, setModalVisible] = useState(false);
  const [cards, setCards] = useState([]);
  const [productName, setProductName] = useState('');
  const [productTotal, setProductTotal] = useState('');
  const [editingProduct, setEditingProduct] = useState(null); // <- Novo: armazena o produto que está sendo editado
  

  // Carregar produtos ao iniciar
  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const storedProducts = await AsyncStorage.getItem('products');
    if (storedProducts) {
      setCards(JSON.parse(storedProducts));
    }
  }

  async function saveProducts(updatedCards) {
    await AsyncStorage.setItem('products', JSON.stringify(updatedCards));
    setCards(updatedCards);
  }

  async function addOrEditProduct() {
    if (editingProduct) {
      // Editando produto existente
      const updatedCards = cards.map((item) =>
        item.id === editingProduct.id
          ? { ...item, name: productName, quantity: Number(productTotal) }
          : item
      );
      await saveProducts(updatedCards);
    } else {
      // Adicionando novo produto
      const newProduct = {
        id: Date.now(), // melhor que usar `cards.length`
        name: productName,
        quantity: Number(productTotal),
      };
      const updatedCards = [...cards, newProduct];
      await saveProducts(updatedCards);
    }

    setProductName('');
    setProductTotal('');
    setEditingProduct(null);
    setModalVisible(false);
  }

  async function deleteProduct(id) {
    const updatedCards = cards.filter((item) => item.id !== id);
    await saveProducts(updatedCards);
  }

  function openEditProduct(product) {
    setEditingProduct(product);
    setProductName(product.name);
    setProductTotal(String(product.quantity));
    setModalVisible(true);
  }

  return (
    <View style={styles.container}>
      <StatusBar />

      <Modal 
          visible={modalVisible} 
          animationType='slide'
      >
          <View style={styles.container}>
            <Text>{editingProduct ? 'Editar Produto' : 'Adicionar Produto'}</Text>
            <TextInput 
                placeholder="Nome do Produto"
                value={productName}
                onChangeText={(text) => setProductName(text)}
            />
            <TextInput 
                placeholder="Quantidade" 
                keyboardType="numeric"
                value={productTotal}
                onChangeText={(text) => setProductTotal(text)}
            />

            <TouchableOpacity 
                style={[styles.btn, {backgroundColor:'#2D90CC'}]}
                onPress={addOrEditProduct}
            >
                <Text style={styles.btnText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.btn, {backgroundColor:'#000'}]} 
                onPress={() => {
                  setModalVisible(false);
                  setEditingProduct(null);
                  setProductName('');
                  setProductTotal('');
                }}
            >
                <Text style={styles.btnText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
      </Modal>

      <ScrollView style={{width:'100%'}}>
        {cards.map((card) => (
          <View key={card.id} style={styles.card}>
            <Text style={styles.cardText}>Nome: {card.name}</Text>
            <Text style={styles.cardText}>Quantidade: {card.quantity}</Text>

            <View style={{flexDirection:'row', marginTop:10}}>
              <TouchableOpacity 
                  style={[styles.btnSmall, {backgroundColor: '#2D90CC'}]}
                  onPress={() => openEditProduct(card)}
              >
                  <Text style={styles.btnText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                  style={[styles.btnSmall, {backgroundColor: '#FF0000'}]}
                  onPress={() => deleteProduct(card.id)}
              >
                  <Text style={styles.btnText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={{marginTop:10}}>
          <Button title="Adicionar Produto" onPress={() => setModalVisible(true)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title:{
    flex:1,
    padding:20
  },
  btn:{    
    flexDirection: 'row',
    width: 120,
    height: 45,
    margin: 5,
    alignItems:'center',
    justifyContent:'center',
    borderRadius: 10,
  },
  btnSmall:{
    flexDirection: 'row',
    width: 80,
    height: 40,
    margin: 5,
    alignItems:'center',
    justifyContent:'center',
    borderRadius: 8,
  },
  btnText:{
    color: '#fff',
    fontSize: 14,
    alignItems:'center',
  },
  card: {
    marginTop: 20,
    padding: 20,
    width: '90%',
    alignSelf:'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  cardText:{
    fontSize: 18,
    margin:5,
  },
  modalView:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  },
});
