import { useState } from 'react'
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import { deleteUser, type User } from '@entities/user'

interface DeleteUserDialogProps {
  user: User | null
  onClose: () => void
  onDeleted: (user: User) => void
}

export function DeleteUserDialog({ user, onClose, onDeleted }: DeleteUserDialogProps) {
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const close = () => {
    if (deleting) return
    setError(null)
    onClose()
  }

  const confirmDeletion = async () => {
    if (!user || deleting) return
    setDeleting(true)
    setError(null)

    try {
      await deleteUser(user.id)
      onDeleted(user)
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : 'Não foi possível excluir o usuário.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Dialog
      open={Boolean(user)}
      onClose={close}
      aria-labelledby="delete-user-title"
      aria-describedby="delete-user-description"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 3,
        '& .MuiDialog-paper': {
          width: 'min(390px, calc(100% - 32px))',
          m: 2,
          px: { xs: 2.5, sm: 4 },
          py: 3.5,
          borderRadius: 1,
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            bgcolor: 'rgba(9, 22, 30, 0.12)',
            backdropFilter: 'blur(2px)',
          },
        },
      }}
    >
      <DialogTitle id="delete-user-title" sx={{ p: 0, mb: 1.5, color: '#0b2b25', fontSize: 22, fontWeight: 700, textAlign: 'center' }}>
        Deseja excluir?
      </DialogTitle>
      <DialogContent sx={{ p: '0 !important', mb: error ? 2 : 3.5 }}>
        <Typography id="delete-user-description" sx={{ color: '#0b2b25', fontSize: 16, fontWeight: 400, textAlign: 'center' }}>
          O usuário será excluído.
        </Typography>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', gap: 0.75, p: 0 }}>
        <Button
          type="button"
          variant="outlined"
          onClick={close}
          disabled={deleting}
          sx={{ width: 102, height: 48, borderColor: '#274a4b', color: '#102829', fontSize: 14 }}
        >
          Não
        </Button>
        <Button
          type="button"
          variant="contained"
          disableElevation
          onClick={() => void confirmDeletion()}
          disabled={deleting}
          sx={{ width: 102, height: 48, bgcolor: '#069db4', color: '#fff', fontSize: 14 }}
        >
          {deleting ? <CircularProgress size={18} color="inherit" /> : 'Sim'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
