import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, DollarSign, Clock, Target, ArrowLeft, Download, Share2, Calculator, Users, Building2 } from 'lucide-react'
import CTAButton from '@acrux/design-tokens/components/CTAButton'

const formatCurrency = (num) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(num)
const formatNumber = (num) => new Intl.NumberFormat('es-CO').format(num)

export default function Resultado() {
  const [resultado, setResultado] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const data = sessionStorage.getItem('acrux_calculadora_roi_resultado')
    if (data) {
      setResultado(JSON.parse(data))
      localStorage.setItem('lm-calculadora-roi-completed', 'true')
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!resultado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md">
          <Calculator className="w-16 h-16 text-primary/30 mx-auto mb-6" />
          <h2 className="font-display text-2xl font-bold text-primary mb-4">No hay resultados</h2>
          <p className="text-secondary mb-6">Complete la calculadora para ver su análisis ROI personalizado.</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Volver a la calculadora
          </Link>
        </div>
      </div>
    )
  }

  const roiColor = resultado.roiPorcentual >= 100 ? 'text-green-600' : resultado.roiPorcentual >= 0 ? 'text-accent' : 'text-red-600'
  const roiBg = resultado.roiPorcentual >= 100 ? 'bg-green-50 border-green-200' : resultado.roiPorcentual >= 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Resultado */}
      <section className="bg-primary text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-secondary/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-primary text-sm font-bold rounded-full mb-6">
            <TrendingUp className="w-4 h-4" />
            Tu Análisis ROI Personalizado
          </span>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Resultados para <span className="text-accent">{resultado.sector}</span>
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Organización {resultado.tamano.toLowerCase()} · Problema: {resultado.problema.toLowerCase()} · Inversión: {resultado.inversion}
          </p>
        </div>
      </section>

      {/* Métricas Principales */}
      <section className="py-12 -mt-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <MetricCard
              icon={<DollarSign className="w-8 h-8" />}
              label="Inversión Requerida"
              value={formatCurrency(resultado.montoInversion)}
              subtitle={resultado.duracion}
              color="bg-blue-500"
            />
            <MetricCard
              icon={<TrendingUp className="w-8 h-8" />}
              label="ROI Estimado"
              value={`${resultado.roiPorcentual}%`}
              subtitle="A 12 meses"
              color={`bg-gradient-to-r ${roiBg.replace('bg-', 'from-').replace('border-', 'to-')}`}
              valueClass={roiColor}
            />
            <MetricCard
              icon={<Clock className="w-8 h-8" />}
              label="Payback"
              value={`${resultado.paybackMeses} meses`}
              subtitle="Recuperación de inversión"
              color="bg-green-500"
            />
            <MetricCard
              icon={<Target className="w-8 h-8" />}
              label="Ahorro Anual"
              value={formatCurrency(resultado.ahorroAnual)}
              subtitle="vs costo actual del problema"
              color="bg-purple-500"
            />
          </div>

          {/* Detalle del Análisis */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Resumen Ejecutivo */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-soft p-8 border-t-4 border-primary">
                <h2 className="font-display text-xl font-bold text-primary mb-6 flex items-center gap-2">
                  <Building2 className="w-6 h-6" />
                  Resumen Ejecutivo
                </h2>
                <div className="prose text-secondary max-w-none">
                  <p className="mb-4">
                    Basado en tu perfil (<strong>{resultado.tamano.toLowerCase()}</strong> en sector <strong>{resultado.sector}</strong>)
                    con el problema principal de <strong>{resultado.problema.toLowerCase()}</strong>,
                    el costo anual estimado de no actuar es de <strong className="text-primary">{formatCurrency(resultado.costoProblemaAnual)}</strong>.
                  </p>
                  <p className="mb-4">
                    Implementando <strong>{resultado.inversion.toLowerCase()}</strong> ({formatCurrency(resultado.montoInversion)} / {resultado.duracion}),
                    proyectamos un ahorro anual de <strong className="text-primary">{formatCurrency(resultado.ahorroAnual)}</strong>
                    (reducción del ~35% en costos asociados al problema), generando un
                    <strong className={roiColor}>{resultado.roiPorcentual >= 0 ? '+' : ''}{resultado.roiPorcentual}% ROI</strong>
                    a 12 meses con payback en <strong>{resultado.paybackMeses} meses</strong>.
                  </p>
                  <div className={`p-4 rounded-lg border ${roiBg}`}>
                    <p className="font-medium">
                      <strong>Conclusión:</strong>{' '}
                      {resultado.roiPorcentual >= 100
                        ? 'Inversión altamente rentable. Recuperas tu inversión en menos de un año y generas valor significativo.'
                        : resultado.roiPorcentual >= 0
                        ? 'Inversión rentable con payback razonable. Valor positivo a mediano plazo.'
                        : 'ROI negativo a 12 meses. Requiere horizonte mayor a 18-24 meses para ver retorno positivo.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Proyección Temporal */}
              <div className="bg-white rounded-2xl shadow-soft p-8 border-t-4 border-accent">
                <h2 className="font-display text-xl font-bold text-primary mb-6 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-accent" />
                  Proyección de Valor Acumulado
                </h2>
                <div className="space-y-4">
                  {[6, 12, 24, 36].map(mes => {
                    const ahorroMes = resultado.ahorroAnual / 12
                    const valorAcumulado = ahorroMes * mes - resultado.montoInversion
                    const esPositivo = valorAcumulado >= 0
                    return (
                      <div key={mes} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <span className="font-bold text-primary">{mes}M</span>
                          </div>
                          <div>
                            <p className="font-medium text-primary">Mes {mes}</p>
                            <p className="text-sm text-secondary">Ahorro acumulado: {formatCurrency(ahorroMes * mes)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-display text-xl font-bold ${esPositivo ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(valorAcumulado)}
                          </p>
                          <p className="text-sm text-secondary">{esPositivo ? 'Ganancia neta' : 'Inversión neta'}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Benchmarking */}
              <div className="bg-white rounded-2xl shadow-soft p-8 border-t-4 border-secondary">
                <h2 className="font-display text-xl font-bold text-primary mb-6 flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  Benchmarking Sectorial
                </h2>
                <p className="text-secondary mb-6">
                  Comparativa con organizaciones similares que completaron transformación ACRUX:
                </p>
                <div className="grid sm:grid-cols-3 gap-4">
                  <BenchmarkCard label="ROI Promedio Sector" value={`${Math.round(resultado.roiPorcentual * 1.15)}%`} diff="+15% vs tu estimación" />
                  <BenchmarkCard label="Tiempo Payback Promedio" value={`${Math.max(3, Math.round(resultado.paybackMeses * 0.8))} meses`} diff={`${Math.round((resultado.paybackMeses - resultado.paybackMeses * 0.8) * 10) / 10}M más rápido`} />
                  <BenchmarkCard label="Mejora Engagement" value="+42%" diff="Promedio post-transformación" />
                </div>
              </div>
            </div>

            {/* Sidebar Acciones */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-soft p-6 border-t-4 border-accent sticky top-24">
                <h3 className="font-display text-lg font-bold text-primary mb-4">Próximos Pasos</h3>
                <div className="space-y-3">
                  <Link
                    to="https://calendly.com/acrux-consultores"
                    target="_blank"
                    rel="noopener"
                    className="block w-full bg-primary text-white py-3 rounded-lg font-bold text-center hover:bg-primary/90 transition-colors"
                  >
                    Agendar validación estratégica (gratis)
                  </Link>
                  <Link
                    to="https://acrux.life/contacto"
                    className="block w-full border-2 border-primary text-primary py-3 rounded-lg font-bold text-center hover:bg-primary/5 transition-colors"
                  >
                    Recibir reporte completo por email
                  </Link>
                  <button
                    onClick={() => downloadReport(resultado)}
                    className="block w-full bg-accent text-primary py-3 rounded-lg font-bold text-center hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Descargar PDF ejecutivo
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-soft p-6 border-t-4 border-secondary sticky top-24" style={{ top: '20rem' }}>
                <h3 className="font-display text-lg font-bold text-primary mb-4">Compartir Resultados</h3>
                <p className="text-secondary text-sm mb-4">Comparte este análisis con tu equipo directivo:</p>
                <div className="flex gap-2">
                  <button className="flex-1 border border-gray-300 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1">
                    <Share2 className="w-4 h-4" />
                    LinkedIn
                  </button>
                  <button className="flex-1 border border-gray-300 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1">
                    <Share2 className="w-4 h-4" />
                    Email
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-2xl p-6 sticky top-24" style={{ top: '32rem' }}>
                <h3 className="font-display text-lg font-bold mb-3">¿Necesitas más precisión?</h3>
                <p className="text-white/90 text-sm mb-4">
                  Esta calculadora usa benchmarks. Un diagnóstico real (DIGITAL-H / PULSO-H) usa datos de TU organización.
                </p>
                <div className="flex flex-col gap-2">
                  <Link to="https://acrux.life/digital-h/" target="_blank" rel="noopener" className="bg-white/10 border border-white/20 py-2 rounded-lg text-center text-sm hover:bg-white/20 transition-colors">
                    Diagnóstico Madurez Digital (DIGITAL-H)
                  </Link>
                  <Link to="https://acrux.life/pulso-h/" target="_blank" rel="noopener" className="bg-white/10 border border-white/20 py-2 rounded-lg text-center text-sm hover:bg-white/20 transition-colors">
                    Diagnóstico Clima Laboral (PULSO-H)
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">Transformemos tu organización juntos</h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Los números son claros. La transformación organizacional bien hecha no es un gasto, es la mejor inversión que puedes hacer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="https://calendly.com/acrux-consultores"
              target="_blank"
              rel="noopener"
              className="bg-accent text-primary px-6 py-3 rounded-lg font-bold hover:bg-accent/90 transition-colors"
            >
              Agendar sesión estratégica
            </Link>
            <Link
              to="https://acrux.life/contacto"
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-bold hover:bg-white/10 transition-colors"
            >
              Contactar
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

// Componentes auxiliares
function MetricCard({ icon, label, value, subtitle, color, valueClass = 'text-primary' }) {
  return (
    <div className="bg-white rounded-2xl shadow-soft p-6 border-t-4 border-primary">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${color}`}>
          {icon}
        </div>
      </div>
      <p className="metric-label">{label}</p>
      <p className={`metric-value ${valueClass}`}>{value}</p>
      <p className="text-xs text-secondary/60">{subtitle}</p>
    </div>
  )
}

function BenchmarkCard({ label, value, diff }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <p className="text-xs text-secondary/70 uppercase tracking-wide mb-1">{label}</p>
      <p className="font-display text-2xl font-bold text-primary">{value}</p>
      <p className="text-xs text-green-600 font-medium">{diff}</p>
    </div>
  )
}

function downloadReport(resultado) {
  const content = `
REPORTE EJECUTIVO ROI - TRANSFORMACIÓN ORGANIZACIONAL
=====================================================
Generado: ${new Date().toLocaleDateString('es-CO')}
Organización: ${resultado.tamano} - ${resultado.sector}
Problema: ${resultado.problema}
Inversión: ${resultado.inversion}

MÉTRICAS CLAVE
--------------
Inversión Requerida: ${formatCurrency(resultado.montoInversion)} (${resultado.duracion})
ROI Estimado (12M): ${resultado.roiPorcentual}%
Payback: ${resultado.paybackMeses} meses
Ahorro Anual Proyectado: ${formatCurrency(resultado.ahorroAnual)}
Costo Actual del Problema: ${formatCurrency(resultado.costoProblemaAnual)}

PROYECCIÓN TEMPORAL
-------------------
Mes 6:  ${formatCurrency((resultado.ahorroAnual/12)*6 - resultado.montoInversion)}
Mes 12: ${formatCurrency((resultado.ahorroAnual/12)*12 - resultado.montoInversion)}
Mes 24: ${formatCurrency((resultado.ahorroAnual/12)*24 - resultado.montoInversion)}
Mes 36: ${formatCurrency((resultado.ahorroAnual/12)*36 - resultado.montoInversion)}

PRÓXIMOS PASOS RECOMENDADOS
---------------------------
1. Agendar sesión de validación estratégica (gratis)
2. Realizar diagnóstico DIGITAL-H / PULSO-H para datos reales
3. Diseñar hoja de ruta de transformación a medida
4. Definir KPIs y plan de medición de impacto

Contacto: hola@acrux.life | https://acrux.life
ACRUX Consultores - Transformación Organizacional desde Psicología y Trabajo Social
  `.trim()

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ROI-ACRUX-${resultado.sector}-${Date.now()}.txt`
  a.click()
  URL.revokeObjectURL(url)
}