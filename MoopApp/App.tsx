import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { ThemeProvider, useTheme } from "./src/contexts/ThemeContext";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import { initI18n } from './src/i18n';
import LanguageSwitcher from './src/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { registerForPushNotifications } from './src/services/NotificationsService';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const { t } = useTranslation();

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
    headerRight: () => (
      <LanguageSwitcher />
    ),
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <NavigationContainer key={isAuthenticated ? 'auth-nav' : 'guest-nav'}>
        <Stack.Navigator
          key={isAuthenticated ? 'auth-stack' : 'guest-stack'}
          initialRouteName={isAuthenticated ? "Home" : "Login"}
          screenOptions={screenOptions}
        >
          {isAuthenticated ? (
            // Authenticated screens
            <>
              <Stack.Screen 
                name="Home" 
                component={HomeScreen} 
                options={{ title: t('nav.appTitle') }}
              />
              <Stack.Screen 
                name="MapScreen" 
                component={MapScreen} 
                options={{ title: t('nav.map') }}
              />
              <Stack.Screen 
                name="BikeListScreen" 
                component={BikeListScreen} 
                options={{ title: t('nav.bikeList') }}
              />
              <Stack.Screen 
                name="RegisterSlotScreen" 
                component={RegisterSlotScreen} 
                options={{ title: t('nav.registerSlot') }}
              />
              <Stack.Screen 
                name="StatisticsScreen" 
                component={StatisticsScreen} 
                options={{ title: t('nav.stats') }}
              />
              
              {/* New Mecanico CRUD screens */}
              <Stack.Screen 
                name="MecanicoList" 
                component={MecanicoListScreen}
                options={{ title: t('nav.mecanicos') }}
              />
              <Stack.Screen 
                name="MecanicoForm" 
                component={MecanicoFormScreen}
                options={{ title: t('nav.mecanicoNew') }}
              />
              <Stack.Screen 
                name="MecanicoDetail" 
                component={MecanicoDetailScreen}
                options={{ title: t('nav.mecanicoDetails') }}
              />
              
              {/* New Oficina CRUD screens */}
              <Stack.Screen 
                name="OficinaList" 
                component={OficinaListScreen}
                options={{ title: t('nav.oficinas') }}
              />
              <Stack.Screen 
                name="OficinaForm" 
                component={OficinaFormScreen}
                options={{ title: t('nav.oficinaNew') }}
              />
              <Stack.Screen 
                name="OficinaDetail" 
                component={OficinaDetailScreen}
                options={{ title: t('nav.oficinaDetails') }}
              />

              {/* New Deposito CRUD screens */}
              <Stack.Screen 
                name="DepositoList" 
                component={DepositoListScreen}
                options={{ title: t('nav.depositos') }}
              />
              <Stack.Screen 
                name="DepositoForm" 
                component={DepositoFormScreen}
                options={{ title: t('nav.depositoNew') }}
              />
              <Stack.Screen 
                name="DepositoDetail" 
                component={DepositoDetailScreen}
                options={{ title: t('nav.depositoDetails') }}
              />

              {/* New Moto CRUD screens */}
              <Stack.Screen 
                name="MotoList" 
                component={MotoListScreen}
                options={{ title: t('moto.list.title') }}
              />
              <Stack.Screen 
                name="MotoForm" 
                component={MotoFormScreen}
                options={{ title: t('moto.form.titleNew') }}
              />
              <Stack.Screen 
                name="MotoDetail" 
                component={MotoDetailScreen}
                options={{ title: t('nav.motoDetails') }}
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
  // Initialize i18n once
  initI18n();

  React.useEffect(() => {
    // Load persisted language if exists
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('lang');
        if (saved) {
          const { default: i18n } = await import('./src/i18n');
          i18n.changeLanguage(saved);
        }
      } catch {
        // ignore language load error
      }
    })();

    // Register push notifications and log token (later send to backend)
    // Registra push somente em dispositivo físico; evita warnings no web
    if (Device.isDevice) {
      registerForPushNotifications().then((res) => {
        if (res.granted && res.token) {
          console.log('Expo push token:', res.token);
        } else if (res.error) {
          console.log('Push registration info:', res.error);
        }
      });
    } else {
      console.log('Push remoto indisponível em web/simulador - usando fallback local (Alert).');
    }
    const sub = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received:', notification.request.content);
    });
    return () => {
      sub.remove();
    };
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}
