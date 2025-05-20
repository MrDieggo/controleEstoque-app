import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

//Telas
import ProductScreen from './src/ProductScreen';
import SaleScreen from './src/SaleScreen';
import ReportScreen from './src/ReportScreen';
import HomeScreen from './src/HomeScreen'


export default function App() {

  const Tab = createBottomTabNavigator();

  const icons ={
    Home: {lib: Ionicons, name:'home-outline'},
    Produtos: {lib: MaterialIcons, name:'manage-search'},
    Vendas: {lib: Ionicons, name:'archive-outline'},
    Relatorios: {lib: Ionicons, name:'pie-chart-outline'},
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            const {lib: IconLib, name} = icons[route.name]
            return <IconLib name={name} size={size} color={color}/>
            },
          headerShown:false,
        })}
          
      >
        <Tab.Screen name='Home' component={HomeScreen}/>
        <Tab.Screen name='Produtos' component={ProductScreen}/>
        <Tab.Screen name='Vendas' component={SaleScreen}/>
        <Tab.Screen name='Relatorios' component={ReportScreen}/>
      </Tab.Navigator>

    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
