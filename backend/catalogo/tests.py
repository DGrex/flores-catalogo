from decimal import Decimal
from types import SimpleNamespace

from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase

from catalogo.validators import (
    ValidadorImagenSegura,
    validar_precio_positivo,
    validar_texto_sin_html,
)


class ValidadorImagenSeguraTestCase(TestCase):
    """Cloudinary guarda el archivo sin extensión en su nombre (public_id),
    y Django re-corre los validadores del modelo en cada guardado del admin
    aunque no se toque la imagen. Sin el chequeo de `_committed`, editar
    cualquier otro campo de una Flor ya guardada fallaba con "Formato no
    permitido" solo por re-validar la imagen existente.
    """

    def test_archivo_ya_guardado_no_se_revalida(self):
        archivo_existente = SimpleNamespace(_committed=True, name="media/flores/foto_sin_extension")
        ValidadorImagenSegura()(archivo_existente)  # no debe lanzar excepción

    def test_archivo_nuevo_con_extension_invalida_falla(self):
        archivo_nuevo = SimpleUploadedFile("virus.exe", b"contenido", content_type="application/octet-stream")
        with self.assertRaises(ValidationError):
            ValidadorImagenSegura()(archivo_nuevo)


class ValidadoresTestCase(TestCase):
    def test_precio_negativo_falla(self):
        with self.assertRaises(ValidationError):
            validar_precio_positivo(Decimal("-5.00"))

    def test_precio_cero_falla(self):
        with self.assertRaises(ValidationError):
            validar_precio_positivo(Decimal("0"))

    def test_precio_valido_pasa(self):
        validar_precio_positivo(Decimal("12.50"))  # no debe lanzar excepción

    def test_texto_con_script_falla(self):
        with self.assertRaises(ValidationError):
            validar_texto_sin_html('Rosa roja <script>alert(1)</script>')

    def test_texto_normal_pasa(self):
        validar_texto_sin_html("Rosa roja de tallo largo")  # no debe lanzar excepción


class FlorSerializerTestCase(TestCase):
    def test_nombre_muy_corto_es_invalido(self):
        from catalogo.serializers import FlorSerializer

        serializer = FlorSerializer(data={
            "nombre": "Ro",
            "descripcion": "Descripción suficientemente larga",
            "precio": "10.00",
            "stock": 5,
        })
        self.assertFalse(serializer.is_valid())
        self.assertIn("nombre", serializer.errors)

    def test_precio_excesivo_es_invalido(self):
        from catalogo.serializers import FlorSerializer

        serializer = FlorSerializer(data={
            "nombre": "Rosa Roja",
            "descripcion": "Descripción suficientemente larga",
            "precio": "999999.00",
            "stock": 5,
        })
        self.assertFalse(serializer.is_valid())
        self.assertIn("precio", serializer.errors)
