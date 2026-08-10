const CLOUDINARY_HOST = "res.cloudinary.com";
const MARCADOR_UPLOAD = "/upload/";

/**
 * Loader personalizado de next/image para Cloudinary.
 *
 * En vez de que el servidor de Next.js descargue y redimensione cada imagen
 * (lento en hosting con recursos limitados), delega el resize + conversión de
 * formato/calidad al CDN de Cloudinary, que ya sirve el archivo optimizado
 * desde el edge más cercano al usuario.
 *
 * Solo transforma URLs que realmente sean de res.cloudinary.com; cualquier
 * otro origen se devuelve intacto (nunca se construye una URL con un host
 * distinto al de la imagen original).
 */
export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return src;
  }

  if (url.hostname !== CLOUDINARY_HOST) {
    return src;
  }

  const indice = url.pathname.indexOf(MARCADOR_UPLOAD);
  if (indice === -1) {
    return src;
  }

  const calidad = quality ? String(quality) : "auto";
  const transformaciones = `f_auto,q_${calidad},w_${width},c_limit`;
  const inicioResto = indice + MARCADOR_UPLOAD.length;
  const pathTransformado =
    url.pathname.slice(0, inicioResto) + transformaciones + "/" + url.pathname.slice(inicioResto);

  return `${url.origin}${pathTransformado}${url.search}`;
}
