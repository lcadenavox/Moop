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

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateForm = (): boolean => {
    let isValid = true;

    // Reset errors
    setEmailError('');
    setPasswordError('');

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

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      await login(email, password);
      navigation.replace('Home');
    } catch (error) {
      if (error instanceof ApiError) {
        Alert.alert('Erro de Login', error.message);
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
    testCredentials: {
      marginTop: theme.spacing.xl,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    testCredentialsTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    testCredentialsText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.xs,
    },
    fillTestButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.sm,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      marginTop: theme.spacing.sm,
    },
    fillTestButtonText: {
      color: 'white',
      fontSize: 12,
      fontWeight: '500',
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <ApiStatus />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Entrar</Text>

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

        <TouchableOpacity
          style={[styles.button, isLoading ? styles.buttonDisabled : null]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.linkText}>Não tem conta? Cadastre-se</Text>
        </TouchableOpacity>

        <View style={styles.testCredentials}>
          <Text style={styles.testCredentialsTitle}>Credenciais de Teste:</Text>
          <Text style={styles.testCredentialsText}>Email: teste@moop.com</Text>
          <Text style={styles.testCredentialsText}>Senha: 123456</Text>
          <TouchableOpacity
            style={styles.fillTestButton}
            onPress={() => {
              setEmail('teste@moop.com');
              setPassword('123456');
            }}
          >
            <Text style={styles.fillTestButtonText}>Preencher Automaticamente</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default LoginScreen;