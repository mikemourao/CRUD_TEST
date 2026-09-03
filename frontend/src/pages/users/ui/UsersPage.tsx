import { useCallback, useEffect, useState } from 'react'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import FirstPageRoundedIcon from '@mui/icons-material/FirstPageRounded'
import LastPageRoundedIcon from '@mui/icons-material/LastPageRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { getUsers, type PaginatedUsers } from '@entities/user'

const itemsPerPage = 15
const emptyResult: PaginatedUsers = { data: [], total: 0, page: 1, limit: itemsPerPage, totalPages: 0 }

export function UsersPage() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [result, setResult] = useState<PaginatedUsers>(emptyResult)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedSearch(search.trim()), 350)
    return () => window.clearTimeout(timeout)
  }, [search])

  useEffect(() => {
    const controller = new AbortController()
    const requestTimer = window.setTimeout(() => {
      setLoading(true)
      setError(null)

      void getUsers({ search: debouncedSearch, page, limit: itemsPerPage, signal: controller.signal })
        .then(setResult)
        .catch((requestError: unknown) => {
          if (requestError instanceof DOMException && requestError.name === 'AbortError') return
          setError(requestError instanceof Error ? requestError.message : 'Não foi possível carregar os usuários.')
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false)
        })
    }, 0)

    return () => {
      window.clearTimeout(requestTimer)
      controller.abort()
    }
  }, [debouncedSearch, page, reloadKey])

  const changeSearch = useCallback((value: string) => {
    setSearch(value)
    setPage(1)
  }, [])

  const totalPages = Math.max(1, result.totalPages)
  const hasPreviousPage = page > 1
  const hasNextPage = page < totalPages && result.total > 0

  return (
    <Box sx={{ width: '100%', height: { md: 'calc(100vh - 74px)' }, minHeight: 440, display: 'flex', flexDirection: 'column' }}>
      <Typography component="h1" sx={{ fontSize: 23, fontWeight: 600, lineHeight: 1.25, mb: 0.5 }}>
        Usuários
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 1 }}>
        <TextField
          value={search}
          onChange={(event) => changeSearch(event.target.value)}
          placeholder="Pesquisa"
          size="small"
          slotProps={{
            htmlInput: { 'aria-label': 'Pesquisar usuário por nome' },
            input: {
              startAdornment: (
                <InputAdornment position="start" sx={{ mr: 0.5 }}>
                  <SearchRoundedIcon sx={{ fontSize: 17 }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            width: { xs: '100%', sm: 152 },
            bgcolor: '#fff',
            '& .MuiOutlinedInput-root': { height: 31, fontSize: 10, boxShadow: '0 2px 4px rgba(0,0,0,.18)' },
          }}
        />
        <Button
          variant="contained"
          disableElevation
          startIcon={<AddRoundedIcon sx={{ fontSize: '18px !important' }} />}
          sx={{ height: 30, px: 1.5, borderRadius: 1, bgcolor: '#069db4', fontSize: 10, whiteSpace: 'nowrap' }}
        >
          Cadastrar Usuário
        </Button>
      </Box>

      <Paper elevation={1} sx={{ flex: 1, minHeight: 300, overflow: 'hidden', borderRadius: 0.75 }}>
        {loading ? (
          <Box sx={{ height: '100%', display: 'grid', placeItems: 'center' }}>
            <CircularProgress size={28} />
          </Box>
        ) : error ? (
          <Box sx={{ height: '100%', display: 'grid', placeItems: 'center', p: 2 }}>
            <Alert severity="error" action={<Button color="inherit" size="small" onClick={() => setReloadKey((key) => key + 1)}>Tentar novamente</Button>}>
              {error}
            </Alert>
          </Box>
        ) : result.data.length === 0 ? (
          <Box sx={{ height: '100%', display: 'grid', placeItems: 'center', textAlign: 'center', px: 2 }}>
            <Box>
              <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.25 }}>Nenhum Usuário Registrado</Typography>
              <Typography sx={{ fontSize: 10.5 }}>Clique em “Cadastrar Usuário” para começar a cadastrar.</Typography>
            </Box>
          </Box>
        ) : (
          <TableContainer sx={{ maxHeight: '100%' }}>
            <Table stickyHeader size="small" aria-label="Lista de usuários">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Nome</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>E-mail</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Matrícula</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {result.data.map((user) => (
                  <TableRow hover key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.registration}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Box sx={{ minHeight: 38, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Typography sx={{ fontSize: 8 }}>Total de itens: {result.total || ''}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
          <Typography sx={{ fontSize: 8, mr: 1.5 }}>Itens por página&nbsp; {itemsPerPage}</Typography>
          <IconButton aria-label="Primeira página" size="small" disabled={!hasPreviousPage} onClick={() => setPage(1)} sx={{ p: 0.5 }}><FirstPageRoundedIcon sx={{ fontSize: 14 }} /></IconButton>
          <IconButton aria-label="Página anterior" size="small" disabled={!hasPreviousPage} onClick={() => setPage((current) => current - 1)} sx={{ p: 0.5 }}><ChevronLeftRoundedIcon sx={{ fontSize: 14 }} /></IconButton>
          <Box sx={{ width: 24, height: 24, display: 'grid', placeItems: 'center', bgcolor: '#069db4', color: '#fff', borderRadius: 0.5, fontSize: 9 }}>{page}</Box>
          <IconButton aria-label="Próxima página" size="small" disabled={!hasNextPage} onClick={() => setPage((current) => current + 1)} sx={{ p: 0.5 }}><ChevronRightRoundedIcon sx={{ fontSize: 14 }} /></IconButton>
          <IconButton aria-label="Última página" size="small" disabled={!hasNextPage} onClick={() => setPage(totalPages)} sx={{ p: 0.5 }}><LastPageRoundedIcon sx={{ fontSize: 14 }} /></IconButton>
          <Typography sx={{ fontSize: 8, ml: 0.25 }}>de {totalPages}</Typography>
        </Box>
      </Box>
    </Box>
  )
}
