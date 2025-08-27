// src/App.jsx
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import PublicIcon from '@mui/icons-material/Public';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import { createTheme } from '@mui/material/styles';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import { Outlet } from 'react-router';
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
    segment: 'public',
    title: 'Public',
    icon: <PublicIcon />,
    children: [
      { segment: 'components', title: 'Components', icon: <SettingsInputComponentIcon />},
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

const branding = { title: 'HUBBLE' };

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
  const { user, sair, possuiTodas, possuiAlguma } = useAuth();
  const navigation = filtrar(baseNavigation, { possuiTodas, possuiAlguma });

  const session = user ? { user: { name: user.name, email: user.email, image: user.image } } : null;

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
