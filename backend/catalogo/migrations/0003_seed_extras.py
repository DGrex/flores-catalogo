from django.db import migrations

EXTRAS_INICIALES = [
    {"nombre": "Luces", "icono": "💡"},
    {"nombre": "Mariposas", "icono": "🦋"},
    {"nombre": "Corona", "icono": "👑"},
    {"nombre": "Tarjeta", "icono": "💌"},
]


def crear_extras(apps, schema_editor):
    Extra = apps.get_model("catalogo", "Extra")
    for datos in EXTRAS_INICIALES:
        Extra.objects.get_or_create(nombre=datos["nombre"], defaults=datos)


def eliminar_extras(apps, schema_editor):
    Extra = apps.get_model("catalogo", "Extra")
    Extra.objects.filter(nombre__in=[d["nombre"] for d in EXTRAS_INICIALES]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("catalogo", "0002_extra_flor_extras"),
    ]

    operations = [
        migrations.RunPython(crear_extras, eliminar_extras),
    ]
