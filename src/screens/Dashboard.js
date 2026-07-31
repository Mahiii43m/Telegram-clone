// src/screens/Dashboard.js (Firestore - Real Data)
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { getDepartments, updateDepartment, getChats, markChatRead } from '../services/firestore';

export default function Dashboard() {
  const navigation = useNavigation();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [temp, setTemp] = useState(63);
  const [condition, setCondition] = useState('Mostly sunny');
  const [time, setTime] = useState('');
  const [showMeeting, setShowMeeting] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  // Clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      const temps = [61, 62, 63, 64, 65];
      const conditions = ['Mostly sunny', 'Clear', 'Partly cloudy', 'Overcast'];
      setTemp(temps[Math.floor(Math.random() * temps.length)]);
      setCondition(conditions[Math.floor(Math.random() * conditions.length)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // ─── Firestore: Departments ──────────────────────────────
  useEffect(() => {
    const unsubscribe = getDepartments((data) => {
      if (data && data.length > 0) {
        setDepartments(data);
      } else {
        Alert.alert('No Data', 'No departments found in Firestore.');
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // ─── Firestore: Chats ─────────────────────────────────────
  useEffect(() => {
    const unsubscribe = getChats((data) => {
      if (data && data.length > 0) {
        setChats(data);
      } else {
        Alert.alert('No Data', 'No chats found in Firestore.');
      }
    });
    return unsubscribe;
  }, []);

  // ─── Handlers ─────────────────────────────────────────────
  const handleEditDept = async (id, newName) => {
    try {
      await updateDepartment(id, { name: newName });
      // Optimistic update
      setDepartments(prev =>
        prev.map(d => (d.id === id ? { ...d, name: newName } : d))
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update department name.');
    }
  };

  const handleChatClick = async (chat) => {
    if (chat.unread > 0) {
      try {
        await markChatRead(chat.id);
        setChats(prev =>
          prev.map(c => (c.id === chat.id ? { ...c, unread: 0 } : c))
        );
      } catch (error) {
        console.error('Error marking chat read:', error);
      }
    }
    setSelectedChat(chat);
  };

  const filteredChats = chats.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.last.toLowerCase().includes(search.toLowerCase())
  );

  const filteredDepts = departments.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.admin.toLowerCase().includes(search.toLowerCase())
  );

  const totalUnread = chats.reduce((sum, c) => sum + c.unread, 0);

  // ─── Logout ────────────────────────────────────────────────
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              navigation.navigate('Login');
            } catch (error) {
              console.error('Logout error:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0f1e' }}>
        <ActivityIndicator size="large" color="#22d3ee" />
        <Text style={{ color: '#888', marginTop: 10 }}>Loading dashboard...</Text>
      </View>
    );
  }

  // ─── RENDER (same as before) ─────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f1e" />
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>◈ TERMINAL</Text>
            <TouchableOpacity
              onPress={() => setEditMode(!editMode)}
              style={[styles.editButton, editMode && styles.editButtonActive]}
            >
              <Text style={[styles.editButtonText, editMode && styles.editButtonTextActive]}>
                {editMode ? '✓ Editing' : '✎ Edit'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.weather}>
              <Text style={styles.temp}>{temp}°F</Text>
              <Text style={styles.condition}>{condition}</Text>
            </View>
            <View style={styles.clock}>
              <Text style={styles.time}>{time || '--:--'}</Text>
              <Text style={styles.date}>7/31/2026</Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowNotif(!showNotif)}
              style={styles.bellContainer}
            >
              <Text style={styles.bell}>🔔</Text>
              {totalUnread > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{totalUnread}</Text>
                </View>
              )}
              {showNotif && (
                <View style={styles.notifDropdown}>
                  <Text style={styles.notifItem}>⚠️ Telemetry spike at 10:15</Text>
                  <Text style={styles.notifItem}>📡 New orbit data available</Text>
                  <Text style={styles.notifItem}>📅 Meeting reminder: tomorrow 10 AM</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Text style={styles.logoutText}>⏻ Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* MAIN CONTENT */}
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Departments */}
          <View style={styles.column}>
            <Text style={styles.columnTitle}>Departments</Text>
            {filteredDepts.map(dept => (
              <View key={dept.id} style={[styles.deptCard, dept.status === 'warning' && styles.deptCardWarning]}>
                {editMode ? (
                  <TextInput
                    defaultValue={dept.name}
                    onBlur={(e) => handleEditDept(dept.id, e.nativeEvent.text)}
                    style={styles.deptInput}
                    autoFocus
                  />
                ) : (
                  <Text style={styles.deptName}>{dept.name}</Text>
                )}
                <View style={styles.deptRow}>
                  <Text style={styles.deptAdmin}>
                    {dept.admin ? `👤 ${dept.admin}${dept.admin.includes('Kassa') || dept.admin.includes('Alene') || dept.admin === 'Amina' ? ' (Admin)' : ''}` : ''}
                  </Text>
                  <View style={styles.deptStatus}>
                    <View style={[
                      styles.statusDot,
                      dept.status === 'online' ? styles.dotOnline :
                      dept.status === 'warning' ? styles.dotWarning :
                      styles.dotOffline
                    ]} />
                    <Text style={styles.deptTime}>{dept.time}</Text>
                  </View>
                </View>
              </View>
            ))}
            <TouchableOpacity onPress={() => setShowMeeting(true)} style={styles.meetingCard}>
              <Text style={styles.meetingTitle}>📅 Dr. Alene</Text>
              <Text style={styles.meetingSub}>Meeting scheduled for tomorrow at 10 AM</Text>
            </TouchableOpacity>
          </View>

          {/* Chat */}
          <View style={styles.column}>
            <View style={styles.chatHeader}>
              <Text style={styles.columnTitle}>Chat</Text>
              <Text style={styles.unreadCount}>{totalUnread} unread</Text>
            </View>
            <TextInput
              placeholder="Search chats..."
              placeholderTextColor="#666"
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
            />
            <View style={styles.chatList}>
              {filteredChats.map(chat => (
                <TouchableOpacity
                  key={chat.id}
                  onPress={() => handleChatClick(chat)}
                  style={[styles.chatItem, selectedChat?.id === chat.id && styles.chatItemSelected]}
                >
                  <View>
                    <Text style={styles.chatName}>{chat.name}</Text>
                    <Text style={styles.chatLast} numberOfLines={1}>{chat.last}</Text>
                  </View>
                  <View style={styles.chatRight}>
                    <Text style={styles.chatTime}>{chat.time}</Text>
                    {chat.unread > 0 && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadBadgeText}>{chat.unread}</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
              {filteredChats.length === 0 && (
                <Text style={styles.noChats}>No chats match</Text>
              )}
            </View>
            {selectedChat && (
              <View style={styles.threadContainer}>
                <Text style={styles.threadTitle}>Thread: {selectedChat.name}</Text>
                <ScrollView style={styles.threadScroll}>
                  {selectedChat.thread.map((msg, idx) => (
                    <View key={idx} style={styles.threadMessage}>
                      <Text style={styles.threadText}>{msg}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Ops */}
          <View style={styles.column}>
            <Text style={styles.columnTitle}>Ops</Text>
            <View style={styles.opsCard}>
              <View style={styles.opsRow}>
                <Text style={styles.opsLabel}>Telemetry</Text>
                <Text style={styles.opsStatus}>● stable</Text>
              </View>
              <Text style={styles.opsReading}>Last reading: {temp}°F · {condition}</Text>
            </View>
            <View style={styles.actionsRow}>
              <TouchableOpacity style={[styles.actionButton, styles.actionLaunch]}>
                <Text style={styles.actionText}>🚀 Launch</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.actionScan]}>
                <Text style={styles.actionText}>📡 Scan</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.actionReport, styles.fullWidth]}>
                <Text style={styles.actionText}>📊 Full Report</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.actionChats, styles.fullWidth]}
                onPress={() => navigation.navigate('ChatsList')}
              >
                <Text style={styles.actionText}>💬 Go to Chats</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* MEETING MODAL */}
        <Modal visible={showMeeting} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>📅 Meeting Details</Text>
              <Text style={styles.modalText}>Host: <Text style={styles.modalHighlight}>Dr. Alene</Text></Text>
              <Text style={styles.modalText}>Time: <Text style={styles.modalHighlight}>Tomorrow, 10:00 AM</Text></Text>
              <Text style={styles.modalText}>Topic: Terrain report review</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalButton, styles.joinButton]}>
                  <Text style={styles.joinButtonText}>Join Meeting</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowMeeting(false)} style={[styles.modalButton, styles.closeButton]}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

