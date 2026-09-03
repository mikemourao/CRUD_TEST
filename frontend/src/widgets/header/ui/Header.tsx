import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import { AppBar, Avatar, Box, IconButton, Toolbar, Typography } from '@mui/material'

interface HeaderProps {
  sidebarWidth: number
  onMenuClick: () => void
}

export function Header({ sidebarWidth, onMenuClick }: HeaderProps) {
  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={1}
      sx={{
        width: { md: `calc(100% - ${sidebarWidth}px)` },
        ml: { md: `${sidebarWidth}px` },
        bgcolor: '#fff',
        borderBottom: '1px solid #e7e7e7',
        zIndex: (muiTheme) => muiTheme.zIndex.drawer + 1,
        transition: (muiTheme) => muiTheme.transitions.create(['width', 'margin-left']),
      }}
    >
      <Toolbar sx={{ minHeight: '52px !important', px: { xs: 2, md: 3 }, justifyContent: 'space-between' }}>
        <IconButton onClick={onMenuClick} sx={{ display: { md: 'none' } }} aria-label="Abrir menu">
          <MenuRoundedIcon />
        </IconButton>
        <Box sx={{ display: { xs: 'none', md: 'block' } }} />
        <Box sx={{ position: 'relative' }}>
          <Avatar sx={{ width: 31, height: 31, bgcolor: '#07202c', border: '2px solid #00b8cf' }}>
            <Typography variant="caption" fontWeight={600}>MS</Typography>
          </Avatar>
          <Box sx={{ position: 'absolute', right: -1, bottom: -1, width: 8, height: 8, borderRadius: '50%', bgcolor: '#fff', border: '1px solid #cfd3d6' }} />
        </Box>
      </Toolbar>
    </AppBar>
  )
}
