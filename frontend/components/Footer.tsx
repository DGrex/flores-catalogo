export default function Footer() {
  return (
    <footer className="border-t border-neutral-100 py-8">
      <div className="mx-auto max-w-7xl px-4 text-center text-sm text-neutral-400 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} Gaby Flower. Todos los derechos reservados.
      </div>
    </footer>
  );
}
