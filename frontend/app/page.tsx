import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:py-28">
      <span className="text-5xl">💐</span>
      <h1 className="mt-6 text-3xl font-bold text-neutral-900 sm:text-4xl lg:text-5xl">
        Flores para cada ocasión
      </h1>
      <p className="mt-4 max-w-xl text-base text-neutral-500 sm:text-lg">
        Explora nuestro catálogo, descubre precios e información de cada
        arreglo, y realiza tu pedido directamente por WhatsApp.
      </p>
      <Link
        href="/catalogo"
        className="mt-8 inline-flex items-center justify-center rounded-xl bg-primary-600 px-6 py-3 font-medium text-white transition-colors hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
      >
        Ver catálogo
      </Link>
    </div>
  );
}
