import React from 'react';
import FunnelHeader from './FunnelHeader';
import FunnelFooter from './FunnelFooter';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-background" data-theme="roi">
      <FunnelHeader title="Acrux | Calculadora ROI" />
      
      <main className="flex-1">
        {children}
      </main>

      <FunnelFooter />
    </div>
  );
}
