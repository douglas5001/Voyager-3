import React from 'react';
import {
  Box, Typography, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Stack, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Chip, Autocomplete
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../services/apiClient';
import OverlayLoader from '../../components/loader/OverlayLoader';

export default function Profile() {
  const [profiles, setProfiles] = React.useState([]);
  const [permissoes, setPermissoes] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [edting, setsetEdting] = React.useState(null);
  const [saving, setSaving] = React.useState(false);
  const [load, setLoad] = React.useState(false);
  const [carregandoPerms, setLoadPerms] = React.useState(false);
  const [erro, setErro] = React.useState('');

  const [nome, setNome] = React.useState('');
  const [permissionIds, setPermissionIds] = React.useState([]);

  function ClearFoms() {
    setNome('');
    setPermissionIds([]);
  }

  function OpenCreate() {
    setsetEdting(null);
    ClearFoms();
    setOpen(true);
  }

  function openEditing(p) {
    setsetEdting(p);
    setNome(p.name || '');
    const ids = Array.isArray(p.permissions)
      ? p.permissions
          .map((perm) => (typeof perm === 'object' ? perm.id : permissoes.find((x) => x.name === perm)?.id))
          .filter(Boolean)
      : [];
    setPermissionIds(ids);
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setErro('');
  }

  async function get_profile() {
    setLoad(true);
    setErro('');
    try {
      const { data } = await api.get('/profiles');
      setProfiles(data);
    } catch {
      setErro('Não foi possível carregar perfis');
    } finally {
      setLoad(false);
    }
  }

  async function get_permissions() {
    setLoadPerms(true);
    try {
      const { data } = await api.get('/permissions');
      setPermissoes(data);
    } catch {
      setErro('Não foi possível carregar permissões');
    } finally {
      setLoadPerms(false);
    }
  }

  async function post_profile(e) {
    e.preventDefault();
    setErro('');
    setSaving(true);
    try {
      const payload = { name: nome, permission_ids: permissionIds };
      if (edting) {
        await api.put(`/profiles/${edting.id}`, payload);
      } else {
        await api.post('/profiles', payload);
      }
      await get_profile();
      closeModal();
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data || 'Falha ao salvar perfil';
      setErro(typeof msg === 'string' ? msg : 'Falha ao salvar perfil');
    } finally {
      setSaving(false);
    }
  }

  async function remover(p) {
    setErro('');
    setSaving(true);
    try {
      await api.delete(`/profiles/${p.id}`);
      await get_profile();
    } catch (err) {
      const msg = err?.response?.data || 'Falha ao remover perfil';
      setErro(typeof msg === 'string' ? msg : 'Falha ao remover perfil');
    } finally {
      setSaving(false);
    }
  }

  React.useEffect(() => {
    get_permissions();
    get_profile();
  }, []);

  const opcoesSelecionadas = permissoes.filter((opt) => permissionIds.includes(opt.id));

  return (
    <Box p={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Perfis</Typography>
        <Button variant="contained" onClick={OpenCreate}>Novo</Button>
      </Stack>

      {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}

      <Box sx={{ position: 'relative' }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Permissões</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {profiles.map((p) => (
                <TableRow key={p.id} hover>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {Array.isArray(p.permissions) && p.permissions.length > 0 ? (
                        p.permissions.map((perm) => {
                          const nomePerm = typeof perm === 'object' ? perm.name : String(perm);
                          return <Chip key={`${p.id}-${nomePerm}`} label={nomePerm} size="small" />;
                        })
                      ) : (
                        <Typography variant="body2" color="text.secondary">Sem permissões</Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Grid container spacing={1} justifyContent="flex-end">
                      <Grid item>
                        <Button size="small" variant="outlined" onClick={() => openEditing(p)}>Editar</Button>
                      </Grid>
                      <Grid item>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => remover(p)}
                        >
                          Remover
                        </Button>
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              ))}
              {profiles.length === 0 && !load && (
                <TableRow>
                  <TableCell colSpan={4}>Nenhum perfil encontrado</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <OverlayLoader aberto={load} />
      </Box>

      <Dialog open={open} onClose={closeModal} fullWidth maxWidth="sm" keepMounted>
        <DialogTitle>{edting ? 'Editar Perfil' : 'Novo Perfil'}</DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
          {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}
          <Box component="form" id="profile-form" onSubmit={post_profile} sx={{ position: 'relative' }}>
            <Stack spacing={2}>
              <TextField label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} fullWidth required />
              <Autocomplete
                multiple
                options={permissoes}
                value={opcoesSelecionadas}
                getOptionLabel={(opt) => opt.name}
                isOptionEqualToValue={(a, b) => a.id === b.id}
                onChange={(_, selecionadas) => setPermissionIds(selecionadas.map((o) => o.id))}
                loading={carregandoPerms}
                renderInput={(params) => <TextField {...params} label="Permissões" placeholder="Selecionar" />}
              />
            </Stack>
            <OverlayLoader aberto={saving} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} disabled={saving}>Cancelar</Button>
          <Button type="submit" form="profile-form" variant="contained" disabled={saving}>
            {edting ? 'Salvar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
