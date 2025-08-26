let assinantes = new Set();
let contador = 0;

function notify() {
  const ativo = contador > 0;
  for (const fn of assinantes) fn(ativo, contador);
}

export function initLoading() {
  contador += 1;
  notify();
}

export function finallyLoading() {
  contador = Math.max(0, contador - 1);
  notify();
}

export function singhLoading(listener) {
  assinantes.add(listener);
  return () => assinantes.delete(listener);
}
