import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Calculator, TrendingUp, Users, Target, ArrowRight } from 'lucide-react'
import { AcruxApiClient } from '@acrux/api-client'
import CTAButton from '@acrux/design-tokens/components/CTAButton'

// Configuración de la calculadora
const SECTORES = [
  { value: 'tecnologia', label: 'Tecnología / Software', factor: 1.4 },
  { value: 'servicios', label: 'Servicios Profesionales', factor: 1.3 },
  { value: 'manufactura', label: 'Manufactura / Industrial', factor: 1.2 },
  { value: 'salud', label: 'Salud / Farmacéutica', factor: 1.35 },
  { value: 'finanzas', label: 'Finanzas / Seguros', factor: 1.45 },
  { value: 'retail', label: 'Retail / Consumo', factor: 1.15 },
  { value: 'educacion', label: 'Educación / ONG', factor: 1.1 },
  { value: 'otro', label: 'Otro', factor: 1.0 },
]

const TAMANOS = [
  { value: 'pequena', label: 'Pequeña (1-50 empleados)', multiplicador: 1, empleados: 25 },
  { value: 'mediana', label: 'Mediana (51-250 empleados)', multiplicador: 3, empleados: 125 },
  { value: 'grande', label: 'Grande (251-1000 empleados)', multiplicador: 8, empleados: 500 },
  { value: 'empresa', label: 'Empresa (1000+ empleados)', multiplicador: 20, empleados: 2500 },
]

const PROBLEMAS = [
  { value: 'rotacion', label: 'Alta rotación de talento', costoBase: 0.15 },
  { value: 'productividad', label: 'Baja productividad/engagement', costoBase: 0.12 },
  { value: 'liderazgo', label: 'Brechas de liderazgo', costoBase: 0.18 },
  { value: 'cultura', label: 'Cultura tóxica / desalineada', costoBase: 0.22 },
  { value: 'cambio', label: 'Resistencia al cambio / transformación fallida', costoBase: 0.20 },
  { value: 'bienestar', label: 'Burnout / bajo bienestar', costoBase: 0.16 },
]

const INVERSIONES = [
  { value: 'diagnostico', label: 'Solo Diagnóstico (DIGITAL-H / PULSO-H)', monto: 15000, duracion: '2-3 semanas' },
  { value: 'piloto', label: 'Piloto 1 área / equipo', monto: 45000, duracion: '3 meses' },
  { value: 'programa', label: 'Programa integral transformación', monto: 120000, duracion: '6-12 meses' },
  { value: 'enterprise', label: 'Transformación enterprise multi-país', monto: 350000, duracion: '12-24 meses' },
]

