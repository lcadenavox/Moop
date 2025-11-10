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
import { useTranslation } from 'react-i18next';
import { createOficinaSchema, validateWith } from '../validation/schemas';

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
  const { t } = useTranslation();
  const isEditing = !!oficina;
  const translatedEspecialidades = (t('oficina.especialidadesOptions', { returnObjects: true }) as string[]) || especialidadesDisponiveis;

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
      title: isEditing ? t('oficina.form.titleEdit') : t('oficina.form.titleNew'),
    });
  }, [navigation, isEditing, t]);

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

  const handleSave = async () => {
    setNomeError('');
    setEnderecoError('');
    setTelefoneError('');
    setEspecialidadesError('');
    const schema = createOficinaSchema(t);
    const result = await validateWith(schema, {
      nome,
      endereco,
      telefone,
      especialidades: especialidadesSelecionadas,
    });
    if (!result.valid) {
      setNomeError(result.errors.nome || '');
      setEnderecoError(result.errors.endereco || '');
      setTelefoneError(result.errors.telefone || '');
      setEspecialidadesError(result.errors.especialidades || '');
      return;
    }

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
        Alert.alert(t('common.success'), t('oficina.form.updated'), [
          { text: t('common.ok'), onPress: () => navigation.navigate('OficinaList') }
        ]);
      } else {
        await OficinaService.create(oficinaData);
        Alert.alert(t('common.success'), t('oficina.form.created'), [
          { text: t('common.ok'), onPress: () => navigation.navigate('OficinaList') }
        ]);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        Alert.alert(t('common.error'), error.message);
      } else {
        Alert.alert(t('common.error'), t('oficina.form.errorSave', 'Falha ao salvar oficina'));
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
          <Text style={styles.label}>{t('oficina.form.nome')}</Text>
          <TextInput
            style={[styles.input, nomeError ? styles.inputError : null]}
            value={nome}
            onChangeText={(text) => {
              setNome(text);
              if (nomeError) setNomeError('');
            }}
            placeholder={t('oficina.form.placeholderNome')}
            placeholderTextColor={theme.colors.textSecondary}
            autoCapitalize="words"
          />
          {nomeError ? <Text style={styles.errorText}>{nomeError}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t('oficina.form.endereco')}</Text>
          <TextInput
            style={[styles.input, enderecoError ? styles.inputError : null]}
            value={endereco}
            onChangeText={(text) => {
              setEndereco(text);
              if (enderecoError) setEnderecoError('');
            }}
            placeholder={t('oficina.form.placeholderEndereco')}
            placeholderTextColor={theme.colors.textSecondary}
            autoCapitalize="words"
            multiline
          />
          {enderecoError ? <Text style={styles.errorText}>{enderecoError}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t('oficina.form.telefone')}</Text>
          <TextInput
            style={[styles.input, telefoneError ? styles.inputError : null]}
            value={telefone}
            onChangeText={(text) => {
              setTelefone(text);
              if (telefoneError) setTelefoneError('');
            }}
            placeholder={t('oficina.form.placeholderTelefone')}
            placeholderTextColor={theme.colors.textSecondary}
            keyboardType="phone-pad"
          />
          {telefoneError ? <Text style={styles.errorText}>{telefoneError}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t('oficina.form.especialidades')}</Text>
          <View style={styles.especialidadesContainer}>
            {translatedEspecialidades.map((especialidade) => {
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
            <Text style={styles.secondaryButtonText}>{t('common.cancel')}</Text>
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
                {isEditing ? t('common.update') : t('common.save')}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default OficinaFormScreen;