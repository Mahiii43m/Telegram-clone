import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';

// Mock Data matching the design mockup and structure
const INITIAL_CHATS = [
  { 
    id: '1', 
    name: 'Geology Department', 
    message: 'Dr. Alene (Admin): telemetry data synced.', 
    type: 'department',
    groupDetails: {
      name: 'Geology Department',
      description: 'Space Science and Geospatial Institute - Geology Exploration Team',
      leader: 'Dr. Alene',
      members: [
        { name: 'Dr. Alene', role: 'Geology Dept Head & Admin' },
        { name: 'Natan Ethiopia', role: 'Staff Geologist' },
        { name: 'Sara Tekle', role: 'Geospatial Analyst' },
        { name: 'Abebe Kebede', role: 'Survey Technician' },
      ]
    }
  },
  { id: 'section-contacts', isSectionHeader: true, title: 'contacts' },
  { id: '2', name: 'Natan Ethiopia', message: 'The telemetry readings are stable.', type: 'chats' },
  { 
    id: '3', 
    name: 'Space Operations', 
    message: 'Dir. Kassa (Admin): launch checklist ready.', 
    type: 'department',
    groupDetails: {
      name: 'Space Operations',
      description: 'SSGI - Orbital Launch and Telemetry Coordination Division',
      leader: 'Director Kassa',
      members: [
        { name: 'Director Kassa', role: 'Operations Head & Admin' },
        { name: 'Eshatu Tola', role: 'Communications Engineer' },
        { name: 'Biniam Yosef', role: 'Orbit Analyst' },
      ]
    }
  },
  { id: '4', name: 'Dr. Alene', message: 'Meeting scheduled for tomorrow at 10 AM.', type: 'chats' },
  { 
    id: '5', 
    name: 'Geospatial Division', 
    message: 'Amina (Admin): coordinate data updated.', 
    type: 'department',
    groupDetails: {
      name: 'Geospatial Division',
      description: 'SSGI - Mapping, Cartography & GIS Remote Sensing Staff',
      leader: 'Amina Mohammed',
      members: [
        { name: 'Amina Mohammed', role: 'Division Chief & Admin' },
        { name: 'Yared Tesfaye', role: 'GIS Coordinator' },
        { name: 'Helen Yohannes', role: 'Remote Sensing Expert' },
      ]
    }
  },
  { id: '6', name: 'Orbit Chat Support', message: 'Welcome to your premium orbital terminal.', type: 'chats' },
  { id: '7', name: 'Dev Team Lead', message: 'Vite build configurations are updated.', type: 'chats' },
];

