import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import MessagePopup from '@/components/MessagePopup';

interface MessagePopupContextProps {
  showMessagePopup: (props: MessagePopupProps) => void;
  closeMessagePopup: () => void;
}

const MessagePopupContext = createContext<MessagePopupContextProps | undefined>(undefined);

interface MessagePopupProviderProps {
  children: ReactNode;
}

export const MessagePopupProvider: React.FC<MessagePopupProviderProps> = ({ children }) => {
  const [popupProps, setPopupProps] = useState<MessagePopupProps | null>(null);

  const showMessagePopup = useCallback((props: MessagePopupProps) => {
    setPopupProps(props);
  }, []);

  const closeMessagePopup = useCallback(() => {
    setPopupProps(null);
  }, []);

  return (
    <MessagePopupContext.Provider value={{ showMessagePopup, closeMessagePopup }}>
      {children}
      {/* Render MessagePopup only when popupProps exist */}
      {popupProps && (
        <MessagePopup
          {...popupProps}
          onClose={() => {
            popupProps.onClose(); // Call the provided onClose callback
            closeMessagePopup(); // Close the popup
          }}
        />
      )}
    </MessagePopupContext.Provider>
  );
};

export const useMessagePopup = (): MessagePopupContextProps => {
  const context = useContext(MessagePopupContext);
  if (!context) {
    throw new Error('useMessagePopup must be used within a MessagePopupProvider');
  }
  return context;
};
