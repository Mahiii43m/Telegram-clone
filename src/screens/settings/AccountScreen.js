// src/screens/settings/AccountScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { saveUserProfile, getUserProfile } from '../../services/userService';
import { updateProfile } from 'firebase/auth';
import { auth } from '../../firebase';

const DEFAULT_AVATAR = require('../../../assets/icon.png');

const RESEARCH_AREAS = [
  'Space Weather',
  'Geospatial Analysis',
  'Satellite Technology',
  'Climate Modeling',
  'Planetary Science',
  'Aeronomy',
  'Magnetism',
  'Remote Sensing',
  'GIS Mapping',
  'Data Science',
];

const DIVISIONS = [
  'Aeronomy',
  'GIS Remote Sensing',
  'Planetary Science',
  'Space Operations',
  'Geospatial Division',
  'Research & Development',
  'Space Science',
];

export default function AccountScreen({ navigation }) {
  const { user } = useAuth();
  const { theme, isDark } = useTheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [staffId, setStaffId] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [researchArea, setResearchArea] = useState('');
  const [division, setDivision] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showResearchModal, setShowResearchModal] = useState(false);
  const [showDivisionModal, setShowDivisionModal] = useState(false);

  const bgColor = theme?.background || '#0a0e1a';
  const textColor = theme?.textPrimary || '#ffffff';
  const secondaryText = theme?.textSecondary || '#a0a0b0';
  const borderColor = theme?.border || 'rgba(255,255,255,0.08)';
  const cardColor = theme?.surface || 'rgba(255,255,255,0.06)';
  const brandColor = theme?.primary || '#1a4b8c';
  const accentColor = theme?.secondary || '#6c5ce7';

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (!user?.uid) {
          setName(user?.displayName || '');
          setEmail(user?.email || '');
          setLoading(false);
          return;
        }

        const profile = await getUserProfile(user.uid);
        if (profile) {
          setName(profile.name || user?.displayName || '');
          setEmail(profile.email || user?.email || '');
          setStaffId(profile.staffId || '');
          setDepartment(profile.department || '');
          setRole(profile.role || '');
          setBio(profile.bio || '');
          setResearchArea(profile.researchArea || '');
          setDivision(profile.division || '');
          setAvatar(profile.avatar || null);
        } else {
          setName(user?.displayName || '');
          setEmail(user?.email || '');
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        setName(user?.displayName || '');
        setEmail(user?.email || '');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const pickImage = async () => {
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
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Error', 'Name and email are required.');
      return;
    }

    setSaving(true);
    try {
      await saveUserProfile(user.uid, {
        name: name.trim(),
        email: email.trim(),
        staffId: staffId.trim(),
        department: department.trim(),
        role: role.trim(),
        bio: bio.trim(),
        researchArea: researchArea.trim(),
        division: division.trim(),
        avatar: avatar || null,
      });

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: name.trim(),
        });
      }

      Alert.alert('Success', 'Profile updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const renderPickerModal = (title, data, selectedValue, onSelect, visible, setVisible) => (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={() => setVisible(false)}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setVisible(false)}>
        <View style={[styles.modalContent, { backgroundColor: isDark ? '#1a1a2e' : '#ffffff' }]}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: textColor }]}>{title}</Text>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Ionicons name="close" size={24} color={secondaryText} />
            </TouchableOpacity>
          </View>

          <View style={[styles.modalDivider, { backgroundColor: borderColor }]} />

          <FlatList
            data={data}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.modalItem,
                  selectedValue === item && [styles.modalItemSelected, { backgroundColor: accentColor + '20', borderColor: accentColor }],
                ]}
                onPress={() => {
                  onSelect(item);
                  setVisible(false);
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.modalItemText,
                    { color: selectedValue === item ? accentColor : textColor },
                    selectedValue === item && styles.modalItemTextSelected,
                  ]}
                >
                  {item}
                </Text>
                {selectedValue === item && (
                  <Ionicons name="checkmark-circle" size={22} color={accentColor} />
                )}
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.modalList}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={brandColor} />
          <Text style={[styles.loadingText, { color: secondaryText }]}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <LinearGradient
        colors={isDark ? ['#0a0e1a', '#1a2a4a'] : ['#f5f3ff', '#e0d5ff']}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back-outline" size={28} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Account</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving} style={styles.saveButton}>
          <Text style={[styles.saveText, { color: brandColor, opacity: saving ? 0.5 : 1 }]}>
            {saving ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Avatar */}
        <TouchableOpacity style={styles.avatarWrapper} onPress={pickImage}>
          <View style={styles.avatarContainer}>
            <Image
              source={avatar ? { uri: avatar } : DEFAULT_AVATAR}
              style={styles.avatar}
              resizeMode="cover"
            />
            <View style={styles.editAvatarBtn}>
              <Ionicons name="camera-outline" size={18} color="#ffffff" />
            </View>
          </View>
          <Text style={[styles.changePhotoText, { color: secondaryText }]}>Tap to change photo</Text>
        </TouchableOpacity>

        {/* Form */}
        <View style={[styles.formCard, { backgroundColor: cardColor, borderColor: borderColor }]}>
          {/* Staff ID */}
          <View style={styles.formGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="id-card-outline" size={16} color={accentColor} />
              <Text style={[styles.label, { color: secondaryText }]}>Staff ID</Text>
            </View>
            <TextInput
              style={[styles.input, { color: textColor, borderBottomColor: borderColor }]}
              value={staffId}
              onChangeText={setStaffId}
              placeholder="e.g., SSGI-2025-001"
              placeholderTextColor={secondaryText}
            />
          </View>

          {/* Name */}
          <View style={styles.formGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="person-outline" size={16} color={accentColor} />
              <Text style={[styles.label, { color: secondaryText }]}>Full Name</Text>
            </View>
            <TextInput
              style={[styles.input, { color: textColor, borderBottomColor: borderColor }]}
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              placeholderTextColor={secondaryText}
            />
          </View>

          {/* Email */}
          <View style={styles.formGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="mail-outline" size={16} color={accentColor} />
              <Text style={[styles.label, { color: secondaryText }]}>Email</Text>
            </View>
            <TextInput
              style={[styles.input, { color: textColor, borderBottomColor: borderColor }]}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={secondaryText}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Department */}
          <View style={styles.formGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="business-outline" size={16} color={accentColor} />
              <Text style={[styles.label, { color: secondaryText }]}>Department</Text>
            </View>
            <TextInput
              style={[styles.input, { color: textColor, borderBottomColor: borderColor }]}
              value={department}
              onChangeText={setDepartment}
              placeholder="e.g., Geospatial Division"
              placeholderTextColor={secondaryText}
            />
          </View>

          {/* Role / Title */}
          <View style={styles.formGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="briefcase-outline" size={16} color={accentColor} />
              <Text style={[styles.label, { color: secondaryText }]}>Role / Title</Text>
            </View>
            <TextInput
              style={[styles.input, { color: textColor, borderBottomColor: borderColor }]}
              value={role}
              onChangeText={setRole}
              placeholder="e.g., Geospatial Analyst"
              placeholderTextColor={secondaryText}
            />
          </View>

          {/* Research Area */}
          <TouchableOpacity style={styles.formGroup} onPress={() => setShowResearchModal(true)} activeOpacity={0.7}>
            <View style={styles.labelRow}>
              <Ionicons name="flask-outline" size={16} color={accentColor} />
              <Text style={[styles.label, { color: secondaryText }]}>Research Area</Text>
            </View>
            <View style={[styles.pickerField, { borderBottomColor: borderColor }]}>
              <Text style={[styles.pickerText, { color: researchArea ? textColor : secondaryText }]}>
                {researchArea || 'Select research area...'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={secondaryText} />
            </View>
          </TouchableOpacity>

          {/* Division */}
          <TouchableOpacity style={styles.formGroup} onPress={() => setShowDivisionModal(true)} activeOpacity={0.7}>
            <View style={styles.labelRow}>
              <Ionicons name="layers-outline" size={16} color={accentColor} />
              <Text style={[styles.label, { color: secondaryText }]}>Division</Text>
            </View>
            <View style={[styles.pickerField, { borderBottomColor: borderColor }]}>
              <Text style={[styles.pickerText, { color: division ? textColor : secondaryText }]}>
                {division || 'Select division...'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={secondaryText} />
            </View>
          </TouchableOpacity>

          {/* Bio */}
          <View style={styles.formGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="text-outline" size={16} color={accentColor} />
              <Text style={[styles.label, { color: secondaryText }]}>Bio / About Me</Text>
            </View>
            <TextInput
              style={[styles.bioInput, { color: textColor, borderColor: borderColor }]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself..."
              placeholderTextColor={secondaryText}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        <View style={styles.noteContainer}>
          <Ionicons name="information-circle-outline" size={18} color={secondaryText} />
          <Text style={[styles.noteText, { color: secondaryText }]}>
            Changes will be saved to your profile.
          </Text>
        </View>
      </ScrollView>

      {/* Research Area Modal */}
      {renderPickerModal(
        'Select Research Area',
        RESEARCH_AREAS,
        researchArea,
        setResearchArea,
        showResearchModal,
        setShowResearchModal
      )}

      {/* Division Modal */}
      {renderPickerModal(
        'Select Division',
        DIVISIONS,
        division,
        setDivision,
        showDivisionModal,
        setShowDivisionModal
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButton: { padding: 4, width: 40 },
  headerTitle: { fontSize: 20, fontWeight: '700', flex: 1, textAlign: 'center' },
  saveButton: { padding: 8 },
  saveText: { fontSize: 16, fontWeight: '600' },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: { marginTop: 12, fontSize: 16 },
  avatarWrapper: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#6c5ce7',
    overflow: 'hidden',
  },
  avatar: {
    width: 100,
    height: 100,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6c5ce7',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0a0e1a',
  },
  changePhotoText: {
    marginTop: 8,
    fontSize: 13,
    opacity: 0.6,
  },
  formCard: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 14,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  input: {
    borderBottomWidth: 1,
    paddingVertical: 8,
    fontSize: 16,
    paddingLeft: 0,
  },
  pickerField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  pickerText: {
    fontSize: 16,
  },
  bioInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    minHeight: 80,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  noteText: {
    marginLeft: 8,
    fontSize: 13,
    opacity: 0.6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '75%',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalDivider: {
    height: 1,
    marginBottom: 12,
    opacity: 0.3,
  },
  modalList: {
    paddingBottom: 8,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  modalItemSelected: {
    borderWidth: 1,
  },
  modalItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalItemTextSelected: {
    fontWeight: '600',
  },
});