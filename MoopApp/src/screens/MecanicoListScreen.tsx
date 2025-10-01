import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { Mecanico } from '../types';
import MecanicoService from '../services/MecanicoService';
import { ApiError } from '../services/ApiService';

interface MecanicoListScreenProps {
  navigation: any;
}

const MecanicoListScreen: React.FC<MecanicoListScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [mecanicos, setMecanicos] = useState<Mecanico[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadMecanicos();
    }, [])
  );

  const loadMecanicos = async () => {
    try {
      setLoading(true);
      const data = await MecanicoService.getAll();
      setMecanicos(data);
    } catch (error) {
      if (error instanceof ApiError) {
        Alert.alert('Erro', error.message);
      } else {
        Alert.alert('Erro', 'Falha ao carregar mecânicos');
      }
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMecanicos();
    setRefreshing(false);
  };

  const handleDelete = (mecanico: Mecanico) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja excluir o mecânico ${mecanico.nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => deleteMecanico(mecanico.id)
        },
      ]
    );
  };

  const deleteMecanico = async (id: number) => {
    try {
      await MecanicoService.delete(id);
      setMecanicos(prev => prev.filter(mecanico => mecanico.id !== id));
      Alert.alert('Sucesso', 'Mecânico excluído com sucesso');
    } catch (error) {
      if (error instanceof ApiError) {
        Alert.alert('Erro', error.message);
      } else {
        Alert.alert('Erro', 'Falha ao excluir mecânico');
      }
    }
  };

  const renderMecanicoItem = ({ item }: { item: Mecanico }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('MecanicoDetail', { mecanico: item })}
    >
      <View style={styles.itemContent}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>{item.nome}</Text>
          <Text style={styles.itemSubtitle}>Especialidade: {item.especialidade}</Text>
        </View>
        <View style={styles.itemActions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('MecanicoForm', { mecanico: item })}
          >
            <Ionicons name="pencil" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(item)}
          >
            <Ionicons name="trash" size={20} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.lg,
    },
    emptyText: {
      fontSize: 18,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: theme.spacing.md,
    },
    itemContainer: {
      backgroundColor: theme.colors.surface,
      marginHorizontal: theme.spacing.md,
      marginVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.md,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    itemContent: {
      flexDirection: 'row',
      padding: theme.spacing.md,
      alignItems: 'center',
    },
    itemInfo: {
      flex: 1,
    },
    itemTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    itemSubtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    itemActions: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    editButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.background,
    },
    deleteButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.background,
    },
    fab: {
      position: 'absolute',
      bottom: theme.spacing.lg,
      right: theme.spacing.lg,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.emptyText, { marginTop: theme.spacing.md }]}>
          Carregando mecânicos...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {mecanicos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="construct" size={64} color={theme.colors.textSecondary} />
          <Text style={styles.emptyText}>
            Nenhum mecânico cadastrado.{'\n'}Toque no botão + para adicionar.
          </Text>
        </View>
      ) : (
        <FlatList
          data={mecanicos}
          renderItem={renderMecanicoItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingVertical: theme.spacing.md }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
      
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('MecanicoForm')}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default MecanicoListScreen;