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
import { Moto } from '../types';
import MotoService from '../services/MotoService';
import { ApiError } from '../services/ApiService';

interface MotoListScreenProps {
  navigation: any;
}

const MotoListScreen: React.FC<MotoListScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [motos, setMotos] = useState<Moto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadMotos();
    }, [])
  );

  const loadMotos = async () => {
    try {
      setLoading(true);
      const data = await MotoService.getAll();
      setMotos(data);
    } catch (error) {
      if (error instanceof ApiError) {
        Alert.alert('Erro', error.message);
      } else {
        Alert.alert('Erro', 'Falha ao carregar motos');
      }
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMotos();
    setRefreshing(false);
  };

  const handleDelete = (moto: Moto) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja excluir a moto ${moto.marca} ${moto.modelo}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => deleteMoto(moto.id)
        },
      ]
    );
  };

  const deleteMoto = async (id: number) => {
    try {
      await MotoService.delete(id);
      setMotos(prev => prev.filter(moto => moto.id !== id));
      Alert.alert('Sucesso', 'Moto excluída com sucesso', [
        { text: 'OK', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Home' }] }) }
      ]);
    } catch (error) {
      if (error instanceof ApiError) {
        Alert.alert('Erro', error.message);
      } else {
        Alert.alert('Erro', 'Falha ao excluir moto');
      }
    }
  };

  const renderMotoItem = ({ item }: { item: Moto }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('MotoDetail', { moto: item })}
    >
      <View style={styles.itemContent}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>{item.marca} {item.modelo}</Text>
          <Text style={styles.itemSubtitle}>Ano: {item.ano}</Text>
        </View>
        <View style={styles.itemActions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('MotoForm', { moto: item })}
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
          Carregando motos...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {motos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="car-sport" size={64} color={theme.colors.textSecondary} />
          <Text style={styles.emptyText}>
            Nenhuma moto cadastrada.{'\n'}Toque no botão + para adicionar.
          </Text>
        </View>
      ) : (
        <FlatList
          data={motos}
          renderItem={renderMotoItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingVertical: theme.spacing.md }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
      
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('MotoForm')}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default MotoListScreen;