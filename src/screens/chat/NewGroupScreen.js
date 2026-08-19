import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import Typography from '../../components/Typography';
import { SPACING, RADIUS } from '../../constants/typography';

const DEPARTMENTS = ['Space Science', 'Geospatial Division', 'Research', 'Operations', 'Support'];

export default function NewGroupScreen({ navigation }) {
  const { theme, isDark } = useTheme();
  const [groupName, setGroupName] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const bgColor = theme?.background || '#0a0e1a';
  const textColor = theme?.textPrimary || '#ffffff';
  const secondaryText = theme?.textSecondary || '#a0a0b0';
  const borderColor = theme?.border || 'rgba(255,255,255,0.08)';
  const cardColor = theme?.surface || 'rgba(255,255,255,0.06)';
  const brandColor = theme?.primary || '#1a4b8c';
  const accentColor = theme?.secondary || '#6c5ce7';

  const createGroup = () => {
    if (!groupName.trim()) {
      Alert.alert('Error', 'Please enter a group name.');
      return;
    }
    if (!selectedDepartment) {
      Alert.alert('Error', 'Please select a department.');
      return;
    }
    Alert.alert('Success', `Group "${groupName}" created in ${selectedDepartment} (coming soon)`);
    navigation.goBack();
  };

  const toggleDepartment = (dept) => {
    setSelectedDepartment(dept === selectedDepartment ? '' : dept);
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
        <Typography variant="heading3" color={textColor} style={styles.headerTitle}>
          New Group
        </Typography>
        <TouchableOpacity onPress={createGroup} style={styles.createButton}>
          <Typography variant="body" color={brandColor} style={styles.createText}>Create</Typography>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.inputCard, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <Typography variant="label" color={secondaryText}>Group Name</Typography>
          <TextInput
            style={[styles.input, { color: textColor, borderBottomColor: borderColor }]}
            placeholder="Enter group name"
            placeholderTextColor={secondaryText}
            value={groupName}
            onChangeText={setGroupName}
          />
        </View>

        <View style={[styles.inputCard, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <Typography variant="label" color={secondaryText}>Department</Typography>
          <View style={styles.deptContainer}>
            {DEPARTMENTS.map((dept) => (
              <TouchableOpacity
                key={dept}
                style={[
                  styles.deptChip,
                  { backgroundColor: selectedDepartment === dept ? brandColor : 'rgba(255,255,255,0.05)', borderColor: borderColor },
                ]}
                onPress={() => toggleDepartment(dept)}
                activeOpacity={0.7}
              >
                <Typography
                  variant="caption"
                  color={selectedDepartment === dept ? '#ffffff' : secondaryText}
                >
                  {dept}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.inputCard, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <Typography variant="label" color={secondaryText}>Members</Typography>
          <TouchableOpacity style={styles.addMembersBtn} activeOpacity={0.6}>
            <Ionicons name="person-add-outline" size={20} color={accentColor} />
            <Typography variant="body" color={accentColor} style={styles.addMembersText}>
              Add Members (coming soon)
            </Typography>
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
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  backButton: { padding: SPACING.xs, width: 40 },
  headerTitle: { flex: 1, textAlign: 'center' },
  createButton: { padding: SPACING.sm },
  createText: { fontWeight: '600' },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING['2xl'],
  },
  inputCard: {
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    marginBottom: SPACING.md,
  },
  input: {
    borderBottomWidth: 1,
    paddingVertical: SPACING.sm,
    fontSize: 16,
    marginTop: SPACING.xs,
  },
  deptContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.xs,
  },
  deptChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  addMembersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  addMembersText: {
    marginLeft: SPACING.sm,
  },
});