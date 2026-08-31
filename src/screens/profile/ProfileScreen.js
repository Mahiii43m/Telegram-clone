import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Typography from '../../components/Typography';
import { SPACING, RADIUS } from '../../constants/typography';
import { getUserProfile, saveUserProfile } from '../../services/userService';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';

const DEFAULT_AVATAR = require('../../../assets/icon.png');

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { theme, isDark } = useTheme();

  // ─── State ──────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: '',
    researchArea: '',
    division: '',
    profilePicture: null,
  });
  const [notifications, setNotifications] = useState({
    announcements: true,
    training: true,
    research: false,
    events: true,
  });

  // ─── Theme Colors ──────────────────────────────────────────────────────
  const bgColor = theme?.background || '#0a0e1a';
  const textColor = theme?.textPrimary || '#ffffff';
  const secondaryText = theme?.textSecondary || '#a0a0b0';
  const borderColor = theme?.border || 'rgba(255,255,255,0.08)';
  const cardColor = theme?.surface || 'rgba(255,255,255,0.06)';
  const brandColor = theme?.primary || '#1a4b8c';
  const accentColor = theme?.secondary || '#6c5ce7';
  const goldAccent = theme?.accent || '#de994a';

  // ─── Load Profile ──────────────────────────────────────────────────────
  useEffect(() => {
    loadProfile();
    loadNotificationPreferences();
  }, []);

  const loadProfile = async () => {
    try {
      if (!user?.uid) {
        setProfile({
          name: user?.displayName || 'Orbit User',
          email: user?.email || 'orbiting@chat.com',
          bio: '',
          researchArea: '',
          division: '',
          profilePicture: null,
        });
        setLoading(false);
        return;
      }

      const profileData = await getUserProfile(user.uid);
      if (profileData) {
        setProfile({
          name: profileData.name || user?.displayName || 'Orbit User',
          email: profileData.email || user?.email || 'orbiting@chat.com',
          bio: profileData.bio || '',
          researchArea: profileData.researchArea || '',
          division: profileData.division || '',
          profilePicture: profileData.profilePicture || null,
        });
      } else {
        setProfile({
          name: user?.displayName || 'Orbit User',
          email: user?.email || 'orbiting@chat.com',
          bio: '',
          researchArea: '',
          division: '',
          profilePicture: null,
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadNotificationPreferences = async () => {
    try {
      // You can extend this to load from Firestore
      // For now, keep the default values
    } catch (error) {
      console.error('Error loading notification preferences:', error);
    }
  };

  // ─── Profile Picture ──────────────────────────────────────────────────
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera roll permissions to change your avatar.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets?.[0]) {
        const imageUri = result.assets[0].uri;
        await uploadProfilePicture(imageUri);
      }
    } catch (error) {
      console.error('Image pick error:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const uploadProfilePicture = async (imageUri) => {
    if (!user?.uid) return;
    
    setSaving(true);
    try {
      // Convert image to blob
      const response = await fetch(imageUri);
      const blob = await response.blob();

      // Upload to Firebase Storage
      const storageRef = ref(storage, `profile-pictures/${user.uid}`);
      await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(storageRef);

      // Update Firestore
      await saveUserProfile(user.uid, { profilePicture: downloadUrl });

      // Update local state
      setProfile(prev => ({ ...prev, profilePicture: downloadUrl }));
      Alert.alert('Success', 'Profile picture updated!');
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload profile picture.');
    } finally {
      setSaving(false);
    }
  };

  // ─── Notification Toggle ─────────────────────────────────────────────
  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    // Optionally save to Firestore here
  };

  // ─── Render Toggle Item ──────────────────────────────────────────────
  const renderToggleItem = (label, key) => (
    <View style={[styles.toggleRow, { borderBottomColor: borderColor }]}>
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

  // ─── Handlers ──────────────────────────────────────────────────────────
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

  const navigateToEditProfile = () => {
    navigation.navigate('Account');
  };

  // ─── Loading State ────────────────────────────────────────────────────
  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={brandColor} />
          <Typography variant="body" color={secondaryText} style={styles.loadingText}>
            Loading profile...
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Main Render ──────────────────────────────────────────────────────
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
        <TouchableOpacity onPress={navigateToEditProfile} style={styles.editHeaderBtn}>
          <Ionicons name="pencil-outline" size={22} color={accentColor} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ─── Avatar ──────────────────────────────────────────────────── */}
        <TouchableOpacity style={styles.avatarWrapper} onPress={pickImage} disabled={saving}>
          <View style={styles.avatarContainer}>
            {profile.profilePicture ? (
              <Image source={{ uri: profile.profilePicture }} style={styles.avatar} />
            ) : (
              <Image source={DEFAULT_AVATAR} style={styles.avatar} resizeMode="contain" />
            )}
          </View>
          <TouchableOpacity style={styles.editAvatarBtn} onPress={pickImage}>
            <Ionicons name="camera-outline" size={18} color="#ffffff" />
          </TouchableOpacity>
          {saving && (
            <View style={styles.savingOverlay}>
              <ActivityIndicator size="small" color="#ffffff" />
            </View>
          )}
        </TouchableOpacity>

        {/* ─── User Info ──────────────────────────────────────────────── */}
        <View style={styles.userInfo}>
          <Typography variant="heading2" color={textColor}>
            {profile.name || 'Orbit User'}
          </Typography>
          <Typography variant="body" color={secondaryText}>
            {profile.email || 'orbiting@chat.com'}
          </Typography>

          <View style={styles.detailRow}>
            <Ionicons name="flask-outline" size={16} color={accentColor} />
            <Typography variant="caption" color={secondaryText} style={styles.detailText}>
              {profile.researchArea || 'Research Area not set'}
            </Typography>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="layers-outline" size={16} color={accentColor} />
            <Typography variant="caption" color={secondaryText} style={styles.detailText}>
              {profile.division || 'Division not set'}
            </Typography>
          </View>
          {profile.bio ? (
            <View style={styles.detailRow}>
              <Ionicons name="text-outline" size={16} color={accentColor} />
              <Typography variant="caption" color={secondaryText} style={styles.detailText}>
                {profile.bio}
              </Typography>
            </View>
          ) : null}

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

        {/* ─── Organization ───────────────────────────────────────────── */}
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

        {/* ─── Research Interests ────────────────────────────────────── */}
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

        {/* ─── Account Settings ───────────────────────────────────────── */}
        <View style={[styles.optionsCard, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <Typography variant="label" color={secondaryText} style={styles.sectionLabel}>
            ACCOUNT SETTINGS
          </Typography>

          <TouchableOpacity style={[styles.optionItem, { borderBottomColor: borderColor }]} onPress={navigateToEditProfile}>
            <Ionicons name="person-outline" size={22} color={accentColor} style={styles.optionIcon} />
            <Typography variant="body" color={textColor}>Edit Profile</Typography>
            <Ionicons name="chevron-forward-outline" size={18} color={secondaryText} style={styles.optionArrow} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.optionItem, { borderBottomColor: borderColor }]} onPress={() => Alert.alert('Coming Soon', 'Change Password feature coming soon!')}>
            <Ionicons name="key-outline" size={22} color={accentColor} style={styles.optionIcon} />
            <Typography variant="body" color={textColor}>Change Password</Typography>
            <Ionicons name="chevron-forward-outline" size={18} color={secondaryText} style={styles.optionArrow} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.optionItem, { borderBottomColor: borderColor }]} onPress={() => Alert.alert('Coming Soon', 'Publications feature coming soon!')}>
            <Ionicons name="document-text-outline" size={22} color={accentColor} style={styles.optionIcon} />
            <Typography variant="body" color={textColor}>My Publications</Typography>
            <Ionicons name="chevron-forward-outline" size={18} color={secondaryText} style={styles.optionArrow} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.optionItem, { borderBottomColor: borderColor }]} onPress={() => Alert.alert('Coming Soon', 'Group Chats feature coming soon!')}>
            <Ionicons name="people-outline" size={22} color={accentColor} style={styles.optionIcon} />
            <Typography variant="body" color={textColor}>Group Chats</Typography>
            <Ionicons name="chevron-forward-outline" size={18} color={secondaryText} style={styles.optionArrow} />
          </TouchableOpacity>
        </View>

        {/* ─── Notification Preferences ──────────────────────────────── */}
        <View style={[styles.optionsCard, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <Typography variant="label" color={secondaryText} style={styles.sectionLabel}>
            NOTIFICATION PREFERENCES
          </Typography>

          {renderToggleItem('SSGI Announcements', 'announcements')}
          {renderToggleItem('Training & Workshops', 'training')}
          {renderToggleItem('Research Publications', 'research')}
          {renderToggleItem('Events & Conferences', 'events')}
        </View>

        {/* ─── Logout ──────────────────────────────────────────────────── */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={20} color="#ffffff" style={{ marginRight: SPACING.sm }} />
          <Typography variant="body" color="#ffffff" style={styles.logoutText}>Sign Out</Typography>
        </TouchableOpacity>

        {/* ─── Footer ──────────────────────────────────────────────────── */}
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
  editHeaderBtn: { padding: SPACING.sm },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING['2xl'],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: { marginTop: SPACING.md },
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
    width: 100,
    height: 100,
    borderRadius: 50,
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
  savingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  optionIcon: { marginRight: SPACING.md },
  optionArrow: { marginLeft: 'auto' },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
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