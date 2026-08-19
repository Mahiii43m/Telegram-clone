import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import Typography from '../../components/Typography';
import { SPACING, RADIUS } from '../../constants/typography';

// Mock SSGI announcements (you can later fetch from an API)
const ANNOUNCEMENTS = [
  {
    id: '1',
    title: 'Digital Addressing System eDAS Launched',
    date: 'August 15, 2026',
    summary: 'SSGI launches a new digital addressing system for Adama city.',
    type: 'announcement',
  },
  {
    id: '2',
    title: 'Space Science Conference 2026 (S-ARC2026)',
    date: 'August 12, 2026',
    summary: 'Call for abstracts now open. Submit your research by September 30.',
    type: 'event',
  },
  {
    id: '3',
    title: 'Training: "Journey to the Space"',
    date: 'August 10, 2026',
    summary: 'SSGI offers a 5‑day training program on space science and geospatial analysis.',
    type: 'training',
  },
  {
    id: '4',
    title: 'CORS Network Expansion',
    date: 'August 5, 2026',
    summary: 'New Continuous Operating Reference Stations deployed in Southern Ethiopia.',
    type: 'update',
  },
];

export default function NotificationsScreen({ navigation }) {
  const { theme, isDark } = useTheme();

  const bgColor = theme?.background || '#0a0e1a';
  const textColor = theme?.textPrimary || '#ffffff';
  const secondaryText = theme?.textSecondary || '#a0a0b0';
  const borderColor = theme?.border || 'rgba(255,255,255,0.08)';
  const cardColor = theme?.surface || 'rgba(255,255,255,0.06)';
  const accentColor = theme?.secondary || '#6c5ce7';

  const renderItem = ({ item }) => (
    <View style={[styles.notificationCard, { backgroundColor: cardColor, borderColor: borderColor }]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: textColor }]}>{item.title}</Text>
        <Text style={[styles.cardDate, { color: secondaryText }]}>{item.date}</Text>
      </View>
      <Text style={[styles.cardSummary, { color: secondaryText }]}>{item.summary}</Text>
      <View style={[styles.typeBadge, { backgroundColor: accentColor + '20' }]}>
        <Text style={[styles.typeText, { color: accentColor }]}>{item.type.toUpperCase()}</Text>
      </View>
    </View>
  );

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
          Notifications
        </Typography>
        <View style={{ width: 40 }} />
      </View>

      {/* List */}
      <FlatList
        data={ANNOUNCEMENTS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={48} color={secondaryText} />
            <Typography variant="body" color={secondaryText} style={styles.emptyText}>
              No new notifications
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
  listContent: { padding: SPACING.lg, paddingBottom: SPACING['2xl'] },
  notificationCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: SPACING.sm,
  },
  cardDate: { fontSize: 12 },
  cardSummary: { fontSize: 14, marginBottom: SPACING.sm },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  typeText: { fontSize: 10, fontWeight: '600' },
  emptyContainer: { alignItems: 'center', paddingVertical: SPACING['4xl'] },
  emptyText: { marginTop: SPACING.md },
});
