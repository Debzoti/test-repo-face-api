// src/pages/Home.tsx
import React from 'react';
import Header from '../ui/Header';
import ImageUpload from '../components/ImageUpload';

const Home: React.FC = () => {
  return (
    <div>
      <Header title="Face Analysis & Dynamic Advice" />
      <ImageUpload />
    </div>
  );
};

export default Home;
