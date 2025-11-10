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
import { notifyCreation } from '../services/NotificationsService';
import { ApiError } from '../services/ApiService';
import { useTranslation } from 'react-i18next';
import { createDepositoSchema, validateWith } from '../validation/schemas';

interface DepositoFormScreenProps {
  navigation: any;
  route: any;
}

const DepositoFormScreen: React.FC<DepositoFormScreenProps> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { deposito } = route.params || {};
  const { t } = useTranslation();
  const isEditing = !!deposito;

  const [nome, setNome] = useState<string>(deposito?.nome || '');
  const [endereco, setEndereco] = useState<string>(deposito?.endereco || '');
  const [loading, setLoading] = useState(false);

  const [nomeError, setNomeError] = useState('');
  const [enderecoError, setEnderecoError] = useState('');

  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? t('deposito.form.titleEdit') : t('deposito.form.titleNew'),
    });
  }, [navigation, isEditing, t]);

  const handleSave = async () => {
    setNomeError('');
    setEnderecoError('');
    const schema = createDepositoSchema(t);
    const result = await validateWith(schema, { nome, endereco });
    if (!result.valid) {
      setNomeError(result.errors.nome || '');
      setEnderecoError(result.errors.endereco || '');
      return;
    }

    try {
      setLoading(true);

      const depositoData = {
        nome: nome.trim(),
        endereco: endereco.trim(),
      } as Omit<Deposito, 'id'>;

      if (isEditing) {
        await DepositoService.update(deposito.id, depositoData);
        Alert.alert(t('common.success'), t('deposito.form.updated'), [
          { text: t('common.ok'), onPress: () => navigation.navigate('DepositoList') }
        ]);
      } else {
        await DepositoService.create(depositoData);
        // Notificação push/local localizada
        notifyCreation('deposito', { nome: depositoData.nome }).catch(() => {});
        Alert.alert(t('common.success'), t('deposito.form.created'), [
          { text: t('common.ok'), onPress: () => navigation.navigate('DepositoList') }
        ]);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        Alert.alert(t('common.error'), error.message);
      } else {
        Alert.alert(t('common.error'), t('deposito.form.errorSave', 'Falha ao salvar depósito'));
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
          <Text style={styles.label}>{t('deposito.form.nome')}</Text>
          <TextInput
            style={[styles.input, nomeError ? styles.inputError : null]}
            value={nome}
            onChangeText={(text) => {
              setNome(text);
              if (nomeError) setNomeError('');
            }}
            placeholder={t('deposito.form.placeholderNome')}
            placeholderTextColor={theme.colors.textSecondary}
            autoCapitalize="words"
          />
          {nomeError ? <Text style={styles.errorText}>{nomeError}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t('deposito.form.endereco')}</Text>
          <TextInput
            style={[styles.input, enderecoError ? styles.inputError : null]}
            value={endereco}
            onChangeText={(text) => {
              setEndereco(text);
              if (enderecoError) setEnderecoError('');
            }}
            placeholder={t('deposito.form.placeholderEndereco')}
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

export default DepositoFormScreen;
