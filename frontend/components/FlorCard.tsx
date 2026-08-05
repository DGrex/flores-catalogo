"use client";

import { useState } from "react";
import Image from "next/image";

import FlorDetalleModal from "@/components/FlorDetalleModal";
import type { Flor } from "@/lib/api/types";
import { formatearPrecio } from "@/lib/utils/whatsapp";

interface FlorCardProps {
  flor: Flor;
}

export default function FlorCard({ flor }: FlorCardProps) {
  const [detalleAbierto, setDetalleAbierto] = useState(false);

  return (
    <>
      <article className="group flex flex-col overflow-hidden rounded-xl2 bg-white shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-lg">
        <button
          type="button"
          onClick={() => setDetalleAbierto(true)}
          aria-label={`Ver información de ${flor.nombre}`}
          className="relative aspect-square w-full overflow-hidden bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          <Image
            src={flor.imagen}
            alt={flor.nombre}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 23vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/20 group-hover:opacity-100">
            <span className="rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold text-neutral-800">
              Ver información
            </span>
          </div>
          {!flor.disponible && (
            <span className="absolute right-2 top-2 rounded-full bg-neutral-900/80 px-3 py-1 text-xs font-semibold text-white">
              Agotado
            </span>
          )}
          {flor.categoria && (
            <span className="absolute left-2 top-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-primary-700">
              {flor.categoria.nombre}
            </span>
          )}
        </button>

        <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
          <h3 className="text-base font-semibold text-neutral-900 sm:text-lg">
            {flor.nombre}
          </h3>
          <p className="line-clamp-2 flex-1 text-sm text-neutral-500">
            {flor.descripcion}
          </p>
          <p className="text-xl font-bold text-primary-600">
            {formatearPrecio(flor.precio)}
          </p>
        </div>
      </article>

      {detalleAbierto && (
        <FlorDetalleModal flor={flor} onCerrar={() => setDetalleAbierto(false)} />
      )}
    </>
  );
}
