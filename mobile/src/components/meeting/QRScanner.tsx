import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

interface QRScannerProps {
  onScan: (data: string) => Promise<void>;
  onBack: () => void;
}

export default function QRScanner({ onScan, onBack }: QRScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [pasteValue, setPasteValue] = useState('');

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    onScan(data);
  };

  const handlePaste = async () => {
    if (pasteValue.trim()) {
      await onScan(pasteValue.trim());
    }
  };

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Camera Permission</Text>
        <Text style={styles.subtitle}>Camera access is needed to scan QR codes</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={requestPermission}>
          <Text style={styles.primaryButtonText}>Grant Permission</Text>
        </TouchableOpacity>

        {/* Paste fallback */}
        <View style={styles.pasteContainer}>
          <Text style={styles.pasteLabel}>Or paste QR data:</Text>
          <TextInput
            style={styles.pasteInput}
            value={pasteValue}
            onChangeText={setPasteValue}
            placeholder="Paste QR data..."
            placeholderTextColor={colors.textMuted}
            multiline
          />
          <TouchableOpacity style={styles.pasteButton} onPress={handlePaste}>
            <Text style={styles.pasteButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan QR Code</Text>
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        />
        {/* Scan overlay */}
        <View style={styles.scanOverlay}>
          <View style={styles.scanFrame} />
        </View>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontFamily: fonts.displayRegular,
    fontSize: 24,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  cameraContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: colors.ttPrimary,
    borderRadius: 12,
  },
  primaryButton: {
    backgroundColor: colors.ttPrimary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 10,
  },
  primaryButtonText: {
    color: colors.bgBase,
    fontFamily: fonts.uiSemiBold,
    fontSize: 16,
  },
  pasteContainer: {
    width: '100%',
    marginTop: 16,
    gap: 8,
  },
  pasteLabel: {
    color: colors.textMuted,
    fontFamily: fonts.ui,
    fontSize: 12,
  },
  pasteInput: {
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.15)',
    borderRadius: 8,
    padding: 12,
    color: colors.textPrimary,
    fontFamily: fonts.mono,
    fontSize: 12,
    minHeight: 60,
  },
  pasteButton: {
    backgroundColor: colors.bgElevated,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  pasteButtonText: {
    color: colors.textPrimary,
    fontFamily: fonts.uiMedium,
    fontSize: 14,
  },
  backButton: {
    paddingVertical: 8,
  },
  backButtonText: {
    color: colors.textMuted,
    fontFamily: fonts.ui,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
