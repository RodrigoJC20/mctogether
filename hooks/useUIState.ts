import { useState } from 'react';

export const useUIState = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(1);

  return {
    modalVisible,
    setModalVisible,
    currentUserId,
    setCurrentUserId,
  };
}; 