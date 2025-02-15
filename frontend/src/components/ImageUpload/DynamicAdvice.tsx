import React, { useState } from 'react';

interface DynamicAdviceProps {
  analysisId?: string;
}

const DynamicAdvice: React.FC<DynamicAdviceProps> = ({ analysisId }) => {
  const [chatResponse, setChatResponse] = useState<string | null>(null);

  const requestDynamicAdvice = async (mvpType: 'skinCare' | 'hairStyle' | 'looksMax') => {
    if (!analysisId) return alert('No analysis data available.');
    try {
      const response = await fetch('http://localhost:3001/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mvpType, analysisId }),
      });
      const data = await response.json();
      setChatResponse(data.response);
    } catch (error) {
      console.error('Error fetching advice:', error);
    }
  };

  return (
    <div>
      <h2>Dynamic Gemini Chat</h2>
      <button onClick={() => requestDynamicAdvice('skinCare')}>Skin Care Advice</button>
      <button onClick={() => requestDynamicAdvice('hairStyle')}>Hair Style Advice</button>
      <button onClick={() => requestDynamicAdvice('looksMax')}>Looks Max Score</button>
      {chatResponse && <p>{chatResponse}</p>}
    </div>
  );
};

export default DynamicAdvice;
