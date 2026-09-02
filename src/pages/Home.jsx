import { useState, useId } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calculator, TrendingUp, Users, DollarSign, Clock, ShieldCheck, ArrowRight, Sparkles, Building2, HelpCircle, Activity, Heart, Award } from 'lucide-react';
import { AcruxApiClient } from '@acrux/api-client';

const SECTORES = [
  { value: 'tecnologia', label: 'Tecnología / Software', factor: 1.35 },
  { value: 'servicios', label: 'Servicios Profesionales / Consultoría', factor: 1.25 },
  { value: 'finanzas', label: 'Finanzas / Banca / Seguros', factor: 1.40 },
  { value: 'salud', label: 'Salud / Farmacéutica', factor: 1.30 },
  { value: 'manufactura', label: 'Manufactura / Industria', factor: 1.15 },
  { value: 'retail', label: 'Retail / Consumo Masivo', factor: 1.10 },
  { value: 'otro', label: 'Otro Sector', factor: 1.0 },
];

const RIESGOS = [
  { value: 'bajo', label: '🟢 Leve (Rotación ~8%)', rotacionPct: 0.08, burnoutFactor: 0.8, desc: 'Fugas esporádicas de talento.' },
  { value: 'moderado', label: '🟡 Moderado (Rotación ~18%)', rotacionPct: 0.18, burnoutFactor: 1.2, desc: 'Fatiga constante en áreas clave.' },
  { value: 'severo', label: '🔴 Severo (Rotación ~32%)', rotacionPct: 0.32, burnoutFactor: 1.8, desc: 'Burnout alto y pérdida continua de talento.' },
];

