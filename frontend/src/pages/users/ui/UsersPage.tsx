import { useCallback, useEffect, useState } from 'react'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import ClearRoundedIcon from '@mui/icons-material/ClearRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import FirstPageRoundedIcon from '@mui/icons-material/FirstPageRounded'
import LastPageRoundedIcon from '@mui/icons-material/LastPageRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import {
  Alert,
  type AlertColor,
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
  Snackbar,
} from '@mui/material'
import { getUsers, type PaginatedUsers, type User } from '@entities/user'
import { DeleteUserDialog } from '@features/delete-user'
import { ViewUserDrawer } from '@features/view-user'
import noSearchResultsIllustration from '@shared/assets/no-search-results.svg'
import { useLocation, useNavigate } from 'react-router-dom'

const itemsPerPage = 15
const emptyResult: PaginatedUsers = { data: [], total: 0, page: 1, limit: itemsPerPage, totalPages: 0 }

interface PageNotification {
  message: string
  severity: AlertColor
}

function UsersTableHeader() {
  return (
    <TableHead>
      <TableRow>
        <TableCell sx={{ height: 36, py: 0, px: 1, bgcolor: '#0b1930', color: '#fff', border: 0, borderRadius: '3px 0 0 3px', fontSize: 14, fontWeight: 500 }}>
          Nome
        </TableCell>
        <TableCell align="center" sx={{ width: 132, height: 36, py: 0, px: 0.5, bgcolor: '#0b1930', color: '#fff', border: 0, borderRadius: '0 3px 3px 0', fontSize: 14, fontWeight: 500 }}>
          Ações
        </TableCell>
      </TableRow>
    </TableHead>
  )
}