// ─── STYLES (keep your existing styles) ──────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a0f1e',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 12,
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#22d3ee',
  },
  editButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#555',
  },
  editButtonActive: {
    borderColor: '#fbbf24',
    backgroundColor: '#fbbf2410',
  },
  editButtonText: {
    fontSize: 12,
    color: '#aaa',
  },
  editButtonTextActive: {
    color: '#fbbf24',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  weather: {
    alignItems: 'flex-end',
  },
  temp: {
    fontSize: 14,
    color: '#ddd',
  },
  condition: {
    fontSize: 10,
    color: '#666',
  },
  clock: {
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 14,
    color: '#ddd',
  },
  date: {
    fontSize: 10,
    color: '#666',
  },
  bellContainer: {
    position: 'relative',
  },
  bell: {
    fontSize: 22,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  notifDropdown: {
    position: 'absolute',
    top: 30,
    right: 0,
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 8,
    width: 200,
    zIndex: 10,
  },
  notifItem: {
    color: '#ccc',
    fontSize: 12,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#ef444420',
    borderWidth: 1,
    borderColor: '#ef4444',
    marginLeft: 8,
  },
  logoutText: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '600',
  },
  content: {
    paddingBottom: 40,
  },
  column: {
    marginBottom: 20,
    backgroundColor: '#111827',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  columnTitle: {
    fontSize: 10,
    textTransform: 'uppercase',
    color: '#888',
    letterSpacing: 1,
    marginBottom: 8,
  },
  deptCard: {
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 6,
  },
  deptCardWarning: {
    borderColor: '#fbbf24',
    backgroundColor: '#fbbf2410',
  },
  deptName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#22d3ee',
  },
  deptInput: {
    fontSize: 14,
    fontWeight: '600',
    color: '#22d3ee',
    borderBottomWidth: 1,
    borderBottomColor: '#22d3ee',
    paddingVertical: 2,
  },
  deptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  deptAdmin: {
    fontSize: 11,
    color: '#888',
  },
  deptStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotOnline: {
    backgroundColor: '#4ade80',
  },
  dotWarning: {
    backgroundColor: '#fbbf24',
  },
  dotOffline: {
    backgroundColor: '#f87171',
  },
  deptTime: {
    fontSize: 11,
    color: '#888',
  },
  meetingCard: {
    marginTop: 8,
    padding: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#22d3ee',
    borderRadius: 6,
  },
  meetingTitle: {
    fontSize: 14,
    color: '#22d3ee',
  },
  meetingSub: {
    fontSize: 11,
    color: '#888',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  unreadCount: {
    fontSize: 11,
    color: '#888',
  },
  searchInput: {
    backgroundColor: '#0a0f1e',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    color: '#ddd',
    fontSize: 14,
    marginBottom: 8,
  },
  chatList: {
    maxHeight: 200,
  },
  chatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  chatItemSelected: {
    backgroundColor: '#1a1a2e',
  },
  chatName: {
    fontSize: 14,
    color: '#ddd',
  },
  chatLast: {
    fontSize: 11,
    color: '#888',
    maxWidth: 140,
  },
  chatRight: {
    alignItems: 'flex-end',
  },
  chatTime: {
    fontSize: 11,
    color: '#888',
  },
  unreadBadge: {
    backgroundColor: '#22d3ee',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 2,
  },
  unreadBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  noChats: {
    textAlign: 'center',
    color: '#666',
    paddingVertical: 20,
  },
  threadContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  threadTitle: {
    fontSize: 11,
    color: '#888',
    marginBottom: 4,
  },
  threadScroll: {
    maxHeight: 80,
    backgroundColor: '#0a0f1e',
    padding: 6,
    borderRadius: 4,
  },
  threadMessage: {
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    paddingVertical: 2,
  },
  threadText: {
    fontSize: 13,
    color: '#ddd',
  },
  opsCard: {
    backgroundColor: '#0a0f1e',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 10,
  },
  opsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  opsLabel: {
    color: '#ddd',
    fontSize: 14,
  },
  opsStatus: {
    color: '#4ade80',
    fontSize: 14,
  },
  opsReading: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLaunch: {
    borderColor: '#22d3ee',
    backgroundColor: '#22d3ee20',
  },
  actionScan: {
    borderColor: '#fbbf24',
    backgroundColor: '#fbbf2420',
  },
  actionReport: {
    borderColor: '#a78bfa',
    backgroundColor: '#a78bfa20',
  },
  actionChats: {
    borderColor: '#22d3ee',
    backgroundColor: '#22d3ee20',
  },
  fullWidth: {
    flexBasis: '100%',
  },
  actionText: {
    fontSize: 14,
    color: '#ddd',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a2234',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#22d3ee',
    width: '80%',
    maxWidth: 360,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#22d3ee',
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    color: '#ccc',
    marginVertical: 4,
  },
  modalHighlight: {
    color: '#22d3ee',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  joinButton: {
    backgroundColor: '#22d3ee',
  },
  joinButtonText: {
    fontWeight: 'bold',
    color: '#000',
  },
  closeButton: {
    backgroundColor: '#444',
  },
  closeButtonText: {
    color: '#ddd',
  },
});