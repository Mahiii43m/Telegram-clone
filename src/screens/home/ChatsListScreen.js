import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Platform,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// ─── Full Mock Data ──────────────────────────────────────────────────────────
const INITIAL_CHATS = [
  // 📌 PINNED
  {
    id: 'pinned1',
    name: 'SSGI Announcements',
    department: 'All Staff',
    message: '🚨 New: Digital Addressing System eDAS launched',
    time: '10:30 AM',
    type: 'department',
    unread: 0,
    isAdmin: true,
    isUrgent: true,
    pinned: true,
    hasFiles: true,
    encrypted: true,
    departmentTag: 'announcement',
    groupDetails: {
      name: 'SSGI Announcements',
      description: 'Official announcements from the Space Science and Geospatial Institute',
      leader: 'Director General',
      members: [
        { name: 'Director General', role: 'Admin' },
        { name: 'Dr. Alene', role: 'Geology Dept Head' },
        { name: 'Amina Mohammed', role: 'Geospatial Division Chief' },
      ],
    },
  },
  // 🌍 GEOSPATIAL DIVISION
  {
    id: 'geo1',
    name: 'Geology Department',
    department: 'Geospatial Division',
    message: 'Dr. Alene (Admin): upload terrain reports by 4 PM.',
    time: '11:45 AM',
    type: 'department',
    unread: 2,
    isAdmin: true,
    isUrgent: false,
    pinned: false,
    hasFiles: true,
    encrypted: true,
    departmentTag: 'geospatial',
    groupDetails: {
      name: 'Geology Department',
      description: 'Space Science and Geospatial Institute — Geology Exploration Team',
      leader: 'Dr. Alene',
      members: [
        { name: 'Dr. Alene', role: 'Geology Dept Head & Admin' },
        { name: 'Natan Ethiopia', role: 'Staff Geologist' },
        { name: 'Sara Tekle', role: 'Geospatial Analyst' },
        { name: 'Abebe Kebede', role: 'Survey Technician' },
      ],
    },
  },
  {
    id: 'geo2',
    name: 'Geospatial Division',
    department: 'Geospatial Division',
    message: 'Amina (Admin): coordinate data updated.',
    time: 'Yesterday',
    type: 'department',
    unread: 0,
    isAdmin: true,
    isUrgent: false,
    pinned: false,
    hasFiles: false,
    encrypted: true,
    departmentTag: 'geospatial',
    groupDetails: {
      name: 'Geospatial Division',
      description: 'SSGI — Mapping, Cartography & GIS Remote Sensing Staff',
      leader: 'Amina Mohammed',
      members: [
        { name: 'Amina Mohammed', role: 'Division Chief & Admin' },
        { name: 'Yared Tesfaye', role: 'GIS Coordinator' },
        { name: 'Helen Yohannes', role: 'Remote Sensing Expert' },
      ],
    },
  },
  {
    id: 'geo3',
    name: 'Survey & Mapping Team',
    department: 'Geospatial Division',
    message: 'Ground survey completed at coordinates 9.03°N 38.74°E.',
    time: 'Yesterday',
    type: 'department',
    unread: 3,
    isAdmin: false,
    isUrgent: false,
    pinned: false,
    hasFiles: true,
    encrypted: true,
    departmentTag: 'geospatial',
    groupDetails: {
      name: 'Survey & Mapping Team',
      description: 'SSGI — On‑site survey and mapping operations',
      leader: 'Sara Tekle',
      members: [
        { name: 'Sara Tekle', role: 'Team Lead' },
        { name: 'Abebe Kebede', role: 'Survey Technician' },
      ],
    },
  },
  // 🛰️ SPACE SCIENCE
  {
    id: 'space1',
    name: 'Space Operations',
    department: 'Space Science',
    message: 'Dir. Kassa (Admin): launch checklist ready.',
    time: '11:42 AM',
    type: 'department',
    unread: 5,
    isAdmin: true,
    isUrgent: true,
    pinned: false,
    hasFiles: false,
    encrypted: true,
    departmentTag: 'space',
    groupDetails: {
      name: 'Space Operations',
      description: 'SSGI — Orbital Launch and Telemetry Coordination Division',
      leader: 'Director Kassa',
      members: [
        { name: 'Director Kassa', role: 'Operations Head & Admin' },
        { name: 'Eshatu Tola', role: 'Communications Engineer' },
        { name: 'Biniam Yosef', role: 'Orbit Analyst' },
      ],
    },
  },
  {
    id: 'space2',
    name: 'Space Weather Team',
    department: 'Space Science',
    message: 'Dr. Tadesse: Solar flare data incoming.',
    time: '09:10 AM',
    type: 'department',
    unread: 1,
    isAdmin: false,
    isUrgent: false,
    pinned: false,
    hasFiles: true,
    encrypted: true,
    departmentTag: 'space',
    groupDetails: {
      name: 'Space Weather Team',
      description: 'SSGI — Solar and space weather monitoring',
      leader: 'Dr. Tadesse',
      members: [
        { name: 'Dr. Tadesse', role: 'Lead Scientist' },
        { name: 'Hanna Mulu', role: 'Researcher' },
      ],
    },
  },
  // 🔬 RESEARCH
  {
    id: 'research1',
    name: 'Geophysical Research',
    department: 'Research',
    message: 'Seismic data analysis complete. Paper draft ready.',
    time: 'Yesterday',
    type: 'department',
    unread: 2,
    isAdmin: false,
    isUrgent: false,
    pinned: false,
    hasFiles: true,
    encrypted: true,
    departmentTag: 'research',
    groupDetails: {
      name: 'Geophysical Research',
      description: 'SSGI — Advanced geophysical studies and publications',
      leader: 'Dr. Lemma',
      members: [
        { name: 'Dr. Lemma', role: 'Principal Investigator' },
        { name: 'Tigist Hailu', role: 'Data Analyst' },
      ],
    },
  },
  // 📡 OPERATIONS
  {
    id: 'ops1',
    name: 'Telemetry Monitoring',
    department: 'Operations',
    message: 'The telemetry readings are stable.',
    time: '11:42 AM',
    type: 'department',
    unread: 0,
    isAdmin: false,
    isUrgent: false,
    pinned: false,
    hasFiles: false,
    encrypted: true,
    departmentTag: 'operations',
    groupDetails: {
      name: 'Telemetry Monitoring',
      description: 'SSGI — Real‑time telemetry and data streams',
      leader: 'Eshatu Tola',
      members: [
        { name: 'Eshatu Tola', role: 'Lead Engineer' },
        { name: 'Biniam Yosef', role: 'Orbit Analyst' },
      ],
    },
  },
  // SUPPORT
  {
    id: 'support1',
    name: 'Orbit Chat Support',
    department: 'Support',
    message: 'Welcome to your premium orbital terminal.',
    time: 'Yesterday',
    type: 'chats',
    unread: 0,
    isAdmin: false,
    isUrgent: false,
    pinned: false,
    hasFiles: false,
    encrypted: true,
    departmentTag: 'support',
  },
  // PERSONAL
  {
    id: 'personal1',
    name: 'Natan Ethiopia',
    department: 'Personal',
    message: 'The telemetry readings are stable.',
    time: '11:42 AM',
    type: 'chats',
    unread: 0,
    isAdmin: false,
    isUrgent: false,
    pinned: false,
    hasFiles: false,
    encrypted: true,
    departmentTag: 'personal',
  },
  {
    id: 'personal2',
    name: 'Dr. Alene',
    department: 'Personal',
    message: 'Meeting scheduled for tomorrow at 10 AM.',
    time: '09:10 AM',
    type: 'chats',
    unread: 1,
    isAdmin: false,
    isUrgent: false,
    pinned: false,
    hasFiles: false,
    encrypted: true,
    departmentTag: 'personal',
  },
];

