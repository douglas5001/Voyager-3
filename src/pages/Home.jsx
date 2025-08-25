import { Stack, Typography, Button, Container } from '@mui/material';

export default function Home() {
  return (
    <Container maxWidth="md">
      <Stack spacing={2} mt={6}>
        <Typography variant="h4">Olá</Typography>
        <Button variant="contained">Hello world</Button>
      </Stack>
    </Container>
  );
}
