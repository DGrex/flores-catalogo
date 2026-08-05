"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <h1 className="text-2xl font-bold text-neutral-900">
        Algo salió mal
      </h1>
      <p className="mt-2 text-neutral-500">
        Ocurrió un error inesperado. Puedes intentar de nuevo.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-xl bg-primary-600 px-5 py-2.5 font-medium text-white hover:bg-primary-700"
      >
        Reintentar
      </button>
    </div>
  );
}
