import React, { useState } from 'react';
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
import { useAuth } from '../contexts/AuthContext';
import { ApiError } from '../services/ApiService';
import ApiStatus from '../components/ApiStatus';

interface RegisterScreenProps {
  navigation: any;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { register, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateForm = (): boolean => {
    let isValid = true;

    // Reset errors
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // Name validation
    if (!name.trim()) {
      setNameError('Nome é obrigatório');
      isValid = false;
    } else if (name.trim().length < 2) {
      setNameError('Nome deve ter pelo menos 2 caracteres');
      isValid = false;
    }

    // Email validation
    if (!email.trim()) {
      setEmailError('Email é obrigatório');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email inválido');
      isValid = false;
    }

    // Password validation
    if (!password.trim()) {
      setPasswordError('Senha é obrigatória');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Senha deve ter pelo menos 6 caracteres');
      isValid = false;
    }

    // Confirm password validation
    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Confirmação de senha é obrigatória');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Senhas não coincidem');
      isValid = false;
    }

    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      await register(name.trim(), email.trim(), password);
      Alert.alert('Sucesso', 'Conta criada com sucesso!', [
        { text: 'OK', onPress: () => navigation.replace('Home') }
      ]);
    } catch (error) {
      if (error instanceof ApiError) {
        Alert.alert('Erro de Cadastro', error.message);
      } else {
        Alert.alert('Erro', 'Ocorreu um erro inesperado. Tente novamente.');
      }
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: theme.spacing.lg,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.xl,
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
    button: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
      paddingVertical: theme.spacing.md,
      marginTop: theme.spacing.lg,
      alignItems: 'center',
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
    linkButton: {
      marginTop: theme.spacing.lg,
      alignItems: 'center',
    },
    linkText: {
      color: theme.colors.primary,
      fontSize: 16,
    },
  });

  return (
    <View style={styles.container}>
      <ApiStatus />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Cadastrar</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={[styles.input, nameError ? styles.inputError : null]}
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (nameError) setNameError('');
            }}
            placeholder="Digite seu nome"
            placeholderTextColor={theme.colors.textSecondary}
            autoCapitalize="words"
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, emailError ? styles.inputError : null]}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (emailError) setEmailError('');
            }}
            placeholder="Digite seu email"
            placeholderTextColor={theme.colors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={[styles.input, passwordError ? styles.inputError : null]}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (passwordError) setPasswordError('');
            }}
            placeholder="Digite sua senha"
            placeholderTextColor={theme.colors.textSecondary}
            secureTextEntry
            autoCapitalize="none"
          />
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirmar Senha</Text>
          <TextInput
            style={[styles.input, confirmPasswordError ? styles.inputError : null]}
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (confirmPasswordError) setConfirmPasswordError('');
            }}
            placeholder="Confirme sua senha"
            placeholderTextColor={theme.colors.textSecondary}
            secureTextEntry
            autoCapitalize="none"
          />
          {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading ? styles.buttonDisabled : null]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Cadastrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.linkText}>Já tem conta? Faça login</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default RegisterScreen;