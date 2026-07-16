import React, { useState, useRef, useEffect } from 'react';
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
  Image,
  Alert,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';
// --- ATTACHMENT IMPORTS ---
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';

// Default mock messages for 1-on-1 chats
const DEFAULT_1ON1_MESSAGES = [
  { id: '1', text: 'Hello! Telemetry checks out normal here.', sender: 'them', senderName: 'Contact', time: '11:42 AM' },
  { id: '2', text: 'Great. Are the geospatial imagery files ready for transmission?', sender: 'me', senderName: 'Me', time: '11:43 AM' },
  { id: '3', text: 'Yes, they are compiled. Initiating satellite uplink now.', sender: 'them', senderName: 'Contact', time: '11:45 AM' },
  { id: '4', text: 'Acknowledged. Let me know when the sync completes.', sender: 'me', senderName: 'Me', time: '11:46 AM' },
];

// Special mock messages for the Geology Department group
const GEOLOGY_MESSAGES = [
  { id: '1', text: 'Hi team, telemetry data check completed. Satellite antenna is aligned.', sender: 'Natan Ethiopia', senderName: 'Natan Ethiopia', senderRole: 'Staff Geologist', time: '11:40 AM' },
  { id: '2', text: 'Excellent. GIS mapping layers for the rift zone are uploaded.', sender: 'Sara Tekle', senderName: 'Sara Tekle', senderRole: 'Geospatial Analyst', time: '11:42 AM' },
  { id: '3', text: 'I am on-site at the coordinates. Ground survey tools are calibrated.', sender: 'Abebe Kebede', senderName: 'Abebe Kebede', senderRole: 'Survey Technician', time: '11:43 AM' },
  { id: '4', text: 'Please upload the terrain analysis reports by 4 PM. I will review and sign off as the admin leader.', sender: 'Dr. Alene', senderName: 'Dr. Alene', senderRole: 'Geology Dept Head & Admin', time: '11:45 AM', isAdmin: true },
];

// Special mock messages for other department groups
const GENERAL_GROUP_MESSAGES = [
  { id: '1', text: 'Attention department members, please report your current coordinates.', sender: 'Admin', senderName: 'Admin', senderRole: 'Staff Leader & Admin', time: '10:30 AM', isAdmin: true },
  { id: '2', text: 'Communications link is active and telemetry is verified.', sender: 'Staff', senderName: 'Staff Member', senderRole: 'Specialist', time: '10:32 AM' },
];

