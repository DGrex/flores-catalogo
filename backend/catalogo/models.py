from django.db import models
from django.utils.text import slugify

from catalogo.validators import (
    ValidadorImagenSegura,
    validar_precio_no_negativo,
    validar_precio_positivo,
    validar_texto_sin_html,
)


class Categoria(models.Model):
    """Categoria de flores (ej. Rosas, Ramos, Ocasiones especiales)."""

    nombre = models.CharField(max_length=80, unique=True)
    slug = models.SlugField(max_length=90, unique=True, blank=True)

    class Meta:
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"
        ordering = ["nombre"]

    def __str__(self):
        return self.nombre

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.nombre)
        super().save(*args, **kwargs)


class Extra(models.Model):
    """Complemento opcional que puede agregarse a un arreglo (ej. luces,
    mariposas, corona, tarjeta). Se asigna por producto desde el admin,
    eligiendo qué opciones aplican a cada flor.
    """

    nombre = models.CharField(max_length=60, unique=True)
    icono = models.CharField(
        max_length=10, blank=True,
        help_text="Emoji opcional para mostrarlo en el catálogo (ej. 💡, 🦋, 👑).",
    )
    precio = models.DecimalField(
        max_digits=6, decimal_places=2, default=0,
        validators=[validar_precio_no_negativo],
        help_text="Costo adicional. Déjalo en 0 si va incluido sin costo extra (ej. Tarjeta).",
    )
    admite_texto_personalizado = models.BooleanField(
        default=False,
        help_text="Actívalo para permitir que el cliente escriba un texto "
        "(ej. la dedicatoria de la tarjeta).",
    )
    activo = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Extra"
        verbose_name_plural = "Extras"
        ordering = ["nombre"]

    def __str__(self):
        return self.nombre


class Componente(models.Model):
    """Elemento que compone un producto: tipo de flor u otra cosa que lo
    conforma (ej. Rosas, Girasoles, Chocolates, Peluche). Se elige por
    checkbox al crear/editar un producto para describir su composición,
    y se muestra en el catálogo junto a la descripción.
    """

    nombre = models.CharField(max_length=60, unique=True)
    icono = models.CharField(
        max_length=10, blank=True,
        help_text="Emoji opcional para mostrarlo en el catálogo (ej. 🌹, 🌻, 🍫).",
    )
    activo = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Componente"
        verbose_name_plural = "Componentes"
        ordering = ["nombre"]

    def __str__(self):
        return self.nombre


class Flor(models.Model):
    """Producto del catálogo. Las imágenes se delegan a Cloudinary."""

    nombre = models.CharField(max_length=120, validators=[validar_texto_sin_html])
    descripcion = models.TextField(
        max_length=600, blank=True, validators=[validar_texto_sin_html]
    )
    precio = models.DecimalField(
        max_digits=8, decimal_places=2, validators=[validar_precio_positivo]
    )
    categoria = models.ForeignKey(
        Categoria, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="flores",
    )
    imagen = models.ImageField(
        upload_to="flores/%Y/%m/",
        validators=[ValidadorImagenSegura()],
        help_text="JPG, PNG o WEBP. Máximo 5MB.",
    )
    extras = models.ManyToManyField(
        Extra, blank=True, related_name="flores",
        help_text="Complementos disponibles para este producto (luces, mariposas, corona, tarjeta, etc.).",
    )
    componentes = models.ManyToManyField(
        Componente, blank=True, related_name="flores",
        help_text="Qué tipo de flores u otros elementos incluye este producto (ej. Rosas, Girasoles, Chocolates).",
    )
    stock = models.PositiveIntegerField(default=0)
    disponible = models.BooleanField(default=True)
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Flor"
        verbose_name_plural = "Flores"
        ordering = ["-creado_en"]
        indexes = [
            models.Index(fields=["disponible"]),
            models.Index(fields=["categoria"]),
        ]

    def __str__(self):
        return f"{self.nombre} (${self.precio})"

    def marcar_disponibilidad_por_stock(self):
        """Regla de negocio simple: sin stock, no está disponible.

        Se llama explícitamente desde el service layer antes de guardar,
        para mantener el modelo libre de lógica de orquestación (SRP).
        """
        self.disponible = self.stock > 0
