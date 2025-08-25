let assinantes = new Set();
let contador = 0;

function notificar() {
  const ativo = contador > 0;
  for (const fn of assinantes) fn(ativo, contador);
}

export function iniciarLoading() {
  contador += 1;
  notificar();
}

export function finalizarLoading() {
  contador = Math.max(0, contador - 1);
  notificar();
}

export function assinarLoading(listener) {
  assinantes.add(listener);
  return () => assinantes.delete(listener);
}
