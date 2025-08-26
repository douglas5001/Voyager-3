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
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    if (token && !tokenValidated(token)) {
      localStorage.removeItem('access_token');
      setToken('');
      setUsuario(null);
    }
  }, [token]);

  useEffect(() => {
    async function carregarPerfil() {
      try {
        const { sub } = jwtDecode(token);
        if (!sub) return setUsuario(null);
        const { data } = await api.get(`/users/${sub}`);
        const img = data?.image ? absoluteUrl(data.image) : '';
        setUsuario({ ...data, image: img });
      } catch {
        setUsuario(null);
      }
    }
    if (tokenValidated(token)) carregarPerfil();
    else setUsuario(null);
  }, [token]);

  const claims = useMemo(() => {
    if (!tokenValidated(token)) return null;
    try { return jwtDecode(token); } catch { return null; }
  }, [token]);

  const permissoes = useMemo(() => Array.isArray(claims?.permissions) ? claims.permissions : [], [claims]);
  const administrador = Boolean(claims?.is_admin);

  function saveToken(novo) {
    localStorage.setItem('access_token', novo);
    setToken(novo);
  }

  function close() {
    localStorage.removeItem('access_token');
    setToken('');
    setUsuario(null);
    window.location.assign('/login');
  }

  async function open(credenciais) {
    const { data } = await api.post('/login', credenciais);
    saveToken(data.access_token);
    return data;
  }

  function hasPermission(permissao) { return administrador || permissoes.includes(permissao); }
  function hasAll(lista) { return administrador || !Array.isArray(lista) || lista.length === 0 || lista.every(permissoes.includes.bind(permissoes)); }
  function hasAny(lista) { return administrador || !Array.isArray(lista) || lista.length === 0 || lista.some(permissoes.includes.bind(permissoes)); }

  const valor = {
    token,
    claims,
    usuario,
    permissoes,
    administrador,
    autenticado: tokenValidated(token),
    open,
    close,
    hasPermission,
    hasAll,
    hasAny,
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