export default function Home() {
  const navigate = useNavigate();
  const emailInputId = useId();
  const consentCheckboxId = useId();

  // Interactive State
  const [numEmpleados, setNumEmpleados] = useState(80);
  const [salarioMensual, setSalarioMensual] = useState(2500); // USD/month
  const [sectorValue, setSectorValue] = useState('tecnologia');
  const [riesgoValue, setRiesgoValue] = useState('moderado');

  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Benchmarked Math Logic
  const sector = SECTORES.find(s => s.value === sectorValue) || SECTORES[0];
  const riesgo = RIESGOS.find(r => r.value === riesgoValue) || RIESGOS[1];

  const masaSalarialAnual = numEmpleados * salarioMensual * 12;

  // 1. Cost of Turnover (Gallup/McKinsey: replacing an employee costs ~6 months salary)
  const empleadosQueRotan = Math.max(1, Math.round(numEmpleados * riesgo.rotacionPct));
  const costoRotacion = Math.round(empleadosQueRotan * (salarioMensual * 6) * sector.factor);

  // 2. Cost of Burnout & Disengagement (18% disengaged * 20% lost productivity)
  const costoBurnout = Math.round((numEmpleados * 0.18) * (salarioMensual * 12 * 0.20) * riesgo.burnoutFactor * sector.factor);

  // 3. Cost of Leadership & Friction (5% wasted efficiency)
  const costoFriccion = Math.round(masaSalarialAnual * 0.05 * sector.factor);

  // Total Annual Hidden Loss
  const costoOcultoAnual = costoRotacion + costoBurnout + costoFriccion;

  // ACRUX Transformation Impact (40% recovery)
  const ahorroAnualProyectado = Math.round(costoOcultoAnual * 0.40);

  // ACRUX Investment Benchmark
  const montoInversionEst = Math.round(numEmpleados <= 30 ? 15000 : numEmpleados <= 150 ? 38000 : 95000);
  const roiPorcentualEst = Math.round(((ahorroAnualProyectado - montoInversionEst) / montoInversionEst) * 100);
  const paybackMesesEst = parseFloat((montoInversionEst / (ahorroAnualProyectado / 12)).toFixed(1));

  const formatCurrency = (num) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Ingresá tu email para generar el reporte de auditoría en PDF';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Formato de correo electrónico inválido';
    if (!consent) newErrors.consent = 'Debes aceptar la política de privacidad';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const resultado = {
      sector: sector.label,
      empleados: numEmpleados,
      salarioMensual,
      montoInversion: montoInversionEst,
      duracion: numEmpleados <= 50 ? '3 meses' : '6 a 12 meses',
      costoProblemaAnual: costoOcultoAnual,
      ahorroAnual: ahorroAnualProyectado,
      roiPorcentual: roiPorcentualEst,
      paybackMeses: paybackMesesEst,
      costoRotacion,
      costoAusentismo: costoBurnout,
      costoProductividad: costoFriccion,
      empleadosQueRotan,
      email,
    };

    try {
      const client = new AcruxApiClient();
      await client.submitLead({
        email,
        product: 'calculadora-roi',
        score: roiPorcentualEst,
        profile: sector.label,
        answers: {
          empleados: numEmpleados,
          salarioMensual,
          ahorroAnual: ahorroAnualProyectado,
          paybackMeses: paybackMesesEst,
          montoInversion: montoInversionEst,
        },
        gdpr_consent: consent,
      });
    } catch (apiErr) {
      console.warn('API sync fallback:', apiErr);
    }

    sessionStorage.setItem('acrux_calculadora_roi_resultado', JSON.stringify(resultado));
    sessionStorage.setItem('acrux_calculadora_roi_completed', 'true');

    navigate('/resultado');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0D111A] via-[#1B2A4A] to-[#0D111A] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/15 border border-accent/30 text-accent font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            Simulador Financiero de Retorno • Metodología ACRUX
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Cuantificá el <span className="text-accent underline decoration-accent/50">costo oculto del desgaste</span> y proyectá tu ROI
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Descubrí el impacto económico de la rotación involuntaria y la fatiga en tu equipo, y medí el retorno financiero de implementar la metodología de transformación de <strong>ACRUX Consultores</strong>.
          </p>
        </div>
      </section>

      {/* Main Calculator Workspace */}
      <section id="calculadora" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Interactive Controls (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200/80 space-y-8 text-left">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="font-display text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Calculator className="w-6 h-6 text-primary-600" />
                  Parámetros de tu Organización
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Ajustá los parámetros clave para calcular las fugas de capital en tiempo real.
                </p>
              </div>

              {/* Slider 1: Número de Empleados */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-primary-600" />
                    Número de Colaboradores
                  </label>
                  <span className="text-base font-black text-primary-700 font-mono bg-primary-50 px-3 py-1 rounded-xl border border-primary-100">
                    {numEmpleados} colaboradores
                  </span>
                </div>

                <input
                  type="range"
                  min="10"
                  max="1000"
                  step="10"
                  value={numEmpleados}
                  onChange={(e) => setNumEmpleados(Number(e.target.value))}
                  className="w-full accent-primary-600 cursor-pointer h-2.5 bg-slate-200 rounded-lg"
                />

                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] font-bold text-slate-400 font-mono">Presets rápidos:</span>
                  {[25, 80, 200, 500].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setNumEmpleados(preset)}
                      className={`px-3 py-1 text-xs font-mono font-bold rounded-xl border transition-all ${
                        numEmpleados === preset
                          ? 'bg-primary-600 text-white border-primary-600 shadow-xs'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {preset} emp
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider 2: Salario Promedio Mensual */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-primary-600" />
                    Salario Promedio Mensual (USD)
                  </label>
                  <span className="text-base font-black text-primary-700 font-mono bg-primary-50 px-3 py-1 rounded-xl border border-primary-100">
                    {formatCurrency(salarioMensual)} / mes
                  </span>
                </div>

                <input
                  type="range"
                  min="1000"
                  max="8000"
                  step="250"
                  value={salarioMensual}
                  onChange={(e) => setSalarioMensual(Number(e.target.value))}
                  className="w-full accent-primary-600 cursor-pointer h-2.5 bg-slate-200 rounded-lg"
                />
              </div>

              {/* Selector 3: Nivel de Rotación y Burnout */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-primary-600" />
                  Nivel de Rotación &amp; Desgaste Estimado
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {RIESGOS.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setRiesgoValue(r.value)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        riesgoValue === r.value
                          ? 'bg-primary-50 border-primary-500 shadow-sm ring-1 ring-primary-500'
                          : 'bg-slate-50 border-slate-200/80 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900 mb-1">{r.label}</div>
                      <div className="text-[11px] text-slate-500 leading-tight">{r.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector 4: Sector Industrial */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-primary-600" />
                  Sector Industrial
                </label>
                <select
                  value={sectorValue}
                  onChange={(e) => setSectorValue(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 outline-hidden focus:ring-2 focus:ring-primary-500 cursor-pointer"
                >
                  {SECTORES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Lead Capture Form */}
              <form onSubmit={handleSubmit} className="pt-6 border-t border-slate-100 space-y-4" noValidate>
                <div className="space-y-1.5">
                  <label htmlFor={emailInputId} className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                    Correo Corporativo para Generar Auditoría en PDF *
                  </label>
                  <input
                    id={emailInputId}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu.nombre@empresa.com"
                    className="w-full px-4 py-3.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 outline-hidden focus:ring-2 focus:ring-primary-500"
                  />
                  {errors.email && <p className="text-xs text-red-500 font-semibold">{errors.email}</p>}
                </div>

                <div className="space-y-1">
                  <label htmlFor={consentCheckboxId} className="flex items-center gap-2 cursor-pointer">
                    <input
                      id={consentCheckboxId}
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="w-4 h-4 rounded-md accent-primary-600"
                    />
                    <span className="text-xs text-slate-600">
                      Acepto la <a href="https://acrux.life/privacidad" target="_blank" rel="noopener noreferrer" className="underline font-bold text-slate-800">Política de Privacidad</a> y tratamiento de datos.
                    </span>
                  </label>
                  {errors.consent && <p className="text-xs text-red-500 font-semibold">{errors.consent}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-accent hover:bg-accent-dark text-primary-900 font-black text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
                >
                  <span>{isSubmitting ? 'Generando Auditoría PDF...' : 'Generar Reporte Completo en PDF & ROI'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>

            {/* Right Column: Live Calculation Dashboard (5 cols) */}
            <div className="lg:col-span-5 space-y-6 sticky top-24">
              {/* Cost & Savings Summary Box */}
              <div className="bg-gradient-to-br from-[#0D111A] via-[#1B2A4A] to-[#0D111A] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-accent/30 space-y-6 text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-accent/10 rounded-full blur-2xl pointer-events-none" />

                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-accent font-mono">
                    💸 Pérdida Anual Oculta Estimada
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-red-400 font-mono tracking-tight">
                    {formatCurrency(costoOcultoAnual)}
                  </div>
                  <p className="text-xs text-slate-300">
                    Pérdida anual proyectada por ~{empleadosQueRotan} bajas de talento y desgaste en {numEmpleados} colaboradores.
                  </p>
                </div>

                {/* Savings & ROI Pill */}
                <div className="bg-white/10 border border-white/15 rounded-2xl p-5 space-y-3 backdrop-blur-xs">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <span className="text-[11px] font-bold text-accent uppercase font-mono">Ahorro Anual Proyectado</span>
                      <div className="text-2xl font-black text-emerald-400 font-mono">{formatCurrency(ahorroAnualProyectado)}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-bold text-slate-300 uppercase font-mono">ROI Proyectado</span>
                      <div className="text-2xl font-black text-accent font-mono">+{roiPorcentualEst}%</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
                    <span>⏱️ Payback de Inversión:</span>
                    <strong className="text-white font-bold">{paybackMesesEst} meses</strong>
                  </div>
                </div>

                {/* Factor Breakdown List */}
                <div className="space-y-2.5 pt-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                    Desglose de Pérdidas por Factor:
                  </span>

                  <div className="space-y-2">
                    <div className="bg-white/5 p-2.5 rounded-xl flex items-center justify-between text-xs border border-white/10">
                      <span className="text-slate-300 font-medium">• Rotación de Personal (~{empleadosQueRotan} bajas/año)</span>
                      <span className="font-mono font-bold text-white">{formatCurrency(costoRotacion)}</span>
                    </div>

                    <div className="bg-white/5 p-2.5 rounded-xl flex items-center justify-between text-xs border border-white/10">
                      <span className="text-slate-300 font-medium">• Desgaste Emocional &amp; Ausentismo</span>
                      <span className="font-mono font-bold text-white">{formatCurrency(costoBurnout)}</span>
                    </div>

                    <div className="bg-white/5 p-2.5 rounded-xl flex items-center justify-between text-xs border border-white/10">
                      <span className="text-slate-300 font-medium">• Fricción de Liderazgo &amp; Procesos</span>
                      <span className="font-mono font-bold text-white">{formatCurrency(costoFriccion)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reassurance Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md text-left space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-primary-700 uppercase tracking-wider font-mono">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Garantía Metodológica ACRUX
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Basado en estándares internacionales de Retorno en Capital Humano (ROI-HC), Gallup Workplace Science y modelos de riesgo psicosocial MBI-HSS.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}