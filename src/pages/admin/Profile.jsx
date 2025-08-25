import {
  Box, Typography, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Checkbox, FormControlLabel, Stack, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Switch, Avatar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Profile() {
    return (
        <Box p={3}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">Perfil</Typography>
                <Button variant="contained">New</Button>
            </Stack>
            <Box sx={{ position: 'relative' }}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Id</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell align='right'>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>1</TableCell>
                                <TableCell>Administrador</TableCell>
                                <TableCell align="right">
                                    <Grid container spacing={1} justifyContent="flex-end">
                                    <Grid item>
                                        <Button size="small" variant="outlined" onClick={() => null}>Editar</Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                        size="small"
                                        variant="outlined"
                                        color="error"
                                        startIcon={<DeleteIcon />}
                                        onClick={() => null}
                                        >
                                        Remover
                                        </Button>
                                    </Grid>
                                    </Grid>
                                </TableCell>
                            </TableRow>
                        </TableBody>


                    </Table>
                </TableContainer>
            </Box>
        </Box>
    )
}