// Helper to format seconds -> mm:ss
const formatDuration = (totalSeconds) => {
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function ChatWindowScreen({ route, navigation }) {
  const { contactName, groupDetails } = route.params || { contactName: 'Contact' };
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [inputText, setInputText] = useState('');

  // --- Attachment staging (picked but not yet sent) ---
  const [pendingAttachment, setPendingAttachment] = useState(null); // { type: 'image'|'file', uri, name }

  // --- Voice recording state ---
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingRef = useRef(null);
  const recordingTimerRef = useRef(null);

  // --- Voice playback state ---
  const [playingMessageId, setPlayingMessageId] = useState(null);
  const soundRef = useRef(null);

  // Choose messages based on group context
  const getInitialMessages = () => {
    if (!groupDetails) return DEFAULT_1ON1_MESSAGES;
    if (contactName.includes('Geology')) return GEOLOGY_MESSAGES;
    return GENERAL_GROUP_MESSAGES;
  };

  const [messages, setMessages] = useState(getInitialMessages());

  // Clean up any active recording / sound on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync().catch(() => {});
      }
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
      }
    };
  }, []);

  // ---------- SEND ----------
  const handleSendMessage = () => {
    if (!inputText.trim() && !pendingAttachment) return;

    const newMessage = {
      id: String(Date.now()),
      text: inputText.trim(),
      sender: 'me',
      senderName: 'Me',
      senderRole: 'Staff',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachment: pendingAttachment || null,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
    setPendingAttachment(null);
  };

  // ---------- ATTACHMENTS: IMAGE ----------
  const pickImage = async () => {
    setShowAttachMenu(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow photo library access to attach images.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      setPendingAttachment({
        type: 'image',
        uri: asset.uri,
        name: asset.fileName || 'photo.jpg',
      });
    }
  };

  const takePhoto = async () => {
    setShowAttachMenu(false);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow camera access to take a photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      setPendingAttachment({
        type: 'image',
        uri: asset.uri,
        name: asset.fileName || 'photo.jpg',
      });
    }
  };

  // ---------- ATTACHMENTS: DOCUMENT ----------
  const pickDocument = async () => {
    setShowAttachMenu(false);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      const asset = result.assets ? result.assets[0] : result; // supports both SDK response shapes
      setPendingAttachment({
        type: 'file',
        uri: asset.uri,
        name: asset.name || 'document',
        size: asset.size,
      });
    } catch (err) {
      Alert.alert('Error', 'Could not open document picker.');
    }
  };

  const removePendingAttachment = () => setPendingAttachment(null);

  // ---------- VOICE RECORDING ----------
  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow microphone access to record voice messages.');
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = recording;
      setIsRecording(true);
      setRecordingDuration(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      Alert.alert('Error', 'Could not start recording.');
    }
  };

  const stopRecording = async (send) => {
    if (!recordingRef.current) return;

    clearInterval(recordingTimerRef.current);
    recordingTimerRef.current = null;

    try {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      const duration = recordingDuration;
      recordingRef.current = null;
      setIsRecording(false);
      setRecordingDuration(0);

      if (send && uri) {
        const newMessage = {
          id: String(Date.now()),
          text: '',
          sender: 'me',
          senderName: 'Me',
          senderRole: 'Staff',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          attachment: { type: 'voice', uri, duration },
        };
        setMessages((prev) => [...prev, newMessage]);
      }
    } catch (err) {
      setIsRecording(false);
      setRecordingDuration(0);
      Alert.alert('Error', 'Could not save recording.');
    }
  };

  const cancelRecording = () => stopRecording(false);
  const finishRecording = () => stopRecording(true);

  // ---------- VOICE PLAYBACK ----------
  const playVoiceMessage = async (uri, id) => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
        if (playingMessageId === id) {
          setPlayingMessageId(null);
          return;
        }
      }
      const { sound } = await Audio.Sound.createAsync({ uri }, { shouldPlay: true });
      soundRef.current = sound;
      setPlayingMessageId(id);
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setPlayingMessageId(null);
          sound.unloadAsync();
          soundRef.current = null;
        }
      });
    } catch (err) {
      Alert.alert('Error', 'Could not play voice message.');
    }
  };

  // ---------- RENDER ATTACHMENT INSIDE A BUBBLE ----------
  const renderAttachment = (attachment, isMe, messageId) => {
    if (!attachment) return null;

    if (attachment.type === 'image') {
      return (
        <Image
          source={{ uri: attachment.uri }}
          style={styles.attachmentImage}
          resizeMode="cover"
        />
      );
    }

    if (attachment.type === 'file') {
      return (
        <View style={styles.fileAttachmentRow}>
          <Svg width={20} height={20} viewBox="0 0 24 24">
            <Path
              d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z"
              fill={isMe ? '#ffffff' : '#1b5674'}
            />
          </Svg>
          <Text
            numberOfLines={1}
            style={[styles.fileAttachmentName, isMe ? { color: '#ffffff' } : { color: '#333333' }]}
          >
            {attachment.name}
          </Text>
        </View>
      );
    }

    if (attachment.type === 'voice') {
      const isPlaying = playingMessageId === messageId;
      return (
        <TouchableOpacity
          style={styles.voiceAttachmentRow}
          onPress={() => playVoiceMessage(attachment.uri, messageId)}
          activeOpacity={0.7}
        >
          <View style={[styles.voicePlayButton, isMe ? { backgroundColor: 'rgba(255,255,255,0.25)' } : { backgroundColor: '#e9eef1' }]}>
            <Svg width={14} height={14} viewBox="0 0 24 24">
              {isPlaying ? (
                <Path d="M6 5h4v14H6zM14 5h4v14h-4z" fill={isMe ? '#ffffff' : '#1b5674'} />
              ) : (
                <Path d="M8 5v14l11-7z" fill={isMe ? '#ffffff' : '#1b5674'} />
              )}
            </Svg>
          </View>
          <View style={styles.voiceWaveform}>
            {[3, 6, 9, 6, 4, 8, 5, 3].map((h, idx) => (
              <View
                key={idx}
                style={[
                  styles.voiceWaveBar,
                  { height: h * 2, backgroundColor: isMe ? 'rgba(255,255,255,0.8)' : '#1b5674' },
                ]}
              />
            ))}
          </View>
          <Text style={[styles.voiceDuration, isMe ? { color: 'rgba(255,255,255,0.85)' } : { color: '#666666' }]}>
            {formatDuration(attachment.duration || 0)}
          </Text>
        </TouchableOpacity>
      );
    }

    return null;
  };

  const renderMessageItem = ({ item }) => {
    const isMe = item.sender === 'me';
    const isGroup = !!groupDetails;
    const isSenderAdmin = item.isAdmin || (isGroup && item.sender === groupDetails.leader);

    return (
      <View style={[styles.messageRow, isMe ? styles.messageRowMe : styles.messageRowThem]}>
        {!isMe && (
          <View style={[styles.miniAvatar, isSenderAdmin && styles.miniAvatarAdmin]}>
            <Text style={styles.miniAvatarText}>
              {isGroup ? item.sender.substring(0, 1) : contactName.substring(0, 1)}
            </Text>
          </View>
        )}
        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
          {isGroup && !isMe && (
            <View style={styles.senderHeader}>
              <Text style={[styles.senderNameText, isSenderAdmin && styles.senderNameTextAdmin]}>
                {item.sender}
              </Text>
              {isSenderAdmin && (
                <View style={styles.adminBadge}>
                  <Text style={styles.adminBadgeText}>Leader</Text>
                </View>
              )}
            </View>
          )}
          {isGroup && !isMe && item.senderRole && (
            <Text style={styles.roleText}>{item.senderRole}</Text>
          )}

          {renderAttachment(item.attachment, isMe, item.id)}

          {!!item.text && (
            <Text style={isMe ? styles.bubbleTextMe : styles.bubbleTextThem}>{item.text}</Text>
          )}
          <Text style={isMe ? styles.timeTextMe : styles.timeTextThem}>{item.time}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Svg width={24} height={24} viewBox="0 0 24 24">
              <Path
                d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
                fill="#ffffff"
              />
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
                <Path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
                  fill="#ffffff"
                />
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

        {/* Pending attachment preview (shown above input bar before sending) */}
        {pendingAttachment && (
          <View style={styles.pendingAttachmentBar}>
            {pendingAttachment.type === 'image' ? (
              <Image source={{ uri: pendingAttachment.uri }} style={styles.pendingImageThumb} />
            ) : (
              <View style={styles.pendingFileIcon}>
                <Svg width={18} height={18} viewBox="0 0 24 24">
                  <Path
                    d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z"
                    fill="#1b5674"
                  />
                </Svg>
              </View>
            )}
            <Text numberOfLines={1} style={styles.pendingAttachmentName}>
              {pendingAttachment.name}
            </Text>
            <TouchableOpacity onPress={removePendingAttachment} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Svg width={18} height={18} viewBox="0 0 24 24">
                <Path
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
                  fill="#8a8a8a"
                />
              </Svg>
            </TouchableOpacity>
          </View>
        )}

        {/* Recording-in-progress bar (replaces the normal input bar while recording) */}
        {isRecording ? (
          <View style={styles.recordingBar}>
            <TouchableOpacity onPress={cancelRecording} style={styles.recordingCancelButton}>
              <Svg width={20} height={20} viewBox="0 0 24 24">
                <Path
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
                  fill="#c0392b"
                />
              </Svg>
            </TouchableOpacity>

            <View style={styles.recordingIndicatorRow}>
              <View style={styles.recordingDot} />
              <Text style={styles.recordingTimerText}>{formatDuration(recordingDuration)}</Text>
              <Text style={styles.recordingHintText}>Recording voice message…</Text>
            </View>

            <TouchableOpacity onPress={finishRecording} style={styles.sendButton} activeOpacity={0.8}>
              <Svg width={18} height={18} viewBox="0 0 24 24">
                <Path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="#ffffff" />
              </Svg>
            </TouchableOpacity>
          </View>
        ) : (
          /* Input Bar */
          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.attachButton}
              onPress={() => setShowAttachMenu(true)}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Svg width={22} height={22} viewBox="0 0 24 24">
                <Path
                  d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 0 1 5 0v10.5a1 1 0 0 1-2 0V6H10v9.5a2.5 2.5 0 0 0 5 0V5a4 4 0 0 0-8 0v12.5a5.5 5.5 0 0 0 11 0V6h-1.5z"
                  fill="#1b5674"
                />
              </Svg>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Type your orbital message..."
              placeholderTextColor="#8a8a8a"
              value={inputText}
              onChangeText={setInputText}
              multiline={false}
            />

            {inputText.trim() || pendingAttachment ? (
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSendMessage}
                activeOpacity={0.8}
              >
                <Svg width={18} height={18} viewBox="0 0 24 24">
                  <Path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="#ffffff" />
                </Svg>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.sendButton}
                onPress={startRecording}
                activeOpacity={0.8}
              >
                <Svg width={18} height={18} viewBox="0 0 24 24">
                  <Path
                    d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z"
                    fill="#ffffff"
                  />
                </Svg>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Attach menu (choose Photo / Camera / Document) */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showAttachMenu}
          onRequestClose={() => setShowAttachMenu(false)}
        >
          <TouchableOpacity
            style={styles.attachMenuOverlay}
            activeOpacity={1}
            onPress={() => setShowAttachMenu(false)}
          >
            <View style={styles.attachMenuSheet}>
              <TouchableOpacity style={styles.attachMenuOption} onPress={pickImage}>
                <View style={[styles.attachMenuIconWrap, { backgroundColor: '#de994a' }]}>
                  <Svg width={20} height={20} viewBox="0 0 24 24">
                    <Path
                      d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
                      fill="#ffffff"
                    />
                  </Svg>
                </View>
                <Text style={styles.attachMenuLabel}>Photo Library</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.attachMenuOption} onPress={takePhoto}>
                <View style={[styles.attachMenuIconWrap, { backgroundColor: '#1b5674' }]}>
                  <Svg width={20} height={20} viewBox="0 0 24 24">
                    <Path
                      d="M9 2l-1.83 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"
                      fill="#ffffff"
                    />
                  </Svg>
                </View>
                <Text style={styles.attachMenuLabel}>Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.attachMenuOption} onPress={pickDocument}>
                <View style={[styles.attachMenuIconWrap, { backgroundColor: '#6b7280' }]}>
                  <Svg width={20} height={20} viewBox="0 0 24 24">
                    <Path
                      d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z"
                      fill="#ffffff"
                    />
                  </Svg>
                </View>
                <Text style={styles.attachMenuLabel}>Document</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.attachMenuCancel}
                onPress={() => setShowAttachMenu(false)}
              >
                <Text style={styles.attachMenuCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Department Info Modal */}
        {groupDetails && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={showInfoModal}
            onRequestClose={() => setShowInfoModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <Text style={styles.modalHeaderTitle}>Department Group Info</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setShowInfoModal(false)}
                  >
                    <Svg width={24} height={24} viewBox="0 0 24 24">
                      <Path
                        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
                        fill="#333333"
                      />
                    </Svg>
                  </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.modalBody}>
                  {/* Department Name & Description */}
                  <View style={styles.infoCard}>
                    <Text style={styles.infoCardName}>{groupDetails.name}</Text>
                    <Text style={styles.infoCardDescription}>{groupDetails.description}</Text>
                  </View>

                  {/* Staff Leader section */}
                  <Text style={styles.sectionTitle}>STAFF LEADER & ADMIN</Text>
                  <View style={styles.leaderCard}>
                    <View style={styles.leaderBadge}>
                      <Svg width={20} height={20} viewBox="0 0 24 24">
                        <Path
                          d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 8h2v2h-2v-2zm0-4h2v2h-2v-2z"
                          fill="#ffffff"
                        />
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

                  {/* Staff Members List */}
                  <Text style={styles.sectionTitle}>STAFF MEMBERS ({groupDetails.members.length})</Text>
                  <View style={styles.membersListCard}>
                    {groupDetails.members.map((member, index) => {
                      const isLeader = member.name === groupDetails.leader;
                      return (
                        <View key={index}>
                          <View style={styles.memberRow}>
                            <View style={[styles.memberAvatar, isLeader && styles.memberAvatarLeader]}>
                              <Text style={styles.memberAvatarText}>
                                {member.name.substring(0, 1)}
                              </Text>
                            </View>
                            <View style={styles.memberInfo}>
                              <Text style={styles.memberName}>{member.name}</Text>
                              <Text style={styles.memberRoleText}>{member.role}</Text>
                            </View>
                            {isLeader && (
                              <View style={styles.leaderTag}>
                                <Text style={styles.leaderTagText}>Admin</Text>
                              </View>
                            )}
                          </View>
                          {index < groupDetails.members.length - 1 && <View style={styles.modalDivider} />}
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
  safeArea: {
    flex: 1,
    backgroundColor: '#b6a378', // anchors header color on iOS
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  header: {
    backgroundColor: '#1B5674',
    paddingTop: Platform.OS === 'android' ? 40 : 15,
    paddingBottom: 15,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  backButton: {
    padding: 4,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#fdfdfd',
    opacity: 0.9,
    marginTop: 2,
    textAlign: 'center',
  },
  headerRightSpacer: {
    width: 32, // matches back button hit target for perfect centering
  },
  infoIconWrapper: {
    padding: 4,
  },
  messagesList: {
    flex: 1,
  },
  messagesListContent: {
    padding: 15,
    paddingBottom: 25,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-end',
  },
  messageRowMe: {
    justifyContent: 'flex-end',
  },
  messageRowThem: {
    justifyContent: 'flex-start',
  },
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
  miniAvatarAdmin: {
    backgroundColor: '#de994a', // golden orange for admin avatars
  },
  miniAvatarText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555555',
  },
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
      android: {
        elevation: 1,
      },
    }),
  },
  bubbleMe: {
    backgroundColor: '#1b5674',
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 4,
  },
  senderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  senderNameText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1b5674',
  },
  senderNameTextAdmin: {
    color: '#de994a', // golden ochre for department head in group chat
  },
  adminBadge: {
    backgroundColor: '#de994a',
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginLeft: 6,
  },
  adminBadgeText: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  roleText: {
    fontSize: 10,
    color: '#8a8a8a',
    marginBottom: 4,
    fontWeight: '500',
  },
  bubbleTextMe: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleTextThem: {
    color: '#000000',
    fontSize: 14,
    lineHeight: 20,
  },
  timeTextMe: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
    marginTop: 4,
  },
  timeTextThem: {
    fontSize: 9,
    color: '#8a8a8a',
    textAlign: 'right',
    marginTop: 4,
  },

  // --- Attachment rendering inside bubbles ---
  attachmentImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
    marginBottom: 6,
  },
  fileAttachmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 6,
    maxWidth: 220,
  },
  fileAttachmentName: {
    fontSize: 13,
    marginLeft: 8,
    flexShrink: 1,
  },
  voiceAttachmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 180,
    marginBottom: 4,
  },
  voicePlayButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  voiceWaveform: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    height: 20,
  },
  voiceWaveBar: {
    width: 3,
    borderRadius: 2,
    marginRight: 3,
  },
  voiceDuration: {
    fontSize: 11,
    marginLeft: 8,
  },

  // --- Pending attachment preview bar (above input, before sending) ---
  pendingAttachmentBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e5ea',
  },
  pendingImageThumb: {
    width: 36,
    height: 36,
    borderRadius: 8,
    marginRight: 10,
  },
  pendingFileIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#f1f1f3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  pendingAttachmentName: {
    flex: 1,
    fontSize: 13,
    color: '#333333',
  },

  // --- Input bar ---
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: '#e5e5ea',
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
  },
  attachButton: {
    marginRight: 8,
    padding: 4,
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f1f3',
    borderRadius: 20,
    height: 40,
    paddingHorizontal: 15,
    fontSize: 14,
    color: '#333333',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#1b5674',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },

  // --- Recording bar (replaces input bar while recording) ---
  recordingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: '#e5e5ea',
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
  },
  recordingCancelButton: {
    padding: 4,
    marginRight: 10,
  },
  recordingIndicatorRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#c0392b',
    marginRight: 8,
  },
  recordingTimerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginRight: 10,
  },
  recordingHintText: {
    fontSize: 12,
    color: '#8a8a8a',
  },

  // --- Attach menu (bottom sheet) ---
  attachMenuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  attachMenuSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 15,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 35 : 20,
  },
  attachMenuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  attachMenuIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  attachMenuLabel: {
    fontSize: 15,
    color: '#333333',
    fontWeight: '500',
  },
  attachMenuCancel: {
    marginTop: 10,
    paddingVertical: 14,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f1f3',
  },
  attachMenuCancelText: {
    fontSize: 15,
    color: '#c0392b',
    fontWeight: '600',
  },

  // --- Modal styles ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#f5f5f7',
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
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5ea',
  },
  modalHeaderTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333333',
  },
  closeButton: {
    padding: 2,
  },
  modalBody: {
    padding: 20,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e5ea',
  },
  infoCardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1b5674',
    marginBottom: 6,
  },
  infoCardDescription: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8a8a8a',
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 0.8,
  },
  leaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#de994a',
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
      android: {
        elevation: 4,
      },
    }),
  },
  leaderBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  leaderBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
  },
  leaderInfo: {
    flex: 1,
  },
  leaderName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  leaderRole: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.9,
    marginTop: 2,
  },
  membersListCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e5e5ea',
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
  memberAvatarLeader: {
    backgroundColor: '#de994a',
  },
  memberAvatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555555',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  memberRoleText: {
    fontSize: 11,
    color: '#8a8a8a',
    marginTop: 2,
  },
  leaderTag: {
    backgroundColor: 'rgba(222, 153, 74, 0.15)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  leaderTagText: {
    color: '#de994a',
    fontSize: 10,
    fontWeight: 'bold',
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#f1f1f3',
    marginVertical: 4,
  },
});