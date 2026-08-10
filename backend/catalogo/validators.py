"""
Validadores independientes y reutilizables.

Cada funcion tiene una unica responsabilidad (principio S de SOLID) y puede
usarse tanto desde los modelos como desde los serializers, evitando duplicar
reglas de negocio en varios lugares.
"""

from django.core.exceptions import ValidationError
from django.utils.deconstruct import deconstructible

MAX_IMAGE_SIZE_MB = 5
EXTENSIONES_PERMITIDAS = {"jpg", "jpeg", "png", "webp"}
CONTENT_TYPES_PERMITIDOS = {"image/jpeg", "image/png", "image/webp"}


@deconstructible
class ValidadorImagenSegura:
    """Valida tamaño, extension y tipo MIME real de una imagen subida.

    No confia solo en la extension del archivo (un atacante puede renombrar
    un .exe a .jpg): valida tambien el content_type reportado y, cuando es
    posible, abre la imagen con Pillow para confirmar que es una imagen real.
    """

    def __call__(self, archivo):
        # Si el archivo ya está guardado en el storage (Cloudinary), no es
        # una subida nueva: se re-valida en cada guardado del admin/API
        # aunque no se toque la imagen (Django corre full_clean sobre todos
        # los campos). Cloudinary además guarda el public_id sin extensión,
        # lo que rompía el chequeo de formato sobre imágenes ya subidas.
        if getattr(archivo, "_committed", False):
            return

        # 1. Tamaño maximo
        limite_bytes = MAX_IMAGE_SIZE_MB * 1024 * 1024
        if archivo.size > limite_bytes:
            raise ValidationError(
                f"La imagen no puede superar los {MAX_IMAGE_SIZE_MB}MB."
            )

        # 2. Extension
        extension = archivo.name.rsplit(".", 1)[-1].lower() if "." in archivo.name else ""
        if extension not in EXTENSIONES_PERMITIDAS:
            raise ValidationError(
                f"Formato no permitido. Usa: {', '.join(sorted(EXTENSIONES_PERMITIDAS))}."
            )

        # 3. Content-type reportado por el navegador
        content_type = getattr(archivo, "content_type", None)
        if content_type and content_type not in CONTENT_TYPES_PERMITIDOS:
            raise ValidationError("El tipo de archivo no corresponde a una imagen válida.")

        # 4. Verificacion real del contenido con Pillow (evita archivos disfrazados)
        try:
            from PIL import Image

            archivo.seek(0)
            imagen = Image.open(archivo)
            imagen.verify()

            # verify() solo revisa que las cabeceras sean validas y deja el
            # objeto Image inutilizable para mas operaciones. Reabrimos y
            # forzamos la decodificacion completa de los pixeles: un archivo
            # truncado o corrupto puede pasar verify() sin problema y recien
            # fallar al decodificarse de verdad (que es justo lo que hace
            # Cloudinary al recibirlo, rechazandolo con "Resource is
            # invalid"). Detectarlo aqui evita que ese fallo aparezca recien
            # en la subida, como un error 500 en vez de un mensaje claro.
            archivo.seek(0)
            imagen = Image.open(archivo)
            imagen.load()

            archivo.seek(0)
        except Exception as exc:  # noqa: BLE001
            raise ValidationError("El archivo no es una imagen válida o está dañado.") from exc


def validar_precio_positivo(valor):
    if valor is None or valor <= 0:
        raise ValidationError("El precio debe ser mayor a 0.")


def validar_precio_no_negativo(valor):
    if valor is None or valor < 0:
        raise ValidationError("El precio no puede ser negativo.")


def validar_texto_sin_html(valor):
    """Evita inyeccion de HTML/JS crudo en campos de texto (mitigacion XSS)."""
    caracteres_peligrosos = ["<script", "javascript:", "onerror=", "onload="]
    texto_normalizado = (valor or "").lower()
    for patron in caracteres_peligrosos:
        if patron in texto_normalizado:
            raise ValidationError("El texto contiene contenido no permitido.")
