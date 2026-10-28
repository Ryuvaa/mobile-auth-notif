import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { apiFetch } from './api';

// 1. Konfigurasi agar notifikasi tampil saat aplikasi terbuka
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// 2. Fungsi Registrasi Token & Channel
export async function registerForPushNotificationsAsync() {
  let token;

  // Wajib untuk Android agar notifikasi bisa muncul melayang (Heads-up)
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  // Minta izin akses notifikasi
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    alert('Izin notifikasi ditolak!');
    return;
  }

  // Ambil Push Token
  try {
   const pushTokenData = await Notifications.getExpoPushTokenAsync({
  projectId: '471f0ee6-4b9c-47d3-8042-d9844abe760c',
});
    token = pushTokenData.data;
    console.log('Expo Push Token baru:', token);
  } catch (error) {
    console.error('Gagal mengambil token:', error);
  }

  return token;
}

export function simpanPushToken(token, expoPushToken) {
  return apiFetch('/notifications/token', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ expoPushToken }),
  });
}

export function kirimNotifikasiUji(token) {
  return apiFetch('/notifications/test', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}