// src/screens/settings/HelpFAQScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Linking,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';

const FAQ_DATA = [
  {
    id: '1',
    question: 'How do I start a new chat?',
    answer: 'Tap the "New Chat" button in the bottom navigation or tap the "💬" icon in the chat list header.',
    icon: 'chatbubble-outline',
  },
  {
    id: '2',
    question: 'Are my messages encrypted?',
    answer: 'Yes, all messages in Orbit Chat are end‑to‑end encrypted. Only you and the recipient can read them.',
    icon: 'lock-closed-outline',
  },
  {
    id: '3',
    question: 'How do I create a department group?',
    answer: 'Tap "New Group" from the main menu (⋮) and select a department. Add members and tap "Create".',
    icon: 'people-outline',
  },
  {
    id: '4',
    question: 'What is SSGI?',
    answer: 'The Space Science and Geospatial Institute (SSGI) is Ethiopia\'s premier institution for space science and geospatial research, established in 2022.',
    icon: 'business-outline',
  },
  {
    id: '5',
    question: 'How do I access satellite data?',
    answer: 'Satellite data can be accessed through the "Satellite Data" menu option under the main menu (⋮).',
    icon: 'satellite-outline',
  },
  {
    id: '6',
    question: 'How do I join SSGI training programs?',
    answer: 'Training programs are announced via the "Announcements" channel. You can also check the "Training" section under the main menu.',
    icon: 'school-outline',
  },
  {
    id: '7',
    question: 'How do I report a geospatial issue?',
    answer: 'Report geospatial issues by tapping "Report an Issue" in this screen or by contacting the Geospatial Division directly.',
    icon: 'map-outline',
  },
  {
    id: '8',
    question: 'How do I get technical support for telemetry?',
    answer: 'For telemetry support, contact the Operations team via the "Telemetry Monitoring" chat or email support@orbit-chat.com.',
    icon: 'radio-outline',
  },
];

