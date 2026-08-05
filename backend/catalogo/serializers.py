from rest_framework import serializers

from catalogo.models import Categoria, Extra, Flor
from catalogo.validators import validar_texto_sin_html


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ["id", "nombre", "slug"]


class ExtraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Extra
        fields = ["id", "nombre", "icono", "precio", "admite_texto_personalizado"]


class FlorSerializer(serializers.ModelSerializer):
    """Serializer único, pero con validación explícita por campo
    (principio de responsabilidad única: cada método valida una sola cosa).
    """

    categoria = CategoriaSerializer(read_only=True)
    categoria_id = serializers.PrimaryKeyRelatedField(
        queryset=Categoria.objects.all(), source="categoria",
        write_only=True, required=False, allow_null=True,
    )
    extras = ExtraSerializer(many=True, read_only=True)
    extras_ids = serializers.PrimaryKeyRelatedField(
        queryset=Extra.objects.filter(activo=True), source="extras",
        write_only=True, required=False, many=True,
    )

    class Meta:
        model = Flor
        fields = [
            "id", "nombre", "descripcion", "precio", "imagen",
            "categoria", "categoria_id", "extras", "extras_ids",
            "stock", "disponible", "creado_en",
        ]
        read_only_fields = ["id", "disponible", "creado_en"]

    def validate_nombre(self, value: str) -> str:
        valor = value.strip()
        if len(valor) < 3:
            raise serializers.ValidationError("El nombre debe tener al menos 3 caracteres.")
        validar_texto_sin_html(valor)
        return valor

    def validate_descripcion(self, value: str) -> str:
        valor = value.strip()
        if len(valor) < 10:
            raise serializers.ValidationError("La descripción debe tener al menos 10 caracteres.")
        validar_texto_sin_html(valor)
        return valor

    def validate_precio(self, value):
        if value <= 0:
            raise serializers.ValidationError("El precio debe ser mayor a 0.")
        if value > 10000:
            raise serializers.ValidationError("El precio parece incorrecto (máximo $10000).")
        return value

    def validate_stock(self, value):
        if value < 0:
            raise serializers.ValidationError("El stock no puede ser negativo.")
        return value
