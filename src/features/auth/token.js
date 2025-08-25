import { jwtDecode } from 'jwt-decode';

export function tokenValido(token) {
  if (!token) return false;
  try {
    const { exp } = jwtDecode(token);
    return !!exp && exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}
