import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'

interface ConfirmCancelDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export function ConfirmCancelDialog({ open, onClose, onConfirm }: ConfirmCancelDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-cancel-title"
      aria-describedby="confirm-cancel-description"
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
      <DialogTitle id="confirm-cancel-title" sx={{ p: 0, mb: 1.5, color: '#0b2b25', fontSize: 22, fontWeight: 700, textAlign: 'center' }}>
        Deseja cancelar?
      </DialogTitle>
      <DialogContent sx={{ p: '0 !important', mb: 3.5 }}>
        <Typography id="confirm-cancel-description" sx={{ color: '#0b2b25', fontSize: 16, fontWeight: 400, textAlign: 'center' }}>
          Os dados inseridos não serão salvos
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', gap: 0.75, p: 0 }}>
        <Button type="button" variant="outlined" onClick={onClose} sx={{ width: 102, height: 48, borderColor: '#274a4b', color: '#102829', fontSize: 14 }}>
          Não
        </Button>
        <Button type="button" variant="contained" disableElevation onClick={onConfirm} sx={{ width: 102, height: 48, bgcolor: '#069db4', color: '#fff', fontSize: 14 }}>
          Sim
        </Button>
      </DialogActions>
    </Dialog>
  )
}
