import { useState } from 'react';
import { Box, Paper, Stack, TextField, Typography, Button, Alert } from '@mui/material';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../features/auth/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { entrar } = useAuth();
  const destino = location.state?.from || '/';

  async function enviar(e) {
    e.preventDefault();
    setErro('');
    setEnviando(true);
    try {
      await entrar({ email, password });
      navigate(destino, { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message || 'Falha ao entrar';
      setErro(msg);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Box sx={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', p: 2 }}>
      <Paper elevation={4} sx={{ width: '100%', maxWidth: 420, p: 4 }}>
        <Stack component="form" onSubmit={enviar} spacing={3}>
          <Typography variant="h5" align="center">Acessar conta</Typography>
          {erro && <Alert severity="error">{erro}</Alert>}
          <TextField label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
          <TextField label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
          <Button type="submit" variant="contained" size="large" disabled={enviando}>Entrar</Button>
        </Stack>
      </Paper>
    </Box>
  );
}
