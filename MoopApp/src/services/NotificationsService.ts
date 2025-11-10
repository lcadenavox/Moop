import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Alert } from 'react-native';

export interface PushRegistrationResult {
  granted: boolean;
  token?: string;
  error?: string;
}

// Configure notification presentation behavior when app is foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function resolveProjectId(): string | undefined {
  const cfg: any = (Constants as any)?.expoConfig ?? (Constants as any)?.manifest ?? {};
  // EAS projectId is stored under extra.eas.projectId when configured
  const extra = (cfg.extra as any) || {};
  const eas = extra.eas || {};
  return eas.projectId;
}

async function getExpoPushToken(): Promise<string | undefined> {
  try {
    const projectId = resolveProjectId();
    // getExpoPushTokenAsync requires projectId in SDK 49+
    const res = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined,
    );
    return res.data;
  } catch (e: any) {
    console.warn('Expo push token error:', e?.message || e);
    return undefined;
  }
}

export async function registerForPushNotifications(): Promise<PushRegistrationResult> {
  // Em ambiente web ou simulador sem Device real, evitamos pedir permissão (gera warning) e usamos fallback.
  if (!Device.isDevice || Platform.OS === 'web') {
    return { granted: false, error: 'Web/simulador: push remoto indisponível, usando fallback local.' };
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    return { granted: false, error: 'Permissão de notificação negada' };
  }

  const token = await getExpoPushToken();
  if (token) {
    await AsyncStorage.setItem('expoPushToken', token);
  }
  return { granted: true, token };
}

export async function sendTestPush(token: string, title: string, body: string) {
  // Send via Expo Push API for demo purposes
  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: token,
      sound: 'default',
      title,
      body,
    }),
  });
}

export async function sendLocalNotification(title: string, body: string) {
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: null, // imediato
  });
}

export async function notifyCreation(entity: 'moto' | 'deposito', data: { nome?: string; marca?: string; modelo?: string }) {
  // Recupera idioma salvo corretamente (chave 'lang' usada no App.tsx)
  const lang = (await AsyncStorage.getItem('lang')) || 'pt';

  // Mensagens localizadas básicas (mantém chaves para futura integração com i18n se desejado)
  const templates = {
    pt: {
      motoTitle: 'Nova Moto',
      motoBody: `Moto ${data.marca ?? ''} ${data.modelo ?? ''} criada com sucesso.`.trim(),
      depositoTitle: 'Novo Depósito',
      depositoBody: `Depósito ${data.nome ?? ''} criado com sucesso.`.trim(),
    },
    es: {
      motoTitle: 'Nueva Moto',
      motoBody: `Moto ${data.marca ?? ''} ${data.modelo ?? ''} creada con éxito.`.trim(),
      depositoTitle: 'Nuevo Depósito',
      depositoBody: `Depósito ${data.nome ?? ''} creado con éxito.`.trim(),
    },
  };
  const tpl = lang === 'es' ? templates.es : templates.pt;
  const title = entity === 'moto' ? tpl.motoTitle : tpl.depositoTitle;
  const body = entity === 'moto' ? tpl.motoBody : tpl.depositoBody;

  // Se ambiente web, usar alerta simples (push remoto indisponível)
  if (Platform.OS === 'web') {
    Alert.alert(title, body);
    return;
  }

  const token = await AsyncStorage.getItem('expoPushToken');
  if (token) {
    try {
      await sendTestPush(token, title, body);
    } catch {
      await sendLocalNotification(title, body);
    }
  } else {
    await sendLocalNotification(title, body);
  }
}
