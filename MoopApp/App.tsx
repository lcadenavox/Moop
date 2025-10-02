import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { StatusBar } from 'expo-status-bar';

import { ThemeProvider, useTheme } from "./src/contexts/ThemeContext";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";

// Existing screens
import BikeListScreen from "./src/screens/BikeListScreen";
import HomeScreen from "./src/screens/HomeScreen";
import MapScreen from "./src/screens/MapScreen";
import RegisterSlotScreen from "./src/screens/RegisterSlotScreen";
import StatisticsScreen from "./src/screens/StatisticsScreen";

// New screens
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import MecanicoListScreen from "./src/screens/MecanicoListScreen";
import MecanicoFormScreen from "./src/screens/MecanicoFormScreen";
import MecanicoDetailScreen from "./src/screens/MecanicoDetailScreen";
import OficinaListScreen from "./src/screens/OficinaListScreen";
import OficinaFormScreen from "./src/screens/OficinaFormScreen";
import OficinaDetailScreen from "./src/screens/OficinaDetailScreen";
import DepositoListScreen from "./src/screens/DepositoListScreen";
import DepositoFormScreen from "./src/screens/DepositoFormScreen";
import DepositoDetailScreen from "./src/screens/DepositoDetailScreen";
import MotoListScreen from "./src/screens/MotoListScreen";
import MotoFormScreen from "./src/screens/MotoFormScreen";
import MotoDetailScreen from "./src/screens/MotoDetailScreen";

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { theme, isDark } = useTheme();
  const { isAuthenticated, isLoading } = useAuth();

  const screenOptions = {
    headerStyle: {
      backgroundColor: theme.colors.surface,
    },
    headerTintColor: theme.colors.text,
    headerTitleStyle: {
      fontWeight: 'bold' as const,
    },
    contentStyle: {
      backgroundColor: theme.colors.background,
    },
  };

  if (isLoading) {
    return null; // Could show a loading screen here
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={isAuthenticated ? "Home" : "Login"}
          screenOptions={screenOptions}
        >
          {isAuthenticated ? (
            // Authenticated screens
            <>
              <Stack.Screen 
                name="Home" 
                component={HomeScreen} 
                options={{ title: 'Moop App' }}
              />
              <Stack.Screen 
                name="Mapa do Pátio" 
                component={MapScreen} 
              />
              <Stack.Screen 
                name="Lista de Motos" 
                component={BikeListScreen} 
              />
              <Stack.Screen 
                name="Cadastro de Vaga" 
                component={RegisterSlotScreen} 
              />
              <Stack.Screen 
                name="Estatísticas" 
                component={StatisticsScreen} 
              />
              
              {/* New Mecanico CRUD screens */}
              <Stack.Screen 
                name="MecanicoList" 
                component={MecanicoListScreen}
                options={{ title: 'Mecânicos' }}
              />
              <Stack.Screen 
                name="MecanicoForm" 
                component={MecanicoFormScreen}
                options={{ title: 'Novo Mecânico' }}
              />
              <Stack.Screen 
                name="MecanicoDetail" 
                component={MecanicoDetailScreen}
                options={{ title: 'Detalhes do Mecânico' }}
              />
              
              {/* New Oficina CRUD screens */}
              <Stack.Screen 
                name="OficinaList" 
                component={OficinaListScreen}
                options={{ title: 'Oficinas' }}
              />
              <Stack.Screen 
                name="OficinaForm" 
                component={OficinaFormScreen}
                options={{ title: 'Nova Oficina' }}
              />
              <Stack.Screen 
                name="OficinaDetail" 
                component={OficinaDetailScreen}
                options={{ title: 'Detalhes da Oficina' }}
              />

              {/* New Deposito CRUD screens */}
              <Stack.Screen 
                name="DepositoList" 
                component={DepositoListScreen}
                options={{ title: 'Depósitos' }}
              />
              <Stack.Screen 
                name="DepositoForm" 
                component={DepositoFormScreen}
                options={{ title: 'Novo Depósito' }}
              />
              <Stack.Screen 
                name="DepositoDetail" 
                component={DepositoDetailScreen}
                options={{ title: 'Detalhes do Depósito' }}
              />

              {/* New Moto CRUD screens */}
              <Stack.Screen 
                name="MotoList" 
                component={MotoListScreen}
                options={{ title: 'Motos' }}
              />
              <Stack.Screen 
                name="MotoForm" 
                component={MotoFormScreen}
                options={{ title: 'Nova Moto' }}
              />
              <Stack.Screen 
                name="MotoDetail" 
                component={MotoDetailScreen}
                options={{ title: 'Detalhes da Moto' }}
              />
            </>
          ) : (
            // Authentication screens
            <>
              <Stack.Screen 
                name="Login" 
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="Register" 
                component={RegisterScreen}
                options={{ headerShown: false }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}
