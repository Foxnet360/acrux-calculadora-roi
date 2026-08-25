import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Resultado from './pages/Resultado'

function RouteTracker() {
  const location = useLocation()

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        content_group: 'diagnostico',
        funnel_stage: 'consideration',
        page_path: location.pathname + location.search,
        page_location: window.location.href,
      })
    }
  }, [location])

  return null
}

function App() {
  return (
    <Layout>
      <RouteTracker />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resultado" element={<Resultado />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Layout>
  )
}

export default App