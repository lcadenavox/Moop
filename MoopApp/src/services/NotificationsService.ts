import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  if (!Device.isDevice) {
    return { granted: false, error: 'Notificações exigem dispositivo físico' };
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
  // Usa linguagem persistida para mensagens localizadas rápidas sem carregar i18n aqui
  const lang = (await AsyncStorage.getItem('i18n_lang')) || 'pt';

  let titlePt = entity === 'moto' ? 'Nova Moto' : 'Novo Depósito';
  let bodyPt = entity === 'moto'
    ? `Moto ${data.marca ?? ''} ${data.modelo ?? ''} criada com sucesso.`.trim()
    : `Depósito ${data.nome ?? ''} criado com sucesso.`.trim();

  let titleEs = entity === 'moto' ? 'Nueva Moto' : 'Nuevo Depósito';
  let bodyEs = entity === 'moto'
    ? `Moto ${data.marca ?? ''} ${data.modelo ?? ''} creada con éxito.`.trim()
    : `Depósito ${data.nome ?? ''} creado con éxito.`.trim();

  const title = lang === 'es' ? titleEs : titlePt;
  const body = lang === 'es' ? bodyEs : bodyPt;

  // Envia push remota se houver token salvo
  const token = await AsyncStorage.getItem('expoPushToken');
  if (token) {
    await sendTestPush(token, title, body);
  } else {
    // fallback local
    await sendLocalNotification(title, body);
  }
}
