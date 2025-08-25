import { useEffect, useMemo, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../../services/apiClient';
import AuthContext from './AuthContext';
import { absoluteUrl } from '../../utils/url';

function tokenValido(token) {
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
    if (token && !tokenValido(token)) {
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
    if (tokenValido(token)) carregarPerfil();
    else setUsuario(null);
  }, [token]);

  const claims = useMemo(() => {
    if (!tokenValido(token)) return null;
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
    setUsuario(null);
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
    usuario,
    permissoes,
    administrador,
    autenticado: tokenValido(token),
    entrar,
    sair,
    possui,
    possuiTodas,
    possuiAlguma,
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
