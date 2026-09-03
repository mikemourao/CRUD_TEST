import { useState } from 'react'
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded'
import { Box, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'

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
      <Box sx={{ px: collapsed ? 1.5 : 3, pt: 2.5, pb: 2, overflow: 'hidden' }}>
        {collapsed ? (
          <Box sx={{ position: 'relative', width: 40, height: 31, mx: 'auto' }}>
            <Typography sx={{ fontSize: 26, lineHeight: 1, fontWeight: 500, letterSpacing: '-1.5px', whiteSpace: 'nowrap' }}>
              <Box component="span" sx={{ color: '#08b5cf' }}>W</Box>
              <Box component="span" sx={{ color: '#fff' }}>L</Box>
            </Typography>
            <Box sx={{ position: 'absolute', right: 1, bottom: 0, width: 7, height: 7, borderRadius: '50%', bgcolor: '#08b5cf' }} />
          </Box>
        ) : (
          <Typography sx={{ fontSize: 26, lineHeight: 1, fontWeight: 300, letterSpacing: '-1.2px', whiteSpace: 'nowrap' }}>
            <Box component="span" sx={{ color: '#08b5cf' }}>Wen</Box>
            <Box component="span" sx={{ fontWeight: 600 }}>Lock</Box>
            <Box component="span" sx={{ color: '#08b5cf', fontWeight: 700 }}>.</Box>
          </Typography>
        )}
      </Box>

      <List sx={{ px: 1.5, py: 0 }}>
        <ListItemButton selected={isHome} onClick={() => goTo('/')} sx={{ minHeight: 38, borderRadius: 1, mb: 0.75, px: 1.5, '&.Mui-selected': { bgcolor: '#08acc1', '&:hover': { bgcolor: '#08acc1' } } }}>
          <ListItemIcon sx={{ minWidth: collapsed ? 0 : 30, mr: collapsed ? 0 : undefined, color: isHome ? '#071528' : '#c7ced9', justifyContent: 'center' }}><HomeRoundedIcon fontSize="small" /></ListItemIcon>
          {!collapsed && <ListItemText primary="Home" primaryTypographyProps={{ fontSize: 12, fontWeight: 700 }} />}
        </ListItemButton>

        <ListItemButton onClick={() => setAccessOpen((open) => !open)} sx={{ minHeight: 40, borderRadius: 1, px: 1.5, color: '#c7ced9' }}>
          <ListItemIcon sx={{ minWidth: collapsed ? 0 : 30, mr: collapsed ? 0 : undefined, color: '#c7ced9', justifyContent: 'center' }}><AdminPanelSettingsOutlinedIcon fontSize="small" /></ListItemIcon>
          {!collapsed && <ListItemText primary="Controle de Acesso" primaryTypographyProps={{ fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap' }} />}
          {!collapsed && <ExpandMoreRoundedIcon fontSize="small" sx={{ transform: accessOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform .2s' }} />}
        </ListItemButton>

        {accessOpen && !collapsed && (
          <ListItemButton selected={isUsers} onClick={() => goTo('/usuarios')} sx={{ minHeight: 38, pl: 4.8, borderRadius: 1, color: isUsers ? '#071528' : '#c7ced9', '&.Mui-selected': { bgcolor: '#08acc1', '&:hover': { bgcolor: '#08acc1' } } }}>
            <ListItemIcon sx={{ minWidth: 28, color: isUsers ? '#071528' : '#c7ced9' }}><PersonOutlineRoundedIcon sx={{ fontSize: 18 }} /></ListItemIcon>
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
