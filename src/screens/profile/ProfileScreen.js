import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  ScrollView,
  Alert,
  Linking,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Typography from '../../components/Typography';
import { SPACING, RADIUS } from '../../constants/typography';

const PROFILE_IMAGE = require('../../../assets/icon.png');

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { theme, isDark } = useTheme();

  const [notifications, setNotifications] = React.useState({
    announcements: true,
    training: true,
    research: false,
    events: true,
  });

  const bgColor = theme?.background || '#0a0e1a';
  const textColor = theme?.textPrimary || '#ffffff';
  const secondaryText = theme?.textSecondary || '#a0a0b0';
  const borderColor = theme?.border || 'rgba(255,255,255,0.08)';
  const cardColor = theme?.surface || 'rgba(255,255,255,0.06)';
  const brandColor = theme?.primary || '#1a4b8c';
  const accentColor = theme?.secondary || '#6c5ce7';
  const goldAccent = theme?.accent || '#de994a';

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: logout },
      ]
    );
  };

  const openSSGIWebsite = () => {
    Linking.openURL('https://ssgi.gov.et/').catch(() => {
      Alert.alert('Error', 'Could not open the SSGI website.');
    });
  };

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderToggleItem = (label, key) => (
    <View style={styles.toggleRow}>
      <Typography variant="body" color={textColor}>{label}</Typography>
      <Switch
        value={notifications[key]}
        onValueChange={() => toggleNotification(key)}
        trackColor={{ false: '#3a3a5a', true: brandColor }}
        thumbColor={notifications[key] ? '#ffffff' : '#f4f3f4'}
        ios_backgroundColor="#3a3a5a"
      />
    </View>
  );

  const showComingSoon = () => {
    Alert.alert('Coming Soon', 'This feature will be available in a future update.');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <LinearGradient
        colors={isDark ? ['#0a0e1a', '#1a2a4a'] : ['#f5f3ff', '#e0d5ff']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back-outline" size={28} color={textColor} />
        </TouchableOpacity>
        <Typography variant="heading3" color={textColor} style={styles.headerTitle}>
          Profile
        </Typography>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarContainer}>
            <Image source={PROFILE_IMAGE} style={styles.avatar} resizeMode="contain" />
          </View>
          <TouchableOpacity style={styles.editAvatarBtn} onPress={showComingSoon}>
            <Ionicons name="camera-outline" size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <Typography variant="heading2" color={textColor}>
            {user?.name || 'Orbit User'}
          </Typography>
          <Typography variant="body" color={secondaryText}>
            {user?.email || 'orbiting@chat.com'}
          </Typography>

          <View style={styles.detailRow}>
            <Ionicons name="flask-outline" size={16} color={accentColor} />
            <Typography variant="caption" color={secondaryText} style={styles.detailText}>
              Research Area: Space Weather & Geospatial Analysis
            </Typography>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color={accentColor} />
            <Typography variant="caption" color={secondaryText} style={styles.detailText}>
              Member since 2025
            </Typography>
          </View>

          <View style={styles.badgeContainer}>
            <View style={[styles.badge, { backgroundColor: accentColor + '20' }]}>
              <Typography variant="caption" color={accentColor}>SSGI Staff</Typography>
            </View>
            <View style={[styles.badge, { backgroundColor: brandColor + '20' }]}>
              <Typography variant="caption" color={brandColor}>Geospatial Division</Typography>
            </View>
            <View style={[styles.badge, { backgroundColor: goldAccent + '20' }]}>
              <Typography variant="caption" color={goldAccent}>Space Science</Typography>
            </View>
          </View>
        </View>

        {/* Organization */}
        <View style={[styles.organizationCard, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <View style={styles.orgHeader}>
            <Ionicons name="business-outline" size={22} color={goldAccent} />
            <Typography variant="heading3" color={textColor} style={styles.orgTitle}>
              Space Science & Geospatial Institute
            </Typography>
          </View>
          <Typography variant="body" color={secondaryText} style={styles.orgDescription}>
            Leading Africa's space and geospatial sector through research, innovation, and collaboration.
          </Typography>
          <TouchableOpacity style={[styles.orgButton, { backgroundColor: brandColor }]} onPress={openSSGIWebsite}>
            <Ionicons name="globe-outline" size={18} color="#ffffff" style={styles.orgButtonIcon} />
            <Typography variant="body" color="#ffffff" style={styles.orgButtonText}>
              Visit SSGI Website
            </Typography>
          </TouchableOpacity>
        </View>

        {/* Research Interests */}
        <View style={[styles.optionsCard, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <Typography variant="label" color={secondaryText} style={styles.sectionLabel}>
            RESEARCH INTERESTS
          </Typography>
          <View style={styles.tagsContainer}>
            {['Space Weather', 'Geospatial Data', 'Climate Modeling', 'Satellite Technology'].map((tag, index) => (
              <View key={index} style={[styles.tag, { backgroundColor: accentColor + '15' }]}>
                <Typography variant="caption" color={accentColor}>{tag}</Typography>
              </View>
            ))}
          </View>
        </View>

        {/* Account Settings */}
        <View style={[styles.optionsCard, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <Typography variant="label" color={secondaryText} style={styles.sectionLabel}>
            ACCOUNT SETTINGS
          </Typography>

          <TouchableOpacity style={styles.optionItem} activeOpacity={0.6} onPress={showComingSoon}>
            <Ionicons name="person-outline" size={22} color={accentColor} style={styles.optionIcon} />
            <Typography variant="body" color={textColor}>Edit Profile</Typography>
            <Ionicons name="chevron-forward-outline" size={18} color={secondaryText} style={styles.optionArrow} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem} activeOpacity={0.6} onPress={showComingSoon}>
            <Ionicons name="key-outline" size={22} color={accentColor} style={styles.optionIcon} />
            <Typography variant="body" color={textColor}>Change Password</Typography>
            <Ionicons name="chevron-forward-outline" size={18} color={secondaryText} style={styles.optionArrow} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem} activeOpacity={0.6} onPress={showComingSoon}>
            <Ionicons name="document-text-outline" size={22} color={accentColor} style={styles.optionIcon} />
            <Typography variant="body" color={textColor}>My Publications</Typography>
            <Ionicons name="chevron-forward-outline" size={18} color={secondaryText} style={styles.optionArrow} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem} activeOpacity={0.6} onPress={showComingSoon}>
            <Ionicons name="people-outline" size={22} color={accentColor} style={styles.optionIcon} />
            <Typography variant="body" color={textColor}>Group Chats</Typography>
            <Ionicons name="chevron-forward-outline" size={18} color={secondaryText} style={styles.optionArrow} />
          </TouchableOpacity>
        </View>

        {/* Notification Preferences */}
        <View style={[styles.optionsCard, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <Typography variant="label" color={secondaryText} style={styles.sectionLabel}>
            NOTIFICATION PREFERENCES
          </Typography>

          {renderToggleItem('SSGI Announcements', 'announcements')}
          {renderToggleItem('Training & Workshops', 'training')}
          {renderToggleItem('Research Publications', 'research')}
          {renderToggleItem('Events & Conferences', 'events')}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={20} color="#ffffff" style={{ marginRight: SPACING.sm }} />
          <Typography variant="body" color="#ffffff" style={styles.logoutText}>Sign Out</Typography>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Typography variant="caption" color={secondaryText} style={styles.footerText}>
            Orbit Chat v1.0.0
          </Typography>
          <Typography variant="caption" color={secondaryText} style={styles.footerSubtext}>
            Secure Communication for Space & Geospatial Teams
          </Typography>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  backButton: { padding: SPACING.xs, width: 40 },
  headerTitle: { flex: 1, textAlign: 'center' },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING['2xl'],
  },
  avatarWrapper: {
    position: 'relative',
    marginTop: SPACING.lg,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#6c5ce7',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6c5ce7',
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0a0e1a',
  },
  userInfo: {
    alignItems: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
    width: '100%',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  detailText: {
    marginLeft: SPACING.xs,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginTop: SPACING.sm,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.lg,
    marginHorizontal: SPACING.xs,
    marginVertical: SPACING.xs,
  },
  organizationCard: {
    width: '100%',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  orgHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  orgTitle: {
    marginLeft: SPACING.sm,
  },
  orgDescription: {
    lineHeight: 18,
    marginBottom: SPACING.md,
  },
  orgButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  orgButtonIcon: {
    marginRight: SPACING.sm,
  },
  orgButtonText: {
    fontWeight: '600',
  },
  optionsCard: {
    width: '100%',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    paddingHorizontal: SPACING.sm,
    marginBottom: SPACING.md,
  },
  sectionLabel: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    letterSpacing: 1,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  optionIcon: { marginRight: SPACING.md },
  optionArrow: { marginLeft: 'auto' },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  tag: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.lg,
    marginRight: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: SPACING.base,
    backgroundColor: '#c0392b',
    borderRadius: RADIUS.md,
    marginTop: SPACING.sm,
  },
  logoutText: { fontWeight: '600' },
  footer: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  footerText: { opacity: 0.5 },
  footerSubtext: { opacity: 0.3, marginTop: SPACING.xs },
});
