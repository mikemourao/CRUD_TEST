import { useEffect, useRef, useState } from 'react'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import { AppBar, Avatar, Box, ClickAwayListener, IconButton, ListItemButton, Paper, Popper, Toolbar, Typography } from '@mui/material'
import type { User } from '@entities/user'

interface HeaderProps {
  user: User
  sidebarWidth: number
  onMenuClick: () => void
  onLogout: () => void
}

function getInitials(name: string) {
  const names = name.trim().split(/\s+/)
  return `${names[0]?.[0] ?? ''}${names.at(-1)?.[0] ?? ''}`.toUpperCase()
}

export function Header({ user, sidebarWidth, onMenuClick, onLogout }: HeaderProps) {
  const profileAnchorRef = useRef<HTMLDivElement | null>(null)
  const closeTimerRef = useRef<number | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [profilePinned, setProfilePinned] = useState(false)

  const cancelScheduledClose = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  const scheduleClose = () => {
    if (profilePinned) return
    cancelScheduledClose()
    closeTimerRef.current = window.setTimeout(() => setProfileOpen(false), 120)
  }

  const closeProfile = () => {
    cancelScheduledClose()
    setProfilePinned(false)
    setProfileOpen(false)
  }

  useEffect(() => () => cancelScheduledClose(), [])

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
        <Box
          ref={profileAnchorRef}
          onMouseEnter={() => {
            cancelScheduledClose()
            setProfileOpen(true)
          }}
          onMouseLeave={scheduleClose}
          onClick={() => {
            cancelScheduledClose()
            if (profilePinned) closeProfile()
            else {
              setProfilePinned(true)
              setProfileOpen(true)
            }
          }}
          onKeyDown={(event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return
            event.preventDefault()
            cancelScheduledClose()
            if (profilePinned) closeProfile()
            else {
              setProfilePinned(true)
              setProfileOpen(true)
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Abrir menu do perfil"
          aria-expanded={profileOpen}
          sx={{ position: 'relative', cursor: 'pointer', outline: 'none', '&:focus-visible': { borderRadius: '50%', boxShadow: '0 0 0 3px rgba(8, 172, 193, .3)' } }}
        >
          <Avatar sx={{ width: 35, height: 35, bgcolor: '#07202c', border: '2px solid #00b8cf' }}>
            <Typography sx={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>{getInitials(user.name)}</Typography>
          </Avatar>
          <Box sx={{ position: 'absolute', right: -3, bottom: -2, width: 14, height: 14, display: 'grid', placeItems: 'center', borderRadius: '50%', bgcolor: '#fff', border: '1px solid #cfd3d6' }}>
            <KeyboardArrowDownRoundedIcon sx={{ color: '#52625f', fontSize: 13 }} />
          </Box>
        </Box>
        <Popper
          open={profileOpen}
          anchorEl={profileAnchorRef.current}
          placement="bottom-end"
          modifiers={[{ name: 'offset', options: { offset: [0, 8] } }]}
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 4 }}
        >
          <ClickAwayListener onClickAway={closeProfile}>
            <Paper
              onMouseEnter={cancelScheduledClose}
              onMouseLeave={scheduleClose}
              elevation={4}
              sx={{
                position: 'relative',
                width: 230,
                p: 1.25,
                borderRadius: 0.75,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -6,
                  right: 12,
                  width: 12,
                  height: 12,
                  bgcolor: '#fff',
                  transform: 'rotate(45deg)',
                  boxShadow: '-2px -2px 3px rgba(0, 0, 0, .04)',
                },
              }}
            >
              <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                <Avatar sx={{ width: 31, height: 31, bgcolor: '#143b36', fontSize: 11 }}>{getInitials(user.name)}</Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography noWrap sx={{ color: '#0099ae', fontSize: 12, fontWeight: 600 }}>{user.name}</Typography>
                  <Typography noWrap sx={{ color: '#6b7775', fontSize: 10 }}>{user.email}</Typography>
                </Box>
              </Box>
              <ListItemButton onClick={onLogout} sx={{ minHeight: 34, px: 0.5, borderRadius: 0.5, color: '#0b2b25' }}>
                <LogoutRoundedIcon sx={{ mr: 1, fontSize: 19 }} />
                <Typography sx={{ fontSize: 12, fontWeight: 500 }}>Sair</Typography>
              </ListItemButton>
            </Paper>
          </ClickAwayListener>
        </Popper>
      </Toolbar>
    </AppBar>
  )
}
