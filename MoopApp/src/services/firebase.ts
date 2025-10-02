import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, type Auth } from 'firebase/auth';

// Dynamically load RN persistence (not available on web)
let getReactNativePersistence: any;
try {
	// @ts-ignore
	({ getReactNativePersistence } = require('firebase/auth/react-native'));
} catch {}

// Resolve config from env, expo.extra, or bundled app.json
const env: any = (typeof process !== 'undefined' ? process.env : {}) ?? {};
const pick = (...vals: any[]) => vals.find((v) => typeof v === 'string' && v.length > 0);

function resolveExtra(): any {
	// Newer Expo
	const fromConstants = (Constants as any)?.expoConfig?.extra ?? (Constants as any)?.manifestExtra ?? {};
	// Older Expo/runtime fallbacks (web)
	const fromGlobal1 = (globalThis as any)?.__expo?.manifest?.extra ?? {};
	const fromGlobal2 = (globalThis as any)?.ExpoConfig?.extra ?? {};
	const fromWindow = (typeof window !== 'undefined' && (window as any).__EXPO_CONFIG__?.expoConfig?.extra) || {};
	let fromAppJson = {} as any;
	try {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const appJson = require('../../app.json');
		fromAppJson = appJson?.expo?.extra ?? {};
	} catch {}
	return { ...fromAppJson, ...fromConstants, ...fromGlobal1, ...fromGlobal2, ...fromWindow };
}

const extra = resolveExtra();

let cfg: any = {
	apiKey: pick(env.EXPO_PUBLIC_FIREBASE_API_KEY, extra.FIREBASE_API_KEY),
	authDomain: pick(env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN, extra.FIREBASE_AUTH_DOMAIN),
	projectId: pick(env.EXPO_PUBLIC_FIREBASE_PROJECT_ID, extra.FIREBASE_PROJECT_ID),
	storageBucket: pick(env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET, extra.FIREBASE_STORAGE_BUCKET),
	messagingSenderId: pick(env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, extra.FIREBASE_MESSAGING_SENDER_ID),
	appId: pick(env.EXPO_PUBLIC_FIREBASE_APP_ID, extra.FIREBASE_APP_ID),
	measurementId: pick(env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID, extra.FIREBASE_MEASUREMENT_ID),
};

// Last-resort fallback using provided keys (safe for client apps)
if (!cfg.apiKey && !cfg.appId && !cfg.projectId) {
	cfg = {
		apiKey: 'AIzaSyDKmI_l2GIbvD43APWzRo9I8gR1nPfsm1A',
		authDomain: 'moop-be288.firebaseapp.com',
		projectId: 'moop-be288',
		storageBucket: 'moop-be288.appspot.com',
		messagingSenderId: '1043744156721',
		appId: '1:1043744156721:web:0860ea41b38aea62d13910',
		measurementId: 'G-6BT8D4N4NV',
	};
}

// Guard against missing critical fields that would trigger auth/invalid-api-key
if (!cfg.apiKey || !cfg.appId || !cfg.projectId) {
	throw new Error('Firebase config missing (apiKey/appId/projectId). Check app.json expo.extra or EXPO_PUBLIC_* envs.');
}

const app = getApps().length ? getApp() : initializeApp(cfg as any);

let auth: Auth;
if (getReactNativePersistence) {
  // React Native: initializeAuth must be called before any getAuth(app)
  try {
    auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
  } catch (e) {
    // Fallback to default if initializeAuth already called or not supported
    auth = getAuth(app);
  }
} else {
  // Web/other environments
  auth = getAuth(app);
}

export { app, auth };
