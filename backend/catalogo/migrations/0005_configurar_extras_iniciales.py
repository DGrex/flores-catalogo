from decimal import Decimal

from django.db import migrations

# La tarjeta va incluida sin costo y admite el texto/dedicatoria del cliente.
# Los demás extras quedan con precio en 0 hasta que se configure el costo
# real desde el admin (no inventamos precios de negocio).
TARJETA = {"precio": Decimal("0"), "admite_texto_personalizado": True}


def configurar_extras(apps, schema_editor):
    Extra = apps.get_model("catalogo", "Extra")
    Extra.objects.filter(nombre="Tarjeta").update(**TARJETA)


def revertir(apps, schema_editor):
    Extra = apps.get_model("catalogo", "Extra")
    Extra.objects.filter(nombre="Tarjeta").update(
        precio=Decimal("0"), admite_texto_personalizado=False
    )


class Migration(migrations.Migration):

    dependencies = [
        ("catalogo", "0004_extra_admite_texto_personalizado_extra_precio"),
    ]

    operations = [
        migrations.RunPython(configurar_extras, revertir),
    ]
