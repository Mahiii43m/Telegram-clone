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
import Svg, { Path } from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../../context/AuthContext';

// ─── Mock Data ───────────────────────────────────────────────────────────────
const INITIAL_CHATS = [
  {
    id: '1',
    name: 'Geology Department',
    message: 'Dr. Alene (Admin): upload terrain reports by 4 PM.',
    time: '11:45 AM',
    type: 'department',
    unread: 2,
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
  { id: 'sec-contacts', isSectionHeader: true, title: 'contacts' },
  {
    id: '2',
    name: 'Natan Ethiopia',
    message: 'The telemetry readings are stable.',
    time: '11:42 AM',
    type: 'chats',
    unread: 0,
  },
  {
    id: '3',
    name: 'Space Operations',
    message: 'Dir. Kassa (Admin): launch checklist ready.',
    time: '10:35 AM',
    type: 'department',
    unread: 5,
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
    id: '4',
    name: 'Dr. Alene',
    message: 'Meeting scheduled for tomorrow at 10 AM.',
    time: '09:10 AM',
    type: 'chats',
    unread: 1,
  },
  {
    id: '5',
    name: 'Geospatial Division',
    message: 'Amina (Admin): coordinate data updated.',
    time: 'Yesterday',
    type: 'department',
    unread: 0,
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
    id: '6',
    name: 'Orbit Chat Support',
    message: 'Welcome to your premium orbital terminal.',
    time: 'Yesterday',
    type: 'chats',
    unread: 0,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function ChatsListScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const searchInputRef = useRef(null);

  // Filter chats by tab and search
  const filteredData = INITIAL_CHATS.filter((item) => {
    if (item.isSectionHeader) return true;
    if (activeTab === 'chats' && item.type !== 'chats') return false;
    if (activeTab === 'department' && item.type !== 'department') return false;
    if (searchQuery.trim()) {
      return item.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  }).filter((item, index, arr) => {
    // Remove orphaned section headers
    if (item.isSectionHeader) {
      const next = arr[index + 1];
      return next && !next.isSectionHeader;
    }
    return true;
  });

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await logout();
  };

  // ── Render each list row ──
  const renderItem = ({ item }) => {
    if (item.isSectionHeader) {
      return (
        <View style={styles.sectionRow}>
          <View style={styles.sectionLine} />
          <Text style={styles.sectionLabel}>{item.title}</Text>
          <View style={styles.sectionLine} />
        </View>
      );
    }

    const isGroup = item.type === 'department';

    return (
      <TouchableOpacity
        style={styles.chatRow}
        onPress={() =>
          navigation.navigate('ChatWindow', {
            contactName: item.name,
            groupDetails: item.groupDetails,
          })
        }
        activeOpacity={0.7}
      >
        {/* Avatar */}
        <View style={[styles.avatar, isGroup && styles.avatarGroup]}>
          <Svg width={26} height={26} viewBox="0 0 24 24">
            {isGroup ? (
              <Path
                d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-3.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V20h6v-3.5c0-2.33-4.67-3.5-7-3.5z"
                fill="#ffffff"
              />
            ) : (
              <Path
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                fill="#ffffff"
              />
            )}
          </Svg>
        </View>

        {/* Text block */}
        <View style={styles.chatInfo}>
          <View style={styles.chatTopRow}>
            <Text style={styles.chatName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.chatTime}>{item.time}</Text>
          </View>
          <View style={styles.chatBottomRow}>
            <Text style={styles.chatPreview} numberOfLines={1}>{item.message}</Text>
            {item.unread > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item.unread}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* ── Header ─────────────────────────────────────── */}
      <View style={styles.header}>
        {/* Top row */}
        <View style={styles.headerTopRow}>
          {/* Edit / Logout button */}
          <TouchableOpacity
            style={styles.pillBtn}
            onPress={() => setShowLogoutModal(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.pillBtnText}>Edit</Text>
          </TouchableOpacity>

          {/* Title */}
          <View style={styles.titlePill}>
            <Text style={styles.titlePillText}>chats</Text>
          </View>

          {/* Right controls */}
          <View style={styles.rightControls}>
            <TouchableOpacity
              onPress={() => Alert.alert('Notifications', 'No new notifications')}
              activeOpacity={0.7}
            >
              <Svg width={18} height={18} viewBox="0 0 24 24">
                <Path
                  d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
                  fill="#ffffff"
                />
              </Svg>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search bar */}
        <View style={styles.searchBar}>
          <Svg width={15} height={15} viewBox="0 0 24 24" style={{ marginRight: 6 }}>
            <Path
              d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
              fill="#8a8a8a"
            />
          </Svg>
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#8a8a8a"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} activeOpacity={0.7}>
              <Svg width={16} height={16} viewBox="0 0 24 24">
                <Path
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                  fill="#8a8a8a"
                />
              </Svg>
            </TouchableOpacity>
          )}
        </View>

        {/* Tabs */}
        <View style={styles.tabRow}>
          {['All', 'chats', 'department'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── Chat List ───────────────────────────────────── */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No chats found</Text>
          </View>
        }
      />

      {/* ── Bottom Bar ──────────────────────────────────── */}
      <View style={styles.bottomBar}>
        <View style={styles.navCapsule}>
          {/* Chats tab */}
          <TouchableOpacity style={styles.navBtn} activeOpacity={0.7} onPress={() => setActiveTab('All')}>
            <Svg width={22} height={22} viewBox="0 0 24 24">
              <Path
                d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"
                fill={activeTab === 'All' ? '#1b5674' : '#aaaaaa'}
              />
            </Svg>
          </TouchableOpacity>

          {/* Department tab */}
          <TouchableOpacity style={styles.navBtn} activeOpacity={0.7} onPress={() => setActiveTab('department')}>
            <Svg width={22} height={22} viewBox="0 0 24 24">
              <Path
                d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-3.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V20h6v-3.5c0-2.33-4.67-3.5-7-3.5z"
                fill={activeTab === 'department' ? '#1b5674' : '#aaaaaa'}
              />
            </Svg>
          </TouchableOpacity>

          {/* Profile / logout */}
          {/* Profile */}  
          <TouchableOpacity style={styles.navBtn} activeOpacity={0.7} onPress={() => navigation.navigate('Profile')}>
            <Svg width={22} height={22} viewBox="0 0 24 24">
              <Path
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                fill="#aaaaaa"
              />
            </Svg>
          </TouchableOpacity>
        </View>
         
        {/* Search button */}
        <TouchableOpacity
          style={styles.searchBtn}
          onPress={() => searchInputRef.current && searchInputRef.current.focus()}
          activeOpacity={0.8}
        >
          <Svg width={20} height={20} viewBox="0 0 24 24">
            <Path
              d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
              fill="#ffffff"
            />
          </Svg>
        </TouchableOpacity>
      </View>

      {/* ── Logout Confirmation Modal ────────────────────── */}
      <Modal transparent animationType="fade" visible={showLogoutModal} onRequestClose={() => setShowLogoutModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Sign Out</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to sign out{user?.name ? `, ${user.name}` : ''}?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowLogoutModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.logoutBtn}
                onPress={handleLogout}
                activeOpacity={0.8}
              >
                <Text style={styles.logoutBtnText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#b6a378',
  },

  // Header
  header: {
    backgroundColor: '#b6a378',
    paddingTop: Platform.OS === 'android' ? 10 : 4,
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  pillBtn: {
    backgroundColor: '#de994a',
    borderRadius: 14,
    paddingVertical: 5,
    paddingHorizontal: 16,
  },
  pillBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  titlePill: {
    backgroundColor: '#de994a',
    borderRadius: 14,
    paddingVertical: 5,
    paddingHorizontal: 22,
  },
  titlePillText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  rightControls: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 14,
    padding: 8,
  },

  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: 12,
    height: 38,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
    paddingVertical: 0,
  },

  // Tabs
  tabRow: {
    flexDirection: 'row',
    gap: 6,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 14,
    paddingVertical: 6,
  },
  tabActive: {
    backgroundColor: '#de994a',
  },
  tabText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#4a3b1f',
  },
  tabTextActive: {
    color: '#ffffff',
  },

  // List
  list: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  listContent: {
    paddingBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 76,
  },

  // Section header
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#888888',
    marginHorizontal: 10,
    textTransform: 'lowercase',
  },

  // Chat row
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#b6b6b6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarGroup: {
    backgroundColor: '#1b5674',
  },
  chatInfo: {
    flex: 1,
  },
  chatTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111111',
    flex: 1,
    marginRight: 8,
  },
  chatTime: {
    fontSize: 11,
    color: '#8a8a8a',
  },
  chatBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatPreview: {
    fontSize: 13,
    color: '#666666',
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#1b5674',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  unreadText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },

  // Empty state
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    color: '#8a8a8a',
    fontSize: 16,
  },

  // Bottom bar
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#b6a378',
    paddingHorizontal: 14,
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 28 : 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
    gap: 12,
  },
  navCapsule: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 28,
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  navBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  searchBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1b5674',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  // Logout modal
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
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111111',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cccccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#555555',
  },
  logoutBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#c0392b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});