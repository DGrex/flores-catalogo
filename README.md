# Catálogo de Flores 🌸

Proyecto full-stack: catálogo de flores con panel de administración (Django
Admin), imágenes servidas desde Cloudinary, y frontend en Next.js con
contacto directo por WhatsApp.

```
flores-catalogo/
├── backend/    → Django + Django REST Framework (API + panel admin)
└── frontend/   → Next.js + TypeScript + Tailwind CSS (catálogo público)
```

## Flujo del sistema

1. Tú (administrador) entras a `/admin` del backend y subes una flor con
   nombre, descripción, precio, categoría e imagen.
2. La imagen se sube automáticamente a **Cloudinary** (nunca se guarda en tu
   propio servidor), que devuelve una URL ya optimizada.
3. El frontend en Next.js consulta la API (`/api/flores/`) y renderiza el
   catálogo dinámicamente — cada 60 segundos revisa si hay cambios, sin
   necesidad de rehacer un deploy.
4. Cada tarjeta de producto tiene un botón que abre WhatsApp con un mensaje
   ya redactado con el nombre y precio de la flor.

## Cómo se aplicaron los principios SOLID

**Backend (`backend/catalogo/`)**

| Principio | Dónde se aplica |
|---|---|
| **S** — Responsabilidad única | `models.py` solo define datos; `validators.py` solo valida; `repositories.py` solo consulta la BD; `services.py` solo orquesta reglas de negocio; `views.py` solo traduce HTTP |
| **O** — Abierto/cerrado | Nuevas reglas de validación se agregan como funciones nuevas en `validators.py` sin tocar el modelo existente |
| **L** — Sustitución de Liskov | `FlorRepository` implementa `AbstractFlorRepository`; cualquier otra implementación (ej. con caché) puede reemplazarla sin romper `FlorService` |
| **I** — Segregación de interfaces | Serializers separan campos de lectura (`categoria` anidado) de escritura (`categoria_id`) |
| **D** — Inversión de dependencias | `FlorService` recibe el repositorio por inyección de dependencia (`repository: AbstractFlorRepository`), no lo crea directamente |

**Frontend (`frontend/`)**

- `lib/api/florService.ts` define una interfaz `IFlorService`; los componentes
  dependen de esa abstracción, no de `fetch` directamente (inversión de
  dependencias también en el cliente).
- Cada componente (`FlorCard`, `WhatsAppButton`, `FlorGrid`, `ErrorState`,
  `FlorGridSkeleton`) tiene una única responsabilidad visual.

## Seguridad implementada

- **Gestión de secretos**: nada de contraseñas ni claves en el código;
  todo vive en `.env` / `.env.local` (nunca se suben a git).
- **Transporte**: HTTPS forzado, HSTS activado en producción, cookies
  `Secure` y `HttpOnly`.
- **Cabeceras**: `X-Frame-Options`, `X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy` en el frontend; `SecurityMiddleware`
  de Django en el backend.
- **CORS**: restringido explícitamente a los dominios del frontend
  autorizados (no `*`).
- **Autenticación**: JWT de vida corta con rotación y lista negra de tokens
  usados, para el acceso administrativo vía API.
- **Autorización**: lectura del catálogo pública; escritura (crear/editar/
  borrar flores) solo para usuarios `staff` autenticados.
- **Rate limiting**: throttling por IP/usuario en toda la API, más estricto
  aún en los endpoints de escritura, para mitigar fuerza bruta y abuso.
- **Validación de archivos**: la imagen subida se valida por tamaño,
  extensión, tipo MIME y contenido real (con Pillow) antes de guardarse —
  no se confía en la extensión del archivo.
- **Anti-XSS**: los campos de texto rechazan patrones de HTML/JS
  peligrosos (`<script`, `javascript:`, `onerror=`, etc.) antes de guardarse.
- **Validación de contraseñas**: activados los validadores estándar de
  Django (longitud mínima, no comunes, no numéricas) para cuentas del panel.
- **Límite de subida**: tamaño máximo de request configurado a nivel de
  Django para evitar saturar el servidor con archivos grandes.

