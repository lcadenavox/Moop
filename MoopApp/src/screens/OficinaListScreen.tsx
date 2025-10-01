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
import { Oficina } from '../types';
import OficinaService from '../services/OficinaService';
import { ApiError } from '../services/ApiService';

interface OficinaListScreenProps {
  navigation: any;
}

const OficinaListScreen: React.FC<OficinaListScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [oficinas, setOficinas] = useState<Oficina[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadOficinas();
    }, [])
  );

  const loadOficinas = async () => {
    try {
      setLoading(true);
      const data = await OficinaService.getAll();
      setOficinas(data);
    } catch (error) {
      if (error instanceof ApiError) {
        Alert.alert('Erro', error.message);
      } else {
        Alert.alert('Erro', 'Falha ao carregar oficinas');
      }
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOficinas();
    setRefreshing(false);
  };

  const handleDelete = (oficina: Oficina) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja excluir a oficina ${oficina.nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => deleteOficina(oficina.id)
        },
      ]
    );
  };

  const deleteOficina = async (id: number) => {
    try {
      await OficinaService.delete(id);
      setOficinas(prev => prev.filter(oficina => oficina.id !== id));
      Alert.alert('Sucesso', 'Oficina excluída com sucesso');
    } catch (error) {
      if (error instanceof ApiError) {
        Alert.alert('Erro', error.message);
      } else {
        Alert.alert('Erro', 'Falha ao excluir oficina');
      }
    }
  };

  const renderOficinaItem = ({ item }: { item: Oficina }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('OficinaDetail', { oficina: item })}
    >
      <View style={styles.itemContent}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>{item.nome}</Text>
          <Text style={styles.itemSubtitle}>{item.endereco}</Text>
          <Text style={styles.itemPhone}>{item.telefone}</Text>
          <View style={styles.especialidadesContainer}>
            {item.especialidades.slice(0, 2).map((esp, index) => (
              <View key={index} style={styles.especialidadeTag}>
                <Text style={styles.especialidadeText}>{esp}</Text>
              </View>
            ))}
            {item.especialidades.length > 2 && (
              <Text style={styles.maisEspecialidades}>
                +{item.especialidades.length - 2} mais
              </Text>
            )}
          </View>
        </View>
        <View style={styles.itemActions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('OficinaForm', { oficina: item })}
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
      alignItems: 'flex-start',
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
      marginBottom: theme.spacing.xs,
    },
    itemPhone: {
      fontSize: 14,
      color: theme.colors.primary,
      marginBottom: theme.spacing.sm,
    },
    especialidadesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    especialidadeTag: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs / 2,
      borderRadius: theme.borderRadius.sm,
    },
    especialidadeText: {
      fontSize: 12,
      color: 'white',
      fontWeight: '500',
    },
    maisEspecialidades: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      fontStyle: 'italic',
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
          Carregando oficinas...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {oficinas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="business" size={64} color={theme.colors.textSecondary} />
          <Text style={styles.emptyText}>
            Nenhuma oficina cadastrada.{'\n'}Toque no botão + para adicionar.
          </Text>
        </View>
      ) : (
        <FlatList
          data={oficinas}
          renderItem={renderOficinaItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingVertical: theme.spacing.md }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
      
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('OficinaForm')}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default OficinaListScreen;