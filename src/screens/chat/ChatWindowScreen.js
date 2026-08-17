import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

// ─── Decision Enablers Data ──────────────────────────────────────────────
const DECISION_ENABLERS = [
  {
    id: 'edas',
    icon: 'location-outline',
    title: 'eDAS Address Lookup',
    description: 'Find digital addresses in 73 Ethiopian cities',
    action: () => Alert.alert('eDAS Lookup', 'Search for digital addresses by city (Adama, Arba Minch, Jinka, etc.)'),
  },
  {
    id: 'satellite',
    icon: 'satellite-outline',
    title: 'Satellite CORS Network',
    description: '9 operational stations · 30 more planned',
    action: () => Alert.alert('Satellite CORS', 'View live satellite data network status.'),
  },
  {
    id: 'research',
    icon: 'document-text-outline',
    title: 'Research Publications',
    description: 'Latest papers from S-ARC 2026 conference',
    action: () => Alert.alert('Publications', 'Browse research papers and conference proceedings.'),
  },
  {
    id: 'disaster',
    icon: 'warning-outline',
    title: 'Disaster Risk Alerts',
    description: 'Flood · Landslide · Earthquake monitoring',
    action: () => Alert.alert('Disaster Alerts', 'View current disaster risk data from remote sensing.'),
  },
  {
    id: 'maps',
    icon: 'map-outline',
    title: 'Geospatial Data Maps',
    description: 'Urban planning · Agriculture · Water resources',
    action: () => Alert.alert('Geospatial Maps', 'Open interactive map viewer for SSGI data.'),
  },
  {
    id: 'training',
    icon: 'school-outline',
    title: 'Training Programs',
    description: 'Journey to the Space · SciGirls · Radio Astronomy',
    action: () => Alert.alert('Training', 'View upcoming training and capacity building programs.'),
  },
];

export default function ChatWindowScreen({ route, navigation }) {
  const { theme, isDark } = useTheme();
  const { contactName, groupDetails } = route.params || {};

  const isDecisionChat = contactName === '🔑 Key Decision Enablers';

  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hello!', sender: 'them', time: '11:42 AM' },
    { id: '2', text: 'Hi there!', sender: 'me', time: '11:43 AM' },
  ]);

  const bgColor = theme?.background || '#0a0e1a';
  const textColor = theme?.textPrimary || '#ffffff';
  const secondaryText = theme?.textSecondary || '#a0a0b0';
  const borderColor = theme?.border || 'rgba(255,255,255,0.1)';
  const brandColor = theme?.primary || '#1a4b8c';
  const cardColor = theme?.surface || 'rgba(255,255,255,0.06)';

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMessage = {
      id: String(messages.length + 1),
      text: inputText.trim(),
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([...messages, newMessage]);
    setInputText('');
  };

  const renderMessageItem = ({ item }) => {
    const isMe = item.sender === 'me';
    return (
      <View style={[styles.messageRow, isMe ? styles.messageRowMe : styles.messageRowThem]}>
        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
          <Text style={[styles.bubbleText, { color: isMe ? '#ffffff' : '#f0f0f5' }]}>
            {item.text}
          </Text>
          <Text style={[styles.timeText, { color: isMe ? 'rgba(255,255,255,0.6)' : '#94a3b8' }]}>
            {item.time}
          </Text>
        </View>
      </View>
    );
  };

  // ─── Decision Chat View ──────────────────────────────────────────────────
  if (isDecisionChat) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: bgColor }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        {/* Header */}
        <View style={[styles.header, { backgroundColor: brandColor }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Svg width={24} height={24} viewBox="0 0 24 24">
              <Path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="#ffffff" />
            </Svg>
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>🔑 Key Decision Enablers</Text>
            <Text style={styles.headerSubtitle}>Powered by SSGI Data</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.decisionList} showsVerticalScrollIndicator={false}>
          <Text style={[styles.decisionHeaderText, { color: secondaryText }]}>
            Select a tool to access SSGI decision data
          </Text>
          {DECISION_ENABLERS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.decisionCard, { backgroundColor: cardColor, borderColor: borderColor }]}
              onPress={item.action}
              activeOpacity={0.7}
            >
              <View style={styles.decisionIcon}>
                <Ionicons name={item.icon} size={24} color={brandColor} />
              </View>
              <View style={styles.decisionContent}>
                <Text style={[styles.decisionTitle, { color: textColor }]}>{item.title}</Text>
                <Text style={[styles.decisionDescription, { color: secondaryText }]}>{item.description}</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={18} color={secondaryText} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─── Normal Chat View ──────────────────────────────────────────────────
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgColor }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: brandColor }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Svg width={24} height={24} viewBox="0 0 24 24">
              <Path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="#ffffff" />
            </Svg>
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>{contactName || 'Chat'}</Text>
            {groupDetails && (
              <Text style={styles.headerSubtitle}>
                group • {groupDetails.members?.length || 0} members
              </Text>
            )}
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Messages */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessageItem}
          contentContainerStyle={styles.messagesListContent}
        />

        {/* Input Bar */}
        <View style={[styles.inputContainer, { backgroundColor: cardColor, borderTopColor: borderColor }]}>
          <TextInput
            style={[styles.input, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f0f2f5', color: textColor }]}
            placeholder="Type your orbital message..."
            placeholderTextColor={secondaryText}
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: brandColor }, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!inputText.trim()}
          >
            <Svg width={18} height={18} viewBox="0 0 24 24">
              <Path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="#ffffff" />
            </Svg>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  header: {
    paddingTop: Platform.OS === 'android' ? 40 : 15,
    paddingBottom: 15,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  backButton: { padding: 4 },
  headerTitleContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  headerTitle: { fontSize: 17, fontWeight: 'bold', color: '#ffffff' },
  headerSubtitle: { fontSize: 11, color: '#fdfdfd', opacity: 0.9, marginTop: 2, textAlign: 'center' },
  decisionList: { padding: 16, paddingBottom: 30 },
  decisionHeaderText: { fontSize: 13, textAlign: 'center', marginBottom: 16 },
  decisionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  decisionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(26,75,140,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  decisionContent: { flex: 1 },
  decisionTitle: { fontSize: 15, fontWeight: '600' },
  decisionDescription: { fontSize: 12, marginTop: 2 },
  messagesListContent: { padding: 15, paddingBottom: 25 },
  messageRow: { flexDirection: 'row', marginBottom: 15, alignItems: 'flex-end' },
  messageRowMe: { justifyContent: 'flex-end' },
  messageRowThem: { justifyContent: 'flex-start' },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: '75%',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1.5,
      },
      android: { elevation: 1 },
    }),
  },
  bubbleMe: {
    backgroundColor: '#1a4b8c',
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderBottomLeftRadius: 4,
  },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  timeText: { fontSize: 9, textAlign: 'right', marginTop: 4 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    height: 40,
    paddingHorizontal: 15,
    fontSize: 14,
    marginRight: 10,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: { opacity: 0.5 },
});
