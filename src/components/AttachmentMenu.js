import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Platform,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function AttachmentMenu({ visible, onClose, onSelectOption }) {
  if (!visible) return null;

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Invisible backdrop: tapping outside the sheet closes it */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.sheetContainer}>
              {/* Drag Handle Indicator */}
              <View style={styles.dragHandle} />

              <Text style={styles.sheetTitle}>Share Content</Text>

              <View style={styles.optionsGrid}>
                {/* Option 1: Gallery / Media */}
                <TouchableOpacity
                  style={styles.optionButton}
                  activeOpacity={0.7}
                  onPress={() => {
                    onSelectOption('image');
                    onClose();
                  }}
                >
                  <View style={[styles.iconWrapper, { backgroundColor: '#4a90e2' }]}>
                    <Svg width={24} height={24} viewBox="0 0 24 24">
                      <Path
                        d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
                        fill="#ffffff"
                      />
                    </Svg>
                  </View>
                  <Text style={styles.optionLabel}>Gallery</Text>
                </TouchableOpacity>

                {/* Option 2: Document / File */}
                <TouchableOpacity
                  style={styles.optionButton}
                  activeOpacity={0.7}
                  onPress={() => {
                    onSelectOption('file');
                    onClose();
                  }}
                >
                  <View style={[styles.iconWrapper, { backgroundColor: '#de994a' }]}>
                    <Svg width={24} height={24} viewBox="0 0 24 24">
                      <Path
                        d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
                        fill="#ffffff"
                      />
                    </Svg>
                  </View>
                  <Text style={styles.optionLabel}>File</Text>
                </TouchableOpacity>

                {/* Option 3: Voice Note */}
                <TouchableOpacity
                  style={styles.optionButton}
                  activeOpacity={0.7}
                  onPress={() => {
                    onSelectOption('voice');
                    onClose();
                  }}
                >
                  <View style={[styles.iconWrapper, { backgroundColor: '#2ecc71' }]}>
                    <Svg width={24} height={24} viewBox="0 0 24 24">
                      <Path
                        d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1 9h2c0 .55-.45 1-1 1s-1-.45-1-1zm6-12h-1.7c0 3-2.54 5.1-5.3 5.1S4.7 14 4.7 11H3c0 4.27 3.48 7.82 7.5 8.3V22h3v-2.7c4.02-.48 7.5-4.03 7.5-8.3z"
                        fill="#ffffff"
                      />
                    </Svg>
                  </View>
                  <Text style={styles.optionLabel}>Voice</Text>
                </TouchableOpacity>
              </View>

              {/* Cancel Button */}
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    width: '100%',
  },
  dragHandle: {
    width: 36,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#e5e5ea',
    alignSelf: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  optionButton: {
    alignItems: 'center',
    width: 80,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  optionLabel: {
    fontSize: 12,
    color: '#555555',
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: '#f1f1f3',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ff3b30', // Telegram red for cancel
  },
});