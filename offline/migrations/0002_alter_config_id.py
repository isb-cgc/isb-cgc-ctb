# Generated by Django 3.2.13 on 2022-05-26 18:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('offline', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='config',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]
