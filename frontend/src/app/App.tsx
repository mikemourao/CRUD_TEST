import { useState } from 'react'
import { Box } from '@mui/material'
import { Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from '@pages/home'
import { LoginPage } from '@pages/login'
import { CreateUserPage } from '@pages/create-user'
import { EditUserPage } from '@pages/edit-user'
import { UsersPage } from '@pages/users'
import { Header } from '@widgets/header'
import { Sidebar } from '@widgets/sidebar'
import type { User } from '@entities/user'

const expandedSidebarWidth = 184
const collapsedSidebarWidth = 64
const sessionStorageKey = 'wenlock.session.user'

function getStoredUser(): User | null {
  try {
    const storedUser = window.localStorage.getItem(sessionStorageKey)
    return storedUser ? JSON.parse(storedUser) as User : null
  } catch {
    window.localStorage.removeItem(sessionStorageKey)
    return null
  }
}

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(getStoredUser)
  const sidebarWidth = sidebarCollapsed ? collapsedSidebarWidth : expandedSidebarWidth

  const authenticate = (user: User) => {
    window.localStorage.setItem(sessionStorageKey, JSON.stringify(user))
    setCurrentUser(user)
  }

  const logout = () => {
    window.localStorage.removeItem(sessionStorageKey)
    setCurrentUser(null)
  }

  if (!currentUser) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={authenticate} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header user={currentUser} sidebarWidth={sidebarWidth} onMenuClick={() => setMobileOpen(true)} onLogout={logout} />
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
          <Route path="/" element={<HomePage userName={currentUser.name} />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/usuarios" element={<UsersPage />} />
          <Route path="/usuarios/cadastrar" element={<CreateUserPage />} />
          <Route path="/usuarios/:userId/editar" element={<EditUserPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  )
}
