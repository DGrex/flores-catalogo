import Link from "next/link";

import TulipanesChenille from "@/components/TulipanesChenille";

export default function HomePage() {
  return (
    <div className="overflow-hidden bg-gradient-to-br from-primary-50 via-[#fdf6ee] to-primary-100">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-6 lg:py-24 lg:px-8">
        <div className="animate-fade-in-up text-center lg:text-left">


          <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
            Flores que
            <br />
            no se marchitan
          </h1>

          <p className="mt-3 font-serif text-xl italic text-primary-600 sm:text-2xl">
            Detalles hechos con chenille
          </p>

          <p className="mx-auto mt-4 max-w-md text-base text-neutral-500 sm:text-lg lg:mx-0">
            Explora nuestro catálogo, descubre precios e información de cada
            arreglo, y realiza tu pedido directamente por WhatsApp.
          </p>

          <Link
            href="/catalogo"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-7 py-3.5 font-medium text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-primary-700 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
          >
            Ver catálogo
            <span aria-hidden="true">🌷</span>
          </Link>
        </div>

        <div className="animate-fade-in-up [animation-delay:150ms]">
          <TulipanesChenille />
        </div>
      </div>
    </div>
  );
}
