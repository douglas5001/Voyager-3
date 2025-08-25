import { useEffect, useState } from 'react';
import { assinarLoading } from '../../services/loadingBus';
import { Backdrop, CircularProgress } from '@mui/material';

export default function GlobalLoader() {
  const [ativo, setAtivo] = useState(false);
  useEffect(() => assinarLoading(setAtivo), []);
  return (
    <Backdrop open={ativo} sx={{ zIndex: (t) => t.zIndex.modal + 1 }}>
      <CircularProgress />
    </Backdrop>
  );
}
