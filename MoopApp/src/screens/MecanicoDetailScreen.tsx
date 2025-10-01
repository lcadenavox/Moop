import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { Mecanico } from '../types';

interface MecanicoDetailScreenProps {
  navigation: any;
  route: any;
}

const MecanicoDetailScreen: React.FC<MecanicoDetailScreenProps> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { mecanico }: { mecanico: Mecanico } = route.params;

  const handleEdit = () => {
    navigation.navigate('MecanicoForm', { mecanico });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      padding: theme.spacing.lg,
    },
    card: {
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
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    detailIcon: {
      marginRight: theme.spacing.md,
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
    },
    buttonContainer: {
      marginTop: theme.spacing.xl,
      gap: theme.spacing.md,
    },
    button: {
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
    primaryButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>{mecanico.nome}</Text>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="person" size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Nome</Text>
              <Text style={styles.detailValue}>{mecanico.nome}</Text>
            </View>
          </View>

          <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
            <View style={styles.detailIcon}>
              <Ionicons name="construct" size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Especialidade</Text>
              <Text style={styles.detailValue}>{mecanico.especialidade}</Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleEdit}
          >
            <Ionicons name="pencil" size={20} color="white" />
            <Text style={styles.primaryButtonText}>Editar Mecânico</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default MecanicoDetailScreen;