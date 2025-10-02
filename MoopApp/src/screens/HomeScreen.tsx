import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import ApiStatus from '../components/ApiStatus';

export default function HomeScreen({ navigation }: any) {
  const { theme, isDark, toggleTheme } = useTheme();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Confirmar Logout',
      'Deseja realmente sair do aplicativo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Logout error:', error);
            }
          }
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing.lg,
    },
    header: {
      position: 'absolute',
      top: 60,
      right: theme.spacing.lg,
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    headerButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.surface,
    },
    welcomeContainer: {
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
    },
    title: {
      fontSize: 26,
      fontWeight: "bold",
      color: theme.colors.primary,
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    botao: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      marginVertical: theme.spacing.xs,
      width: "100%",
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
    },
    textoBotao: {
      color: theme.colors.text,
      fontSize: 16,
      textAlign: "center",
      fontWeight: '500',
    },
  });

  return (
    <View style={styles.container}>
      <ApiStatus />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={toggleTheme}
        >
          <Ionicons 
            name={isDark ? "sunny" : "moon"} 
            size={24} 
            color={theme.colors.text} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out" size={24} color={theme.colors.error} />
        </TouchableOpacity>
      </View>

      <View style={styles.welcomeContainer}>
        <Text style={styles.title}>Bem-vindo à Moop</Text>
        {user && (
          <Text style={styles.subtitle}>Olá, {user.name || user.email}!</Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate("Mapa do Pátio")}
      >
        <Ionicons name="map" size={20} color={theme.colors.text} />
        <Text style={styles.textoBotao}>Mapa do Pátio</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate("MotoList")}
      >
        <Ionicons name="list" size={20} color={theme.colors.text} />
        <Text style={styles.textoBotao}>Lista de Motos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate("OficinaList")}
      >
        <Ionicons name="business" size={20} color={theme.colors.text} />
        <Text style={styles.textoBotao}>Gerenciar Oficinas</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate("MecanicoList")}
      >
        <Ionicons name="construct" size={20} color={theme.colors.text} />
        <Text style={styles.textoBotao}>Gerenciar Mecânicos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate("DepositoList")}
      >
        <Ionicons name="cube" size={20} color={theme.colors.text} />
        <Text style={styles.textoBotao}>Gerenciar Depósitos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate("Cadastro de Vaga")}
      >
        <Ionicons name="add-circle" size={20} color={theme.colors.text} />
        <Text style={styles.textoBotao}>Cadastrar Nova Vaga</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate("Estatísticas")}
      >
        <Ionicons name="stats-chart" size={20} color={theme.colors.text} />
        <Text style={styles.textoBotao}>Estatísticas</Text>
      </TouchableOpacity>
    </View>
  );
}


