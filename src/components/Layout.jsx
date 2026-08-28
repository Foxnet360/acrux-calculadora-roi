import React from 'react';
import { Navbar, Footer } from '@acrux/ui';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-background" data-theme="roi">
      <Navbar
        brandName="Acrux Consultores"
        productBadge="Calculadora ROI"
        navLinks={[
          { to: 'https://acrux.life', label: 'Volver a acrux.life' },
          { to: 'https://acrux.life/digital-h', label: 'DIGITAL-H' },
          { to: 'https://acrux.life/pulso-h', label: 'PULSO-H' },
        ]}
        ctaLabel="Agendar consultoría"
        ctaHref="https://calendly.com/acrux-consultores/30min"
        theme="roi"
      />
      
      <main className="flex-1 pt-20">
        {children}
      </main>

      <Footer
        productName="Calculadora ROI Transformación"
        nit="900.230.435-1"
        tagline="Transformación Organizacional desde Psicología y Trabajo Social"
        showNewsletter={true}
      />
    </div>
  );
}