// ─── Department Tabs ────────────────────────────────────────────────────────
const DEPARTMENT_TABS = [
  { id: 'all', label: 'All', icon: 'planet-outline' },
  { id: 'space', label: 'Space Science', icon: 'rocket-outline' },
  { id: 'geospatial', label: 'Geospatial', icon: 'map-outline' },
  { id: 'research', label: 'Research', icon: 'flask-outline' },
  { id: 'operations', label: 'Operations', icon: 'radio-outline' },
];

// ─── Main Component ──────────────────────────────────────────────────────────
export default function ChatsListScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { theme, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const searchInputRef = useRef(null);

  const bgColor = theme?.background || '#0a0e1a';
  const textColor = theme?.textPrimary || '#ffffff';
  const secondaryText = theme?.textSecondary || '#a0a0b0';
  const cardColor = theme?.surface || 'rgba(255,255,255,0.06)';
  const brandColor = theme?.primary || '#1a4b8c';
  const accentColor = theme?.secondary || '#6c5ce7';
  const goldAccent = theme?.accent || '#de994a';
  const borderColor = theme?.border || 'rgba(255,255,255,0.1)';

  const adminBadgeBg = isDark ? 'rgba(108, 92, 231, 0.2)' : 'rgba(108, 92, 231, 0.15)';
  const adminBadgeText = accentColor;
  const pinnedBorderColor = brandColor;
  const pinnedHeaderColor = isDark ? secondaryText : '#555555';

  const getFilteredChats = () => {
    let filtered = INITIAL_CHATS.filter((item) => {
      if (activeTab !== 'all' && item.departmentTag !== activeTab) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.message.toLowerCase().includes(q) ||
          item.department.toLowerCase().includes(q)
        );
      }
      return true;
    });
    const pinned = filtered.filter(c => c.pinned);
    const unpinned = filtered.filter(c => !c.pinned);
    return { pinned, unpinned };
  };

  const { pinned, unpinned } = getFilteredChats();

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await logout();
  };

  const renderChatItem = ({ item }) => {
    const isGroup = item.type === 'department';
    const isPinned = item.pinned;

    return (
      <TouchableOpacity
        style={[
          styles.chatRow,
          isPinned && [styles.pinnedRow, { borderLeftColor: pinnedBorderColor }],
          { backgroundColor: cardColor, borderBottomColor: borderColor }
        ]}
        onPress={() =>
          navigation.navigate('ChatWindow', {
            contactName: item.name,
            groupDetails: item.groupDetails,
          })
        }
        activeOpacity={0.6}
      >
        <View style={[styles.avatar, isGroup && styles.avatarGroup]}>
          <Text style={[styles.avatarText, { color: '#ffffff' }]}>
            {item.name.charAt(0)}
          </Text>
          {item.isAdmin && (
            <View style={[styles.adminDot, { borderColor: isDark ? '#0a0e1a' : '#ffffff' }]}>
              <Ionicons name="shield-checkmark" size={10} color="#ffffff" />
            </View>
          )}
        </View>

        <View style={styles.chatInfo}>
          <View style={styles.chatTopRow}>
            <View style={styles.nameRow}>
              <Text style={[styles.chatName, { color: textColor }]} numberOfLines={1}>
                {item.name}
              </Text>
              {item.isUrgent && <Text style={styles.urgentIcon}>🚨</Text>}
              {item.isAdmin && (
                <View style={[styles.adminBadge, { backgroundColor: adminBadgeBg }]}>
                  <Text style={[styles.adminBadgeText, { color: adminBadgeText }]}>Admin</Text>
                </View>
              )}
            </View>
            <Text style={[styles.chatTime, { color: secondaryText }]}>{item.time}</Text>
          </View>
          <View style={styles.chatBottomRow}>
            <Text style={[styles.chatPreview, { color: secondaryText }]} numberOfLines={1}>
              {item.message}
            </Text>
            {item.unread > 0 && (
              <View style={[styles.unreadBadge, { backgroundColor: brandColor }]}>
                <Text style={[styles.unreadText, { color: '#ffffff' }]}>{item.unread}</Text>
              </View>
            )}
          </View>
          <View style={styles.chatMetaRow}>
            <Text style={[styles.departmentLabel, { color: accentColor }]}>
              {item.department}
            </Text>
            <View style={styles.iconRow}>
              {item.hasFiles && (
                <Ionicons name="attach-outline" size={14} color={secondaryText} style={styles.iconSpacing} />
              )}
              {item.encrypted && (
                <Ionicons name="lock-closed" size={12} color={secondaryText} />
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderPinnedHeader = () => {
    if (pinned.length === 0) return null;
    return (
      <View style={[styles.pinnedHeader, { borderBottomColor: borderColor }]}>
        <Ionicons name="pin" size={16} color={brandColor} />
        <Text style={[styles.pinnedHeaderText, { color: pinnedHeaderColor }]}>PINNED</Text>
      </View>
    );
  };

  const renderList = () => {
    if (pinned.length > 0) {
      return (
        <FlatList
          data={unpinned}
          keyExtractor={(item) => item.id}
          renderItem={renderChatItem}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <>
              {renderPinnedHeader()}
              {pinned.map((item) => (
                <View key={item.id}>
                  {renderChatItem({ item })}
                </View>
              ))}
              <View style={[styles.divider, { borderBottomColor: borderColor, marginLeft: 0 }]} />
            </>
          }
          ItemSeparatorComponent={() => <View style={[styles.divider, { borderBottomColor: borderColor }]} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubbles-outline" size={48} color={secondaryText} />
              <Text style={[styles.emptyText, { color: secondaryText }]}>No chats found</Text>
            </View>
          }
        />
      );
    } else {
      return (
        <FlatList
          data={unpinned}
          keyExtractor={(item) => item.id}
          renderItem={renderChatItem}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={[styles.divider, { borderBottomColor: borderColor }]} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubbles-outline" size={48} color={secondaryText} />
              <Text style={[styles.emptyText, { color: secondaryText }]}>No chats found</Text>
            </View>
          }
        />
      );
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgColor }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <LinearGradient
        colors={isDark ? ['#0a0e1a', '#1a2a4a'] : ['#f5f3ff', '#e0d5ff']}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            style={[styles.pillBtn, { backgroundColor: goldAccent }]}
            onPress={() => setShowLogoutModal(true)}
            activeOpacity={0.8}
          >
            <Text style={[styles.pillBtnText, { color: '#ffffff' }]}>Edit</Text>
          </TouchableOpacity>
          <View style={[styles.titlePill, { backgroundColor: goldAccent }]}>
            <Text style={[styles.titlePillText, { color: '#ffffff' }]}>chats</Text>
          </View>
          <View style={[styles.rightControls, { backgroundColor: 'rgba(0,0,0,0.2)' }]}>
            <TouchableOpacity
              onPress={() => Alert.alert('Notifications', 'No new notifications')}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications-outline" size={22} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.searchBar, { backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.05)' }]}>
          <Ionicons name="search-outline" size={18} color={secondaryText} style={{ marginRight: 8 }} />
          <TextInput
            ref={searchInputRef}
            style={[styles.searchInput, { color: textColor }]}
            placeholder="Search chats, files, or people..."
            placeholderTextColor={secondaryText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} activeOpacity={0.7}>
              <Ionicons name="close-circle" size={18} color={secondaryText} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          {DEPARTMENT_TABS.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && [styles.tabActive, { backgroundColor: brandColor }],
                { borderColor: borderColor }
              ]}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={tab.icon}
                size={16}
                color={activeTab === tab.id ? '#ffffff' : secondaryText}
                style={styles.tabIcon}
              />
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === tab.id ? '#ffffff' : secondaryText },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {renderList()}

      <View style={[styles.bottomBar, { backgroundColor: bgColor, borderTopColor: borderColor }]}>
        <View style={[styles.navCapsule, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
          <TouchableOpacity style={styles.navBtn} activeOpacity={0.7} onPress={() => setActiveTab('all')}>
            <Ionicons name="chatbubble-ellipses-outline" size={24} color={activeTab === 'all' ? brandColor : '#aaaaaa'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} activeOpacity={0.7} onPress={() => setActiveTab('department')}>
            <Ionicons name="people-outline" size={24} color={activeTab === 'department' ? brandColor : '#aaaaaa'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} activeOpacity={0.7} onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings-outline" size={24} color="#aaaaaa" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} activeOpacity={0.7} onPress={() => navigation.navigate('Profile')}>
            <Ionicons name="person-outline" size={24} color="#aaaaaa" />
          </TouchableOpacity>
        </View>
      </View>

      <Modal transparent animationType="fade" visible={showLogoutModal} onRequestClose={() => setShowLogoutModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={[styles.modalTitle, { color: '#111111' }]}>Sign Out</Text>
            <Text style={[styles.modalMessage, { color: '#555555' }]}>
              Are you sure you want to sign out{user?.name ? `, ${user.name}` : ''}?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowLogoutModal(false)}
                activeOpacity={0.8}
              >
                <Text style={[styles.cancelBtnText, { color: '#555555' }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.logoutBtn}
                onPress={handleLogout}
                activeOpacity={0.8}
              >
                <Text style={[styles.logoutBtnText, { color: '#ffffff' }]}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    paddingTop: Platform.OS === 'android' ? 10 : 4,
    paddingHorizontal: 14,
    paddingBottom: 8,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  pillBtn: { borderRadius: 14, paddingVertical: 5, paddingHorizontal: 16 },
  pillBtnText: { fontWeight: 'bold', fontSize: 14 },
  titlePill: { borderRadius: 14, paddingVertical: 5, paddingHorizontal: 22 },
  titlePillText: { fontWeight: 'bold', fontSize: 15 },
  rightControls: { borderRadius: 14, padding: 6 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    height: 38,
    paddingHorizontal: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  searchInput: { flex: 1, fontSize: 14, paddingVertical: 0 },
  tabsContainer: { paddingVertical: 4 },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
  },
  tabActive: { borderColor: 'transparent' },
  tabIcon: { marginRight: 4 },
  tabText: { fontSize: 12, fontWeight: '600' },
  list: { flex: 1 },
  listContent: { paddingBottom: 10 },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  pinnedRow: { borderLeftWidth: 3, paddingLeft: 13 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    position: 'relative',
  },
  avatarGroup: { borderWidth: 2, borderColor: '#6c5ce7' },
  avatarText: { fontSize: 20, fontWeight: '600' },
  adminDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#6c5ce7',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  chatInfo: { flex: 1 },
  chatTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  chatName: { fontSize: 15, fontWeight: '600', flex: 1 },
  urgentIcon: { fontSize: 14, marginLeft: 4 },
  adminBadge: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 1, marginLeft: 6 },
  adminBadgeText: { fontSize: 9, fontWeight: '600' },
  chatTime: { fontSize: 11, marginLeft: 8 },
  chatBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatPreview: { fontSize: 13, flex: 1, marginRight: 8 },
  unreadBadge: {
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  unreadText: { fontSize: 11, fontWeight: 'bold' },
  chatMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  departmentLabel: { fontSize: 11, fontWeight: '500' },
  iconRow: { flexDirection: 'row', alignItems: 'center' },
  iconSpacing: { marginRight: 4 },
  pinnedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  pinnedHeaderText: { fontSize: 12, fontWeight: '700', letterSpacing: 1, marginLeft: 6 },
  divider: { borderBottomWidth: 1, marginLeft: 76 },
  emptyContainer: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 16, marginTop: 12 },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 28 : 10,
    borderTopWidth: 1,
  },
  navCapsule: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 28,
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  navBtn: { flex: 1, alignItems: 'center', paddingVertical: 6 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  modalBox: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  modalMessage: { fontSize: 14, lineHeight: 20, marginBottom: 24 },
  modalButtons: { flexDirection: 'row', gap: 10 },
  cancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cccccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtnText: { fontSize: 15, fontWeight: '600' },
  logoutBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#c0392b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutBtnText: { fontSize: 15, fontWeight: 'bold' },
});