import { Stack, router } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
// 1. Ubah import ini untuk mengambil fungsi pemanggil token
import { registerForPushNotificationsAsync } from '../services/notificationService';

function Navigator() {
    const { token, loading } = useAuth();

    useEffect(() => {
        if (!loading) {
            if (token) {
                router.replace('/(app)');
            } else {
                router.replace('/sign-in');
            }
        }
    }, [token, loading]);

    if (loading) return null;

    return (
        <Stack>
            <Stack.Protected guard={!token}>
                <Stack.Screen name="sign - in" options={{ title: 'Login' }} />
                <Stack.Screen name="register" options={{ title: 'Daftar' }} />
            </Stack.Protected>
            <Stack.Protected guard={!!token}>
                <Stack.Screen name="(app)" options={{ headerShown: false }} />
            </Stack.Protected>
        </Stack>
    );
}

export default function RootLayout() {
    // 2. Ini kode tambahan untuk memancing token agar muncul di terminal
   useEffect(() => {
        console.log("1. Memulai proses ambil token..."); // Baris detektif 1
        
        registerForPushNotificationsAsync()
            .then(pushToken => {
                console.log("====================================");
                console.log("3. INI TOKENNYA: ", pushToken);
                console.log("====================================");
            })
            .catch(error => {
                console.log("3. ERROR GAGAL AMBIL TOKEN: ", error); // Baris detektif error
            });
    }, []);

    return (
        <AuthProvider>
            <Navigator />
        </AuthProvider>
    );
}