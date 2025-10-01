import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { Oficina } from '../types';

interface OficinaDetailScreenProps {
  navigation: any;
  route: any;
}

const OficinaDetailScreen: React.FC<OficinaDetailScreenProps> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { oficina }: { oficina: Oficina } = route.params;

  const handleEdit = () => {
    navigation.navigate('OficinaForm', { oficina });
  };

  const handleCall = () => {
    const phoneNumber = oficina.telefone.replace(/\D/g, '');
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleOpenMap = () => {
    const encodedAddress = encodeURIComponent(oficina.endereco);
    Linking.openURL(`https://maps.google.com/?q=${encodedAddress}`);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      padding: theme.spacing.lg,
    },
    headerCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    detailIcon: {
      marginRight: theme.spacing.md,
      marginTop: theme.spacing.xs,
      width: 24,
      alignItems: 'center',
    },
    detailContent: {
      flex: 1,
    },
    detailLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs / 2,
    },
    detailValue: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.text,
      lineHeight: 22,
    },
    phoneValue: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.primary,
    },
    especialidadesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.xs,
    },
    especialidadeTag: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
    },
    especialidadeText: {
      fontSize: 12,
      color: 'white',
      fontWeight: '500',
    },
    buttonContainer: {
      marginTop: theme.spacing.xl,
      gap: theme.spacing.md,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.borderRadius.md,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      gap: theme.spacing.sm,
    },
    primaryButton: {
      backgroundColor: theme.colors.primary,
    },
    secondaryButton: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    callButton: {
      backgroundColor: theme.colors.success,
    },
    mapButton: {
      backgroundColor: theme.colors.secondary,
    },
    primaryButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
    secondaryButtonText: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: '600',
    },
    callButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
    mapButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerCard}>
          <Text style={styles.title}>{oficina.nome}</Text>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="location" size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Endereço</Text>
              <Text style={styles.detailValue}>{oficina.endereco}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="call" size={20} color={theme.colors.success} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Telefone</Text>
              <Text style={styles.phoneValue}>{oficina.telefone}</Text>
            </View>
          </View>

          <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
            <View style={styles.detailIcon}>
              <Ionicons name="construct" size={20} color={theme.colors.secondary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Especialidades</Text>
              <View style={styles.especialidadesContainer}>
                {oficina.especialidades.map((especialidade, index) => (
                  <View key={index} style={styles.especialidadeTag}>
                    <Text style={styles.especialidadeText}>{especialidade}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.callButton]}
            onPress={handleCall}
          >
            <Ionicons name="call" size={20} color="white" />
            <Text style={styles.callButtonText}>Ligar para Oficina</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.mapButton]}
            onPress={handleOpenMap}
          >
            <Ionicons name="map" size={20} color="white" />
            <Text style={styles.mapButtonText}>Ver no Mapa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={handleEdit}
          >
            <Ionicons name="pencil" size={20} color="white" />
            <Text style={styles.primaryButtonText}>Editar Oficina</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default OficinaDetailScreen;