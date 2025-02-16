 import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const root = createRoot(document.getElementById('root')!)
root.render(
  <StrictMode>
    <App />
  </StrictMode>
)

// import React from 'react';
// // main.tsx
// import ReactDOM from 'react-dom/client';
// import App from './App';
// import { worker } from './mocks/browser'; // Use the worker from here

// // Start the Service Worker for mocking backend responses
// worker.start().then(() => {
//   const root = ReactDOM.createRoot(document.getElementById('root')!);
//   root.render(
//     <React.StrictMode>
//       <App />
//     </React.StrictMode>
//   );
// });
