import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

//Telas
import Gerenciar from './src/Gerenciar';
import Registrar from './src/Registrar';
import Relatorios from './src/Relatorios';
import Configuracoes from './src/Configs';
import HomeScreen from './src/HomeScreen'


export default function App() {

  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {

            if (route.name === 'Gerenciar'){
              return <MaterialIcons name='manage-search' size={size} color={color}/>
            }else{
              let iconName=''
              if(route.name === 'Home') iconName = 'home-outline'
              else if (route.name === 'Registrar') iconName = 'archive-outline'
              else if (route.name === 'Relatorios') iconName = 'pie-chart-outline'
              else if (route.name === 'Configuracoes') iconName = 'settings-outline'
  
              return <Ionicons name={iconName} size={size} color={color}/>
            }
          },
          headerShown:false,
        })}
          
      >
        <Tab.Screen name='Home' component={HomeScreen}/>
        <Tab.Screen name='Gerenciar' component={Gerenciar}/>
        <Tab.Screen name='Registrar' component={Registrar}/>
        <Tab.Screen name='Relatorios' component={Relatorios}/>
        <Tab.Screen name='Configuracoes' component={Configuracoes}/>
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
