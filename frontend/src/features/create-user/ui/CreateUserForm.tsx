import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { createUser } from '@entities/user'
import { ConfirmCancelDialog } from '@shared/ui'
import { createUserSchema, type CreateUserFormValues } from '../model/create-user-schema'

interface CreateUserFormProps {
  onCancel: () => void
  onSuccess: () => void
}

const fieldSx = {
  '& .MuiFilledInput-root': {
    minHeight: 46,
    borderRadius: 0.5,
    bgcolor: '#f1f1f1',
    fontSize: 14,
    '&:hover': { bgcolor: '#ededed' },
    '&.Mui-focused': { bgcolor: '#f1f1f1' },
  },
  '& .MuiFilledInput-input': { px: 1.25, py: 1.4 },
  '& .MuiFilledInput-input::placeholder': { color: '#667370', opacity: 1 },
  '& .MuiFormHelperText-root': { minHeight: 16, mt: 0.25, mr: 0, textAlign: 'right', fontSize: 10 },
} as const

export function CreateUserForm({ onCancel, onSuccess }: CreateUserFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [requestError, setRequestError] = useState<string | null>(null)
  const [cancelConfirmationOpen, setCancelConfirmationOpen] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    mode: 'onChange',
    defaultValues: { name: '', email: '', registration: '', password: '', confirmPassword: '' },
  })

  const submit = handleSubmit(async (values) => {
    setRequestError(null)
    try {
      await createUser({
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        registration: values.registration,
        password: values.password,
      })
      onSuccess()
    } catch (error: unknown) {
      setRequestError(error instanceof Error ? error.message : 'Não foi possível cadastrar o usuário.')
    }
  })

  const passwordAdornment = (visible: boolean, toggle: () => void, label: string) => (
    <IconButton aria-label={label} onClick={toggle} edge="end" size="small" tabIndex={-1}>
      {visible ? <VisibilityOffOutlinedIcon sx={{ fontSize: 19 }} /> : <VisibilityOutlinedIcon sx={{ fontSize: 19 }} />}
    </IconButton>
  )

  return (
    <Paper component="form" onSubmit={submit} elevation={1} noValidate sx={{ p: 1.25, borderRadius: 0.75 }}>
      {requestError && <Alert severity="error" sx={{ mb: 1, py: 0 }}>{requestError}</Alert>}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.25 }}>
        <Typography sx={{ color: '#0b2b25', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>Dados do Usuário</Typography>
        <Divider sx={{ flex: 1 }} />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, columnGap: 1.75, rowGap: 0.5 }}>
        <TextField
          {...register('name')}
          variant="filled"
          placeholder="Insira o nome completo*"
          error={Boolean(errors.name)}
          helperText={errors.name?.message ?? '* Máx. 30 Caracteres'}
          slotProps={{ input: { disableUnderline: true }, htmlInput: { maxLength: 30 } }}
          sx={fieldSx}
        />
        <TextField
          {...register('registration')}
          variant="filled"
          placeholder="Insira o Nº da matrícula"
          error={Boolean(errors.registration)}
          helperText={errors.registration?.message ?? '* Mín. 4 Letras | * Máx. 10 Caracteres'}
          slotProps={{ input: { disableUnderline: true }, htmlInput: { inputMode: 'numeric', maxLength: 10 } }}
          sx={fieldSx}
        />
        <TextField
          {...register('email')}
          type="email"
          variant="filled"
          placeholder="Insira o E-mail*"
          error={Boolean(errors.email)}
          helperText={errors.email?.message ?? '* Máx. 40 Caracteres'}
          slotProps={{ input: { disableUnderline: true }, htmlInput: { maxLength: 40 } }}
          sx={fieldSx}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.25, mb: 1.25 }}>
        <Typography sx={{ color: '#0b2b25', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>Dados de acesso</Typography>
        <Divider sx={{ flex: 1 }} />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, columnGap: 1.75 }}>
        <TextField
          {...register('password')}
          type={showPassword ? 'text' : 'password'}
          variant="filled"
          placeholder="Senha"
          error={Boolean(errors.password)}
          helperText={errors.password?.message ?? ' '}
          slotProps={{
            input: {
              disableUnderline: true,
              endAdornment: passwordAdornment(showPassword, () => setShowPassword((value) => !value), showPassword ? 'Ocultar senha' : 'Exibir senha'),
            },
            htmlInput: { maxLength: 6 },
          }}
          sx={fieldSx}
        />
        <TextField
          {...register('confirmPassword')}
          type={showConfirmation ? 'text' : 'password'}
          variant="filled"
          placeholder="Repetir Senha"
          error={Boolean(errors.confirmPassword)}
          helperText={errors.confirmPassword?.message ?? ' '}
          slotProps={{
            input: {
              disableUnderline: true,
              endAdornment: passwordAdornment(showConfirmation, () => setShowConfirmation((value) => !value), showConfirmation ? 'Ocultar confirmação' : 'Exibir confirmação'),
            },
            htmlInput: { maxLength: 6 },
          }}
          sx={fieldSx}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.75, mt: 1.25 }}>
        <Button type="button" variant="outlined" onClick={() => setCancelConfirmationOpen(true)} disabled={isSubmitting} sx={{ width: 108, height: 38, borderColor: '#274a4b', color: '#102829', fontSize: 14 }}>
          Cancelar
        </Button>
        <Button type="submit" variant="contained" disableElevation disabled={!isValid || isSubmitting} sx={{ width: 108, height: 38, fontSize: 14 }}>
          {isSubmitting ? <CircularProgress size={15} color="inherit" /> : 'Cadastrar'}
        </Button>
      </Box>
      <ConfirmCancelDialog
        open={cancelConfirmationOpen}
        onClose={() => setCancelConfirmationOpen(false)}
        onConfirm={onCancel}
      />
    </Paper>
  )
}
