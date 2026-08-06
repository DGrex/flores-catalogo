from django.db import migrations

COMPONENTES_INICIALES = [
    {"nombre": "Rosas", "icono": "🌹"},
    {"nombre": "Girasoles", "icono": "🌻"},
    {"nombre": "Tulipanes", "icono": "🌷"},
    {"nombre": "Lirios", "icono": "🌸"},
    {"nombre": "Claveles", "icono": "🌺"},
    {"nombre": "Orquídeas", "icono": "🪻"},
    {"nombre": "Chocolates", "icono": "🍫"},
    {"nombre": "Peluche", "icono": "🧸"},
    {"nombre": "Globos", "icono": "🎈"},
    {"nombre": "Vino", "icono": "🍷"},
]


def crear_componentes(apps, schema_editor):
    Componente = apps.get_model("catalogo", "Componente")
    for datos in COMPONENTES_INICIALES:
        Componente.objects.get_or_create(nombre=datos["nombre"], defaults=datos)


def eliminar_componentes(apps, schema_editor):
    Componente = apps.get_model("catalogo", "Componente")
    Componente.objects.filter(
        nombre__in=[d["nombre"] for d in COMPONENTES_INICIALES]
    ).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("catalogo", "0006_componente_flor_componentes"),
    ]

    operations = [
        migrations.RunPython(crear_componentes, eliminar_componentes),
    ]
