import FlorCard from "@/components/FlorCard";
import type { Categoria, Flor } from "@/lib/api/types";

interface FlorGridProps {
  flores: Flor[];
}

interface Grupo {
  categoria: Categoria | null;
  flores: Flor[];
}

const SIN_CATEGORIA = "sin-categoria";

function agruparPorCategoria(flores: Flor[]): Grupo[] {
  const grupos = new Map<string, Grupo>();

  for (const flor of flores) {
    const clave = flor.categoria?.slug ?? SIN_CATEGORIA;
    if (!grupos.has(clave)) {
      grupos.set(clave, { categoria: flor.categoria, flores: [] });
    }
    grupos.get(clave)!.flores.push(flor);
  }

  return Array.from(grupos.values()).sort((a, b) => {
    if (!a.categoria) return 1;
    if (!b.categoria) return -1;
    return a.categoria.nombre.localeCompare(b.categoria.nombre);
  });
}

function CuadriculaFlores({ flores }: { flores: Flor[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {flores.map((flor) => (
        <FlorCard key={flor.id} flor={flor} />
      ))}
    </div>
  );
}

export default function FlorGrid({ flores }: FlorGridProps) {
  if (flores.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl2 border border-dashed border-neutral-300 py-20 text-center">
        <p className="text-lg font-medium text-neutral-600">
          No hay flores disponibles por el momento.
        </p>
        <p className="mt-1 text-sm text-neutral-400">
          Vuelve a intentarlo más tarde.
        </p>
      </div>
    );
  }

  const grupos = agruparPorCategoria(flores);

  if (grupos.length === 1) {
    return <CuadriculaFlores flores={grupos[0]!.flores} />;
  }

  return (
    <div className="flex flex-col gap-10">
      {grupos.map((grupo) => (
        <section key={grupo.categoria?.slug ?? SIN_CATEGORIA}>
          <h2 className="mb-4 text-lg font-bold text-neutral-900 sm:text-xl">
            {grupo.categoria?.nombre ?? "Otros"}
          </h2>
          <CuadriculaFlores flores={grupo.flores} />
        </section>
      ))}
    </div>
  );
}
