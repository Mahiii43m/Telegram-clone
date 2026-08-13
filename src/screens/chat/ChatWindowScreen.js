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
  Modal,
  ScrollView,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';

// ─── Mock Messages ────────────────────────────────────────────────────────────
const DEFAULT_1ON1_MESSAGES = [
  { id: '1', text: 'Hello! Telemetry checks out normal here.', sender: 'them', senderName: 'Contact', time: '11:42 AM' },
  { id: '2', text: 'Great. Are the geospatial imagery files ready for transmission?', sender: 'me', senderName: 'Me', time: '11:43 AM' },
  { id: '3', text: 'Yes, they are compiled. Initiating satellite uplink now.', sender: 'them', senderName: 'Contact', time: '11:45 AM' },
  { id: '4', text: 'Acknowledged. Let me know when the sync completes.', sender: 'me', senderName: 'Me', time: '11:46 AM' },
];

const GEOLOGY_MESSAGES = [
  { id: '1', text: 'Hi team, telemetry data check completed. Satellite antenna is aligned.', sender: 'Natan Ethiopia', senderName: 'Natan Ethiopia', senderRole: 'Staff Geologist', time: '11:40 AM' },
  { id: '2', text: 'Excellent. GIS mapping layers for the rift zone are uploaded.', sender: 'Sara Tekle', senderName: 'Sara Tekle', senderRole: 'Geospatial Analyst', time: '11:42 AM' },
  { id: '3', text: 'I am on-site at the coordinates. Ground survey tools are calibrated.', sender: 'Abebe Kebede', senderName: 'Abebe Kebede', senderRole: 'Survey Technician', time: '11:43 AM' },
  { id: '4', text: 'Please upload the terrain analysis reports by 4 PM. I will review and sign off as the admin leader.', sender: 'Dr. Alene', senderName: 'Dr. Alene', senderRole: 'Geology Dept Head & Admin', time: '11:45 AM', isAdmin: true },
];

const GENERAL_GROUP_MESSAGES = [
  { id: '1', text: 'Attention department members, please report your current coordinates.', sender: 'Admin', senderName: 'Admin', senderRole: 'Staff Leader & Admin', time: '10:30 AM', isAdmin: true },
  { id: '2', text: 'Communications link is active and telemetry is verified.', sender: 'Staff', senderName: 'Staff Member', senderRole: 'Specialist', time: '10:32 AM' },
];

