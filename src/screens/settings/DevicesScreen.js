// src/screens/settings/DevicesScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';

// Mock data – replace with real data from Firebase
const MOCK_DEVICES = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    location: 'Addis Ababa, Ethiopia',
    lastActive: 'Now',
    isCurrent: true,
  },
  {
    id: '2',
    name: 'MacBook Pro',
    location: 'Addis Ababa, Ethiopia',
    lastActive: '2 hours ago',
    isCurrent: false,
  },
  {
    id: '3',
    name: 'Chrome (Windows)',
    location: 'Addis Ababa, Ethiopia',
    lastActive: 'Yesterday, 4:30 PM',
    isCurrent: false,
  },
  {
    id: '4',
    name: 'Samsung Galaxy S23',
    location: 'Addis Ababa, Ethiopia',
    lastActive: '2 days ago',
    isCurrent: false,
  },
];

export default function DevicesScreen({ navigation }) {
  const { theme, isDark } = useTheme();
  const [devices, setDevices] = useState(MOCK_DEVICES);

  const bgColor = theme?.background || '#0a0e1a';
  const textColor = theme?.textPrimary || '#ffffff';
  const secondaryText = theme?.textSecondary || '#a0a0b0';
  const borderColor = theme?.border || 'rgba(255,255,255,0.08)';
  const cardColor = theme?.surface || 'rgba(255,255,255,0.06)';
  const brandColor = theme?.primary || '#1a4b8c';
  const accentColor = theme?.secondary || '#6c5ce7';
  const goldAccent = theme?.accent || '#de994a';

  const handleRevoke = (deviceId) => {
    Alert.alert(
      'Revoke Session',
      'Are you sure you want to revoke this session? You will be logged out on that device.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Revoke', style: 'destructive', onPress: () => {
            setDevices(prev => prev.filter(device => device.id !== deviceId));
          }
        },
      ]
    );
  };

  const handleLogoutAll = () => {
    Alert.alert(
      'Log Out All Devices',
      'This will log you out of all devices except this one.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out All', style: 'destructive', onPress: () => {
            // Keep only the current device
            setDevices(prev => prev.filter(device => device.isCurrent));
          }
        },
      ]
    );
  };

  const renderDeviceItem = (device) => {
    const isCurrent = device.isCurrent;
    return (
      <View key={device.id} style={[styles.deviceItem, { borderBottomColor: borderColor }]}>
        <View style={styles.deviceLeft}>
          <View style={[styles.deviceIcon, { backgroundColor: isCurrent ? brandColor + '20' : 'rgba(255,255,255,0.05)' }]}>
            <Ionicons
              name={
                device.name.includes('iPhone') || device.name.includes('Samsung') ? 'phone-portrait-outline' :
                device.name.includes('MacBook') ? 'laptop-outline' :
                'desktop-outline'
              }
              size={22}
              color={isCurrent ? brandColor : secondaryText}
            />
          </View>
          <View style={styles.deviceInfo}>
            <Text style={[styles.deviceName, { color: textColor }]}>{device.name}</Text>
            <Text style={[styles.deviceLocation, { color: secondaryText }]}>{device.location}</Text>
            <Text style={[styles.deviceLastActive, { color: secondaryText }]}>
              Last active: {device.lastActive}
            </Text>
          </View>
        </View>
        <View style={styles.deviceRight}>
          {isCurrent && (
            <View style={[styles.currentBadge, { backgroundColor: brandColor }]}>
              <Text style={styles.currentBadgeText}>Current</Text>
            </View>
          )}
          {!isCurrent && (
            <TouchableOpacity
              style={[styles.revokeBtn, { borderColor: borderColor }]}
              onPress={() => handleRevoke(device.id)}
              activeOpacity={0.7}
            >
              <Text style={[styles.revokeText, { color: accentColor }]}>Revoke</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

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
        <Text style={[styles.headerTitle, { color: textColor }]}>Devices</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.infoCard, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <Ionicons name="devices-outline" size={18} color={goldAccent} style={styles.infoIcon} />
          <Text style={[styles.infoText, { color: secondaryText }]}>
            Manage your active sessions. Revoke any device you don't recognize.
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <Text style={[styles.cardTitle, { color: secondaryText }]}>Active Devices</Text>
          {devices.map(renderDeviceItem)}
        </View>

        <TouchableOpacity style={[styles.logoutAllBtn, { borderColor: borderColor }]} onPress={handleLogoutAll}>
          <Ionicons name="log-out-outline" size={18} color="#c0392b" style={{ marginRight: 8 }} />
          <Text style={[styles.logoutAllText, { color: '#c0392b' }]}>Log Out All Devices</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButton: { padding: 4, width: 40 },
  headerTitle: { fontSize: 20, fontWeight: '700', flex: 1, textAlign: 'center' },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 16,
  },
  infoIcon: { marginRight: 10 },
  infoText: { flex: 1, fontSize: 13, lineHeight: 18, opacity: 0.7 },

  card: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    paddingTop: 6,
    opacity: 0.6,
  },

  deviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  deviceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deviceInfo: { flex: 1 },
  deviceName: { fontSize: 15, fontWeight: '500' },
  deviceLocation: { fontSize: 13, opacity: 0.7 },
  deviceLastActive: { fontSize: 12, opacity: 0.5, marginTop: 2 },
  deviceRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentBadgeText: { color: '#ffffff', fontSize: 11, fontWeight: '600' },
  revokeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  revokeText: { fontSize: 13, fontWeight: '600' },
  logoutAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  logoutAllText: { fontSize: 15, fontWeight: '600' },
});