// src/ui/Header.tsx
import React from 'react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header style={{ padding: '20px', backgroundColor: '#eee', marginBottom: '20px' }}>
      <h1>{title}</h1>
    </header>
  );
};

export default Header;
