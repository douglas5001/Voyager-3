// src/App.jsx
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { createTheme } from '@mui/material/styles';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import { Outlet } from 'react-router';

import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { useAuth } from './features/auth/useAuth';

const theme = createTheme({
  cssVariables: { colorSchemeSelector: 'data-toolpad-color-scheme' },
  colorSchemes: { light: true, dark: true },
  breakpoints: { values: { xs: 0, sm: 600, md: 600, lg: 1200, xl: 1536 } },
});

const baseNavigation = [
  {
    segment: 'movies',
    title: 'Movies',
    icon: <FolderIcon />,
    children: [
      { segment: 'lord-of-the-rings', title: 'Lord of the Rings', icon: <DescriptionIcon /> },
      { segment: 'harry-potter', title: 'Harry Potter', icon: <DescriptionIcon /> },
    ],
  },
  {
    segment: 'admin',
    title: 'Admin',
    icon: <AdminPanelSettingsIcon />,
    permission: 'admin',
    children: [
      { segment: 'user', title: 'User', icon: <PersonIcon />, permission: 'listuser' },
      { segment: 'permission', title: 'Permission', icon: <WorkspacePremiumIcon />, anyOf: ['listpermission', 'editpermission'] },
      { segment: 'profile', title: 'Profile', icon: <BadgeIcon />, permission: 'listprofile' },
    ],
  },
];

const branding = { title: 'RPA' };

function filtrar(itens, { possuiTodas, possuiAlguma }) {
  return itens
    .map((n) => {
      const filhos = n.children ? filtrar(n.children, { possuiTodas, possuiAlguma }) : undefined;
      const all = Array.isArray(n.allOf) ? n.allOf : n.permission ? [n.permission] : [];
      const any = Array.isArray(n.anyOf) ? n.anyOf : [];
      const permitido = possuiTodas(all) && possuiAlguma(any);
      if (!permitido) return null;
      if (Array.isArray(filhos) && filhos.length === 0) return null;
      return { ...n, children: filhos };
    })
    .filter(Boolean);
}


export default function App() {
  const { usuario, sair, possuiTodas, possuiAlguma } = useAuth();
  const navigation = filtrar(baseNavigation, { possuiTodas, possuiAlguma });

  const session = usuario ? { user: { name: usuario.name, email: usuario.email, image: usuario.image } } : null;

  return (
    <ReactRouterAppProvider
      navigation={navigation}
      branding={branding}
      theme={theme}
      session={session}
      authentication={{ signOut: sair }}
    >
      <Outlet />
    </ReactRouterAppProvider>
  );
}
