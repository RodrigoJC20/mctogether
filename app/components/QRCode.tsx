import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect, useState } from 'react';

interface QRCodeProps {
  groupId: string;
}

interface BarcodeScannedEvent {
  data: string;
  type: string;
}

export const QRCode = ({ groupId }: QRCodeProps) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

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
        onBarcodeScanned={({ data }: BarcodeScannedEvent) => {
          if (!scanned) {
            setScanned(true);
            // Handle scanned QR code data
            console.log('Scanned QR code:', data);
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: 300,
  },
  camera: {
    flex: 1,
  },
}); 