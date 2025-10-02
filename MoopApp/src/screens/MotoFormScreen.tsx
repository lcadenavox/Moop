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
import { Moto } from '../types';
import MotoService from '../services/MotoService';
import { ApiError } from '../services/ApiService';

interface MotoFormScreenProps {
  navigation: any;
  route: any;
}

const MotoFormScreen: React.FC<MotoFormScreenProps> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { moto } = route.params || {};
  const isEditing = !!moto;

  const [marca, setMarca] = useState(moto?.marca || '');
  const [modelo, setModelo] = useState(moto?.modelo || '');
  const [ano, setAno] = useState(moto?.ano?.toString() || '');
  const [loading, setLoading] = useState(false);
  
  const [marcaError, setMarcaError] = useState('');
  const [modeloError, setModeloError] = useState('');
  const [anoError, setAnoError] = useState('');

  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Editar Moto' : 'Nova Moto',
    });
  }, [navigation, isEditing]);

  const validateForm = (): boolean => {
    let isValid = true;

    // Reset errors
    setMarcaError('');
    setModeloError('');
    setAnoError('');

    // Marca validation
    if (!marca.trim()) {
      setMarcaError('Marca é obrigatória');
      isValid = false;
    }

    // Modelo validation
    if (!modelo.trim()) {
      setModeloError('Modelo é obrigatório');
      isValid = false;
    }

    // Ano validation
    const anoNumber = parseInt(ano);
    if (!ano.trim()) {
      setAnoError('Ano é obrigatório');
      isValid = false;
    } else if (isNaN(anoNumber)) {
      setAnoError('Ano deve ser um número válido');
      isValid = false;
    } else if (anoNumber < 1900 || anoNumber > 2100) {
      setAnoError('Ano deve estar entre 1900 e 2100');
      isValid = false;
    }

    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const motoData = {
        marca: marca.trim(),
        modelo: modelo.trim(),
        ano: parseInt(ano),
      };

      if (isEditing) {
        await MotoService.update(moto.id, motoData);
        Alert.alert('Sucesso', 'Moto atualizada com sucesso', [
          { text: 'OK', onPress: () => navigation.navigate('MotoList') }
        ]);
      } else {
        await MotoService.create(motoData);
        Alert.alert('Sucesso', 'Moto criada com sucesso', [
          { text: 'OK', onPress: () => navigation.navigate('MotoList') }
        ]);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        Alert.alert('Erro', error.message);
      } else {
        Alert.alert('Erro', 'Falha ao salvar moto');
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
          <Text style={styles.label}>Marca</Text>
          <TextInput
            style={[styles.input, marcaError ? styles.inputError : null]}
            value={marca}
            onChangeText={(text) => {
              setMarca(text);
              if (marcaError) setMarcaError('');
            }}
            placeholder="Digite a marca da moto"
            placeholderTextColor={theme.colors.textSecondary}
            autoCapitalize="words"
          />
          {marcaError ? <Text style={styles.errorText}>{marcaError}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Modelo</Text>
          <TextInput
            style={[styles.input, modeloError ? styles.inputError : null]}
            value={modelo}
            onChangeText={(text) => {
              setModelo(text);
              if (modeloError) setModeloError('');
            }}
            placeholder="Digite o modelo da moto"
            placeholderTextColor={theme.colors.textSecondary}
            autoCapitalize="words"
          />
          {modeloError ? <Text style={styles.errorText}>{modeloError}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Ano</Text>
          <TextInput
            style={[styles.input, anoError ? styles.inputError : null]}
            value={ano}
            onChangeText={(text) => {
              setAno(text);
              if (anoError) setAnoError('');
            }}
            placeholder="Digite o ano da moto"
            placeholderTextColor={theme.colors.textSecondary}
            keyboardType="numeric"
            maxLength={4}
          />
          {anoError ? <Text style={styles.errorText}>{anoError}</Text> : null}
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

export default MotoFormScreen;