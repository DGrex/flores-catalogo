"""
Capa de repositorio.

Objetivo (principio de Inversión de Dependencias - la "D" de SOLID):
las vistas y servicios NO deben hablar directamente con el ORM de Django.
Hablan con esta interfaz. Si mañana cambias de PostgreSQL a otra fuente de
datos, o quieres cachear consultas, solo tocas este archivo.
"""

from abc import ABC, abstractmethod

from catalogo.models import Flor


class AbstractFlorRepository(ABC):
    @abstractmethod
    def listar_disponibles(self, categoria_slug: str | None = None):
        ...

    @abstractmethod
    def obtener_por_id(self, flor_id: int) -> Flor | None:
        ...


class FlorRepository(AbstractFlorRepository):
    """Implementación concreta usando el ORM de Django."""

    def listar_disponibles(self, categoria_slug: str | None = None):
        queryset = Flor.objects.select_related("categoria").filter(disponible=True)
        if categoria_slug:
            queryset = queryset.filter(categoria__slug=categoria_slug)
        return queryset

    def listar_todas(self):
        return Flor.objects.select_related("categoria").all()

    def obtener_por_id(self, flor_id: int) -> Flor | None:
        return Flor.objects.select_related("categoria").filter(id=flor_id).first()
