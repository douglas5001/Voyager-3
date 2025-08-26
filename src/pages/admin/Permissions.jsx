import React from 'react';
import {
  Box, Typography, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Stack, Alert, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../services/apiClient';
import OverlayLoader from '../../components/loader/OverlayLoader';

export default function Permissions() {
  const [permissions, setPermissions] = React.useState([]);
  const [openModal, setOpenModal] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [saving, setSaving] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [erro, setErro] = React.useState('');
  const [name, setName] = React.useState('');

  function clearForm() {
    setName('');
  }

  function openCreate() {
    setEditing(null);
    clearForm();
    setOpenModal(true);
  }

  function openEdit(p) {
    setEditing(p);
    setName(p.name || '');
    setOpenModal(true);
  }

  function closeModal() {
    setOpenModal(false);
    setErro('');
  }

  async function fetchPermissions() {
    setLoading(true);
    setErro('');
    try {
      const { data } = await api.get('/permissions');
      setPermissions(data);
    } catch {
      setErro('Não foi possível carregar permissões');
    } finally {
      setLoading(false);
    }
  }

  async function save(e) {
    e.preventDefault();
    setErro('');
    setSaving(true);
    try {
      const payload = { name };
      if (editing) {
        await api.put(`/permissions/${editing.id}`, payload);
      } else {
        await api.post('/permissions', payload);
      }
      await fetchPermissions();
      closeModal();
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data || 'Falha ao salvar permissão';
      setErro(typeof msg === 'string' ? msg : 'Falha ao salvar permissão');
    } finally {
      setSaving(false);
    }
  }

  async function removePermission(p) {
    setErro('');
    setSaving(true);
    try {
      await api.delete(`/permissions/${p.id}`);
      await fetchPermissions();
    } catch (err) {
      const msg = err?.response?.data || 'Falha ao remover permissão';
      setErro(typeof msg === 'string' ? msg : 'Falha ao remover permissão');
    } finally {
      setSaving(false);
    }
  }

  React.useEffect(() => {
    fetchPermissions();
  }, []);

  return (
    <Box p={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Permissões</Typography>
        <Button variant="contained" onClick={openCreate}>Novo</Button>
      </Stack>

      {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}

      <Box sx={{ position: 'relative' }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {permissions.map((p) => (
                <TableRow key={p.id} hover>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell align="right">
                    <Grid container spacing={1} justifyContent="flex-end">
                      <Grid item>
                        <Button size="small" variant="outlined" onClick={() => openEdit(p)}>Editar</Button>
                      </Grid>
                      <Grid item>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => removePermission(p)}
                        >
                          Remover
                        </Button>
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              ))}
              {permissions.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={3}>Nenhuma permissão encontrada</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <OverlayLoader aberto={loading} />
      </Box>

      <Dialog open={openModal} onClose={closeModal} fullWidth maxWidth="sm" keepMounted>
        <DialogTitle>{editing ? 'Editar Permissão' : 'Nova Permissão'}</DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
          <Box component="form" id="permission-form" onSubmit={save} sx={{ position: 'relative' }}>
            <Stack spacing={2}>
              <TextField label="Nome" value={name} onChange={(e) => setName(e.target.value)} fullWidth required />
            </Stack>
            <OverlayLoader aberto={saving} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} disabled={saving}>Cancelar</Button>
          <Button type="submit" form="permission-form" variant="contained" disabled={saving}>
            {editing ? 'Salvar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
