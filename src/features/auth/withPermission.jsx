import { useAuth } from './useAuth';
import Forbidden403 from '../../pages/Forbidden403';

export default function withPermission(Componente, allOf = [], anyOf = []) {
  return function Guarded() {
    const { possuiTodas, possuiAlguma } = useAuth();
    const okAll = allOf.length === 0 || possuiTodas(allOf);
    const okAny = anyOf.length === 0 || possuiAlguma(anyOf);
    if (okAll && okAny) return <Componente />;
    return <Forbidden403 />;
  };
}
