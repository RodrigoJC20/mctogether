import React, { ReactNode, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated, Dimensions } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { Image } from 'react-native';
import { PartyModal } from '../components/PartyModal';
import { useUIState } from '../hooks/useUIState';
import { usePartyState } from '../hooks/usePartyState';

const { width } = Dimensions.get('window');
const PANEL_WIDTH = width * 0.75;

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { modalVisible, setModalVisible } = useUIState();
  const { groupId } = usePartyState();
  const [panelVisible, setPanelVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(PANEL_WIDTH))[0];
  
  // Check if user is in a party
  const isInParty = !!groupId;

  const handleLogout = async () => {
    await logout();
    closePanel();
  };

  const openPanel = () => {
    setPanelVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closePanel = () => {
    Animated.timing(slideAnim, {
      toValue: PANEL_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setPanelVisible(false);
    });
  };

  // Navigation routes and their icons
  const routes = {
    '/medals': { icon: 'trophy', label: 'Medals', component: FontAwesome5 },
    '/coupons': { icon: 'ticket-alt', label: 'Coupons', component: FontAwesome5 },
    '/': { icon: 'home', label: 'Home', component: FontAwesome5 },
    '/items': { icon: 'pets', label: 'Pets', component: MaterialIcons },
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={() => router.push('/shop')}
          >
            <FontAwesome5 
              name="shopping-bag" 
              size={24} 
              color={pathname === '/shop' ? '#FFBC0D' : 'black'} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={() => router.push('/menu')}
          >
            <MaterialIcons 
              name="restaurant-menu" 
              size={24} 
              color={pathname === '/menu' ? '#FFBC0D' : 'black'} 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.headerCenter}>
          <Text style={styles.logoText}>
            <Text style={styles.logoTextMc}>Mc</Text>
            <Text style={styles.logoTextTogether}>Together</Text>
          </Text>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.currencyContainer}>
            <Image 
              source={require('../assets/images/coin.png')} 
              style={styles.coinImage}
            />
            <Text style={styles.currencyText}>{user?.currency || 0}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.content}>
        {children}
      </View>

      {/* Party Button (Half Circle above footer) */}
      <View style={styles.partyButtonContainer}>
        <TouchableOpacity 
          style={[
            styles.partyButton, 
            isInParty ? styles.partyButtonActive : null
          ]} 
          onPress={() => setModalVisible(true)}
        >
          {isInParty ? (
            <FontAwesome5 name="qrcode" size={24} color="white" />
          ) : (
            <Ionicons name="people" size={24} color="white" />
          )}
        </TouchableOpacity>
      </View>
      
      <View style={styles.footer}>
        {Object.entries(routes).map(([route, { icon, component: IconComponent }]) => (
          <React.Fragment key={route}>
            <TouchableOpacity 
              style={styles.footerButton} 
              onPress={() => router.push(route as keyof typeof routes)}
            >
              <IconComponent 
                name={icon} 
                size={24} 
                color={pathname === route ? '#FFBC0D' : 'black'} 
              />
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
          </React.Fragment>
        ))}
        <TouchableOpacity style={styles.footerButton} onPress={openPanel}>
            <MaterialIcons name="menu" size={28} color="black" />
        </TouchableOpacity>
      </View>

      {/* Party Modal */}
      <PartyModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />

      {/* Side Panel */}
      {panelVisible && (
        <View style={styles.panelOverlay}>
          <TouchableOpacity 
            style={styles.panelOverlayTouch} 
            activeOpacity={1} 
            onPress={closePanel} 
          />
          <Animated.View 
            style={[
              styles.sidePanel, 
              { transform: [{ translateX: slideAnim }] }
            ]}
          >
            <View style={styles.panelHeader}>
              <View style={styles.userInfoContainer}>
                <FontAwesome5 name="user-circle" size={30} color="black" />
                <Text style={styles.usernameText}>{user?.username}</Text>
              </View>
            </View>
            
            <View style={styles.panelContent}>
              <TouchableOpacity style={styles.panelItem}>
                <MaterialIcons name="settings" size={24} color="black" />
                <Text style={styles.panelItemText}>Settings</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.panelItem}>
                <MaterialIcons name="help" size={24} color="black" />
                <Text style={styles.panelItemText}>Help</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <MaterialIcons name="exit-to-app" size={24} color="white" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: 45,
    paddingBottom: 10,
    paddingHorizontal: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    justifyContent: 'flex-end',
  },
  logoText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  logoTextMc: {
    color: '#FFBC0D', // McDonald's yellow
  },
  logoTextTogether: {
    color: 'black',
  },
  iconButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  coinImage: {
    width: 24,
    height: 24,
  },
  currencyText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  partyButtonContainer: {
    position: 'absolute',
    bottom: 75, // Increased from 60 to create more space
    alignSelf: 'center',
    zIndex: 20,
  },
  partyButton: {
    backgroundColor: '#FFBC0D', // McDonald's yellow
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 3,
    borderColor: 'white',
  },
  partyButtonActive: {
    backgroundColor: '#DA291C', // McDonald's red for active party
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: 20, // Increased from 15 to add more space between party button and footer
    paddingBottom: 25,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 10,
  },
  footerButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  divider: {
    width: 1,
    height: '70%',
    backgroundColor: 'black',
    opacity: 0.2,
  },
  // Side Panel Styles
  panelOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  panelOverlayTouch: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sidePanel: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: PANEL_WIDTH,
    height: '100%',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: -2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    display: 'flex',
    flexDirection: 'column',
  },
  panelHeader: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  usernameText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  panelContent: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  panelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 15,
  },
  panelItemText: {
    fontSize: 16,
    color: 'black',
  },
  logoutButton: {
    backgroundColor: '#DA291C', // McDonald's red
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    gap: 10,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});