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
import { useTheme } from '../contexts/ThemeContext';
import { Mecanico } from '../types';
import MecanicoService from '../services/MecanicoService';
import { ApiError } from '../services/ApiService';
import { useTranslation } from 'react-i18next';
import { createMecanicoSchema, validateWith } from '../validation/schemas';

interface MecanicoFormScreenProps {
  navigation: any;
  route: any;
}

const MecanicoFormScreen: React.FC<MecanicoFormScreenProps> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { mecanico } = route.params || {};
  const { t } = useTranslation();
  const isEditing = !!mecanico;

  const [nome, setNome] = useState(mecanico?.nome || '');
  const [especialidade, setEspecialidade] = useState(mecanico?.especialidade || '');
  const [loading, setLoading] = useState(false);
  
  const [nomeError, setNomeError] = useState('');
  const [especialidadeError, setEspecialidadeError] = useState('');

  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? t('mecanico.form.titleEdit') : t('mecanico.form.titleNew'),
    });
  }, [navigation, isEditing, t]);

  const handleSave = async () => {
    setNomeError('');
    setEspecialidadeError('');
    const schema = createMecanicoSchema(t);
    const result = await validateWith(schema, { nome, especialidade });
    if (!result.valid) {
      setNomeError(result.errors.nome || '');
      setEspecialidadeError(result.errors.especialidade || '');
      return;
    }

    try {
      setLoading(true);
      
      const mecanicoData = {
        nome: nome.trim(),
        especialidade: especialidade.trim(),
      };

      if (isEditing) {
        await MecanicoService.update(mecanico.id, mecanicoData);
        Alert.alert(t('common.success'), t('mecanico.form.updated'), [
          { text: t('common.ok'), onPress: () => navigation.navigate('MecanicoList') }
        ]);
      } else {
        await MecanicoService.create(mecanicoData);
        Alert.alert(t('common.success'), t('mecanico.form.created'), [
          { text: t('common.ok'), onPress: () => navigation.navigate('MecanicoList') }
        ]);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        Alert.alert(t('common.error'), error.message);
      } else {
        Alert.alert(t('common.error'), t('mecanico.form.errorSave', 'Falha ao salvar mecânico'));
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
          <Text style={styles.label}>{t('mecanico.form.nome')}</Text>
          <TextInput
            style={[styles.input, nomeError ? styles.inputError : null]}
            value={nome}
            onChangeText={(text) => {
              setNome(text);
              if (nomeError) setNomeError('');
            }}
            placeholder={t('mecanico.form.placeholderNome')}
            placeholderTextColor={theme.colors.textSecondary}
            autoCapitalize="words"
          />
          {nomeError ? <Text style={styles.errorText}>{nomeError}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t('mecanico.form.especialidade')}</Text>
          <TextInput
            style={[styles.input, especialidadeError ? styles.inputError : null]}
            value={especialidade}
            onChangeText={(text) => {
              setEspecialidade(text);
              if (especialidadeError) setEspecialidadeError('');
            }}
            placeholder={t('mecanico.form.placeholderEspecialidade')}
            placeholderTextColor={theme.colors.textSecondary}
            autoCapitalize="words"
          />
          {especialidadeError ? <Text style={styles.errorText}>{especialidadeError}</Text> : null}
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

export default MecanicoFormScreen;