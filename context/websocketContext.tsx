// websocketContext.tsx
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import Constants from 'expo-constants';
import { ReactNode } from 'react';

const SOCKET_SERVER_URL = Constants.expoConfig?.extra?.apiBaseUrl || 'http://localhost:3000';

interface WebSocketContextType {
  connect: () => void;
  disconnect: () => void;
  sendMessage: (message: string) => void;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType>({
  connect: () => {},
  disconnect: () => {},
  sendMessage: () => {},
  isConnected: false,
});

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    if (socket) return;
    
    const newSocket = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
      autoConnect: false
    });
    
    newSocket.on('connect', () => {
      console.log('Socket.IO connection opened');
      setIsConnected(true);
    });
    
    newSocket.on('disconnect', () => {
      console.log('Socket.IO connection closed');
      setIsConnected(false);
    });
    
    newSocket.on('error', (error) => {
      console.error('Socket.IO error:', error);
    });
    
    newSocket.connect();
    setSocket(newSocket);
  }, [socket]);

  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  }, [socket]);

  const sendMessage = useCallback((message: string) => {
    if (socket && isConnected) {
      const payload = { msg: message };
      socket.emit('mensaje', payload);
    } else {
      console.error('Socket.IO is not connected');
    }
  }, [socket, isConnected]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  return (
    <WebSocketContext.Provider value={{ connect, disconnect, sendMessage, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
};