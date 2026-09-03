import { useEffect, useState } from 'react'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import { Alert, Box, Breadcrumbs, Button, CircularProgress, IconButton, Link, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { getUser, type User } from '@entities/user'
import { EditUserForm } from '@features/edit-user'

export function EditUserPage() {
  const navigate = useNavigate()
  const { userId } = useParams<{ userId: string }>()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const goToUsers = () => navigate('/usuarios')

  useEffect(() => {
    if (!userId) {
      setError('Usuário inválido.')
      setLoading(false)
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
  }, [userId, reloadKey])

  return (
    <Box sx={{ width: '100%' }}>
      <Breadcrumbs separator="›" aria-label="Navegação estrutural" sx={{ mb: 0.75, '& .MuiBreadcrumbs-li': { fontSize: 10 } }}>
        <Link component="button" underline="hover" color="inherit" onClick={goToUsers} sx={{ fontSize: 10 }}>Usuários</Link>
        <Typography sx={{ fontSize: 10 }}>Editar Usuário</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.75 }}>
        <IconButton aria-label="Voltar para usuários" onClick={goToUsers} size="small" sx={{ p: 0.5, mr: 0.25 }}>
          <ArrowBackIosNewRoundedIcon sx={{ fontSize: 19 }} />
        </IconButton>
        <Typography component="h1" sx={{ color: '#0b2b25', fontSize: 24, fontWeight: 700, lineHeight: 1.25 }}>
          Editar Usuário
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ minHeight: 240, display: 'grid', placeItems: 'center' }}><CircularProgress size={30} /></Box>
      ) : error ? (
        <Alert severity="error" action={<Button color="inherit" size="small" onClick={() => setReloadKey((key) => key + 1)}>Tentar novamente</Button>}>{error}</Alert>
      ) : user ? (
        <EditUserForm
          user={user}
          onCancel={goToUsers}
          onSuccess={() => navigate('/usuarios', { state: { successMessage: 'Usuário atualizado com sucesso.' } })}
        />
      ) : null}
    </Box>
  )
}
