from rest_framework.permissions import SAFE_METHODS, BasePermission


class EsAdminOSoloLectura(BasePermission):
    """Cualquiera puede leer el catálogo (GET).

    Solo un usuario staff autenticado (el administrador de la tienda) puede
    crear, editar o eliminar flores. Esto protege la escritura de datos sin
    bloquear la vitrina pública.
    """

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)