export default function ChatWindowScreen({ route, navigation }) {
  const { theme, isDark } = useTheme();
  const { contactName, groupDetails } = route.params || { contactName: 'Contact' };
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [inputText, setInputText] = useState('');

  // Theme colors
  const bgColor = theme?.background || '#0a0e1a';
  const textColor = theme?.textPrimary || '#ffffff';
  const secondaryText = theme?.textSecondary || '#a0a0b0';
  const borderColor = theme?.border || 'rgba(255,255,255,0.1)';
  const brandColor = theme?.primary || '#1a4b8c';
  const accentColor = theme?.secondary || '#6c5ce7';
  const goldAccent = theme?.accent || '#de994a';
  const surfaceColor = theme?.surface || 'rgba(255,255,255,0.06)';
  const cardColor = theme?.card || 'rgba(255,255,255,0.05)';

  // Message bubble colors
  const bubbleSentBg = isDark ? 'rgba(96, 165, 250, 0.25)' : '#1a4b8c';
  const bubbleReceivedBg = isDark ? 'rgba(255,255,255,0.08)' : '#e8e8ed';
  const bubbleSentText = isDark ? '#f8fafc' : '#ffffff';
  const bubbleReceivedText = isDark ? '#f8fafc' : '#1a1a2e';
  
  // Sender name colors (bright in dark mode)
  const senderNameColor = isDark ? '#a78bfa' : '#6c5ce7';
  const adminNameColor = isDark ? '#fbbf24' : '#de994a';
  
  // Role text color
  const roleTextColor = isDark ? '#94a3b8' : '#666666';

  const getInitialMessages = () => {
    if (!groupDetails) return DEFAULT_1ON1_MESSAGES;
    if (contactName.includes('Geology')) return GEOLOGY_MESSAGES;
    return GENERAL_GROUP_MESSAGES;
  };

  const [messages, setMessages] = useState(getInitialMessages());

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMessage = {
      id: String(messages.length + 1),
      text: inputText.trim(),
      sender: 'me',
      senderName: 'Me',
      senderRole: 'Staff',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([...messages, newMessage]);
    setInputText('');
  };

  const renderMessageItem = ({ item }) => {
    const isMe = item.sender === 'me';
    const isGroup = !!groupDetails;
    const isSenderAdmin = item.isAdmin || (isGroup && item.sender === groupDetails.leader);

    return (
      <View style={[styles.messageRow, isMe ? styles.messageRowMe : styles.messageRowThem]}>
        {!isMe && (
          <View style={[styles.miniAvatar, isSenderAdmin && styles.miniAvatarAdmin]}>
            <Text style={[styles.miniAvatarText, { color: isDark ? '#f8fafc' : '#555555' }]}>
              {isGroup ? item.sender.substring(0, 1) : contactName.substring(0, 1)}
            </Text>
          </View>
        )}
        <View style={[
          styles.bubble,
          isMe 
            ? [styles.bubbleMe, { backgroundColor: bubbleSentBg }]
            : [styles.bubbleThem, { backgroundColor: bubbleReceivedBg }]
        ]}>
          {isGroup && !isMe && (
            <View style={styles.senderHeader}>
              <Text style={[
                styles.senderNameText,
                { color: isSenderAdmin ? adminNameColor : senderNameColor }
              ]}>
                {item.sender}
              </Text>
              {isSenderAdmin && (
                <View style={[styles.adminBadge, { backgroundColor: accentColor }]}>
                  <Text style={styles.adminBadgeText}>Leader</Text>
                </View>
              )}
            </View>
          )}
          {isGroup && !isMe && item.senderRole && (
            <Text style={[styles.roleText, { color: roleTextColor }]}>{item.senderRole}</Text>
          )}
          <Text style={[
            styles.bubbleText,
            { color: isMe ? bubbleSentText : bubbleReceivedText }
          ]}>
            {item.text}
          </Text>
          <Text style={[
            styles.timeText,
            { color: isMe ? 'rgba(255,255,255,0.6)' : (isDark ? '#94a3b8' : '#8a8a9a') }
          ]}>
            {item.time}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgColor }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: brandColor }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Svg width={24} height={24} viewBox="0 0 24 24">
              <Path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="#ffffff" />
            </Svg>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerTitleContainer}
            onPress={() => groupDetails && setShowInfoModal(true)}
            disabled={!groupDetails}
            activeOpacity={groupDetails ? 0.7 : 1}
          >
            <Text style={styles.headerTitle}>{contactName}</Text>
            <Text style={styles.headerSubtitle}>
              {groupDetails
                ? `group • ${groupDetails.members.length} members • tap for info`
                : 'satellite linked • active'}
            </Text>
          </TouchableOpacity>

          {groupDetails ? (
            <TouchableOpacity
              style={styles.infoIconWrapper}
              onPress={() => setShowInfoModal(true)}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Svg width={22} height={22} viewBox="0 0 24 24">
                <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="#ffffff" />
              </Svg>
            </TouchableOpacity>
          ) : (
            <View style={styles.headerRightSpacer} />
          )}
        </View>

        {/* Messages List */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessageItem}
          contentContainerStyle={styles.messagesListContent}
          style={styles.messagesList}
          bounces={true}
        />

        {/* Input Bar */}
        <View style={[styles.inputContainer, { backgroundColor: surfaceColor, borderTopColor: borderColor }]}>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f0f2f5',
                color: isDark ? '#f8fafc' : '#1a1a2e'
              }
            ]}
            placeholder="Type your orbital message..."
            placeholderTextColor={isDark ? '#94a3b8' : '#8a8a9a'}
            value={inputText}
            onChangeText={setInputText}
            multiline={false}
          />
          <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: brandColor }, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!inputText.trim()}
            activeOpacity={0.8}
          >
            <Svg width={18} height={18} viewBox="0 0 24 24">
              <Path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="#ffffff" />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* Department Info Modal */}
        {groupDetails && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={showInfoModal}
            onRequestClose={() => setShowInfoModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, { backgroundColor: isDark ? '#1a1a2e' : '#ffffff' }]}>
                <View style={[styles.modalHeader, { borderBottomColor: borderColor }]}>
                  <Text style={[styles.modalHeaderTitle, { color: textColor }]}>Department Group Info</Text>
                  <TouchableOpacity style={styles.closeButton} onPress={() => setShowInfoModal(false)}>
                    <Svg width={24} height={24} viewBox="0 0 24 24">
                      <Path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" fill={textColor} />
                    </Svg>
                  </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.modalBody}>
                  <View style={[styles.infoCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f5f5f7', borderColor: borderColor }]}>
                    <Text style={[styles.infoCardName, { color: textColor }]}>{groupDetails.name}</Text>
                    <Text style={[styles.infoCardDescription, { color: secondaryText }]}>{groupDetails.description}</Text>
                  </View>

                  <Text style={[styles.sectionTitle, { color: secondaryText }]}>STAFF LEADER & ADMIN</Text>
                  <View style={[styles.leaderCard, { backgroundColor: goldAccent }]}>
                    <View style={styles.leaderBadge}>
                      <Svg width={20} height={20} viewBox="0 0 24 24">
                        <Path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 8h2v2h-2v-2zm0-4h2v2h-2v-2z" fill="#ffffff" />
                      </Svg>
                      <Text style={styles.leaderBadgeText}>Admin</Text>
                    </View>
                    <View style={styles.leaderInfo}>
                      <Text style={styles.leaderName}>
                        {groupDetails.members.find(m => m.name === groupDetails.leader)?.name || groupDetails.leader}
                      </Text>
                      <Text style={styles.leaderRole}>
                        {groupDetails.members.find(m => m.name === groupDetails.leader)?.role || 'Department Head'}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.sectionTitle, { color: secondaryText }]}>STAFF MEMBERS ({groupDetails.members.length})</Text>
                  <View style={[styles.membersListCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f5f5f7', borderColor: borderColor }]}>
                    {groupDetails.members.map((member, index) => {
                      const isLeader = member.name === groupDetails.leader;
                      return (
                        <View key={index}>
                          <View style={styles.memberRow}>
                            <View style={[styles.memberAvatar, isLeader && { backgroundColor: goldAccent }]}>
                              <Text style={styles.memberAvatarText}>{member.name.substring(0, 1)}</Text>
                            </View>
                            <View style={styles.memberInfo}>
                              <Text style={[styles.memberName, { color: textColor }]}>{member.name}</Text>
                              <Text style={[styles.memberRoleText, { color: secondaryText }]}>{member.role}</Text>
                            </View>
                            {isLeader && (
                              <View style={[styles.leaderTag, { backgroundColor: goldAccent + '30' }]}>
                                <Text style={[styles.leaderTagText, { color: goldAccent }]}>Admin</Text>
                              </View>
                            )}
                          </View>
                          {index < groupDetails.members.length - 1 && <View style={[styles.modalDivider, { backgroundColor: borderColor }]} />}
                        </View>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
            </View>
          </Modal>
        )}
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
  headerRightSpacer: { width: 32 },
  infoIconWrapper: { padding: 4 },
  messagesList: { flex: 1 },
  messagesListContent: { padding: 15, paddingBottom: 25 },
  messageRow: { flexDirection: 'row', marginBottom: 15, alignItems: 'flex-end' },
  messageRowMe: { justifyContent: 'flex-end' },
  messageRowThem: { justifyContent: 'flex-start' },
  miniAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#dcdcdc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 2,
  },
  miniAvatarAdmin: { backgroundColor: '#6c5ce7' },
  miniAvatarText: { fontSize: 12, fontWeight: 'bold' },
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
  bubbleMe: { borderBottomRightRadius: 4 },
  bubbleThem: { borderBottomLeftRadius: 4 },
  senderHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  senderNameText: { fontSize: 12, fontWeight: 'bold' },
  adminBadge: { borderRadius: 6, paddingHorizontal: 5, paddingVertical: 1, marginLeft: 6 },
  adminBadgeText: { color: '#ffffff', fontSize: 8, fontWeight: 'bold' },
  roleText: { fontSize: 10, marginBottom: 4, fontWeight: '500' },
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: '85%',
    paddingBottom: 25,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  modalHeaderTitle: { fontSize: 17, fontWeight: 'bold' },
  closeButton: { padding: 2 },
  modalBody: { padding: 20 },
  infoCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  infoCardName: { fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
  infoCardDescription: { fontSize: 13, lineHeight: 18 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 0.8,
  },
  leaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#de994a',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: { elevation: 4 },
    }),
  },
  leaderBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  leaderBadgeText: { color: '#ffffff', fontSize: 10, fontWeight: 'bold', marginTop: 2 },
  leaderInfo: { flex: 1 },
  leaderName: { fontSize: 16, fontWeight: 'bold', color: '#ffffff' },
  leaderRole: { fontSize: 12, color: '#ffffff', opacity: 0.9, marginTop: 2 },
  membersListCard: {
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  memberAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#dcdcdc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  memberAvatarText: { fontSize: 14, fontWeight: 'bold', color: '#555555' },
  memberInfo: { flex: 1 },
  memberName: { fontSize: 14, fontWeight: 'bold' },
  memberRoleText: { fontSize: 11, marginTop: 2 },
  leaderTag: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  leaderTagText: { fontSize: 10, fontWeight: 'bold' },
  modalDivider: { height: 1, marginVertical: 4 },
});