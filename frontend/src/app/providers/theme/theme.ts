import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: { main: '#08acc1', contrastText: '#071528' },
    background: { default: '#f4f4f4', paper: '#ffffff' },
    text: { primary: '#0b2130', secondary: '#69707d' },
  },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
    h5: { fontWeight: 500 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 4 },
})
