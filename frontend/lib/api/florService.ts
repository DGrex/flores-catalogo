import type { Flor, RespuestaPaginada } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Contrato abstracto (principio de Inversión de Dependencias).
 *
 * Los componentes de la UI dependen de esta interfaz, no de "fetch" ni de
 * Axios directamente. Si mañana cambias la fuente de datos (otra API, un
 * CMS headless, datos de prueba en tests), solo se reemplaza la
 * implementación de abajo sin tocar ningún componente.
 */
export interface IFlorService {
  obtenerCatalogo(categoriaSlug?: string): Promise<Flor[]>;
}

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

class FlorApiService implements IFlorService {
  async obtenerCatalogo(categoriaSlug?: string): Promise<Flor[]> {
    if (!API_URL) {
      throw new ApiError("NEXT_PUBLIC_API_URL no está configurada.");
    }

    const url = new URL(`${API_URL}/flores/`);
    if (categoriaSlug) {
      url.searchParams.set("categoria__slug", categoriaSlug);
    }

    const flores: Flor[] = [];
    let siguienteUrl: string | null = url.toString();

    while (siguienteUrl) {
      let respuesta: Response;
      try {
        respuesta = await fetch(siguienteUrl, {
          next: { revalidate: 60 }, // ISR: refresca el catálogo cada 60s
        });
      } catch {
        throw new ApiError("No se pudo conectar con el servidor. Verifica tu conexión.");
      }

      if (!respuesta.ok) {
        throw new ApiError(
          `Error al obtener el catálogo (código ${respuesta.status}).`,
          respuesta.status
        );
      }

      const datos: RespuestaPaginada<Flor> | Flor[] = await respuesta.json();
      if (Array.isArray(datos)) {
        flores.push(...datos);
        siguienteUrl = null;
      } else {
        flores.push(...datos.results);
        siguienteUrl = datos.next;
      }
    }

    return flores;
  }
}

export const florService: IFlorService = new FlorApiService();
export { ApiError };
