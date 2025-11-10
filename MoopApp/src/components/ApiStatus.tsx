import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import ApiService from '../services/ApiService';

interface ApiStatusProps {
  onToggleMode?: () => void;
}

const ApiStatus: React.FC<ApiStatusProps> = ({ onToggleMode }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [isOnline, setIsOnline] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [authIssue, setAuthIssue] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const checkApiStatus = async () => {
    setIsChecking(true);
    setAuthIssue(false);
    setLastError(null);
    try {
      // Primeiro tenta um endpoint público de health se existir
      try {
        const health = await ApiService.get<any>('/health');
        if (health || health === '') {
          setIsOnline(true);
          setIsChecking(false);
          return;
        }
      } catch (e: any) {
        // Ignora 404 (backend pode não ter /health) e segue para fallback
        if (e?.status && e.status >= 500) {
          // Se servidor respondeu 5xx sabemos que existe, mas está com erro.
          setIsOnline(false);
          setLastError(`${e.status}`);
          setIsChecking(false);
          return;
        }
      }

      // Fallback: usar listagem de depósitos paginada (pode exigir auth)
      try {
        const result = await ApiService.get<any>('/Deposito?page=1&pageSize=1');
        setIsOnline(!!result);
      } catch (err: any) {
        // Se receber 401 ou 403 consideramos API alcançável porém requer login
        if (err?.status === 401 || err?.status === 403) {
          setIsOnline(true);
          setAuthIssue(true);
        } else {
          setIsOnline(false);
          if (err?.status) setLastError(String(err.status));
        }
      }
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkApiStatus();
  }, []);

  // Sem alternância de modo: sempre tenta API real

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
  backgroundColor: isOnline ? (authIssue ? theme.colors.warning : theme.colors.success) : theme.colors.error,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
      margin: theme.spacing.sm,
    },
    icon: {
      marginRight: theme.spacing.sm,
    },
    text: {
      flex: 1,
      color: 'white',
      fontSize: 12,
      fontWeight: '500',
    },
    button: {
      marginLeft: theme.spacing.sm,
      padding: theme.spacing.xs,
    },
    
  });

  // Se offline mostramos nada para não poluir UI. Só mostra se online ou verificando
  if (!isChecking && !isOnline) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Ionicons
        name={isChecking ? 'sync' : authIssue ? 'lock-closed' : 'checkmark-circle'}
        size={16}
        color="white"
        style={styles.icon}
      />
      <Text style={styles.text}>
        {isChecking
          ? t('apiStatus.checking')
          : authIssue
          ? t('apiStatus.authRequired')
          : t('apiStatus.online')}
      </Text>
      <TouchableOpacity style={styles.button} onPress={checkApiStatus}>
        <Ionicons name="refresh" size={16} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default ApiStatus;