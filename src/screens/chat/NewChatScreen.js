import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import Typography from '../../components/Typography';
import { SPACING, RADIUS } from '../../constants/typography';

const MOCK_USERS = [
  { id: 'u1', name: 'Dr. Alene', department: 'Geospatial Division', email: 'alene@ssgi.gov.et' },
  { id: 'u2', name: 'Amina Mohammed', department: 'Geospatial Division', email: 'amina@ssgi.gov.et' },
  { id: 'u3', name: 'Director Kassa', department: 'Space Science', email: 'kassa@ssgi.gov.et' },
  { id: 'u4', name: 'Dr. Tadesse', department: 'Space Science', email: 'tadesse@ssgi.gov.et' },
  { id: 'u5', name: 'Eshatu Tola', department: 'Operations', email: 'eshatu@ssgi.gov.et' },
];

export default function NewChatScreen({ navigation }) {
  const { theme, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(MOCK_USERS);

  const bgColor = theme?.background || '#0a0e1a';
  const textColor = theme?.textPrimary || '#ffffff';
  const secondaryText = theme?.textSecondary || '#a0a0b0';
  const borderColor = theme?.border || 'rgba(255,255,255,0.08)';
  const cardColor = theme?.surface || 'rgba(255,255,255,0.06)';
  const brandColor = theme?.primary || '#1a4b8c';
  const accentColor = theme?.secondary || '#6c5ce7';

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim()) {
      const q = text.toLowerCase();
      const filtered = MOCK_USERS.filter(
        (user) =>
          user.name.toLowerCase().includes(q) ||
          user.department.toLowerCase().includes(q) ||
          user.email.toLowerCase().includes(q)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(MOCK_USERS);
    }
  };

  const startChat = (user) => {
    Alert.alert('Start Chat', `Chat with ${user.name} (coming soon)`);
  };

  const renderUser = ({ item }) => (
    <TouchableOpacity
      style={[styles.userItem, { backgroundColor: cardColor, borderBottomColor: borderColor }]}
      onPress={() => startChat(item)}
      activeOpacity={0.6}
    >
      <View style={styles.avatar}>
        <Typography variant="heading3" color="#ffffff">
          {item.name.charAt(0)}
        </Typography>
      </View>
      <View style={styles.userInfo}>
        <Typography variant="body" color={textColor}>{item.name}</Typography>
        <Typography variant="caption" color={secondaryText}>{item.department}</Typography>
        <Typography variant="caption" color={secondaryText} style={styles.userEmail}>{item.email}</Typography>
      </View>
      <Ionicons name="chevron-forward-outline" size={18} color={secondaryText} />
    </TouchableOpacity>
  );

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
        <Typography variant="heading3" color={textColor} style={styles.headerTitle}>
          New Chat
        </Typography>
        <View style={{ width: 40 }} />
      </View>

      <View style={[styles.searchBar, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', borderColor: borderColor }]}>
        <Ionicons name="search-outline" size={18} color={secondaryText} style={{ marginRight: 8 }} />
        <TextInput
          style={[styles.searchInput, { color: textColor }]}
          placeholder="Search by name, department, or email..."
          placeholderTextColor={secondaryText}
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Ionicons name="close-circle" size={18} color={secondaryText} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderUser}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color={secondaryText} />
            <Typography variant="body" color={secondaryText} style={styles.emptyText}>
              No users found
            </Typography>
          </View>
        }
      />
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    marginBottom: SPACING.md,
  },
  searchInput: { flex: 1, fontSize: 16, paddingVertical: 0 },
  listContent: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING['2xl'] },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    borderBottomWidth: 1,
    marginBottom: SPACING.xs,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6c5ce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  userInfo: { flex: 1 },
  userEmail: { marginTop: SPACING.xs, opacity: 0.6 },
  emptyContainer: { alignItems: 'center', paddingVertical: SPACING['3xl'] },
  emptyText: { marginTop: SPACING.md },
});