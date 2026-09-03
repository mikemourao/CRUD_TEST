import { Box, Paper, Typography } from '@mui/material'
import homeIllustration from '@shared/assets/home-illustration.svg'

const formattedDate = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
}).format(new Date())

export function HomePage() {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography component="h1" sx={{ mb: 1, color: '#0b2b25', fontSize: { xs: 30, md: 38 }, fontWeight: 700, lineHeight: 1.2 }}>
        Home
      </Typography>

      <Paper
        elevation={1}
        sx={{
          height: { md: 'calc(100vh - 95px)' },
          minHeight: { xs: 'calc(100vh - 125px)', md: 440 },
          p: { xs: 2, md: 1.75 },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box>
          <Typography component="h2" sx={{ fontSize: 18, fontWeight: 700, color: '#0b2b25', lineHeight: 1.35 }}>
            Olá Millena!
          </Typography>
          <Typography sx={{ fontSize: 12, fontWeight: 400, color: '#0b2b25', mt: 0.25, textTransform: 'capitalize' }}>
            {formattedDate}
          </Typography>
        </Box>

        <Box sx={{ flex: 1, display: 'grid', placeItems: 'center', minHeight: 0, pb: { md: 1.5 } }}>
          <Box sx={{ width: '100%', maxWidth: 322, textAlign: 'center' }}>
            <Box
              component="img"
              src={homeIllustration}
              alt="Duas pessoas dando boas-vindas"
              sx={{ display: 'block', width: '100%', maxWidth: 310, maxHeight: { xs: 240, md: 240 }, objectFit: 'contain', mx: 'auto', mb: 1 }}
            />
            <Box sx={{ height: 48, border: '1px solid #8b91a0', borderRadius: 1, px: 2, bgcolor: '#fff', display: 'grid', placeItems: 'center' }}>
              <Typography sx={{ color: '#0b2b25', fontSize: 16, fontWeight: 600 }}>Bem-vindo ao WenLock!</Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}
