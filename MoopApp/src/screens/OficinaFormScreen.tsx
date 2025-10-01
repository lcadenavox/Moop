import React, { useState, useEffect } from 'react';
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
import { Oficina } from '../types';
import OficinaService from '../services/OficinaService';
import { ApiError } from '../services/ApiService';

interface OficinaFormScreenProps {
  navigation: any;
  route: any;
}

const especialidadesDisponiveis = [
  'Motor',
  'Transmissão',
  'Freios',
  'Suspensão',
  'Elétrica',
  'Ar Condicionado',
  'Carroceria',
  'Pintura',
  'Vidros',
  'Pneus',
];

const OficinaFormScreen: React.FC<OficinaFormScreenProps> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { oficina } = route.params || {};
  const isEditing = !!oficina;

  const [nome, setNome] = useState(oficina?.nome || '');
  const [endereco, setEndereco] = useState(oficina?.endereco || '');
  const [telefone, setTelefone] = useState(oficina?.telefone || '');
  const [especialidadesSelecionadas, setEspecialidadesSelecionadas] = useState<string[]>(
    oficina?.especialidades || []
  );
  const [loading, setLoading] = useState(false);
  
  const [nomeError, setNomeError] = useState('');
  const [enderecoError, setEnderecoError] = useState('');
  const [telefoneError, setTelefoneError] = useState('');
  const [especialidadesError, setEspecialidadesError] = useState('');

  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Editar Oficina' : 'Nova Oficina',
    });
  }, [navigation, isEditing]);

  const toggleEspecialidade = (especialidade: string) => {
    setEspecialidadesSelecionadas(prev => {
      if (prev.includes(especialidade)) {
        return prev.filter(e => e !== especialidade);
      } else {
        return [...prev, especialidade];
      }
    });
    if (especialidadesError) setEspecialidadesError('');
  };

  const validateForm = (): boolean => {
    let isValid = true;

    // Reset errors
    setNomeError('');
    setEnderecoError('');
    setTelefoneError('');
    setEspecialidadesError('');

    // Nome validation
    if (!nome.trim()) {
      setNomeError('Nome é obrigatório');
      isValid = false;
    } else if (nome.trim().length < 2) {
      setNomeError('Nome deve ter pelo menos 2 caracteres');
      isValid = false;
    }

    // Endereço validation
    if (!endereco.trim()) {
      setEnderecoError('Endereço é obrigatório');
      isValid = false;
    } else if (endereco.trim().length < 5) {
      setEnderecoError('Endereço deve ter pelo menos 5 caracteres');
      isValid = false;
    }

    // Telefone validation
    const telefoneClean = telefone.replace(/\D/g, '');
    if (!telefone.trim()) {
      setTelefoneError('Telefone é obrigatório');
      isValid = false;
    } else if (telefoneClean.length < 10) {
      setTelefoneError('Telefone deve ter pelo menos 10 dígitos');
      isValid = false;
    }

    // Especialidades validation
    if (especialidadesSelecionadas.length === 0) {
      setEspecialidadesError('Selecione pelo menos uma especialidade');
      isValid = false;
    }

    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const oficinaData = {
        nome: nome.trim(),
        endereco: endereco.trim(),
        telefone: telefone.trim(),
        especialidades: especialidadesSelecionadas,
      };

      if (isEditing) {
        await OficinaService.update(oficina.id, oficinaData);
        Alert.alert('Sucesso', 'Oficina atualizada com sucesso', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        await OficinaService.create(oficinaData);
        Alert.alert('Sucesso', 'Oficina criada com sucesso', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        Alert.alert('Erro', error.message);
      } else {
        Alert.alert('Erro', 'Falha ao salvar oficina');
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
    especialidadesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.sm,
    },
    especialidadeButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    especialidadeButtonSelected: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    especialidadeText: {
      fontSize: 14,
      color: theme.colors.text,
    },
    especialidadeTextSelected: {
      color: 'white',
      fontWeight: '500',
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
          <Text style={styles.label}>Nome da Oficina</Text>
          <TextInput
            style={[styles.input, nomeError ? styles.inputError : null]}
            value={nome}
            onChangeText={(text) => {
              setNome(text);
              if (nomeError) setNomeError('');
            }}
            placeholder="Digite o nome da oficina"
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

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Telefone</Text>
          <TextInput
            style={[styles.input, telefoneError ? styles.inputError : null]}
            value={telefone}
            onChangeText={(text) => {
              setTelefone(text);
              if (telefoneError) setTelefoneError('');
            }}
            placeholder="(11) 99999-9999"
            placeholderTextColor={theme.colors.textSecondary}
            keyboardType="phone-pad"
          />
          {telefoneError ? <Text style={styles.errorText}>{telefoneError}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Especialidades</Text>
          <View style={styles.especialidadesContainer}>
            {especialidadesDisponiveis.map((especialidade) => {
              const isSelected = especialidadesSelecionadas.includes(especialidade);
              return (
                <TouchableOpacity
                  key={especialidade}
                  style={[
                    styles.especialidadeButton,
                    isSelected ? styles.especialidadeButtonSelected : null,
                  ]}
                  onPress={() => toggleEspecialidade(especialidade)}
                >
                  <Text
                    style={[
                      styles.especialidadeText,
                      isSelected ? styles.especialidadeTextSelected : null,
                    ]}
                  >
                    {especialidade}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {especialidadesError ? <Text style={styles.errorText}>{especialidadesError}</Text> : null}
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

export default OficinaFormScreen;