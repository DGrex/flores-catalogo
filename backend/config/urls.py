from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("catalogo.urls")),
    # Autenticacion JWT para el panel/administracion via API
    path("api/auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]

# Solo en desarrollo: sirve las imagenes guardadas localmente cuando
# Cloudinary aun no esta configurado. En produccion (DEBUG=False) esto no
# se activa; ahi las imagenes ya vienen de Cloudinary directamente.
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
