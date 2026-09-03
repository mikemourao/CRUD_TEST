import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import { Box, Breadcrumbs, IconButton, Link, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { CreateUserForm } from '@features/create-user'

export function CreateUserPage() {
  const navigate = useNavigate()
  const goToUsers = () => navigate('/usuarios')

  return (
    <Box sx={{ width: '100%' }}>
      <Breadcrumbs separator="›" aria-label="Navegação estrutural" sx={{ mb: 0.5, '& .MuiBreadcrumbs-li': { fontSize: 10 } }}>
        <Link component="button" underline="hover" color="inherit" onClick={goToUsers} sx={{ fontSize: 10 }}>Usuários</Link>
        <Typography sx={{ fontSize: 10 }}>Cadastro de Usuário</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
        <IconButton aria-label="Voltar para usuários" onClick={goToUsers} size="small" sx={{ p: 0.5, mr: 0.25 }}>
          <ArrowBackIosNewRoundedIcon sx={{ fontSize: 17 }} />
        </IconButton>
        <Typography component="h1" sx={{ color: '#0b2b25', fontSize: 24, fontWeight: 700, lineHeight: 1.25 }}>
          Cadastro de Usuário
        </Typography>
      </Box>

      <CreateUserForm
        onCancel={() => navigate('/usuarios', { state: { notification: { message: 'Cadastro cancelado', severity: 'warning' } } })}
        onSuccess={() => navigate('/usuarios', { state: { successMessage: 'Usuário cadastrado com sucesso.' } })}
      />
    </Box>
  )
}
