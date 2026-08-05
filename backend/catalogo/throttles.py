from rest_framework.throttling import UserRateThrottle


class EscrituraCatalogoThrottle(UserRateThrottle):
    """Límite más estricto para creación/edición desde el panel admin,
    para mitigar abuso incluso con una cuenta ya autenticada."""

    scope = "escritura_catalogo"
    rate = "30/min"
