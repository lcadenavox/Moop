import React, { useMemo } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n';
import { useTheme } from '../contexts/ThemeContext';

const langs = [
  { code: 'pt', label: 'PT' },
  { code: 'es', label: 'ES' },
];

const LanguageSwitcher: React.FC = () => {
  const { theme } = useTheme();
  const current = i18n.language?.slice(0, 2) || 'pt';

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: 'row',
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.sm,
          borderWidth: 1,
          borderColor: theme.colors.border,
          overflow: 'hidden',
        },
        btn: {
          paddingVertical: theme.spacing.xs,
          paddingHorizontal: theme.spacing.sm,
        },
        label: {
          fontSize: 12,
          fontWeight: '600',
          color: theme.colors.text,
        },
        active: {
          backgroundColor: theme.colors.primary,
        },
        activeLabel: {
          color: 'white',
        },
      }),
    [theme],
  );

  return (
    <View style={styles.container}>
      {langs.map((l) => {
        const active = current === l.code;
        return (
          <TouchableOpacity
            key={l.code}
            style={[styles.btn, active && styles.active]}
            onPress={async () => {
              await i18n.changeLanguage(l.code);
              try {
                await AsyncStorage.setItem('lang', l.code);
              } catch {
                // ignore persistence failure
              }
            }}
            accessibilityLabel={`Switch language to ${l.label}`}
          >
            <Text style={[styles.label, active && styles.activeLabel]}>{l.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default LanguageSwitcher;
