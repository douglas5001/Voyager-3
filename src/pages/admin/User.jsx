import * as React from 'react';
import {
  Box, Typography, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Checkbox, FormControlLabel, Stack, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Switch, Avatar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../services/apiClient';
import OverlayLoader from '../../components/loader/OverlayLoader';

export default function User() {
  const [users, setUsers] = React.useState([]);
  const [abrir, setAbrir] = React.useState(false);
  const [editando, setEditando] = React.useState(null);
  const [erro, setErro] = React.useState('');
  const [carregando, setCarregando] = React.useState(false);
  const [salvando, setSalvando] = React.useState(false);

  const [nome, setNome] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [senha, setSenha] = React.useState('');
  const [profileId, setProfileId] = React.useState('');
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [imagem, setImagem] = React.useState(null);

  const [alterarSenha, setAlterarSenha] = React.useState(false);
  const [alterarImagem, setAlterarImagem] = React.useState(false);


  function iniciais(nome) {
    return (nome || '')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0])
      .join('')
      .toUpperCase() || '?';
  }
  
  function limparFormulario() {
    setNome('');
    setEmail('');
    setSenha('');
    setProfileId('');
    setIsAdmin(false);
    setImagem(null);
    setAlterarSenha(false);
    setAlterarImagem(false);
  }

  function abrirCriacao() {
    setEditando(null);
    limparFormulario();
    setAbrir(true);
  }

  function abrirEdicao(u) {
    setEditando(u);
    setNome(u.name || '');
    setEmail(u.email || '');
    setSenha('');
    setProfileId(String(u.profile_id ?? ''));
    setIsAdmin(Boolean(u.is_admin));
    setImagem(null);
    setAlterarSenha(false);
    setAlterarImagem(false);
    setAbrir(true);
  }

  function fecharModal() {
    setAbrir(false);
    setErro('');
  }

  async function listar() {
    setCarregando(true);
    setErro('');
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch {
      setErro('Não foi possível carregar usuários');
    } finally {
      setCarregando(false);
    }
  }

  async function salvar(e) {
    e.preventDefault();
    setErro('');
    setSalvando(true);
    try {
      const form = new FormData();
      form.append('name', nome);
      form.append('email', email);
      form.append('profile_id', profileId);
      form.append('is_admin', String(isAdmin));

      if (!editando || alterarSenha) {
        form.append('password', senha);
      }
      if (editando && alterarImagem && imagem) {
        form.append('image', imagem);
      }
      if (!editando && imagem) {
        form.append('image', imagem);
      }

      if (editando) {
        await api.put(`/users/${editando.id}`, form);
      } else {
        await api.post('/users', form);
      }
      await listar();
      fecharModal();
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data || 'Falha ao salvar usuário';
      setErro(typeof msg === 'string' ? msg : 'Falha ao salvar usuário');
    } finally {
      setSalvando(false);
    }
  }

  async function remover(u) {
    setErro('');
    try {
      await api.delete(`/users/${u.id}`);
      await listar();
    } catch (err) {
      const status = err?.response?.status;
      if (status === 405) setErro('Remoção não disponível no backend');
      else setErro('Falha ao remover usuário');
    }
  }

  React.useEffect(() => {
    listar();
  }, []);

  return (
    <Box p={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Usuários</Typography>
        <Button variant="contained" onClick={abrirCriacao}>Novo</Button>
      </Stack>

      {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}

      <Box sx={{ position: 'relative' }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Imagem</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>E-mail</TableCell>
                <TableCell>Perfil</TableCell>
                <TableCell>Admin</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id} hover>
                  <TableCell>
                    <Avatar
                      src={u.image || ''}
                      alt={u.name || 'Usuário'}
                      sx={{ width: 36, height: 36 }}
                    >
                      {iniciais(u.name)}
                    </Avatar>
                  </TableCell>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.profile_id}</TableCell>
                  <TableCell>{u.is_admin ? 'Sim' : 'Não'}</TableCell>
                  <TableCell align="right">
                    <Grid container spacing={1} justifyContent="flex-end">
                      <Grid item>
                        <Button size="small" variant="outlined" onClick={() => abrirEdicao(u)}>Editar</Button>
                      </Grid>
                      <Grid item>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => remover(u)}
                        >
                          Remover
                        </Button>
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && !carregando && (
                <TableRow>
                  <TableCell colSpan={5}>Nenhum usuário encontrado</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <OverlayLoader aberto={carregando} />
      </Box>

      <Dialog open={abrir} onClose={fecharModal} fullWidth maxWidth="sm" keepMounted>
        <DialogTitle>{editando ? 'Editar usuário' : 'Novo usuário'}</DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
          {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}
          <Box component="form" id="user-form" onSubmit={salvar} sx={{ position: 'relative' }}>
            <Stack spacing={2}>
              <TextField label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} fullWidth required />
              <TextField label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth required />
              <TextField label="Profile ID" type="number" value={profileId} onChange={(e) => setProfileId(e.target.value)} fullWidth required />
              <FormControlLabel control={<Checkbox checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />} label="Administrador" />

              {editando ? (
                <Stack spacing={1}>
                  <FormControlLabel
                    control={<Switch checked={alterarSenha} onChange={(e) => setAlterarSenha(e.target.checked)} />}
                    label="Alterar senha"
                  />
                  {alterarSenha && (
                    <TextField
                      label="Nova senha"
                      type="password"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      fullWidth
                      required
                    />
                  )}

                  <FormControlLabel
                    control={<Switch checked={alterarImagem} onChange={(e) => setAlterarImagem(e.target.checked)} />}
                    label="Alterar imagem"
                  />
                  {alterarImagem && (
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Button variant="outlined" component="label">
                        Selecionar imagem
                        <input hidden type="file" accept="image/*" onChange={(e) => setImagem(e.target.files?.[0] || null)} />
                      </Button>
                      <Typography variant="body2">{imagem?.name || 'Nenhum arquivo selecionado'}</Typography>
                    </Stack>
                  )}
                </Stack>
              ) : (
                <Stack spacing={1}>
                  <TextField
                    label="Senha"
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    fullWidth
                    required
                  />
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Button variant="outlined" component="label">
                      Selecionar imagem
                      <input hidden type="file" accept="image/*" onChange={(e) => setImagem(e.target.files?.[0] || null)} />
                    </Button>
                    <Typography variant="body2">{imagem?.name || 'Nenhum arquivo selecionado'}</Typography>
                  </Stack>
                </Stack>
              )}
            </Stack>

            <OverlayLoader aberto={salvando} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharModal} disabled={salvando}>Cancelar</Button>
          <Button type="submit" form="user-form" variant="contained" disabled={salvando}>
            {editando ? 'Salvar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
