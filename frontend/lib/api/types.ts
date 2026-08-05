export interface Categoria {
  id: number;
  nombre: string;
  slug: string;
}

export interface Extra {
  id: number;
  nombre: string;
  icono: string;
  precio: string;
  admite_texto_personalizado: boolean;
}

export interface Flor {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
  imagen: string;
  categoria: Categoria | null;
  extras: Extra[];
  stock: number;
  disponible: boolean;
  creado_en: string;
}

export interface RespuestaPaginada<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
