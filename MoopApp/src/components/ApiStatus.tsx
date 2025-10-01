import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import ApiService, { IS_OFFLINE_MODE } from '../services/ApiService';

interface ApiStatusProps {
  onToggleMode?: () => void;
}

const ApiStatus: React.FC<ApiStatusProps> = ({ onToggleMode }) => {
  const { theme } = useTheme();
  const [isOnline, setIsOnline] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const checkApiStatus = async () => {
    setIsChecking(true);
    try {
      if (IS_OFFLINE_MODE) {
        // Em modo offline, não tente chamar rede; marque como offline
        setIsOnline(false);
      } else {
        // Usar ApiService para verificar saúde (simulado em offline)
        const result = await ApiService.get<any>('/health');
        setIsOnline(!!result);
      }
    } catch (error) {
      setIsOnline(false);
    }
    setIsChecking(false);
  };

  useEffect(() => {
    checkApiStatus();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isOnline ? theme.colors.success : theme.colors.warning,
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

  return (
    <View style={styles.container}>
      <Ionicons
        name={isChecking ? 'sync' : isOnline ? 'checkmark-circle' : 'warning'}
        size={16}
        color="white"
        style={styles.icon}
      />
      <Text style={styles.text}>
        {isChecking
          ? 'Verificando API...'
          : isOnline
          ? 'API Online'
          : 'Modo Simulado - API Offline'}
      </Text>
      <TouchableOpacity style={styles.button} onPress={checkApiStatus}>
        <Ionicons name="refresh" size={16} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default ApiStatus;