export default function HelpFAQScreen({ navigation }) {
  const { theme, isDark } = useTheme();
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const bgColor = theme?.background || '#0a0e1a';
  const textColor = theme?.textPrimary || '#ffffff';
  const secondaryText = theme?.textSecondary || '#a0a0b0';
  const borderColor = theme?.border || 'rgba(255,255,255,0.08)';
  const cardColor = theme?.surface || 'rgba(255,255,255,0.06)';
  const brandColor = theme?.primary || '#1a4b8c';
  const accentColor = theme?.secondary || '#6c5ce7';
  const goldAccent = theme?.accent || '#de994a';

  const filteredFAQs = FAQ_DATA.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const openEmail = () => {
    Linking.openURL('mailto:support@orbit-chat.com').catch(() => {
      Alert.alert('Error', 'Could not open email client.');
    });
  };

  const openSSGIWebsite = () => {
    Linking.openURL('https://ssgi.gov.et/').catch(() => {
      Alert.alert('Error', 'Could not open SSGI website.');
    });
  };

  const reportIssue = () => {
    Alert.alert('Report Issue', 'Please describe the issue you are facing. Our team will investigate.');
  };

  const sendFeedback = () => {
    Alert.alert('Send Feedback', 'We value your feedback! Please share your thoughts to help us improve Orbit Chat.');
  };

  const renderFAQItem = (item) => {
    const isExpanded = expandedId === item.id;
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.faqItem, { backgroundColor: cardColor, borderColor: borderColor }]}
        onPress={() => toggleExpand(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.faqHeader}>
          <View style={styles.faqTitle}>
            <Ionicons name={item.icon} size={20} color={accentColor} style={styles.faqIcon} />
            <Text style={[styles.faqQuestion, { color: textColor }]}>{item.question}</Text>
          </View>
          <Ionicons
            name={isExpanded ? 'chevron-up-outline' : 'chevron-down-outline'}
            size={20}
            color={secondaryText}
          />
        </View>
        {isExpanded && (
          <Text style={[styles.faqAnswer, { color: secondaryText }]}>{item.answer}</Text>
        )}
      </TouchableOpacity>
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
        <Text style={[styles.headerTitle, { color: textColor }]}>Help & FAQ</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ─── Search ────────────────────────────────────────── */}
        <View style={[styles.searchBar, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <Ionicons name="search-outline" size={20} color={secondaryText} />
          <TextInput
            style={[styles.searchInput, { color: textColor }]}
            placeholder="Search FAQs..."
            placeholderTextColor={secondaryText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={secondaryText} />
            </TouchableOpacity>
          )}
        </View>

        {/* ─── Info ──────────────────────────────────────────── */}
        <View style={[styles.infoCard, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <Ionicons name="help-circle-outline" size={28} color={goldAccent} style={styles.infoIcon} />
          <Text style={[styles.infoText, { color: secondaryText }]}>
            Find answers to common questions or get in touch with our support team.
          </Text>
        </View>

        {/* ─── FAQ List ──────────────────────────────────────── */}
        <View style={styles.faqContainer}>
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map(renderFAQItem)
          ) : (
            <View style={[styles.emptyContainer, { backgroundColor: cardColor, borderColor: borderColor }]}>
              <Ionicons name="search-outline" size={40} color={secondaryText} />
              <Text style={[styles.emptyText, { color: secondaryText }]}>No results found</Text>
              <Text style={[styles.emptySubText, { color: secondaryText }]}>
                Try adjusting your search terms.
              </Text>
            </View>
          )}
        </View>

        {/* ─── Quick Actions ────────────────────────────────── */}
        <View style={[styles.card, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <Text style={[styles.cardTitle, { color: secondaryText }]}>Quick Actions</Text>

          <TouchableOpacity style={[styles.row, { borderBottomColor: borderColor }]} onPress={reportIssue}>
            <View style={[styles.iconWrapper, { backgroundColor: brandColor + '15' }]}>
              <Ionicons name="bug-outline" size={20} color={brandColor} />
            </View>
            <Text style={[styles.rowText, { color: textColor }]}>Report Issue</Text>
            <Ionicons name="chevron-forward-outline" size={18} color={secondaryText} style={styles.chevron} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.row, { borderBottomColor: borderColor }]} onPress={sendFeedback}>
            <View style={[styles.iconWrapper, { backgroundColor: goldAccent + '15' }]}>
              <Ionicons name="chatbubble-outline" size={20} color={goldAccent} />
            </View>
            <Text style={[styles.rowText, { color: textColor }]}>Send Feedback</Text>
            <Ionicons name="chevron-forward-outline" size={18} color={secondaryText} style={styles.chevron} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.row, { borderBottomColor: borderColor }]} onPress={openSSGIWebsite}>
            <View style={[styles.iconWrapper, { backgroundColor: accentColor + '15' }]}>
              <Ionicons name="globe-outline" size={20} color={accentColor} />
            </View>
            <Text style={[styles.rowText, { color: textColor }]}>SSGI Website</Text>
            <Ionicons name="chevron-forward-outline" size={18} color={secondaryText} style={styles.chevron} />
          </TouchableOpacity>
        </View>

        {/* ─── Contact ───────────────────────────────────────── */}
        <View style={[styles.card, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <Text style={[styles.cardTitle, { color: secondaryText }]}>Still need help?</Text>
          <Text style={[styles.cardSubtitle, { color: secondaryText }]}>
            Our support team is here to assist you.
          </Text>

          <TouchableOpacity style={[styles.row, { borderBottomColor: borderColor }]} onPress={openEmail}>
            <View style={[styles.iconWrapper, { backgroundColor: brandColor + '15' }]}>
              <Ionicons name="mail-outline" size={20} color={brandColor} />
            </View>
            <Text style={[styles.rowText, { color: textColor }]}>Email Support</Text>
            <Ionicons name="chevron-forward-outline" size={18} color={secondaryText} style={styles.chevron} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.row, { borderBottomColor: borderColor }]} onPress={openSSGIWebsite}>
            <View style={[styles.iconWrapper, { backgroundColor: accentColor + '15' }]}>
              <Ionicons name="globe-outline" size={20} color={accentColor} />
            </View>
            <Text style={[styles.rowText, { color: textColor }]}>SSGI Website</Text>
            <Ionicons name="chevron-forward-outline" size={18} color={secondaryText} style={styles.chevron} />
          </TouchableOpacity>
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

  // ─── Search ──────────────────────────────────────────────
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },

  // ─── Info ──────────────────────────────────────────────────
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
  },
  infoIcon: { marginRight: 12 },
  infoText: { flex: 1, fontSize: 14, lineHeight: 20, opacity: 0.8 },

  // ─── FAQ ───────────────────────────────────────────────────
  faqContainer: { marginBottom: 16 },
  faqItem: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 8,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  faqIcon: { marginRight: 10 },
  faqQuestion: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12,
    opacity: 0.8,
    paddingLeft: 30,
  },

  // ─── Empty State ──────────────────────────────────────────
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    borderRadius: 14,
    borderWidth: 1,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
  },
  emptySubText: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 4,
  },

  // ─── Cards (Quick Actions & Contact) ─────────────────────
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 4,
    opacity: 0.6,
  },
  cardSubtitle: {
    fontSize: 14,
    marginBottom: 10,
    opacity: 0.7,
  },

  // ─── Rows ──────────────────────────────────────────────────
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rowText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  chevron: {
    marginLeft: 'auto',
  },
});