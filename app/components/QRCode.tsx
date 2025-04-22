import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect, useState } from 'react';
import QRCode from 'react-native-qrcode-svg';

interface QRCodeComponentProps {
  groupId?: string;
  mode: 'scan' | 'display';
  onScan?: (data: string) => void;
}

export const QRCodeComponent = ({ groupId, mode, onScan }: QRCodeComponentProps) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (mode === 'scan' && !permission?.granted) {
      requestPermission();
    }
  }, [permission, mode]);

  if (mode === 'display' && groupId) {
    return (
      <View style={styles.container}>
        <QRCode
          value={groupId}
          size={200}
        />
      </View>
    );
  }

  if (mode === 'scan') {
    if (!permission?.granted) {
      return null;
    }

    return (
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={({ data }) => {
            if (!scanned && onScan) {
              setScanned(true);
              onScan(data);
            }
          }}
        />
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
}); 