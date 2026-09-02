import React from 'react';
import { ArrowLeft, ShieldCheck, ArrowRight } from 'lucide-react';

export default function FunnelHeader({ onVolverClick, title = "Calculadora ROI", showBackButton = true }) {
  const handleVolver = (e) => {
    if (!showBackButton) {
      e.preventDefault();
      return;
    }
    if (onVolverClick) {
      onVolverClick(e);
    } else {
      window.location.href = 'https://acrux.life';
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0D111A] border-b-2 border-accent/40 shadow-2xl font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            <div className="flex-shrink-0 flex items-center gap-3">
              {showBackButton ? (
                <a
                  className="flex items-center gap-3 group"
                  href="https://acrux.life"
                  onClick={handleVolver}
                >
                  <div className="bg-white/10 border border-white/20 p-1.5 rounded-xl flex items-center justify-center shadow-xs group-hover:border-accent transition-all">
                    <img src="/logo.png" alt="ACRUX" className="h-7 sm:h-8 w-auto object-contain" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-display font-black tracking-tight text-white text-sm sm:text-base leading-none group-hover:text-accent transition-colors">
                      ACRUX <span className="text-accent text-xs">✦</span>
                    </span>
                    <span className="text-[10px] uppercase font-bold text-accent tracking-widest mt-1">
                      {title}
                    </span>
                  </div>
                </a>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 border border-white/20 p-1.5 rounded-xl flex items-center justify-center shadow-xs">
                    <img src="/logo.png" alt="ACRUX" className="h-7 sm:h-8 w-auto object-contain" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-display font-black tracking-tight text-white text-sm sm:text-base leading-none">
                      ACRUX <span className="text-accent text-xs">✦</span>
                    </span>
                    <span className="text-[10px] uppercase font-bold text-accent tracking-widest mt-1">
                      {title}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden lg:flex items-center">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-accent font-bold text-xs uppercase tracking-wider font-mono">
                <ShieldCheck className="w-4 h-4 text-accent" />
                Simulador Financiero de Liderazgo • 100% Confidencial
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-3">
              {showBackButton && (
                <a
                  href="https://acrux.life"
                  onClick={handleVolver}
                  className="text-white font-bold text-xs px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 hover:border-accent transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-accent" />
                  <span>Volver a ACRUX</span>
                </a>
              )}
              <a
                href="https://acrux.life/agendar"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-accent text-primary-900 font-black px-4 py-2.5 rounded-xl text-xs hover:bg-accent-dark transition-all shadow-md flex items-center gap-1.5"
              >
                <span>Agendar Sesión</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="flex md:hidden items-center gap-2">
              {showBackButton && (
                <a
                  href="https://acrux.life"
                  onClick={handleVolver}
                  className="text-white p-2 rounded-xl bg-white/10 border border-white/20 flex items-center"
                  aria-label="Volver a ACRUX"
                >
                  <ArrowLeft className="w-5 h-5 text-accent" />
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>
      <div className="h-18" />
    </>
  );
}
