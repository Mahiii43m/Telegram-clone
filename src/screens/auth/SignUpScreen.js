import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  Animated,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { getAuth, signOut } from 'firebase/auth';
import { db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import LogoSVG from '../../assets/images/logo.svg';

const { width, height } = Dimensions.get('window');

export default function SignUpScreen() {
  const navigation = useNavigation();
  const { signup } = useAuth(); // ✅ FIXED: lowercase "signup"

  // ── Form states ──────────────────────────────────────────────
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ── Eye toggles ──────────────────────────────────────────────
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ── Animations ────────────────────────────────────────────────
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  // ── Password requirement states ──────────────────────────────
  const [meetsLength, setMeetsLength] = useState(false);
  const [meetsLowercase, setMeetsLowercase] = useState(false);
  const [meetsUppercase, setMeetsUppercase] = useState(false);
  const [meetsSpecialChar, setMeetsSpecialChar] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // ─── Password checker ──────────────────────────────────────────
  const checkPasswordRequirements = (text) => {
    setPassword(text);
    setMeetsLength(text.length >= 12);
    setMeetsLowercase(/[a-z]/.test(text));
    setMeetsUppercase(/[A-Z]/.test(text));
    setMeetsSpecialChar(/[^A-Za-z0-9]/.test(text));
  };

  const validatePassword = (password) => {
    if (password.length < 12) return 'Password must be at least 12 characters long.';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter.';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter.';
    if (!/[^A-Za-z0-9]/.test(password))
      return 'Password must contain at least one special character (e.g., !@#$%).';
    return null;
  };

  // ─── Sign‑up handler (with console logs) ──────────────────────
  const handleSignUp = async () => {
    const trimmedEmail = email.trim();

    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setError('Please enter a valid phone number (min 10 digits)');
      return;
    }
    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setError('Please enter a valid email address');
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('1. Signing up...');
      const userCredential = await signup(trimmedEmail, password); // ✅ FIXED: lowercase
      const user = userCredential.user;
      console.log('2. User UID:', user.uid);

      console.log('3. Saving to Firestore...');
      await setDoc(doc(db, 'users', user.uid), {
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: trimmedEmail,
        createdAt: new Date().toISOString(),
      });
      console.log('4. Firestore save successful!');

      // Sign out so user goes to Login screen
      const auth = getAuth();
      await signOut(auth);
      console.log('5. Signed out, navigating to Login');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error during sign-up:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password is too weak. Please meet all the requirements above.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address. Please check the format (e.g., example@gmail.com).');
      } else {
        setError(error.message || 'Sign up failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── RequirementItem ──────────────────────────────────────────
  const RequirementItem = ({ met, text }) => (
    <View style={styles.requirementRow}>
      <Text style={[styles.requirementBullet, met ? styles.bulletMet : styles.bulletNotMet]}>
        {met ? '✓' : '*'}
      </Text>
      <Text style={[styles.requirementText, met ? styles.textMet : styles.textNotMet]}>
        {text}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.hillContainer} />
      <Animated.View
        style={[
          styles.contentWrapper,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.logoContainer}>
              <LogoSVG width={200} height={90} />
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.welcomeText}>CREATE ACCOUNT</Text>
              <Text style={styles.appName}>Orbit Chat</Text>
              <Text style={styles.subtitle}>JOIN THE SPACE COMMUNITY</Text>
            </View>

            <View style={styles.formContainer}>
              {/* FULL NAME */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>FULL NAME</Text>
                <TextInput
                  style={[styles.input, error && styles.inputError]}
                  placeholder="Enter your full name"
                  placeholderTextColor="rgba(255,255,255,0.35)"
                  value={fullName}
                  onChangeText={(text) => {
                    setError('');
                    setFullName(text);
                  }}
                  returnKeyType="next"
                />
              </View>

              {/* PHONE */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>PHONE NUMBER</Text>
                <TextInput
                  style={[styles.input, error && styles.inputError]}
                  placeholder="Enter your phone number"
                  placeholderTextColor="rgba(255,255,255,0.35)"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={(text) => {
                    setError('');
                    setPhone(text);
                  }}
                  returnKeyType="next"
                />
              </View>

              {/* EMAIL */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>EMAIL</Text>
                <TextInput
                  style={[styles.input, error && styles.inputError]}
                  placeholder="example@gmail.com"
                  placeholderTextColor="rgba(255,255,255,0.35)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(text) => {
                    setError('');
                    setEmail(text);
                  }}
                  returnKeyType="next"
                />
              </View>

              {/* PASSWORD */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>PASSWORD</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.input, styles.passwordInput, error && styles.inputError]}
                    placeholder="Enter your password"
                    placeholderTextColor="rgba(255,255,255,0.35)"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={checkPasswordRequirements}
                    returnKeyType="next"
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={showPassword ? 'eye' : 'eye-off'}
                      size={24}
                      color="rgba(255,255,255,0.5)"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* PASSWORD REQUIREMENTS */}
              <View style={styles.requirementsContainer}>
                <RequirementItem met={meetsLength} text="At least 12 characters" />
                <RequirementItem met={meetsLowercase} text="At least one lowercase and uppercase letter" />
                <RequirementItem met={meetsSpecialChar} text="At least one special character" />
              </View>

              {/* CONFIRM PASSWORD */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>CONFIRM PASSWORD</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.input, styles.passwordInput, error && styles.inputError]}
                    placeholder="Re-enter your password"
                    placeholderTextColor="rgba(255,255,255,0.35)"
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setError('');
                      setConfirmPassword(text);
                    }}
                    returnKeyType="done"
                    onSubmitEditing={handleSignUp}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={showConfirmPassword ? 'eye' : 'eye-off'}
                      size={24}
                      color="rgba(255,255,255,0.5)"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSignUp}
              disabled={loading}
              activeOpacity={0.7}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
              )}
            </TouchableOpacity>

            {/* SIGN IN LINK */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.signInRow}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.signInText}>Already have an account?</Text>
                <Text style={styles.signInLink}> Sign In</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A1A',
  },
  hillContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: height * 0.52,
    backgroundColor: '#74351e',
    borderTopLeftRadius: height * 0.42,
    borderTopRightRadius: height * 0.42,
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 10,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  textContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.35)',
    textTransform: 'uppercase',
    letterSpacing: 6,
    marginBottom: 2,
  },
  appName: {
    fontSize: 38,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  formContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 6,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  inputError: {
    borderColor: '#FF6B6B',
  },
  passwordContainer: {
    position: 'relative',
    width: '100%',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 14,
    top: 14,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requirementsContainer: {
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  requirementBullet: {
    fontSize: 14,
    marginRight: 10,
    width: 16,
  },
  bulletMet: {
    color: '#4CAF50',
  },
  bulletNotMet: {
    color: '#FF6B6B',
  },
  requirementText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.3)',
  },
  textMet: {
    color: '#4CAF50',
  },
  textNotMet: {
    color: '#FF6B6B',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  button: {
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
    paddingBottom: 10,
  },
  signInRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  signInText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.35)',
  },
  signInLink: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF6B35',
  },
});