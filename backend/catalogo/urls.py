from rest_framework.routers import DefaultRouter

from catalogo.views import CategoriaViewSet, FlorViewSet

router = DefaultRouter()
router.register("flores", FlorViewSet, basename="flor")
router.register("categorias", CategoriaViewSet, basename="categoria")

urlpatterns = router.urls
