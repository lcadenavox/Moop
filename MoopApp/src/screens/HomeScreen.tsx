import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import ApiStatus from '../components/ApiStatus';
import { useTranslation } from 'react-i18next';

export default function HomeScreen({ navigation }: any) {
  const { theme, isDark, toggleTheme } = useTheme();
  const { logout, user, isLoading } = useAuth();
  const { t } = useTranslation();

  const handleLogout = () => {
    try {
      Alert.alert(
        t('auth.logout.confirmTitle'),
        t('auth.logout.confirmMessage'),
        [
          { text: t('auth.logout.cancel'), style: 'cancel' },
          {
            text: t('auth.logout.action'),
            style: 'destructive',
            onPress: async () => {
              try {
                await logout();
                navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
              } catch (error) {
                console.error('Logout error:', error);
                Alert.alert(t('common.error'), t('auth.logout.error'));
              }
            }
          },
        ]
      );
    } catch (e) {
      // Fallback raríssimo caso Alert falhe no ambiente
      Alert.alert(t('auth.logout.fallbackTitle'), t('auth.logout.fallbackMessage'), [
        {
          text: t('common.ok'),
          onPress: async () => {
            await logout();
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
          }
        }
      ]);
    }
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
          {isLoading ? (
            <ActivityIndicator size="small" color={theme.colors.error} />
          ) : (
            <Ionicons name="log-out" size={24} color={theme.colors.error} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.welcomeContainer}>
        <Text style={styles.title}>{t('home.welcome')}</Text>
        {user && (
          <Text style={styles.subtitle}>{t('home.hello', { name: (user.name || user.email) })}</Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate("Mapa do Pátio")}
      >
        <Ionicons name="map" size={20} color={theme.colors.text} />
        <Text style={styles.textoBotao}>{t('home.map')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate("MotoList")}
      >
        <Ionicons name="list" size={20} color={theme.colors.text} />
        <Text style={styles.textoBotao}>{t('nav.bikeList')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate("OficinaList")}
      >
        <Ionicons name="business" size={20} color={theme.colors.text} />
        <Text style={styles.textoBotao}>{t('home.manageOficinas')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate("MecanicoList")}
      >
        <Ionicons name="construct" size={20} color={theme.colors.text} />
        <Text style={styles.textoBotao}>{t('home.manageMecanicos')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate("DepositoList")}
      >
        <Ionicons name="cube" size={20} color={theme.colors.text} />
        <Text style={styles.textoBotao}>{t('home.manageDepositos')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate("Cadastro de Vaga")}
      >
        <Ionicons name="add-circle" size={20} color={theme.colors.text} />
        <Text style={styles.textoBotao}>{t('home.registerSlot')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate("Estatísticas")}
      >
        <Ionicons name="stats-chart" size={20} color={theme.colors.text} />
        <Text style={styles.textoBotao}>{t('home.stats')}</Text>
      </TouchableOpacity>
    </View>
  );
}