export default function Home() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    sector: '',
    tamano: '',
    problema: '',
    inversion: '',
    email: '',
    consent: false,
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.sector) newErrors.sector = 'Selecciona tu sector'
    if (!formData.tamano) newErrors.tamano = 'Selecciona el tamaño de tu organización'
    if (!formData.problema) newErrors.problema = 'Selecciona el problema principal'
    if (!formData.inversion) newErrors.inversion = 'Selecciona el tipo de inversión'
    if (!formData.email) newErrors.email = 'Email requerido para enviar resultados'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email inválido'
    if (!formData.consent) newErrors.consent = 'Debes aceptar la política de privacidad'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calcularROI = (data) => {
    const sector = SECTORES.find(s => s.value === data.sector)
    const tamano = TAMANOS.find(t => t.value === data.tamano)
    const problema = PROBLEMAS.find(p => p.value === data.problema)
    const inversion = INVERSIONES.find(i => i.value === data.inversion)

    if (!sector || !tamano || !problema || !inversion) return null

    // Cálculo simplificado de ROI
    const salarioPromedio = 45000 // USD/año
    const costoProblemaAnual = tamano.empleados * salarioPromedio * problema.costoBase * sector.factor
    const ahorroAnual = costoProblemaAnual * 0.35 // Asumimos 35% de mejora
    const roiPorcentual = ((ahorroAnual - inversion.monto) / inversion.monto) * 100
    const paybackMeses = (inversion.monto / (ahorroAnual / 12)).toFixed(1)

    return {
      sector: sector.label,
      tamano: tamano.label,
      problema: problema.label,
      inversion: inversion.label,
      montoInversion: inversion.monto,
      duracion: inversion.duracion,
      empleados: tamano.empleados,
      costoProblemaAnual: Math.round(costoProblemaAnual),
      ahorroAnual: Math.round(ahorroAnual),
      roiPorcentual: Math.round(roiPorcentual),
      paybackMeses: parseFloat(paybackMeses),
      factorSector: sector.factor,
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)

    try {
      const resultado = calcularROI(formData)
      if (!resultado) throw new Error('Error en cálculo')

      // Enviar a API unificada backend
      try {
        const client = new AcruxApiClient();
        await client.submitLead({
          email: formData.email,
          product: 'calculadora-roi',
          score: resultado.roiPorcentual,
          profile: resultado.sector,
          answers: {
            tamano: formData.tamano,
            problema: formData.problema,
            inversion: formData.inversion,
            ahorroAnual: resultado.ahorroAnual,
            paybackMeses: resultado.paybackMeses,
            montoInversion: resultado.montoInversion,
          },
          gdpr_consent: formData.consent,
        });
      } catch (apiErr) {
        console.warn('API sync warning (continuing with local calculation display):', apiErr);
      }

      // Guardar en sessionStorage para página de resultados
      sessionStorage.setItem('acrux_calculadora_roi_resultado', JSON.stringify(resultado))
      sessionStorage.setItem('acrux_calculadora_roi_completed', 'true')

      navigate('/resultado')
    } catch (error) {
      console.error('Error:', error)
      setErrors({ submit: 'Error al procesar. Intenta de nuevo o contáctanos directamente.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCurrency = (num) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(num)

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary text-white py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-secondary/50" />
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 1200 600" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" stroke-width="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-primary text-sm font-bold rounded-full mb-6">
              <Calculator className="w-4 h-4" />
              Lead Magnet ACRUX
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Calculadora de ROI
              <br />
              <span className="text-accent">Transformación Organizacional</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              Descubre cuánto puedes ahorrar y el retorno de inversión de transformar tu cultura organizacional con la metodología ACRUX. Basado en 20+ años de Psicología y Trabajo Social aplicados a empresas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => document.getElementById('calculadora').scrollIntoView({ behavior: 'smooth' })}
                className="bg-accent text-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
              >
                Calcular mi ROI <ArrowRight className="w-5 h-5" />
              </button>
              <Link
                to="https://acrux.life/contacto"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              >
                Hablar con un experto
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Calculadora */}
      <section id="calculadora" className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Formulario */}
            <div className="bg-white rounded-2xl shadow-soft p-8 sticky top-24">
              <h2 className="font-display text-2xl font-bold text-primary mb-2">Calcula tu ROI</h2>
              <p className="text-secondary mb-8">Completa 4 pasos rápidos y recibe tu análisis personalizado por email.</p>

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* Paso 1: Sector */}
                <fieldset>
                  <legend className="font-display text-lg font-bold text-primary mb-4 flex items-center gap-2">
                    <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                    Sector de tu organización
                  </legend>
                  <select
                    value={formData.sector}
                    onChange={(e) => handleChange('sector', e.target.value)}
                    className="calculator-select"
                    aria-invalid={!!errors.sector}
                  >
                    <option value="">Selecciona tu sector</option>
                    {SECTORES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                  {errors.sector && <p className="text-red-500 text-sm mt-1">{errors.sector}</p>}
                </fieldset>

                {/* Paso 2: Tamaño */}
                <fieldset>
                  <legend className="font-display text-lg font-bold text-primary mb-4 flex items-center gap-2">
                    <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                    Tamaño de tu organización
                  </legend>
                  <select
                    value={formData.tamano}
                    onChange={(e) => handleChange('tamano', e.target.value)}
                    className="calculator-select"
                    aria-invalid={!!errors.tamano}
                  >
                    <option value="">Selecciona el tamaño</option>
                    {TAMANOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                  {errors.tamano && <p className="text-red-500 text-sm mt-1">{errors.tamano}</p>}
                </fieldset>

                {/* Paso 3: Problema */}
                <fieldset>
                  <legend className="font-display text-lg font-bold text-primary mb-4 flex items-center gap-2">
                    <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                    Principal problema a resolver
                  </legend>
                  <select
                    value={formData.problema}
                    onChange={(e) => handleChange('problema', e.target.value)}
                    className="calculator-select"
                    aria-invalid={!!errors.problema}
                  >
                    <option value="">Selecciona el problema</option>
                    {PROBLEMAS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                  {errors.problema && <p className="text-red-500 text-sm mt-1">{errors.problema}</p>}
                </fieldset>

                {/* Paso 4: Inversión */}
                <fieldset>
                  <legend className="font-display text-lg font-bold text-primary mb-4 flex items-center gap-2">
                    <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
                    Nivel de inversión esperado
                  </legend>
                  <select
                    value={formData.inversion}
                    onChange={(e) => handleChange('inversion', e.target.value)}
                    className="calculator-select"
                    aria-invalid={!!errors.inversion}
                  >
                    <option value="">Selecciona nivel de inversión</option>
                    {INVERSIONES.map(i => (
                      <option key={i.value} value={i.value}>
                        {i.label} — {formatCurrency(i.monto)} ({i.duracion})
                      </option>
                    ))}
                  </select>
                  {errors.inversion && <p className="text-red-500 text-sm mt-1">{errors.inversion}</p>}
                </fieldset>

                {/* Email */}
                <fieldset>
                  <legend className="font-display text-lg font-bold text-primary mb-4">Email para recibir resultados</legend>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="tu@email.com"
                    className="calculator-input"
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </fieldset>

                {/* Consentimiento */}
                <fieldset>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.consent}
                      onChange={(e) => handleChange('consent', e.target.checked)}
                      className="mt-1 w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                      aria-invalid={!!errors.consent}
                    />
                    <div className="text-sm text-secondary">
                      Acepto la <Link to="https://acrux.life/privacidad" className="underline hover:text-primary" target="_blank" rel="noopener">Política de Privacidad</Link> y autorizo a ACRUX Consultores a contactarme con los resultados y contenido relacionado.
                    </div>
                  </label>
                  {errors.consent && <p className="text-red-500 text-sm mt-1">{errors.consent}</p>}
                </fieldset>

                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm" role="alert">
                    {errors.submit}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      Calculando...
                    </>
                  ) : (
                    <>
                      <Calculator className="w-5 h-5" />
                      Calcular mi ROI y recibir resultados
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-secondary/60">
                  Tus datos son confidenciales. No hacemos spam. Puedes darte de baja en cualquier momento.
                </p>
              </form>
            </div>

            {/* Beneficios / Preview */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-soft p-8 border-t-4 border-accent">
                <h3 className="font-display text-xl font-bold text-primary mb-6 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-accent" />
                  Qué incluye tu análisis ROI
                </h3>
                <ul className="space-y-4">
                  {[
                    { icon: Calculator, title: 'Costo actual del problema', desc: 'Cuánto te cuesta anualmente no resolverlo (rotación, productividad, cultura)' },
                    { icon: TrendingUp, title: 'Ahorro potencial estimado', desc: 'Basado en benchmarks de 35% mejora post-transformación ACRUX' },
                    { icon: Target, title: 'ROI porcentual y payback', desc: 'Cuándo recuperas la inversión y rentabilidad total a 12/24/36 meses' },
                    { icon: Users, title: 'Comparativa por sector/tamaño', desc: 'Benchmarking contra organizaciones similares a la tuya' },
                  ].map((item, i) => (
                    <li key={i} className="flex gap-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-bold text-primary">{item.title}</h4>
                        <p className="text-secondary text-sm">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-2xl p-8">
                <h3 className="font-display text-xl font-bold mb-4">¿Por qué ACRUX?</h3>
                <ul className="space-y-2 text-white/90">
                  <li className="flex items-center gap-2">✓ Metodología validada en 50+ organizaciones</li>
                  <li className="flex items-center gap-2">✓ Equipo: Psicología + Trabajo Social + Negocio</li>
                  <li className="flex items-center gap-2">✓ 20+ años experiencia transformación cultural</li>
                  <li className="flex items-center gap-2">✓ Herramientas propias: DIGITAL-H, PULSO-H</li>
                  <li className="flex items-center gap-2">✓ Medición de impacto real, no vanity metrics</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">¿Listo para transformar tu organización?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            La calculadora es solo el inicio. Agenda una sesión estratégica gratuita para validar tus números y diseñar tu hoja de ruta.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="https://calendly.com/acrux-consultores"
              className="bg-accent text-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-accent/90 transition-colors"
              target="_blank"
              rel="noopener"
            >
              Agendar sesión estratégica
            </Link>
            <Link
              to="https://acrux.life/contacto"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-colors"
            >
              Contactar directamente
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}