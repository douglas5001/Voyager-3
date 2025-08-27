import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import {
  Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Stack, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Chip, Autocomplete
} from '@mui/material';

export default function Public() {
    const [open, setOpen] = React.useState(true);
    const [erro, setErro] = React.useState('');

    function closeModal() {
        setOpen(false)
        setErro('');
    }

    return (
        <>
            <Card sx={{ 
                minWidth: 275, 
                borderLeft: '5px solid red'
            }}>
            <CardContent>
                <Typography variant="h5" component="div">
                12345678
                </Typography>
                <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>Tipo: Erro</Typography>
                <Typography variant="body2">
                Erro ao analizar arquivos em compactação... ECT..
                </Typography>
            </CardContent>
            <CardActions>
                <Typography variant='caption' sx={{ color: 'text.secondary', textAlign: 'right', flexGrow: 1}}>Data Create: 20/08/2025</Typography>
            </CardActions>
            </Card>

            <Dialog open={open} onClose={closeModal} fullWidth maxWidth="lg" keepMounted>
                <DialogTitle>12345678</DialogTitle>
                <DialogContent dividers sx={{ pt: 2 }}>
                    <Box component="form" 
                        sx={{
                        border: '1px solid',
                        borderColor: 'grey.400',
                        borderRadius: 1,
                        overflow: 'hidden',
                        mt: 2,
                        }}>
                        <Box
                        sx={{
                        backgroundColor: 'primary.main',
                        color: 'white',
                        px: 2,
                        py: 1,
                        }}>
                            <Typography variant="subtitle1" fontWeight="bold">Dados da Tarefa</Typography>
                        </Box>

                        <Box sx={{ p:2 }}>
                            <Grid container spacing={50}>
                                <div>
                                    <Typography><strong>Name: </strong>Douglas</Typography>
                                    <Typography><strong>Cargo: </strong>Dev</Typography>
                                    <Typography><strong>Idade: </strong>23</Typography>
                                </div>
                                <div>
                                    <Typography><strong>Casa: </strong>Ap</Typography>
                                    <Typography><strong>Cidade: </strong>Poa</Typography>
                                    <Typography><strong>Estado: </strong>RS</Typography>
                                </div>
                            </Grid>
                        </Box>
                    </Box>
                </DialogContent>

                <DialogActions>
                <Button onClick={closeModal}>Cancelar</Button>
                <Button type="submit" form="profile-form" variant="contained">
                    Salvar
                </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}