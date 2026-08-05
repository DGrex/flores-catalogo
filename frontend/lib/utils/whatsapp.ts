/**
 * Construye un enlace wa.me válido y codificado, evitando inyecciones en
 * la URL (nunca se concatena texto crudo del usuario sin encodeURIComponent).
 */
export function construirEnlaceWhatsApp(
  numero: string | undefined,
  mensaje: string
): string | null {
  if (!numero) return null;
  const numeroLimpio = numero.replace(/[^\d]/g, "");
  if (!numeroLimpio) return null;
  return `https://wa.me/${numeroLimpio}?text=${encodeURIComponent(mensaje)}`;
}

export function formatearPrecio(precio: string | number): string {
  const valor = typeof precio === "string" ? parseFloat(precio) : precio;
  if (Number.isNaN(valor)) return "$0.00";
  return `$${valor.toFixed(2)}`;
}