export default function ChatsListScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const searchInputRef = useRef(null);

  // Filter logic based on active tab and search query
  const filteredData = INITIAL_CHATS.filter((item) => {
    if (item.isSectionHeader) return true; // keep section header for layout structure

    // Tab filter
    if (activeTab !== 'All' && item.type !== activeTab) {
      return false;
    }

    // Search filter
    return item.name.toLowerCase().includes(searchQuery.toLowerCase());
  }).filter((item, index, self) => {
    // If a section header has no items following it in the filtered list, hide the section header
    if (item.isSectionHeader) {
      const remainingItems = self.slice(index + 1);
      return remainingItems.some(i => !i.isSectionHeader);
    }
    return true;
  });

  const handleFocusSearch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const renderItem = ({ item }) => {
    if (item.isSectionHeader) {
      return (
        <View style={styles.sectionHeaderContainer}>
          <View style={styles.sectionDivider} />
          <Text style={styles.sectionHeaderText}>{item.title}</Text>
          <View style={styles.sectionDivider} />
        </View>
      );
    }

    const isGroup = item.type === 'department';

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => navigation.navigate('ChatWindow', { 
          contactName: item.name, 
          groupDetails: item.groupDetails 
        })}
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
          {isGroup ? (
            // Group/Multi-user SVG
            <Svg width={28} height={28} viewBox="0 0 24 24">
              <Path
                d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-3.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V20h6v-3.5c0-2.33-4.67-3.5-7-3.5z"
                fill="#757575"
              />
            </Svg>
          ) : (
            // Silhouette User SVG
            <Svg width={28} height={28} viewBox="0 0 24 24">
              <Path
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                fill="#757575"
              />
            </Svg>
          )}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text style={styles.messageText} numberOfLines={1}>
            {item.message}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Custom Header matching mockup */}
        <View style={styles.header}>
          {/* Top Row with Edit, title and Grid/Bell buttons */}
          <View style={styles.topRow}>
            <TouchableOpacity style={styles.pillButton} activeOpacity={0.8}>
              <Text style={styles.pillButtonText}>Edit</Text>
            </TouchableOpacity>

            <View style={styles.titlePill}>
              <Text style={styles.titlePillText}>chats</Text>
            </View>

            <View style={styles.rightControls}>
              {/* Grid Icon */}
              <Svg width={16} height={16} viewBox="0 0 24 24">
                <Path
                  d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"
                  fill="#ffffff"
                />
              </Svg>
              <View style={styles.controlDivider} />
              {/* Bell Icon with badge */}
              <View style={styles.bellWrapper}>
                <Svg width={16} height={16} viewBox="0 0 24 24">
                  <Path
                    d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
                    fill="#ffffff"
                  />
                </Svg>
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>2</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Search bar */}
          <View style={styles.searchContainer}>
            <Svg width={16} height={16} viewBox="0 0 24 24" style={styles.searchIcon}>
              <Path
                d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                fill="#8A8A8A"
              />
            </Svg>
            <TextInput
              ref={searchInputRef}
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#8A8A8A"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Tabs row */}
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'All' && styles.activeTab]}
              onPress={() => setActiveTab('All')}
              activeOpacity={0.8}
            >
              <Text style={activeTab === 'All' ? styles.tabTextActive : styles.tabTextInactive}>All</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === 'chats' && styles.activeTab]}
              onPress={() => setActiveTab('chats')}
              activeOpacity={0.8}
            >
              <Text style={activeTab === 'chats' ? styles.tabTextActive : styles.tabTextInactive}>chats</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === 'department' && styles.activeTab]}
              onPress={() => setActiveTab('department')}
              activeOpacity={0.8}
            >
              <Text style={activeTab === 'department' ? styles.tabTextActive : styles.tabTextInactive}>department</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Chat List Body */}
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          style={styles.listContainer}
          contentContainerStyle={styles.listContent}
          bounces={true}
        />

        {/* Custom Bottom Bar matching mockup */}
        <View style={styles.bottomBar}>
          <View style={styles.capsuleContainer}>
            <View style={styles.whiteCircle} />
            <View style={styles.whiteCircle} />
            <View style={styles.whiteCircle} />
            <View style={styles.whiteCircle} />
          </View>

          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleFocusSearch}
            activeOpacity={0.8}
          >
            <Svg width={22} height={22} viewBox="0 0 24 24">
              <Path
                d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                fill="#000000"
              />
            </Svg>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#b6a378', // anchors header color on iOS notch
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#b6a378',
    paddingTop: Platform.OS === 'android' ? 40 : 15,
    paddingBottom: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  pillButton: {
    backgroundColor: '#de994a',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 16,
  },
  pillButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  titlePill: {
    backgroundColor: '#de994a',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 22,
  },
  titlePillText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  rightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.22)',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  controlDivider: {
    width: 1,
    height: 14,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 8,
  },
  bellWrapper: {
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    top: -5,
    right: -7,
    backgroundColor: '#e1251b',
    borderRadius: 6.5,
    width: 13,
    height: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 8.5,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 12,
    height: 38,
    paddingHorizontal: 10,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
    paddingVertical: 0,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tab: {
    borderRadius: 15,
    paddingVertical: 6,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: '#de994a',
  },
  inactiveTab: {
    backgroundColor: '#c4b38d',
  },
  tabTextActive: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  tabTextInactive: {
    color: '#3e3213',
    fontSize: 13,
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  listContent: {
    paddingBottom: 20,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#dcdcdc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  contactName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 13,
    color: '#7f7f7f',
  },
  divider: {
    height: 1,
    backgroundColor: '#e9e9eb',
    marginLeft: 78,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  sectionDivider: {
    flex: 1,
    height: 1,
    backgroundColor: '#2e2e8b',
  },
  sectionHeaderText: {
    fontSize: 12,
    color: '#555555',
    fontWeight: 'bold',
    marginHorizontal: 10,
    textTransform: 'lowercase',
  },
  bottomBar: {
    backgroundColor: '#b6a378',
    paddingVertical: 12,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Platform.OS === 'ios' ? 25 : 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
  },
  capsuleContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#1b5674',
    borderRadius: 40,
    height: 80,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginRight: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  whiteCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffffff',
  },
  searchButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1b5674',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
});