// src/components/ChatInterface.tsx
import React from 'react';

interface ChatInterfaceProps {
  message: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ message }) => {
  return (
    <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <p><strong>Gemini:</strong> {message}</p>
    </div>
  );
};

export default ChatInterface;
