import logging

from cloudinary.exceptions import Error as ErrorCloudinary
from django import forms
from django.contrib import admin
from django.core.exceptions import ValidationError
from django.utils.html import format_html

from catalogo.models import Categoria, Componente, Extra, Flor

logger = logging.getLogger(__name__)


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ["nombre", "slug"]
    search_fields = ["nombre"]
    prepopulated_fields = {"slug": ("nombre",)}


@admin.register(Extra)
class ExtraAdmin(admin.ModelAdmin):
    list_display = ["nombre", "icono", "precio", "admite_texto_personalizado", "activo"]
    list_filter = ["activo"]
    search_fields = ["nombre"]


@admin.register(Componente)
class ComponenteAdmin(admin.ModelAdmin):
    list_display = ["nombre", "icono", "activo"]
    list_filter = ["activo"]
    search_fields = ["nombre"]


class FlorAdminForm(forms.ModelForm):
    class Meta:
        model = Flor
        fields = "__all__"
        widgets = {
            # Checkboxes en vez del <select multiple> por defecto: más claro
            # para elegir qué tipos de flores u otros elementos trae el ramo.
            "componentes": forms.CheckboxSelectMultiple,
        }


@admin.register(Flor)
class FlorAdmin(admin.ModelAdmin):
    form = FlorAdminForm
    list_display = ["nombre", "precio", "categoria", "stock", "disponible", "vista_previa"]
    list_filter = ["disponible", "categoria"]
    search_fields = ["nombre", "descripcion"]
    readonly_fields = ["vista_previa", "creado_en", "actualizado_en"]
    filter_horizontal = ["extras"]
    fields = [
        "nombre", "descripcion", "precio", "categoria",
        "imagen", "vista_previa", "componentes", "extras", "stock", "disponible",
        "creado_en", "actualizado_en",
    ]

    @admin.display(description="Vista previa")
    def vista_previa(self, obj):
        if obj.imagen:
            return format_html(
                '<img src="{}" style="height:80px;border-radius:8px;object-fit:cover;" />',
                obj.imagen.url,
            )
        return "Sin imagen"

    def save_model(self, request, obj, form, change):
        # Mantiene la regla "sin stock => no disponible" también al guardar
        # desde el admin, sin duplicar la lógica del service layer.
        obj.disponible = obj.stock > 0
        try:
            super().save_model(request, obj, form, change)
        except ErrorCloudinary as exc:
            # La validación local (ValidadorImagenSegura) ya descarta la
            # gran mayoría de archivos corruptos o inválidos, pero Cloudinary
            # puede seguir rechazando algún caso puntual al procesarlo. Se
            # deja registro con el detalle real para poder investigarlo,
            # y se traduce a un mensaje claro en vez de un error interno.
            logger.exception(
                "Cloudinary rechazó la imagen al guardar la flor %r", obj.nombre
            )
            raise ValidationError(
                f"No se pudo subir la imagen a Cloudinary ({exc}). "
                "Intenta con otra foto o vuelve a intentarlo en unos minutos."
            ) from exc
