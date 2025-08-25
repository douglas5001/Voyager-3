import { Box, CircularProgress, Fade } from '@mui/material';

export default function OverlayLoader({ aberto }) {
  return (
    <Fade in={aberto} unmountOnExit>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
          bgcolor: 'rgba(0,0,0,0.08)',
          backdropFilter: 'blur(2px)',
          borderRadius: 1,
        }}
      >
        <CircularProgress />
      </Box>
    </Fade>
  );
}