> Nota sobre mantenimiento: las dependencias de código abierto (Next.js,
> Django, librerías de npm/pip) reciben parches de seguridad con frecuencia.
> Es una buena práctica correr `npm audit` / `pip list --outdated`
> periódicamente y mantener las versiones al día — esto también es parte de
> una gestión de seguridad responsable.

## Puesta en marcha

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate       # En Windows: venv\Scripts\activate
pip install -r requirements.txt --break-system-packages   # o sin esa flag si usas venv puro

cp .env.example .env           # completa SECRET_KEY, credenciales de Cloudinary, etc.

python3 manage.py migrate
python3 manage.py createsuperuser   # crea tu usuario admin
python3 manage.py runserver
```

Panel de administración: `http://localhost:8000/admin`
API del catálogo: `http://localhost:8000/api/flores/`

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local   # ajusta la URL de la API y tu número de WhatsApp
npm run dev
```

Sitio: `http://localhost:3000`

## Despliegue a producción (GitHub → deploy automático, costo $0)

Backend en Render + base de datos en Neon + frontend en Vercel, los tres
conectados directamente al repo de GitHub: cada `git push` a `main` dispara
un redeploy solo, sin subir archivos a mano. Se usa Neon en vez de la
Postgres integrada de Render porque la de Render (plan gratis) se elimina
automáticamente 30 días después de creada, sin importar si la usas o no;
Neon (plan gratis) es persistente y no caduca.

1. Crea una cuenta gratuita en [Cloudinary](https://cloudinary.com) y anota
   `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` y `CLOUDINARY_API_SECRET`.
2. **Base de datos (Neon)**: crea una cuenta en [neon.tech](https://neon.tech),
   crea un proyecto/base nueva y copia el "Connection string" (incluye
   `?sslmode=require` al final, Django lo necesita).
3. **Backend (Render)**: en el dashboard de Render, "New" → "Blueprint" →
   selecciona este repo. Render lee [`render.yaml`](render.yaml) y crea el
   web service (sin base de datos propia). Completa las variables marcadas
   como manuales en el dashboard:
   - `DATABASE_URL`: el connection string de Neon del paso 2.
   - `ALLOWED_HOSTS`: el dominio que te asigna Render (`*.onrender.com`) o tu
     dominio propio.
   - `CORS_ALLOWED_ORIGINS`: la URL de producción del frontend en Vercel.
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
     del paso 1.
4. **Frontend (Vercel)**: "Add New Project" → importa este repo → en
   "Root Directory" selecciona `frontend`. Define las variables de entorno
   `NEXT_PUBLIC_API_URL` (URL del backend en Render) y
   `NEXT_PUBLIC_WHATSAPP_NUMERO` (tu número real, formato internacional sin
   signos, ej. `593987654321`). Vercel despliega automáticamente en cada
   push, sin configuración adicional.
5. Tras el primer deploy del backend, entra a la consola/shell de Render y
   crea tu superusuario: `python manage.py createsuperuser`.
6. Si ya tenías datos en tu SQLite local que quieres conservar, migra antes
   o después del paso 5 (ver "Migrar datos existentes a producción" abajo).
7. Verifica que `CORS_ALLOWED_ORIGINS` en Render y `NEXT_PUBLIC_API_URL` en
   Vercel apunten correctamente entre sí, y que el catálogo cargue en la URL
   pública de Vercel.

### Migrar datos existentes a producción

Si ya tienes flores cargadas en tu `db.sqlite3` local y no quieres volver a
capturarlas a mano:

```bash
# 1. Exportar desde tu SQLite local (dentro de backend/, con el venv activo)
python manage.py dumpdata catalogo --indent 2 > catalogo_data.json

# 2. Con el backend ya desplegado y las migraciones corridas en Neon,
#    importar apuntando a la base de producción
DATABASE_URL="<connection string de Neon>" python manage.py loaddata catalogo_data.json

# 3. Crear el superusuario directamente contra producción (opcional, si no
#    lo hiciste desde la consola de Render)
DATABASE_URL="<connection string de Neon>" python manage.py createsuperuser
```

Como las imágenes ya están en Cloudinary, no hace falta migrar archivos —
los registros importados ya traen la referencia correcta.
