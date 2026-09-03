import { useState } from 'react'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import { Alert, Box, Button, CircularProgress, IconButton, Paper, Snackbar, TextField, Typography } from '@mui/material'
import { login } from '@entities/session'
import type { User } from '@entities/user'
import wenlockLogo from '@shared/assets/wenlock-logo.svg'

interface LoginPageProps {
  onLogin: (user: User) => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [forgotPasswordNoticeOpen, setForgotPasswordNoticeOpen] = useState(false)

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!identifier.trim() || !password) return
    setSubmitting(true)
    setError(null)
    try {
      onLogin(await login({ identifier: identifier.trim(), password }))
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : 'Não foi possível entrar.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0b1930', display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.1fr .9fr' }, alignItems: 'center', gap: { md: 6 }, px: { xs: 2, sm: 6, md: 10 }, py: 4 }}>
      <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
        <Box component="img" src={wenlockLogo} alt="WenLock" sx={{ width: 'min(100%, 330px)', height: 'auto' }} />
      </Box>

      <Paper component="form" onSubmit={(event) => void submit(event)} elevation={3} noValidate sx={{ width: '100%', maxWidth: 430, minHeight: 440, mx: 'auto', p: { xs: 3, sm: 4 }, display: 'flex', flexDirection: 'column', borderRadius: 1 }}>
        <Box component="img" src={wenlockLogo} alt="WenLock" sx={{ display: { xs: 'block', md: 'none' }, width: 190, filter: 'brightness(0) invert(1)', mb: 4 }} />
        <Typography component="h1" sx={{ color: '#079bb1', fontSize: { xs: 32, sm: 38 }, fontWeight: 700, lineHeight: 1.2, mb: 2 }}>
          Bem-vindo!
        </Typography>
        <Typography sx={{ color: '#0b2b25', fontSize: 14, mb: 2.5 }}>Entre com sua conta</Typography>

        {error && <Alert severity="error" sx={{ mb: 1.5 }}>{error}</Alert>}

        <TextField
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
          placeholder="E-mail ou Nº matrícula"
          autoComplete="username"
          fullWidth
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { height: 48, fontSize: 14 } }}
          slotProps={{ htmlInput: { 'aria-label': 'E-mail ou número da matrícula' } }}
        />
        <TextField
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type={showPassword ? 'text' : 'password'}
          placeholder="Senha"
          autoComplete="current-password"
          fullWidth
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { height: 48, fontSize: 14 } }}
          slotProps={{
            input: {
              endAdornment: (
                <IconButton type="button" aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'} onClick={() => setShowPassword((visible) => !visible)} edge="end" size="small">
                  {showPassword ? <VisibilityOffOutlinedIcon sx={{ fontSize: 19 }} /> : <VisibilityOutlinedIcon sx={{ fontSize: 19 }} />}
                </IconButton>
              ),
            },
          }}
        />
        <Button type="submit" variant="contained" disableElevation disabled={!identifier.trim() || !password || submitting} sx={{ height: 48, bgcolor: '#079bb1', color: '#fff', fontSize: 14, fontWeight: 700 }}>
          {submitting ? <CircularProgress size={19} color="inherit" /> : 'Entrar'}
        </Button>
        <Button type="button" variant="text" onClick={() => setForgotPasswordNoticeOpen(true)} sx={{ alignSelf: 'center', mt: 1, color: '#079bb1', fontSize: 11, fontWeight: 600 }}>
          Esqueci minha senha
        </Button>
      </Paper>
      <Snackbar
        open={forgotPasswordNoticeOpen}
        autoHideDuration={5000}
        onClose={() => setForgotPasswordNoticeOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="info" variant="filled" onClose={() => setForgotPasswordNoticeOpen(false)}>
          Este recurso será implementado em breve. Agradecemos a sua compreensão.
        </Alert>
      </Snackbar>
    </Box>
  )
}
