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
import { updateUser, type UpdateUserPayload, type User } from '@entities/user'
import { ConfirmCancelDialog } from '@shared/ui'
import { editUserSchema, type EditUserFormValues } from '../model/edit-user-schema'

interface EditUserFormProps {
  user: User
  onCancel: () => void
  onSuccess: () => void
}

const fieldSx = {
  '& .MuiFilledInput-root': {
    minHeight: 50,
    borderRadius: 0.5,
    bgcolor: '#f1f1f1',
    fontSize: 14,
    '&:hover': { bgcolor: '#ededed' },
    '&.Mui-focused': { bgcolor: '#f1f1f1' },
  },
  '& .MuiInputLabel-root': { color: '#0290a4', fontSize: 12, fontWeight: 600 },
  '& .MuiFilledInput-input': { px: 1.25, pt: 2.25, pb: 0.75 },
  '& .MuiFilledInput-input::placeholder': {
    color: '#46615d',
    opacity: 1,
    letterSpacing: '2px',
  },
  '& .MuiFormHelperText-root': { minHeight: 15, mt: 0.25, mr: 0, textAlign: 'right', fontSize: 8 },
} as const

export function EditUserForm({ user, onCancel, onSuccess }: EditUserFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [requestError, setRequestError] = useState<string | null>(null)
  const [cancelConfirmationOpen, setCancelConfirmationOpen] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    mode: 'onChange',
    defaultValues: {
      name: user.name,
      email: user.email,
      registration: user.registration,
      password: '',
      confirmPassword: '',
    },
  })

  const submit = handleSubmit(async (values) => {
    setRequestError(null)
    const payload: UpdateUserPayload = {
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      registration: values.registration,
    }
    if (values.password) payload.password = values.password

    try {
      await updateUser(user.id, payload)
      onSuccess()
    } catch (error: unknown) {
      setRequestError(error instanceof Error ? error.message : 'Não foi possível atualizar o usuário.')
    }
  })

  const passwordAdornment = (visible: boolean, toggle: () => void, label: string) => (
    <IconButton aria-label={label} onClick={toggle} edge="end" size="small" tabIndex={-1}>
      {visible ? <VisibilityOffOutlinedIcon sx={{ fontSize: 19 }} /> : <VisibilityOutlinedIcon sx={{ fontSize: 19 }} />}
    </IconButton>
  )

  return (
    <Paper component="form" onSubmit={submit} elevation={1} noValidate sx={{ p: 1.5, borderRadius: 0.75 }}>
      {requestError && <Alert severity="error" sx={{ mb: 1 }}>{requestError}</Alert>}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <Typography sx={{ color: '#0b2b25', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>Dados do Usuário</Typography>
        <Divider sx={{ flex: 1, borderColor: '#9ca4a3' }} />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, columnGap: 2, rowGap: 0.5 }}>
        <TextField {...register('name')} label="Nome Completo" variant="filled" error={Boolean(errors.name)} helperText={errors.name?.message ?? '* Máx. 30 Caracteres'} slotProps={{ input: { disableUnderline: false }, htmlInput: { maxLength: 30 } }} sx={fieldSx} />
        <TextField {...register('registration')} label="Matrícula" variant="filled" error={Boolean(errors.registration)} helperText={errors.registration?.message ?? '* Mín. 4 | Máx. 10 Caracteres'} slotProps={{ input: { disableUnderline: false }, htmlInput: { inputMode: 'numeric', maxLength: 10 } }} sx={fieldSx} />
        <TextField {...register('email')} label="E-mail" type="email" variant="filled" error={Boolean(errors.email)} helperText={errors.email?.message ?? '* Máx. 40 Caracteres'} slotProps={{ input: { disableUnderline: false }, htmlInput: { maxLength: 40 } }} sx={fieldSx} />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5, mb: 1.5 }}>
        <Typography sx={{ color: '#0b2b25', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>Dados de acesso</Typography>
        <Divider sx={{ flex: 1, borderColor: '#9ca4a3' }} />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, columnGap: 2 }}>
        <TextField {...register('password')} label="Senha" type={showPassword ? 'text' : 'password'} variant="filled" placeholder="••••••" error={Boolean(errors.password)} helperText={errors.password?.message ?? ' '} slotProps={{ input: { endAdornment: passwordAdornment(showPassword, () => setShowPassword((value) => !value), showPassword ? 'Ocultar nova senha' : 'Exibir nova senha') }, htmlInput: { maxLength: 6, autoComplete: 'new-password', 'aria-description': 'Deixe vazio para manter a senha atual' } }} sx={fieldSx} />
        <TextField {...register('confirmPassword')} label="Repetir Senha" type={showConfirmation ? 'text' : 'password'} variant="filled" placeholder="••••••" error={Boolean(errors.confirmPassword)} helperText={errors.confirmPassword?.message ?? ' '} slotProps={{ input: { endAdornment: passwordAdornment(showConfirmation, () => setShowConfirmation((value) => !value), showConfirmation ? 'Ocultar confirmação da nova senha' : 'Exibir confirmação da nova senha') }, htmlInput: { maxLength: 6, autoComplete: 'new-password', 'aria-description': 'Repita somente se desejar alterar a senha' } }} sx={fieldSx} />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1.5 }}>
        <Button type="button" variant="outlined" onClick={() => setCancelConfirmationOpen(true)} disabled={isSubmitting} sx={{ width: 108, height: 38, borderColor: '#274a4b', color: '#102829', fontSize: 14 }}>Cancelar</Button>
        <Button type="submit" variant="contained" disableElevation disabled={!isDirty || !isValid || isSubmitting} sx={{ width: 108, height: 38, fontSize: 14 }}>
          {isSubmitting ? <CircularProgress size={17} color="inherit" /> : 'Salvar'}
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
