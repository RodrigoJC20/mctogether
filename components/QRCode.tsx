import React from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkPermissions = async () => {
      if (mode === 'scan') {
        if (!permission?.granted) {
          const result = await requestPermission();
          if (!result.granted) {
            console.log('Camera permission denied');
          }
        }
        setIsLoading(false);
      }
    };
    checkPermissions();
  }, [permission, mode]);

  if (mode === 'display' && groupId) {
    return (
      <View style={styles.container}>
        <QRCode
          value={groupId}
          size={250}
          backgroundColor="white"
          color="black"
        />
      </View>
    );
  }

  if (mode === 'scan') {
    if (isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.permissionText}>Requesting camera permission...</Text>
        </View>
      );
    }

    if (!permission?.granted) {
      return (
        <View style={styles.container}>
          <Text style={styles.permissionText}>Camera permission is required to scan QR codes</Text>
          <Text style={styles.permissionSubText}>Please enable camera access in your device settings</Text>
        </View>
      );
    }

    return (
      <View style={styles.cameraContainer}>
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
        <View style={styles.scanOverlay}>
          <Text style={styles.scanText}>Position QR code within the frame</Text>
        </View>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  cameraContainer: {
    width: '100%',
    height: 400,
    overflow: 'hidden',
    borderRadius: 15,
    marginVertical: 20,
    position: 'relative',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  scanOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    alignItems: 'center',
  },
  scanText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  permissionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  permissionSubText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
    opacity: 0.8,
  },
}); 