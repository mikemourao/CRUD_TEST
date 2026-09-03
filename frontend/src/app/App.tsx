import { useState } from 'react'
import { Box } from '@mui/material'
import { Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from '@pages/home'
import { CreateUserPage } from '@pages/create-user'
import { UsersPage } from '@pages/users'
import { Header } from '@widgets/header'
import { Sidebar } from '@widgets/sidebar'

const expandedSidebarWidth = 184
const collapsedSidebarWidth = 64

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const sidebarWidth = sidebarCollapsed ? collapsedSidebarWidth : expandedSidebarWidth

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header sidebarWidth={sidebarWidth} onMenuClick={() => setMobileOpen(true)} />
      <Sidebar
        width={sidebarWidth}
        collapsed={sidebarCollapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        onToggleCollapse={() => setSidebarCollapsed((collapsed) => !collapsed)}
      />
      <Box
        component="main"
        sx={{
          width: { xs: '100%', md: `calc(100% - ${sidebarWidth}px)` },
          mt: '52px',
          px: { xs: 2, md: 3 },
          pt: { xs: 1.5, md: 1.25 },
          pb: { xs: 2, md: 1.5 },
          minWidth: 0,
          transition: (muiTheme) => muiTheme.transitions.create('width'),
        }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/usuarios" element={<UsersPage />} />
          <Route path="/usuarios/cadastrar" element={<CreateUserPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  )
}
