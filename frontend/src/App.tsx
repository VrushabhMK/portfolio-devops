import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import DevOpsPipeline from './components/DevOpsPipeline'
import Certifications from './components/Certifications'
import Resume from './components/Resume'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Loader from './components/Loader'

import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'

function PortfolioMain() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <DevOpsPipeline />
        <Certifications />
        <Resume />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

function App() {
  const [loading, setLoading] = useState(true)

  if (loading) {
    return <Loader onComplete={() => setLoading(false)} />
  }

  return (
    <Routes>
      <Route path="/" element={<PortfolioMain />} />
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
    </Routes>
  )
}

export default App
