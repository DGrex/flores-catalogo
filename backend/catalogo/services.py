"""
Capa de servicio: orquesta reglas de negocio.

Las vistas (views.py) quedan "delgadas": solo traducen HTTP <-> servicio.
Toda regla de negocio vive aquí, no en la vista ni en el modelo, lo que
facilita testear la lógica sin necesidad de un cliente HTTP.
"""

from catalogo.models import Flor
from catalogo.repositories import AbstractFlorRepository, FlorRepository


class FlorService:
    def __init__(self, repository: AbstractFlorRepository | None = None):
        # Inyección de dependencia con valor por defecto: facilita testear
        # con un repositorio falso (mock) sin tocar esta clase.
        self._repository = repository or FlorRepository()

    def obtener_catalogo_publico(self, categoria_slug: str | None = None):
        return self._repository.listar_disponibles(categoria_slug)

    def guardar_flor(self, flor: Flor) -> Flor:
        flor.marcar_disponibilidad_por_stock()
        flor.full_clean()  # fuerza que corran todos los validadores del modelo
        flor.save()
        return flor
