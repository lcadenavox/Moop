import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import MecanicoService from '../services/MecanicoService';
import OficinaService from '../services/OficinaService';
import DepositoService from '../services/DepositoService';
import { ApiError } from '../services/ApiService';
import LoadingSpinner from '../components/LoadingSpinner';

const todasVagas = [
  "A1",
  "A2",
  "A3",
  "A4",
  "B1",
  "B2",
  "B3",
  "B4",
  "C1",
  "C2",
  "C3",
  "C4",
];

const StatisticsScreen = () => {
  const { theme } = useTheme();
  const [stats, setStats] = useState<{ 
    total: number; 
    ocupadas: number; 
    motosLocais: number;
    mecanicos: number;
    oficinas: number;
    depositos: number;
    loading: boolean;
  }>({
    total: todasVagas.length,
    ocupadas: 0,
    motosLocais: 0,
    mecanicos: 0,
    oficinas: 0,
    depositos: 0,
    loading: true,
  });

  useEffect(() => {
    calcularEstatisticas();
  }, []);

  const calcularEstatisticas = async () => {
    try {
      // Estatísticas locais (AsyncStorage)
      const dados = await AsyncStorage.getItem("motos");
      const motos = dados ? JSON.parse(dados) : [];
      const vagasOcupadas = motos.filter((m: any) => m.vaga).length;

      // Estatísticas da API
      let mecanicos = 0;
      let oficinas = 0;
      let depositos = 0;
      
      try {
        const mecanicosFromAPI = await MecanicoService.getAll();
        mecanicos = mecanicosFromAPI.length;
      } catch (error) {
        console.log('Erro ao buscar mecânicos da API:', error);
      }

      try {
        const oficinasFromAPI = await OficinaService.getAll();
        oficinas = oficinasFromAPI.length;
      } catch (error) {
        console.log('Erro ao buscar oficinas da API:', error);
      }

      try {
        depositos = await DepositoService.getCount();
      } catch (error) {
        console.log('Erro ao buscar depósitos da API:', error);
      }

      setStats({
        total: todasVagas.length,
        ocupadas: vagasOcupadas,
        motosLocais: motos.length,
        mecanicos,
        oficinas,
        depositos,
        loading: false,
      });
    } catch (error) {
      console.error('Erro ao calcular estatísticas:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  if (stats.loading) {
    return <LoadingSpinner message="Carregando estatísticas..." />;
  }

  const styles = StyleSheet.create({
    container: { 
      flex: 1, 
      backgroundColor: theme.colors.background, 
      padding: theme.spacing.lg 
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.primary,
      marginBottom: theme.spacing.xl,
      textAlign: 'center',
    },
    statsContainer: {
      gap: theme.spacing.lg,
    },
    statCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    statHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    statIcon: {
      marginRight: theme.spacing.sm,
    },
    statTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
    },
    statValue: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.colors.primary,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
    statDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estatísticas do Sistema</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Ionicons 
              name="grid" 
              size={24} 
              color={theme.colors.primary} 
              style={styles.statIcon}
            />
            <Text style={styles.statTitle}>Total de Vagas</Text>
          </View>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statDescription}>Vagas disponíveis no pátio</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Ionicons 
              name="checkmark-circle" 
              size={24} 
              color={theme.colors.success} 
              style={styles.statIcon}
            />
            <Text style={styles.statTitle}>Vagas Ocupadas</Text>
          </View>
          <Text style={[styles.statValue, { color: theme.colors.success }]}>
            {stats.ocupadas}
          </Text>
          <Text style={styles.statDescription}>Vagas atualmente em uso</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Ionicons 
              name="ellipse-outline" 
              size={24} 
              color={theme.colors.warning} 
              style={styles.statIcon}
            />
            <Text style={styles.statTitle}>Vagas Livres</Text>
          </View>
          <Text style={[styles.statValue, { color: theme.colors.warning }]}>
            {stats.total - stats.ocupadas}
          </Text>
          <Text style={styles.statDescription}>Vagas disponíveis para uso</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Ionicons 
              name="car-sport" 
              size={24} 
              color={theme.colors.secondary} 
              style={styles.statIcon}
            />
            <Text style={styles.statTitle}>Motos Cadastradas</Text>
          </View>
          <Text style={[styles.statValue, { color: theme.colors.secondary }]}>
            {stats.motosLocais}
          </Text>
          <Text style={styles.statDescription}>Motos cadastradas localmente</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Ionicons 
              name="construct" 
              size={24} 
              color={theme.colors.warning} 
              style={styles.statIcon}
            />
            <Text style={styles.statTitle}>Mecânicos Cadastrados</Text>
          </View>
          <Text style={[styles.statValue, { color: theme.colors.warning }]}>
            {stats.mecanicos}
          </Text>
          <Text style={styles.statDescription}>Total de mecânicos no sistema</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Ionicons 
              name="business" 
              size={24} 
              color={theme.colors.primary} 
              style={styles.statIcon}
            />
            <Text style={styles.statTitle}>Oficinas Cadastradas</Text>
          </View>
          <Text style={[styles.statValue, { color: theme.colors.primary }]}>
            {stats.oficinas}
          </Text>
          <Text style={styles.statDescription}>Total de oficinas no sistema</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Ionicons 
              name="cube" 
              size={24} 
              color={theme.colors.secondary} 
              style={styles.statIcon}
            />
            <Text style={styles.statTitle}>Depósitos Cadastrados</Text>
          </View>
          <Text style={[styles.statValue, { color: theme.colors.secondary }]}>
            {stats.depositos}
          </Text>
          <Text style={styles.statDescription}>Total de depósitos no sistema</Text>
        </View>
      </View>
    </View>
  );
};

export default StatisticsScreen;
