import { useEffect, useMemo, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../../services/apiClient';
import AuthContext from './AuthContext';
import { absoluteUrl } from '../../utils/url';

function tokenValidated(token) {
  if (!token) return false;
  try {
    const { exp } = jwtDecode(token);
    return !!exp && exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('access_token') || '');
  const [user, setuser] = useState(null);

  useEffect(() => {
    if (token && !tokenValidated(token)) {
      localStorage.removeItem('access_token');
      setToken('');
      setuser(null);
    }
  }, [token]);

  useEffect(() => {
    async function loadingProfile() {
      try {
        const { sub } = jwtDecode(token);
        if (!sub) return setuser(null);
        const { data } = await api.get(`/users/${sub}`);
        const img = data?.image ? absoluteUrl(data.image) : '';
        setuser({ ...data, image: img });
      } catch {
        setuser(null);
      }
    }
    if (tokenValidated(token)) loadingProfile();
    else setuser(null);
  }, [token]);

  const claims = useMemo(() => {
    if (!tokenValidated(token)) return null;
    try { return jwtDecode(token); } catch { return null; }
  }, [token]);

  const permissoes = useMemo(() => Array.isArray(claims?.permissions) ? claims.permissions : [], [claims]);
  const administrador = Boolean(claims?.is_admin);

  function salvarToken(novo) {
    localStorage.setItem('access_token', novo);
    setToken(novo);
  }

  function sair() {
    localStorage.removeItem('access_token');
    setToken('');
    setuser(null);
    window.location.assign('/login');
  }

  async function entrar(credenciais) {
    const { data } = await api.post('/login', credenciais);
    salvarToken(data.access_token);
    return data;
  }

  function possui(permissao) { return administrador || permissoes.includes(permissao); }
  function possuiTodas(lista) { return administrador || !Array.isArray(lista) || lista.length === 0 || lista.every(permissoes.includes.bind(permissoes)); }
  function possuiAlguma(lista) { return administrador || !Array.isArray(lista) || lista.length === 0 || lista.some(permissoes.includes.bind(permissoes)); }

  const valor = {
    token,
    claims,
    user,
    permissoes,
    administrador,
    autenticado: tokenValidated(token),
    entrar,
    sair,
    possui,
    possuiTodas,
    possuiAlguma,
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
