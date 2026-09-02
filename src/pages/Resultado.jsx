import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, DollarSign, Clock, Target, ArrowLeft, Download, Calculator, Users, Building2, ShieldCheck, User } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const formatCurrency = (num) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num || 0);

export default function Resultado() {
  const navigate = useNavigate();
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    const data = sessionStorage.getItem('acrux_calculadora_roi_resultado');
    if (data) {
      setResultado(JSON.parse(data));
      localStorage.setItem('lm-calculadora-roi-completed', 'true');
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  if (!resultado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 font-sans">
        <div className="text-center max-w-md bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
          <Calculator className="w-16 h-16 text-primary-300 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">No hay cálculo disponible</h2>
          <p className="text-slate-600 mb-6 text-sm">Ingresá los parámetros de tu empresa en el simulador para generar el reporte.</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la calculadora</span>
          </Link>
        </div>
      </div>
    );
  }

  const downloadPDFReport = async () => {
    setIsGeneratingPDF(true);
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 16;

      const NAVY = [13, 17, 26];
      const PRIMARY = [46, 134, 171];
      const GOLD = [245, 166, 35];
      const SLATE = [100, 116, 139];

      // Header
      doc.setFillColor(NAVY[0], NAVY[1], NAVY[2]);
      doc.rect(0, 0, pageWidth, 22, 'F');
      doc.setFillColor(GOLD[0], GOLD[1], GOLD[2]);
      doc.rect(0, 22, pageWidth, 1, 'F');

      doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('ACRUX ✦', margin, 14);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Auditoría Financiera de ROI en Transformación Cultural', pageWidth - margin, 12, { align: 'right' });

      doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('Metodología Organizacional ACRUX', pageWidth - margin, 17, { align: 'right' });

      let y = 30;

      doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Reporte de Proyección de Retorno ROI', margin, y);

      y += 6;
      doc.setTextColor(PRIMARY[0], PRIMARY[1], PRIMARY[2]);
      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'bold');
      doc.text(`Sector: ${resultado.sector} • ${resultado.empleados} colaboradores`, margin, y);

      y += 8;

      // KPI Card
      doc.setFillColor(NAVY[0], NAVY[1], NAVY[2]);
      doc.roundedRect(margin, y, pageWidth - margin * 2, 30, 3, 3, 'F');

      doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`Ahorro Anual Proyectado: ${formatCurrency(resultado.ahorroAnual)}`, margin + 6, y + 10);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Retorno ROI: +${resultado.roiPorcentual}% • Payback estimado: ${resultado.paybackMeses} meses`, margin + 6, y + 18);
      doc.text(`Pérdida Anual Oculta sin intervención: ${formatCurrency(resultado.costoProblemaAnual)}`, margin + 6, y + 25);

      y += 36;

      const runAutoTable = (options) => {
        try {
          if (typeof autoTable === 'function') {
            autoTable(doc, options);
          } else if (typeof doc.autoTable === 'function') {
            doc.autoTable(options);
          }
        } catch (e) {
          console.warn('AutoTable fallback:', e);
        }
      };

      runAutoTable({
        startY: y,
        head: [['Factor de Pérdida Oculta', 'Monto Anual (USD)', 'Impacto Organizacional']],
        body: [
          ['Rotación y Reemplazo de Personal', formatCurrency(resultado.costoRotacion), 'Costo de Reclutamiento & Onboarding'],
          ['Desgaste Emocional & Ausentismo', formatCurrency(resultado.costoAusentismo), 'Pérdida de Capacidad Cognitiva'],
          ['Brechas de Liderazgo & Desconexión', formatCurrency(resultado.costoProductividad), 'Ineficiencia en Procesos y Proyectos'],
        ],
        theme: 'grid',
        headStyles: { fillColor: [NAVY[0], NAVY[1], NAVY[2]], textColor: [255, 255, 255], fontStyle: 'bold' },
        styles: { fontSize: 8.5 },
      });

      // Footer
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
      doc.setTextColor(SLATE[0], SLATE[1], SLATE[2]);
      doc.setFontSize(8);
      doc.text('ACRUX Consultores S.A.S. • NIT 900.230.435-1 • acrux.life', margin, pageHeight - 6);
      doc.text('Página 1 de 1', pageWidth - margin, pageHeight - 6, { align: 'right' });

      doc.save(`Auditoria_ROI_ACRUX_${resultado.sector.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans space-y-8 pb-16">
      {/* Hero Header */}
      <section className="bg-gradient-to-br from-[#0D111A] via-[#1B2A4A] to-[#0D111A] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/20 border border-accent/30 text-accent font-bold text-xs uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            Análisis de Retorno de Inversión • ACRUX
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight">
            Resultados de Auditoría: <span className="text-accent">{resultado.sector}</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Simulación para equipo de <strong className="text-white">{resultado.empleados} colaboradores</strong> con masa salarial ajustada.
          </p>
        </div>
      </section>

      {/* KPI Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-200/80 space-y-2 text-left">
            <span className="text-xs font-bold text-slate-400 uppercase font-mono">Pérdida Anual Oculta</span>
            <div className="text-3xl font-black text-red-500 font-mono">{formatCurrency(resultado.costoProblemaAnual)}</div>
            <p className="text-xs text-slate-500">Pérdida estimada sin intervención cultural.</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-200/80 space-y-2 text-left">
            <span className="text-xs font-bold text-slate-400 uppercase font-mono">Ahorro Anual Proyectado</span>
            <div className="text-3xl font-black text-emerald-600 font-mono">{formatCurrency(resultado.ahorroAnual)}</div>
            <p className="text-xs text-slate-500">Recuperación estimada con metodología ACRUX.</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-200/80 space-y-2 text-left">
            <span className="text-xs font-bold text-slate-400 uppercase font-mono">ROI Proyectado</span>
            <div className="text-3xl font-black text-accent font-mono">+{resultado.roiPorcentual}%</div>
            <p className="text-xs text-slate-500">Retorno sobre la inversión estimada.</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-200/80 space-y-2 text-left">
            <span className="text-xs font-bold text-slate-400 uppercase font-mono">Payback Estimado</span>
            <div className="text-3xl font-black text-primary-700 font-mono">{resultado.paybackMeses} meses</div>
            <p className="text-xs text-slate-500">Tiempo estimado de recupero de inversión.</p>
          </div>
        </div>
      </section>

      {/* Breakdown & CTAs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Executive Breakdown */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 text-left space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="font-display text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-primary-600" />
                Resumen Ejecutivo de la Auditoría
              </h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <p>
                Para una organización de <strong className="text-slate-900 font-bold">{resultado.empleados} colaboradores</strong> en el sector <strong className="text-slate-900 font-bold">{resultado.sector}</strong>, el costo anual estimado derivado de rotación, ausentismo y brechas de liderazgo asciende a <strong className="text-red-600 font-bold font-mono">{formatCurrency(resultado.costoProblemaAnual)}</strong>.
              </p>

              <p>
                Implementando un programa de transformación cultural con acompañamiento estratégico de ACRUX, proyectamos un ahorro anual de <strong className="text-emerald-700 font-bold font-mono">{formatCurrency(resultado.ahorroAnual)}</strong>, generando un retorno de <strong className="text-primary-700 font-bold font-mono">+{resultado.roiPorcentual}% ROI</strong> con recupero en <strong className="text-slate-900 font-bold">{resultado.paybackMeses} meses</strong>.
              </p>

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-700">
                  <strong className="text-slate-900 font-bold">Conclusión Directiva:</strong> La inversión en la salud de los sistemas humanos de tu empresa genera retornos financieros directos y medibles a corto y mediano plazo.
                </p>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="bg-gradient-to-br from-[#0D111A] via-[#1B2A4A] to-[#0D111A] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-accent/30 text-left space-y-6 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full bg-accent/20 text-accent font-bold text-xs uppercase tracking-wider font-mono">
                Próximo Paso Recomendado
              </span>

              <h3 className="text-xl font-bold font-display text-white">Agendá una Sesión de Validación Estratégica</h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                Presentá esta simulación financiera a los expertos de ACRUX para calibrar los datos específicos de tu nómina.
              </p>
            </div>

            <div className="space-y-3 pt-4">
              <button
                onClick={downloadPDFReport}
                disabled={isGeneratingPDF}
                className="w-full py-3.5 bg-white text-primary-900 font-bold text-xs sm:text-sm rounded-xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-primary-600" />
                <span>{isGeneratingPDF ? 'Generando PDF...' : 'Descargar Informe PDF'}</span>
              </button>

              <a
                href="https://acrux.life/agendar"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-accent text-primary-900 font-bold text-xs sm:text-sm rounded-xl hover:bg-accent-dark transition-all flex items-center justify-center gap-2 text-center shadow-md"
              >
                <User className="w-4 h-4" />
                <span>Agendar Sesión con Consultor</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}