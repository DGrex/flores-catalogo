interface ErrorStateProps {
  mensaje: string;
}

export default function ErrorState({ mensaje }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center rounded-xl2 border border-red-200 bg-red-50 py-16 text-center"
    >
      <p className="text-lg font-medium text-red-700">
        No se pudo cargar el catálogo
      </p>
      <p className="mt-1 text-sm text-red-500">{mensaje}</p>
    </div>
  );
}
