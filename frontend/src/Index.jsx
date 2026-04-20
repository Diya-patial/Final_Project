import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar/Sidebar'
import Navbar from './components/Navbar/Navbar'
import Dashboard from './pages/Dashboard'
import Deployments from './pages/Deployments'
import Logs from './pages/Logs'
import './App.css'

function Index() {
  const [expanded, setExpanded] = useState(true)
  const [theme,    setTheme]    = useState('dark')

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.classList.toggle('light', next === 'light')
  }

  return (
   
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar expanded={expanded} setExpanded={setExpanded} />

        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
         <Navbar 
  expanded={expanded} 
  setExpanded={setExpanded}   // ✅ ADD THIS
  theme={theme} 
  toggleTheme={toggleTheme} 
/>

          <main style={{
            flex: 1,
            padding: expanded ? '32px' : '24px',
            backgroundImage: `radial-gradient(circle, rgba(128,128,128,0.06) 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
            transition: 'padding 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            overflowX: 'hidden',
            backgroundColor: 'var(--bg)',
          }}>
            <Routes>
              <Route path="/dashboard"  element={<Dashboard />} />
              <Route path="/deployments" element={<Deployments />} />
              <Route path="/logs"        element={<Logs />} />
            </Routes>
          </main>
        </div>
      </div>
   
  )
}

export default Index