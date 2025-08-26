import * as React from 'react';
import {
  Box, Typography, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Checkbox, FormControlLabel, Stack, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Switch, Avatar, Autocomplete
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../services/apiClient';
import OverlayLoader from '../../components/loader/OverlayLoader';

export default function User() {
  const [users, setUsers] = React.useState([]);
  const [profiles, setProfiles] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [erro, setErro] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const [nome, setNome] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [senha, setSenha] = React.useState('');
  const [perfilSelecionado, setPerfilSelecionado] = React.useState(null);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [imagem, setImagem] = React.useState(null);

  const [alterPassword, setAlterPassword] = React.useState(false);
  const [alterImage, setAlterImage] = React.useState(false);

  function init(valor) {
    return (valor || '').split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase() || '?';
  }

  function clearForms() {
    setNome('');
    setEmail('');
    setSenha('');
    setPerfilSelecionado(null);
    setIsAdmin(false);
    setImagem(null);
    setAlterPassword(false);
    setAlterImage(false);
  }

  function openCreate() {
    setEditing(null);
    clearForms();
    setOpen(true);
  }

  function openEdit(u) {
    setEditing(u);
    setNome(u.name || '');
    setEmail(u.email || '');
    setSenha('');
    setPerfilSelecionado(profiles.find((p) => p.id === u.profile_id) || null);
    setIsAdmin(Boolean(u.is_admin));
    setImagem(null);
    setAlterPassword(false);
    setAlterImage(false);
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setErro('');
  }

  async function get_user() {
    setLoading(true);
    setErro('');
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch {
      setErro('Não foi possível carregar usuários');
    } finally {
      setLoading(false);
    }
  }

  async function listProfile() {
    try {
      const { data } = await api.get('/profiles');
      setProfiles(data);
    } catch {
      setErro((e) => e || 'Não foi possível carregar perfis');
    }
  }

  async function post_users(e) {
    e.preventDefault();
    setErro('');
    if (!perfilSelecionado?.id) {
      setErro('Selecione um perfil');
      return;
    }
    setSaving(true);
    try {
      const form = new FormData();
      form.append('name', nome);
      form.append('email', email);
      form.append('profile_id', String(perfilSelecionado.id));
      form.append('is_admin', String(isAdmin));

      if (!editing || alterPassword) {
        form.append('password', senha);
      }
      if (editing && alterImage && imagem) {
        form.append('image', imagem);
      }
      if (!editing && imagem) {
        form.append('image', imagem);
      }

      if (editing) {
        await api.put(`/users/${editing.id}`, form);
      } else {
        await api.post('/users', form);
      }
      await get_user();
      closeModal();
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data || 'Falha ao salvar usuário';
      setErro(typeof msg === 'string' ? msg : 'Falha ao salvar usuário');
    } finally {
      setSaving(false);
    }
  }

  async function delete_user(u) {
    setErro('');
    try {
      await api.delete(`/users/${u.id}`);
      await get_user();
    } catch (err) {
      const status = err?.response?.status;
      if (status === 405) setErro('Remoção não disponível no backend');
      else setErro('Falha ao remover usuário');
    }
  }

  React.useEffect(() => {
    listProfile();
    get_user();
  }, []);

  function name_profile(profileId) {
    return profiles.find((p) => p.id === profileId)?.name || profileId || '';
  }

  return (
    <Box p={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Usuários</Typography>
        <Button variant="contained" onClick={openCreate}>Novo</Button>
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
                    <Avatar src={u.image || ''} alt={u.name || 'Usuário'} sx={{ width: 36, height: 36 }}>
                      {init(u.name)}
                    </Avatar>
                  </TableCell>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{name_profile(u.profile_id)}</TableCell>
                  <TableCell>{u.is_admin ? 'Sim' : 'Não'}</TableCell>
                  <TableCell align="right">
                    <Grid container spacing={1} justifyContent="flex-end">
                      <Grid item>
                        <Button size="small" variant="outlined" onClick={() => openEdit(u)}>Editar</Button>
                      </Grid>
                      <Grid item>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => delete_user(u)}
                        >
                          Remover
                        </Button>
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={6}>Nenhum usuário encontrado</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <OverlayLoader aberto={loading} />
      </Box>

      <Dialog open={open} onClose={closeModal} fullWidth maxWidth="sm" keepMounted>
        <DialogTitle>{editing ? 'Editar usuário' : 'Novo usuário'}</DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
          {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}
          <Box component="form" id="user-form" onSubmit={post_users} sx={{ position: 'relative' }}>
            <Stack spacing={2}>
              <TextField label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} fullWidth required />
              <TextField label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth required />

              <Autocomplete
                options={profiles}
                value={perfilSelecionado}
                onChange={(_, v) => setPerfilSelecionado(v)}
                getOptionLabel={(opt) => opt?.name || ''}
                isOptionEqualToValue={(a, b) => a.id === b.id}
                renderInput={(params) => <TextField {...params} label="Perfil" required />}
              />

              <FormControlLabel control={<Checkbox checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />} label="Administrador" />

              {editing ? (
                <Stack spacing={1}>
                  <FormControlLabel
                    control={<Switch checked={alterPassword} onChange={(e) => setAlterPassword(e.target.checked)} />}
                    label="Alterar senha"
                  />
                  {alterPassword && (
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
                    control={<Switch checked={alterImage} onChange={(e) => setAlterImage(e.target.checked)} />}
                    label="Alterar imagem"
                  />
                  {alterImage && (
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

            <OverlayLoader aberto={saving} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} disabled={saving}>Cancelar</Button>
          <Button type="submit" form="user-form" variant="contained" disabled={saving}>
            {editing ? 'Salvar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
