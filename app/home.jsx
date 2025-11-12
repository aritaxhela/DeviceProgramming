import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, KeyboardAvoidingView } from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) router.replace("/(auth)/login");
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/(auth)/login");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.subtitle}>You are logged in.</Text>

        <TouchableOpacity style={styles.primaryBtn} onPress={handleLogout}>
          <Text style={styles.primaryText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3bee6ff", alignItems: "center", justifyContent: "center", padding: 20 },
  card: { width: "100%", maxWidth: 420, backgroundColor: "white", padding: 22, borderRadius: 16, elevation: 3 },
  title: { fontSize: 26, fontWeight: "800", color: "#8f347dff", marginBottom: 8 },
  subtitle: { color: "#6B7280", marginBottom: 16 },
  primaryBtn: { backgroundColor: "#8f347dff", paddingVertical: 12, borderRadius: 10, alignItems: "center" },
  primaryText: { color: "white", fontWeight: "700" },
});
