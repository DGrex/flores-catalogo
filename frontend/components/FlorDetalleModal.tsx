"use client";

import { useEffect, useMemo, useState } from "react";

import ImagenFlor from "@/components/ImagenFlor";
import WhatsAppButton from "@/components/WhatsAppButton";
import type { Flor } from "@/lib/api/types";
import { formatearPrecio } from "@/lib/utils/whatsapp";

interface FlorDetalleModalProps {
  flor: Flor;
  onCerrar: () => void;
}

export default function FlorDetalleModal({ flor, onCerrar }: FlorDetalleModalProps) {
  const [extrasSeleccionados, setExtrasSeleccionados] = useState<number[]>([]);
  const [textosPersonalizados, setTextosPersonalizados] = useState<Record<number, string>>({});

  useEffect(() => {
    const alPresionarTecla = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") onCerrar();
    };
    document.addEventListener("keydown", alPresionarTecla);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", alPresionarTecla);
      document.body.style.overflow = "";
    };
  }, [onCerrar]);

  function alternarExtra(id: number) {
    setExtrasSeleccionados((actual) =>
      actual.includes(id) ? actual.filter((e) => e !== id) : [...actual, id]
    );
  }

  const extrasElegidos = flor.extras.filter((extra) => extrasSeleccionados.includes(extra.id));

  const extrasConTextoFaltante = extrasElegidos.filter(
    (extra) => extra.admite_texto_personalizado && !textosPersonalizados[extra.id]?.trim()
  );

  const totalExtras = extrasElegidos.reduce((suma, extra) => suma + parseFloat(extra.precio), 0);
  const totalEstimado = parseFloat(flor.precio) + totalExtras;

  const mensaje = useMemo(() => {
    const lineas = [`Hola, me interesa este producto: ${flor.nombre} - ${formatearPrecio(flor.precio)}`];

    for (const extra of extrasElegidos) {
      const costo = parseFloat(extra.precio);
      const etiquetaCosto = costo > 0 ? ` (+${formatearPrecio(costo)})` : " (incluida)";
      lineas.push(`Agregar: ${extra.nombre}${etiquetaCosto}`);
      const texto = textosPersonalizados[extra.id]?.trim();
      if (extra.admite_texto_personalizado && texto) {
        lineas.push(`Texto para ${extra.nombre.toLowerCase()}: "${texto}"`);
      }
    }

    if (totalExtras > 0) {
      lineas.push(`Total estimado: ${formatearPrecio(totalEstimado)}`);
    }

    return lineas.join("\n");
  }, [flor, extrasElegidos, textosPersonalizados, totalExtras, totalEstimado]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4"
      onClick={onCerrar}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={flor.nombre}
        onClick={(evento) => evento.stopPropagation()}
        className="flex h-[100dvh] w-full flex-col overflow-y-auto bg-white shadow-xl sm:h-[85vh] sm:max-w-5xl sm:flex-row sm:overflow-hidden sm:rounded-xl2"
      >
        <div className="relative aspect-square w-full flex-none bg-primary-50 sm:aspect-auto sm:w-1/2">
          <ImagenFlor
            src={flor.imagen}
            alt={flor.nombre}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover"
            priority
          />
          {!flor.disponible && (
            <span className="absolute right-3 top-3 rounded-full bg-neutral-900/80 px-3 py-1 text-xs font-semibold text-white">
              Agotado
            </span>
          )}
        </div>

        <div className="flex flex-col gap-4 p-5 sm:min-h-0 sm:flex-1 sm:overflow-y-auto sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              {flor.categoria && (
                <span className="mb-1 inline-block rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
                  {flor.categoria.nombre}
                </span>
              )}
              <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">
                {flor.nombre}
              </h2>
            </div>
            <button
              type="button"
              onClick={onCerrar}
              aria-label="Cerrar"
              className="rounded-full p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <p className="text-2xl font-bold text-primary-600">
            {formatearPrecio(flor.precio)}
          </p>

          {flor.descripcion && (
            <p className="text-sm leading-relaxed text-neutral-600">
              {flor.descripcion}
            </p>
          )}

          {flor.componentes.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-semibold text-neutral-900">
                Composición
              </p>
              <div className="flex flex-wrap gap-2">
                {flor.componentes.map((componente) => (
                  <span
                    key={componente.id}
                    className="inline-flex items-center gap-1.5 rounded-full bg-neutral-50 px-3 py-1.5 text-sm font-medium text-neutral-700 ring-1 ring-inset ring-neutral-200"
                  >
                    {componente.icono && (
                      <span aria-hidden="true">{componente.icono}</span>
                    )}
                    {componente.nombre}
                  </span>
                ))}
              </div>
            </div>
          )}

          {flor.extras.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-semibold text-neutral-900">
                Opciones para agregar
              </p>
              <div className="flex flex-wrap gap-2">
                {flor.extras.map((extra) => {
                  const activo = extrasSeleccionados.includes(extra.id);
                  const costo = parseFloat(extra.precio);
                  return (
                    <button
                      type="button"
                      key={extra.id}
                      onClick={() => alternarExtra(extra.id)}
                      aria-pressed={activo}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                        activo
                          ? "border-primary-600 bg-primary-600 text-white"
                          : "border-neutral-200 bg-white text-neutral-600 hover:border-primary-300 hover:text-primary-700"
                      }`}
                    >
                      {extra.icono && <span aria-hidden="true">{extra.icono}</span>}
                      {extra.nombre}
                      <span className={activo ? "text-white/80" : "text-neutral-400"}>
                        {costo > 0 ? `+${formatearPrecio(costo)}` : "Gratis"}
                      </span>
                    </button>
                  );
                })}
              </div>

              {extrasElegidos
                .filter((extra) => extra.admite_texto_personalizado)
                .map((extra) => {
                  const faltaTexto = extrasConTextoFaltante.some((e) => e.id === extra.id);
                  return (
                    <div key={extra.id} className="mt-3">
                      <label
                        htmlFor={`texto-extra-${extra.id}`}
                        className="mb-1 block text-xs font-medium text-neutral-500"
                      >
                        Texto para {extra.nombre.toLowerCase()}{" "}
                        <span className="text-primary-600">(obligatorio)</span>
                      </label>
                      <textarea
                        id={`texto-extra-${extra.id}`}
                        value={textosPersonalizados[extra.id] ?? ""}
                        onChange={(evento) =>
                          setTextosPersonalizados((actual) => ({
                            ...actual,
                            [extra.id]: evento.target.value,
                          }))
                        }
                        maxLength={200}
                        rows={2}
                        placeholder="Escribe la dedicatoria que quieres incluir..."
                        aria-invalid={faltaTexto}
                        aria-describedby={faltaTexto ? `error-texto-extra-${extra.id}` : undefined}
                        className={`w-full resize-none rounded-lg border px-3 py-2 text-sm text-neutral-700 focus-visible:outline focus-visible:outline-2 ${
                          faltaTexto
                            ? "border-red-400 focus-visible:outline-red-500"
                            : "border-neutral-200 focus-visible:outline-primary-500"
                        }`}
                      />
                      {faltaTexto && (
                        <p id={`error-texto-extra-${extra.id}`} className="mt-1 text-xs text-red-600">
                          Escribe el texto que quieres para {extra.nombre.toLowerCase()}.
                        </p>
                      )}
                    </div>
                  );
                })}

              {totalExtras > 0 && (
                <p className="mt-3 text-sm font-semibold text-neutral-900">
                  Total estimado: {formatearPrecio(totalEstimado)}
                </p>
              )}
            </div>
          )}

          <p className="rounded-lg bg-neutral-50 px-3 py-2 text-xs text-neutral-500">
            ¿Buscas agregar algo más? Pídelo directamente y lo conversamos por WhatsApp.
          </p>

          {extrasConTextoFaltante.length > 0 && (
            <p className="text-xs text-red-600">
              Completa el texto de{" "}
              {extrasConTextoFaltante.map((e) => e.nombre.toLowerCase()).join(", ")} para
              continuar.
            </p>
          )}

          <WhatsAppButton
            mensaje={mensaje}
            className="mt-1 w-full"
            disabled={extrasConTextoFaltante.length > 0}
          >
            Consultar por WhatsApp
          </WhatsAppButton>
        </div>
      </div>
    </div>
  );
}
