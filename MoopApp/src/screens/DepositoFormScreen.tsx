import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { Deposito } from '../types';
import DepositoService from '../services/DepositoService';
import { ApiError } from '../services/ApiService';

interface DepositoFormScreenProps {
  navigation: any;
  route: any;
}

const DepositoFormScreen: React.FC<DepositoFormScreenProps> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { deposito } = route.params || {};
  const isEditing = !!deposito;

  const [nome, setNome] = useState<string>(deposito?.nome || '');
  const [endereco, setEndereco] = useState<string>(deposito?.endereco || '');
  const [loading, setLoading] = useState(false);

  const [nomeError, setNomeError] = useState('');
  const [enderecoError, setEnderecoError] = useState('');

  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Editar Depósito' : 'Novo Depósito',
    });
  }, [navigation, isEditing]);

  const validateForm = (): boolean => {
    let isValid = true;

    setNomeError('');
    setEnderecoError('');

    if (!nome.trim()) {
      setNomeError('Nome é obrigatório');
      isValid = false;
    } else if (nome.trim().length < 2) {
      setNomeError('Nome deve ter pelo menos 2 caracteres');
      isValid = false;
    }

    if (!endereco.trim()) {
      setEnderecoError('Endereço é obrigatório');
      isValid = false;
    } else if (endereco.trim().length < 5) {
      setEnderecoError('Endereço deve ter pelo menos 5 caracteres');
      isValid = false;
    }

    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const depositoData = {
        nome: nome.trim(),
        endereco: endereco.trim(),
      } as Omit<Deposito, 'id'>;

      if (isEditing) {
        await DepositoService.update(deposito.id, depositoData);
        Alert.alert('Sucesso', 'Depósito atualizado com sucesso', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        await DepositoService.create(depositoData);
        Alert.alert('Sucesso', 'Depósito criado com sucesso', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        Alert.alert('Erro', error.message);
      } else {
        Alert.alert('Erro', 'Falha ao salvar depósito');
      }
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      padding: theme.spacing.lg,
    },
    inputContainer: {
      marginBottom: theme.spacing.md,
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      fontSize: 16,
      color: theme.colors.text,
    },
    inputError: {
      borderColor: theme.colors.error,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: 14,
      marginTop: theme.spacing.xs,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      marginTop: theme.spacing.xl,
    },
    button: {
      flex: 1,
      borderRadius: theme.borderRadius.md,
      paddingVertical: theme.spacing.md,
      alignItems: 'center',
    },
    primaryButton: {
      backgroundColor: theme.colors.primary,
    },
    secondaryButton: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    buttonDisabled: {
      opacity: 0.6,
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
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome do Depósito</Text>
          <TextInput
            style={[styles.input, nomeError ? styles.inputError : null]}
            value={nome}
            onChangeText={(text) => {
              setNome(text);
              if (nomeError) setNomeError('');
            }}
            placeholder="Digite o nome do depósito"
            placeholderTextColor={theme.colors.textSecondary}
            autoCapitalize="words"
          />
          {nomeError ? <Text style={styles.errorText}>{nomeError}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Endereço</Text>
          <TextInput
            style={[styles.input, enderecoError ? styles.inputError : null]}
            value={endereco}
            onChangeText={(text) => {
              setEndereco(text);
              if (enderecoError) setEnderecoError('');
            }}
            placeholder="Digite o endereço completo"
            placeholderTextColor={theme.colors.textSecondary}
            autoCapitalize="words"
            multiline
          />
          {enderecoError ? <Text style={styles.errorText}>{enderecoError}</Text> : null}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.secondaryButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.primaryButton,
              loading ? styles.buttonDisabled : null,
            ]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.primaryButtonText}>
                {isEditing ? 'Atualizar' : 'Salvar'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default DepositoFormScreen;
