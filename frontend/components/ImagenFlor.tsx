"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

/**
 * Envuelve next/image con un skeleton mientras carga y un fade-in al
 * terminar, para que la tarjeta/modal nunca se vea "congelada" con un
 * hueco vacío mientras la imagen todavía viaja desde el CDN.
 */
export default function ImagenFlor({ className = "", alt, onLoad, ...props }: ImageProps) {
  const [cargada, setCargada] = useState(false);

  return (
    <>
      {!cargada && (
        <div className="absolute inset-0 animate-pulse bg-neutral-200" aria-hidden="true" />
      )}
      <Image
        {...props}
        alt={alt}
        onLoad={(evento) => {
          setCargada(true);
          onLoad?.(evento);
        }}
        className={`${className} transition-opacity duration-300 ${
          cargada ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );
}
