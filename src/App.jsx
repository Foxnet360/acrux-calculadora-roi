import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Resultado from './pages/Resultado'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resultado" element={<Resultado />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Layout>
  )
}

export default App