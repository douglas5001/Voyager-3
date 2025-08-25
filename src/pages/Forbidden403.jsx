import { Box, Button, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router';

export default function Forbidden403() {
  const navigate = useNavigate();
  return (
    <Box sx={{ minHeight: '60dvh', display: 'grid', placeItems: 'center', p: 2 }}>
      <Stack spacing={2} alignItems="center">
        <Typography variant="h3">403</Typography>
        <Typography variant="h6" align="center">Você não tem permissão para acessar este recurso</Typography>
        <Button variant="contained" onClick={() => navigate('/')}>Voltar ao início</Button>
      </Stack>
    </Box>
  );
}
