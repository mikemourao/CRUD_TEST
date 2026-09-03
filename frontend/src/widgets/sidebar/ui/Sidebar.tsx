import { useState } from 'react'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import PieChartRoundedIcon from '@mui/icons-material/PieChartRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import { Box, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import wenlockLogo from '@shared/assets/wenlock-logo.svg'
import wenlockCollapsedLogo from '@shared/assets/wenlock-logo-collapsed.svg'
import homeMenuIcon from '@shared/assets/home-menu-icon.svg'
import usersMenuIcon from '@shared/assets/users-menu-icon.svg'
import accessControlMenuIcon from '@shared/assets/access-control-menu-icon.svg'

interface SidebarProps {
  width: number
  collapsed: boolean
  mobileOpen: boolean
  onMobileClose: () => void
  onToggleCollapse: () => void
}

const mobileSidebarWidth = 184

function SidebarContent({ collapsed = false, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const [accessOpen, setAccessOpen] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'
  const isUsers = location.pathname.startsWith('/usuarios')

  const goTo = (path: string) => {
    navigate(path)
    onNavigate?.()
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#0b1930', color: '#fff' }}>
      <Box
        sx={{
          height: 64,
          px: collapsed ? 1.5 : 2.5,
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        {collapsed ? (
          <Box component="img" src={wenlockCollapsedLogo} alt="WenLock" sx={{ display: 'block', width: 40, height: 32, objectFit: 'contain', mx: 'auto' }} />
        ) : (
          <Box component="img" src={wenlockLogo} alt="WenLock" sx={{ display: 'block', width: 135, height: 'auto', maxWidth: '100%' }} />
        )}
      </Box>

      <List sx={{ px: 1.5, py: 0 }}>
        <ListItemButton selected={isHome} onClick={() => goTo('/')} sx={{ height: 40, borderRadius: 1, mb: 1, px: 1.5, color: '#fff', '&.Mui-selected': { color: '#071528', bgcolor: '#08acc1', '&:hover': { bgcolor: '#08acc1' } } }}>
          <ListItemIcon sx={{ minWidth: collapsed ? 0 : 30, mr: collapsed ? 0 : undefined, justifyContent: 'center' }}>
            {isHome ? (
              <PieChartRoundedIcon aria-hidden="true" sx={{ color: '#071528', fontSize: 21 }} />
            ) : (
              <Box component="img" src={homeMenuIcon} alt="" aria-hidden="true" sx={{ display: 'block', width: 20, height: 20 }} />
            )}
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Home" primaryTypographyProps={{ fontSize: 12, fontWeight: isHome ? 700 : 600 }} />}
        </ListItemButton>

        <ListItemButton onClick={() => setAccessOpen((open) => !open)} sx={{ height: 40, borderRadius: 1, px: 1, color: '#c7ced9' }}>
          <ListItemIcon sx={{ minWidth: collapsed ? 0 : 24, mr: collapsed ? 0 : undefined, justifyContent: 'center' }}>
            <Box component="img" src={accessControlMenuIcon} alt="" aria-hidden="true" sx={{ display: 'block', width: 20, height: 20, opacity: 0.72 }} />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Controle de Acesso" sx={{ minWidth: 0 }} primaryTypographyProps={{ fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap' }} />}
          {!collapsed && <ExpandMoreRoundedIcon sx={{ ml: 0.5, flexShrink: 0, color: '#c7ced9', fontSize: 18, transform: accessOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .2s' }} />}
        </ListItemButton>

        {accessOpen && !collapsed && (
          <ListItemButton selected={isUsers} onClick={() => goTo('/usuarios')} sx={{ height: 42, pl: 4.8, borderRadius: 1, color: isUsers ? '#071528' : '#fff', '&.Mui-selected': { bgcolor: '#08acc1', '&:hover': { bgcolor: '#08acc1' } } }}>
            <ListItemIcon sx={{ minWidth: 28, justifyContent: 'center' }}>
              {isUsers ? (
                <PersonRoundedIcon aria-hidden="true" sx={{ color: '#071528', fontSize: 21 }} />
              ) : (
                <Box component="img" src={usersMenuIcon} alt="" aria-hidden="true" sx={{ display: 'block', width: 20, height: 20 }} />
              )}
            </ListItemIcon>
            <ListItemText primary="Usuários" primaryTypographyProps={{ fontSize: 12, fontWeight: isUsers ? 700 : 500 }} />
          </ListItemButton>
        )}
      </List>

      <Box sx={{ mt: 'auto', px: collapsed ? 0 : 3, pb: 2.5, color: '#fff', textAlign: collapsed ? 'center' : 'left' }}>
        {!collapsed && <Typography fontSize={12} fontWeight={700}>© WenLock</Typography>}
        {!collapsed && <Typography fontSize={10} sx={{ opacity: 0.65 }}>Power by Conecthus</Typography>}
        <Typography fontSize={collapsed ? 7 : 9} sx={{ opacity: 0.65, mt: collapsed ? 0 : 0.25 }}>V 0.0.0</Typography>
      </Box>
    </Box>
  )
}

export function Sidebar({ width, collapsed, mobileOpen, onMobileClose, onToggleCollapse }: SidebarProps) {
  return (
    <Box component="nav" sx={{ width: { md: width }, flexShrink: { md: 0 } }} aria-label="Navegação principal">
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: mobileSidebarWidth } }}
      >
        <SidebarContent onNavigate={onMobileClose} />
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width,
            boxSizing: 'border-box',
            border: 0,
            overflowX: 'hidden',
            transition: (muiTheme) => muiTheme.transitions.create('width'),
          },
        }}
        open
      >
        <SidebarContent collapsed={collapsed} />
      </Drawer>
      <IconButton
        aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
        onClick={onToggleCollapse}
        size="small"
        sx={{
          display: { xs: 'none', md: 'inline-flex' },
          position: 'fixed',
          zIndex: (muiTheme) => muiTheme.zIndex.drawer + 2,
          top: 28,
          left: width - 11,
          width: 24,
          height: 24,
          bgcolor: '#f3f6f7',
          color: '#7d8991',
          boxShadow: 1,
          transition: (muiTheme) => muiTheme.transitions.create(['left', 'background-color']),
          '&:hover': { bgcolor: '#fff' },
        }}
      >
        {collapsed ? <ChevronRightRoundedIcon fontSize="small" /> : <ChevronLeftRoundedIcon fontSize="small" />}
      </IconButton>
    </Box>
  )
}
