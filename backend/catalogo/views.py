from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.filters import OrderingFilter, SearchFilter

from catalogo.models import Categoria, Flor
from catalogo.permissions import EsAdminOSoloLectura
from catalogo.serializers import CategoriaSerializer, FlorSerializer
from catalogo.services import FlorService
from catalogo.throttles import EscrituraCatalogoThrottle


class CategoriaViewSet(viewsets.ReadOnlyModelViewSet):
    """Solo lectura pública: las categorías se gestionan desde el admin."""

    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [EsAdminOSoloLectura]


class FlorViewSet(viewsets.ModelViewSet):
    """
    CRUD del catálogo.

    - GET (list/retrieve): público, solo muestra flores disponibles a
      usuarios anónimos.
    - POST/PUT/PATCH/DELETE: solo staff autenticado (panel de administración).

    La vista es intencionalmente "delgada": no contiene reglas de negocio,
    solo traduce la petición HTTP hacia el FlorService (principio SRP).
    """

    serializer_class = FlorSerializer
    permission_classes = [EsAdminOSoloLectura]
    throttle_classes = [EscrituraCatalogoThrottle]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["categoria__slug", "disponible"]
    search_fields = ["nombre", "descripcion"]
    ordering_fields = ["precio", "creado_en", "nombre"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._service = FlorService()

    def get_queryset(self):
        usuario = self.request.user
        if usuario and usuario.is_authenticated and usuario.is_staff:
            return Flor.objects.select_related("categoria").all()
        return self._service.obtener_catalogo_publico()

    def perform_create(self, serializer):
        flor = serializer.save()
        self._service.guardar_flor(flor)

    def perform_update(self, serializer):
        flor = serializer.save()
        self._service.guardar_flor(flor)
