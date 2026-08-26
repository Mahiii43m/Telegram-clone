import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Linking,
  Alert,
  Share,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import Logo from '../../assets/images/logo.svg';

export default function AboutScreen({ navigation }) {
  const { theme, isDark } = useTheme();

  const bgColor = theme?.background || '#0a0e1a';
  const textColor = theme?.textPrimary || '#ffffff';
  const secondaryText = theme?.textSecondary || '#a0a0b0';
  const borderColor = theme?.border || 'rgba(255,255,255,0.08)';
  const cardColor = theme?.surface || 'rgba(255,255,255,0.06)';
  const brandColor = theme?.primary || '#1a4b8c';
  const accentColor = theme?.secondary || '#6c5ce7';
  const goldAccent = theme?.accent || '#de994a';

  const openSSGIWebsite = () => {
    Linking.openURL('https://ssgi.gov.et/').catch(() => {
      Alert.alert('Error', 'Could not open the SSGI website.');
    });
  };

  const shareApp = async () => {
    try {
      await Share.share({
        message:
          '🚀 Orbit Chat – Secure Communication for Space & Geospatial Teams.\n\nBuilt for the Space Science and Geospatial Institute (SSGI).\n\nDownload now: https://orbit-chat.com',
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const rateApp = () => {
    Alert.alert('⭐ Rate Orbit Chat', 'Thank you for using our app!\n\nYour feedback helps us improve.');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back-outline" size={28} color={textColor} />
        </TouchableOpacity>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* ─── Hero Banner ──────────────────────────────────── */}
        <LinearGradient
          colors={isDark ? ['#0a1628', '#3b2a1a'] : ['#1a4b8c', '#f5c842']}
          style={styles.heroBanner}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <View style={styles.orbitalRing} />
          <View style={styles.orbitalRingInner} />

          <View style={styles.heroContent}>
            {/* ✅ Logo now fills the banner – 180×180 */}
            <Logo width={180} height={180} style={styles.appIcon} />
            <Text style={[styles.appName, { color: '#ffffff' }]}>Orbit Chat</Text>
            <Text style={[styles.appVersion, { color: 'rgba(255,255,255,0.8)' }]}>
              Version 1.0.0 • Build 2
            </Text>
            <View style={[styles.ssgiBadge, { backgroundColor: 'rgba(255,215,0,0.2)', borderColor: goldAccent }]}>
              <Text style={[styles.ssgiBadgeText, { color: goldAccent }]}>🛰️ Built for SSGI</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.taglineContainer}>
          <Text style={[styles.tagline, { color: secondaryText }]}>
            Secure Communication for Space & Geospatial Teams
          </Text>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: accentColor + '20', borderColor: accentColor + '40' }]}
            onPress={shareApp}
          >
            <Ionicons name="share-social-outline" size={20} color={accentColor} />
            <Text style={[styles.quickActionText, { color: accentColor }]}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: goldAccent + '20', borderColor: goldAccent + '40' }]}
            onPress={rateApp}
          >
            <Ionicons name="star-outline" size={20} color={goldAccent} />
            <Text style={[styles.quickActionText, { color: goldAccent }]}>Rate</Text>
          </TouchableOpacity>
        </View>

        {/* ─── Unified About Orbit Chat ─────────────────────── */}
        <View style={[styles.aboutCard, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <View style={styles.aboutHeader}>
            <View style={styles.aboutIcon}>
              <Logo width={28} height={28} />
            </View>
            <Text style={[styles.aboutTitle, { color: textColor }]}>About Orbit Chat</Text>
          </View>
          <View style={[styles.aboutDivider, { backgroundColor: borderColor }]} />
          <Text style={[styles.aboutDescription, { color: secondaryText }]}>
            Orbit Chat is a secure, real‑time messaging platform built exclusively for the 
            <Text style={{ color: textColor, fontWeight: '600' }}> Space Science and Geospatial Institute (SSGI)</Text>.
          </Text>
          <Text style={[styles.aboutDescription, { color: secondaryText, marginTop: 8 }]}>
            SSGI is Ethiopia's premier institution for space science and geospatial research,
            leading Africa's space and geospatial sector since its establishment in 2022.
          </Text>
          <Text style={[styles.aboutDescription, { color: secondaryText, marginTop: 8 }]}>
            Orbit Chat enables seamless collaboration among researchers, scientists, and administrators
            through encrypted messaging, department‑based groups, and instant data sharing – all aligned
            with SSGI's mission of innovation, research, and collaboration.
          </Text>

          <TouchableOpacity
            style={[styles.websiteButton, { backgroundColor: brandColor }]}
            onPress={openSSGIWebsite}
            activeOpacity={0.8}
          >
            <Ionicons name="globe-outline" size={18} color="#ffffff" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Visit SSGI Website</Text>
          </TouchableOpacity>
        </View>

        {/* ─── Features Grid ────────────────────────────────── */}
        <View style={[styles.card, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <Text style={[styles.sectionLabel, { color: secondaryText }]}>🚀 Key Features</Text>
          <View style={styles.featuresGrid}>
            {[
              { icon: 'chatbubbles-outline', label: 'Real-time Messaging', color: accentColor },
              { icon: 'lock-closed-outline', label: 'End-to-End Encryption', color: '#34c759' },
              { icon: 'people-outline', label: 'Department Groups', color: '#5ac8fa' },
              { icon: 'moon-outline', label: 'Dark / Light Theme', color: '#ff9f0a' },
              { icon: 'rocket-outline', label: 'Space‑Themed UI', color: '#ff6b8a' },
              { icon: 'cloud-outline', label: 'Cloud Backup', color: '#64d2ff' },
            ].map((item, index) => (
              <View key={index} style={[styles.featureItem, { backgroundColor: 'rgba(255,255,255,0.04)' }]}>
                <View style={[styles.featureIconBg, { backgroundColor: item.color + '20' }]}>
                  <Ionicons name={item.icon} size={18} color={item.color} />
                </View>
                <Text style={[styles.featureLabel, { color: secondaryText }]}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.dividerContainer}>
          <View style={[styles.dividerLine, { backgroundColor: borderColor }]} />
          <Ionicons name="planet-outline" size={20} color={borderColor} style={styles.dividerIcon} />
          <View style={[styles.dividerLine, { backgroundColor: borderColor }]} />
        </View>

        <View style={[styles.creditCard, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <View style={styles.creditRow}>
            <Ionicons name="code-outline" size={18} color={accentColor} />
            <Text style={[styles.creditText, { color: secondaryText }]}>
              Developed by <Text style={{ color: textColor, fontWeight: '600' }}>Orbit Chat Team</Text>
            </Text>
          </View>
          <View style={styles.creditRow}>
            <Ionicons name="server-outline" size={18} color={accentColor} />
            <Text style={[styles.creditText, { color: secondaryText }]}>
              Powered by <Text style={{ color: textColor, fontWeight: '600' }}>Firebase</Text>
            </Text>
          </View>
          <View style={styles.creditRow}>
            <Ionicons name="planet-outline" size={18} color={goldAccent} />
            <Text style={[styles.creditText, { color: secondaryText }]}>
              In partnership with <Text style={{ color: goldAccent, fontWeight: '600' }}>SSGI</Text>
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.copyrightText, { color: secondaryText }]}>
            © {new Date().getFullYear()} Orbit Chat. All rights reserved.
          </Text>
          <Text style={[styles.creditText, { color: secondaryText }]}>
            Built for the Space Science and Geospatial Institute
          </Text>
          <View style={[styles.footerDivider, { backgroundColor: borderColor }]} />
          <Text style={[styles.versionDetail, { color: secondaryText }]}>
            SDK 54.0.0 • React Native 0.74.5
          </Text>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // ─── Header ──────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  backButton: { padding: 4, width: 40 },

  // ─── Hero Banner ──────────────────────────────────────────
  heroBanner: {
    paddingTop: Platform.OS === 'android' ? 8 : 12,
    paddingBottom: 24,
    marginHorizontal: -20,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    position: 'relative',
    overflow: 'hidden',
  },
  orbitalRing: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    transform: [{ rotate: '20deg' }],
  },
  orbitalRingInner: {
    position: 'absolute',
    bottom: -40,
    left: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    transform: [{ rotate: '-15deg' }],
  },
  heroContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  appIcon: {
    width: 180,
    height: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  appVersion: {
    fontSize: 14,
    marginTop: 2,
  },
  ssgiBadge: {
    marginTop: 8,
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  ssgiBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  // ─── Tagline ──────────────────────────────────────────────
  taglineContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  tagline: {
    fontSize: 15,
    textAlign: 'center',
    opacity: 0.7,
    letterSpacing: 0.3,
  },

  // ─── Quick Actions ────────────────────────────────────────
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 1,
  },
  quickActionText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },

  // ─── Unified About Card ──────────────────────────────────
  aboutCard: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#1a4b8c',
  },
  aboutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  aboutIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  aboutDivider: {
    height: 1,
    marginBottom: 12,
    opacity: 0.3,
  },
  aboutDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  websiteButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },

  // ─── Features Card ──────────────────────────────────────
  card: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 6,
  },
  featureIconBg: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  featureLabel: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },

  // ─── Divider ──────────────────────────────────────────────
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerIcon: {
    marginHorizontal: 12,
    opacity: 0.3,
  },

  // ─── Credits ──────────────────────────────────────────────
  creditCard: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  creditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  creditText: {
    fontSize: 14,
    marginLeft: 10,
  },

  // ─── Footer ──────────────────────────────────────────────
  footer: {
    alignItems: 'center',
    marginTop: 4,
  },
  copyrightText: {
    fontSize: 12,
    opacity: 0.5,
  },
  footerDivider: {
    width: 40,
    height: 1,
    marginVertical: 8,
  },
  versionDetail: {
    fontSize: 11,
    opacity: 0.4,
  },
});