export const options = { headerShown: false };

import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform,
} from "react-native";
import { useRouter } from "expo-router";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../../firebase";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!email.trim() || !password.trim() || !confirm.trim()) return "All fields are required";
    const re = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!re.test(email)) return "Email is not valid";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password !== confirm) return "Passwords do not match";
    return "";
  };

  const onRegister = async () => {
    const v = validate();
    if (v) return setErr(v);
    setErr(""); 
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      const local = (email.split("@")[0] || "User").replace(/[._-]+/g, " ");
      await updateProfile(cred.user, { displayName: local });

      router.replace("/(auth)/login");
    } catch (e) {
      setErr(e?.code === "auth/email-already-in-use" ? "Email already exists" : e.message ?? "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const onGoogleRegister = async () => {
    setErr("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
      router.replace("/home");
    } catch (e) {
      setErr(e.message || "Google sign-up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Register with your email</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm password"
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
        />

        {!!err && <Text style={styles.error}>{err}</Text>}

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={onRegister}
          disabled={loading}
        >
          <Text style={styles.primaryText}>{loading ? "Creating..." : "Register"}</Text>
        </TouchableOpacity>

        <View style={{ height: 10 }} />

        <TouchableOpacity
          style={styles.googleBtn}
          onPress={onGoogleRegister}
          disabled={loading}
        >
          <Text style={styles.googleText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace("/(auth)/login")}
          style={{ marginTop: 14 }}
        >
          <Text style={styles.link}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3bee6ff", alignItems: "center", justifyContent: "center", padding: 20 },
  card: { width: "100%", maxWidth: 420, backgroundColor: "white", padding: 22, borderRadius: 16, elevation: 3 },
  title: { fontSize: 26, fontWeight: "800", color: "#8f347dff" },
  subtitle: { color: "#6B7280", marginBottom: 16, marginTop: 2 },
  input: { width: "100%", backgroundColor: "#F9FAFB", borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: "#E5E7EB" },
  primaryBtn: { backgroundColor: "#8f347dff", paddingVertical: 12, borderRadius: 10, alignItems: "center" },
  primaryText: { color: "white", fontWeight: "700" },
  googleBtn: { backgroundColor: "white", borderWidth: 1, borderColor: "#E5E7EB", paddingVertical: 12, borderRadius: 10, alignItems: "center" },
  googleText: { color: "#8f347dff", fontWeight: "700" },
  link: { color: "#191b20ff", fontWeight: "600", textAlign: "center" },
  error: { color: "#DC2626", marginBottom: 6 },
});
