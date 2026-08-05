import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-neutral-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold text-primary-600 sm:text-2xl">
          🌸 Gaby Flower
        </Link>
        <nav className="flex gap-6 text-sm font-medium text-neutral-600">
          <Link href="/catalogo" className="hover:text-primary-600">
            Catálogo
          </Link>
        </nav>
      </div>
    </header>
  );
}
