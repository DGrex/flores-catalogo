import ErrorState from "@/components/ErrorState";
import FlorGrid from "@/components/FlorGrid";
import { ApiError, florService } from "@/lib/api/florService";

export const metadata = {
  title: "Catálogo | Floristería",
  description: "Explora nuestro catálogo de flores con precios e información detallada.",
};

export default async function CatalogoPage() {
  let contenido: React.ReactNode;

  try {
    const flores = await florService.obtenerCatalogo();
    contenido = <FlorGrid flores={flores} />;
  } catch (error) {
    const mensaje =
      error instanceof ApiError
        ? error.message
        : "Ocurrió un error inesperado. Intenta de nuevo más tarde.";
    contenido = <ErrorState mensaje={mensaje} />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mb-8 sm:mb-10">
        <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
          Nuestro Catálogo
        </h1>
        <p className="mt-2 text-neutral-500">
          Elige tu flor favorita y consulta directamente por WhatsApp.
        </p>
      </div>

      {contenido}
    </div>
  );
}
