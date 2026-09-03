import { useEffect, useState } from 'react'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  Typography,
} from '@mui/material'
import { getUser, type User } from '@entities/user'

interface ViewUserDrawerProps {
  userId: string | null
  onClose: () => void
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(new Date(value))
}

function isSameMoment(first: string, second: string) {
  return new Date(first).getTime() === new Date(second).getTime()
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography sx={{ mb: 0.5, color: '#6f7776', fontSize: 12, fontWeight: 500, lineHeight: 1.35 }}>{label}</Typography>
      <Typography sx={{ color: '#0b2b25', fontSize: 14, fontWeight: 600, lineHeight: 1.4, overflowWrap: 'anywhere' }}>
        {value}
      </Typography>
    </Box>
  )
}

export function ViewUserDrawer({ userId, onClose }: ViewUserDrawerProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setUser(null)
      setError(null)
      return
    }

    const controller = new AbortController()
    setLoading(true)
    setError(null)

    void getUser(userId, controller.signal)
      .then(setUser)
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return
        setError(requestError instanceof Error ? requestError.message : 'Não foi possível carregar o usuário.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [userId])

  return (
    <Drawer
      anchor="right"
      open={Boolean(userId)}
      onClose={onClose}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 3 }}
      slotProps={{
        backdrop: {
          sx: {
            bgcolor: 'rgba(9, 22, 30, 0.12)',
            backdropFilter: 'blur(2px)',
          },
        },
        paper: {
          sx: {
            width: { xs: '100%', sm: 350 },
            maxWidth: '100vw',
            boxShadow: '-3px 0 12px rgba(0, 0, 0, 0.12)',
          },
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', px: { xs: 2.5, sm: 3 }, py: 2 }}>
        <Box component="header" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 32, mb: 1.5 }}>
          <Typography component="h2" sx={{ color: '#0b2b25', fontSize: 18, fontWeight: 700, lineHeight: 1.35 }}>
            Visualizar Usuário
          </Typography>
          <IconButton aria-label="Fechar visualização" onClick={onClose} size="small" sx={{ color: '#63706f' }}>
            <CloseRoundedIcon sx={{ fontSize: 21 }} />
          </IconButton>
        </Box>

        {loading ? (
          <Box sx={{ flex: 1, display: 'grid', placeItems: 'center' }}>
            <CircularProgress size={28} />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : user ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Typography sx={{ color: '#0b2b25', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>Dados do Usuário</Typography>
              <Divider sx={{ flex: 1, borderColor: '#9ca4a3' }} />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(100px, .65fr)', gap: 2.5, mb: 3 }}>
              <Detail label="Nome" value={user.name} />
              <Detail label="Matrícula" value={user.registration} />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Detail label="E-mail" value={user.email} />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Typography sx={{ color: '#0b2b25', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>Detalhes</Typography>
              <Divider sx={{ flex: 1, borderColor: '#9ca4a3' }} />
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
              <Detail label="Data de criação" value={formatDate(user.createdAt)} />
              <Detail
                label="Última edição"
                value={isSameMoment(user.createdAt, user.updatedAt) ? 'Nenhuma' : formatDate(user.updatedAt)}
              />
            </Box>
          </>
        ) : null}

        <Button
          type="button"
          variant="outlined"
          onClick={onClose}
          sx={{
            alignSelf: 'center',
            mt: 'auto',
            mb: 0,
            minWidth: 100,
            height: 38,
            borderColor: '#49645f',
            color: '#0b2b25',
            fontSize: 14,
            fontWeight: 600,
            textTransform: 'none',
          }}
        >
          Fechar
        </Button>
      </Box>
    </Drawer>
  )
}
