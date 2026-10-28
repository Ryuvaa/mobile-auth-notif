import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import {
  registerForPushNotificationsAsync,
  simpanPushToken,
  kirimNotifikasiUji,
} from '../../services/notificationService';


export default function HomeScreen() {
    const { user, token, signOut } = useAuth();

    function aktifkanNotifikasi() {
        Alert.alert('Notifikasi', 'Fitur notifikasi aktif.');
    }

    function testNotifikasi() {
        Alert.alert('Notifikasi', 'Pengujian notifikasi berhasil.');
    }
    async function aktifkanNotifikasi() {
  try {
    if (!token) {
      throw new Error('Sesi login tidak ditemukan. Login ulang.');
    }

    const expoPushToken =
      await registerForPushNotificationsAsync();

    if (!expoPushToken) {
      throw new Error(
        'Expo Push Token belum berhasil diperoleh.'
      );
    }

    await simpanPushToken(token, expoPushToken);

    Alert.alert(
      'Berhasil',
      'Perangkat terdaftar untuk notifikasi.'
    );
  } catch (error) {
    Alert.alert('Gagal', error.message);
    console.error('Registrasi notifikasi gagal:', error.message);
  }
}

async function testNotifikasi() {
  try {
    if (!token) {
      throw new Error('Sesi login tidak ditemukan. Login ulang.');
    }

    const data = await kirimNotifikasiUji(token);

    console.log(
      'Respons pengujian notifikasi:',
      JSON.stringify(data, null, 2)
    );

    Alert.alert('Server', data.pesan || 'Respons diterima.');
  } catch (error) {
    Alert.alert('Gagal', error.message);
    console.error('Pengujian notifikasi gagal:', error.message);
  }
}

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Halo, {user?.nama}</Text>
            <Text>Anda sudah login menggunakan JWT.</Text>
            <Button title="Lihat Profil" onPress={() => router.push('/profile')} />
            <Button title="Aktifkan Notifikasi" onPress={aktifkanNotifikasi} />
            <Button title="Kirim Notifikasi Uji" onPress={testNotifikasi} />
            <Button title="Logout" onPress={signOut} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: 'center', gap: 16 },
    title: { fontSize: 26, fontWeight: '700' },
});