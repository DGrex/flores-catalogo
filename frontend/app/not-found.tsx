import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <h1 className="text-3xl font-bold text-neutral-900">404</h1>
      <p className="mt-2 text-neutral-500">No encontramos la página que buscas.</p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-primary-600 px-5 py-2.5 font-medium text-white hover:bg-primary-700"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
