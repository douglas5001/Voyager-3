import { Avatar, Box, Button, Stack, Typography } from '@mui/material';
import { useAuth } from '../../features/auth/useAuth';

export default function SidebarFooter() {
  const { user, sair } = useAuth();

  return (
    <Box sx={{ p: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Avatar src={user?.image || ''} alt={user?.name || 'Usuário'} sx={{ width: 32, height: 32 }} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" noWrap>{user?.name ?? 'Usuário'}</Typography>
          <Typography variant="caption" color="text.secondary" noWrap>{user?.email ?? ''}</Typography>
        </Box>
        <Button size="small" variant="outlined" onClick={sair}>Sair</Button>
      </Stack>
    </Box>
  );
}