export function UsersPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const routeState = location.state as { successMessage?: string; notification?: PageNotification } | null
  const [notification, setNotification] = useState<PageNotification | null>(
    routeState?.notification ?? (routeState?.successMessage ? { message: routeState.successMessage, severity: 'success' } : null),
  )
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [result, setResult] = useState<PaginatedUsers>(emptyResult)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [viewingUserId, setViewingUserId] = useState<string | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)

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
      <Typography component="h1" sx={{ color: '#0b2b25', fontSize: { xs: 30, md: 38 }, fontWeight: 700, lineHeight: 1.2, mb: 1 }}>
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
              endAdornment: search ? (
                <InputAdornment position="end" sx={{ ml: 0.25 }}>
                  <IconButton aria-label="Limpar pesquisa" size="small" onClick={() => changeSearch('')} edge="end">
                    <ClearRoundedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </InputAdornment>
              ) : undefined,
            },
          }}
          sx={{
            width: { xs: '100%', sm: 220 },
            bgcolor: '#fff',
            '& .MuiOutlinedInput-root': { height: 40, fontSize: 14, boxShadow: '0 2px 4px rgba(0,0,0,.18)' },
          }}
        />
        <Button
          onClick={() => navigate('/usuarios/cadastrar')}
          variant="contained"
          disableElevation
          startIcon={<AddRoundedIcon sx={{ fontSize: '18px !important' }} />}
          sx={{ height: 40, px: 2, borderRadius: 1, bgcolor: '#069db4', color: '#fff', fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap' }}
        >
          Cadastrar Usuário
        </Button>
      </Box>

      <Paper
        elevation={result.data.length === 0 && Boolean(debouncedSearch) && !loading && !error ? 0 : 1}
        sx={{ flex: 1, minHeight: 300, overflow: 'hidden', borderRadius: 0.75, bgcolor: result.data.length === 0 && debouncedSearch ? 'transparent' : '#fff' }}
      >
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
        ) : result.data.length === 0 && debouncedSearch ? (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Table size="small" aria-hidden="true" sx={{ borderCollapse: 'separate', borderSpacing: 0 }}>
              <UsersTableHeader />
            </Table>
            <Paper elevation={1} sx={{ flex: 1, display: 'grid', placeItems: 'center', borderRadius: 0.75, textAlign: 'center', px: 2 }}>
              <Box>
                <Box component="img" src={noSearchResultsIllustration} alt="Nenhum resultado encontrado" sx={{ width: { xs: 120, sm: 150 }, height: 'auto', mb: 1.5 }} />
                <Typography sx={{ color: '#0b2b25', fontSize: 16, fontWeight: 700, mb: 0.5 }}>Nenhum Resultado Encontrado</Typography>
                <Typography sx={{ color: '#40534f', fontSize: 12, fontWeight: 400, lineHeight: 1.35 }}>
                  Não foi possível achar nenhum resultado para sua busca.<br />
                  Tente refazer a pesquisa para encontrar o que busca.
                </Typography>
              </Box>
            </Paper>
          </Box>
        ) : result.data.length === 0 ? (
          <Box sx={{ height: '100%', display: 'grid', placeItems: 'center', textAlign: 'center', px: 2 }}>
            <Box>
              <Typography sx={{ fontSize: 16, fontWeight: 700, mb: 0.5 }}>Nenhum Usuário Registrado</Typography>
              <Typography sx={{ fontSize: 14 }}>Clique em “Cadastrar Usuário” para começar a cadastrar.</Typography>
            </Box>
          </Box>
        ) : (
          <TableContainer sx={{ maxHeight: '100%' }}>
            <Table
              stickyHeader
              size="small"
              aria-label="Lista de usuários"
              sx={{ borderCollapse: 'separate', borderSpacing: '0 6px', px: 0.75 }}
            >
              <UsersTableHeader />
              <TableBody>
                {result.data.map((user) => (
                  <TableRow key={user.id} sx={{ '& td': { bgcolor: '#fff', borderTop: '1px solid #e4e4e4', borderBottom: '1px solid #e4e4e4' } }}>
                    <TableCell sx={{ height: 42, py: 0, px: 1, borderLeft: '1px solid #e4e4e4', borderRadius: '3px 0 0 3px', color: '#0b2b25', fontSize: 14, fontWeight: 500 }}>
                      {user.name}
                    </TableCell>
                    <TableCell align="center" sx={{ height: 42, py: 0, px: 0.25, borderRight: '1px solid #e4e4e4', borderRadius: '0 3px 3px 0' }}>
                      <IconButton
                        type="button"
                        aria-label={`Visualizar ${user.name}`}
                        onClick={() => setViewingUserId(user.id)}
                        size="small"
                        sx={{
                          p: 0.75,
                          mx: 0.125,
                          color: '#0b2930',
                          borderRadius: 0.5,
                          transition: 'background-color 150ms ease, color 150ms ease',
                          '& .filled-action-icon': { display: 'none' },
                          '&:hover': {
                            bgcolor: '#069db4',
                            color: '#fff',
                            '& .outlined-action-icon': { display: 'none' },
                            '& .filled-action-icon': { display: 'block' },
                          },
                        }}
                      >
                        <VisibilityOutlinedIcon className="outlined-action-icon" sx={{ fontSize: 19 }} />
                        <VisibilityRoundedIcon className="filled-action-icon" sx={{ fontSize: 19 }} />
                      </IconButton>
                      <IconButton
                        type="button"
                        aria-label={`Editar ${user.name}`}
                        onClick={() => navigate(`/usuarios/${user.id}/editar`)}
                        size="small"
                        sx={{
                          p: 0.75,
                          mx: 0.125,
                          color: '#0b2930',
                          borderRadius: 0.5,
                          transition: 'background-color 150ms ease, color 150ms ease',
                          '& .filled-action-icon': { display: 'none' },
                          '&:hover': {
                            bgcolor: '#069db4',
                            color: '#fff',
                            '& .outlined-action-icon': { display: 'none' },
                            '& .filled-action-icon': { display: 'block' },
                          },
                        }}
                      >
                        <EditOutlinedIcon className="outlined-action-icon" sx={{ fontSize: 19 }} />
                        <EditRoundedIcon className="filled-action-icon" sx={{ fontSize: 19 }} />
                      </IconButton>
                      <IconButton
                        type="button"
                        aria-label={`Excluir ${user.name}`}
                        onClick={() => setDeletingUser(user)}
                        size="small"
                        sx={{
                          p: 0.75,
                          mx: 0.125,
                          color: '#0b1930',
                          borderRadius: 0.5,
                          transition: 'background-color 150ms ease, color 150ms ease',
                          '& .filled-action-icon': { display: 'none' },
                          '&:hover': {
                            bgcolor: '#069db4',
                            color: '#fff',
                            '& .outlined-action-icon': { display: 'none' },
                            '& .filled-action-icon': { display: 'block' },
                          },
                        }}
                      >
                        <DeleteOutlineRoundedIcon className="outlined-action-icon" sx={{ fontSize: 19 }} />
                        <DeleteRoundedIcon className="filled-action-icon" sx={{ fontSize: 19 }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Box sx={{ minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Typography sx={{ fontSize: 12 }}>Total de itens: {result.total || ''}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
          <Typography sx={{ fontSize: 12, mr: 1.5 }}>Itens por página&nbsp; {itemsPerPage}</Typography>
          <IconButton aria-label="Primeira página" size="small" disabled={!hasPreviousPage} onClick={() => setPage(1)} sx={{ p: 0.5 }}><FirstPageRoundedIcon sx={{ fontSize: 14 }} /></IconButton>
          <IconButton aria-label="Página anterior" size="small" disabled={!hasPreviousPage} onClick={() => setPage((current) => current - 1)} sx={{ p: 0.5 }}><ChevronLeftRoundedIcon sx={{ fontSize: 14 }} /></IconButton>
          <Box sx={{ width: 30, height: 30, display: 'grid', placeItems: 'center', bgcolor: '#069db4', color: '#fff', borderRadius: 0.5, fontSize: 12, fontWeight: 600 }}>{page}</Box>
          <IconButton aria-label="Próxima página" size="small" disabled={!hasNextPage} onClick={() => setPage((current) => current + 1)} sx={{ p: 0.5 }}><ChevronRightRoundedIcon sx={{ fontSize: 14 }} /></IconButton>
          <IconButton aria-label="Última página" size="small" disabled={!hasNextPage} onClick={() => setPage(totalPages)} sx={{ p: 0.5 }}><LastPageRoundedIcon sx={{ fontSize: 14 }} /></IconButton>
          <Typography sx={{ fontSize: 12, ml: 0.25 }}>de {totalPages}</Typography>
        </Box>
      </Box>
      <Snackbar
        open={Boolean(notification)}
        autoHideDuration={4000}
        onClose={() => setNotification(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          severity={notification?.severity ?? 'success'}
          variant="filled"
          onClose={() => setNotification(null)}
          sx={notification?.severity === 'warning' ? { bgcolor: '#ff7900', color: '#fff', '& .MuiAlert-icon': { color: '#fff' } } : undefined}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
      <ViewUserDrawer userId={viewingUserId} onClose={() => setViewingUserId(null)} />
      <DeleteUserDialog
        user={deletingUser}
        onClose={() => setDeletingUser(null)}
        onDeleted={(deletedUser) => {
          setDeletingUser(null)
          setNotification({ message: `${deletedUser.name} foi excluído com sucesso.`, severity: 'success' })
          if (result.data.length === 1 && page > 1) {
            setPage((current) => current - 1)
          } else {
            setReloadKey((key) => key + 1)
          }
        }}
      />
    </Box>
  )
}
