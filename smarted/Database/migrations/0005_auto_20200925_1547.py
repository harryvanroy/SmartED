# Generated by Django 2.2.3 on 2020-09-25 05:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Database', '0004_auto_20200925_1528'),
    ]

    operations = [
        migrations.RenameField(
            model_name='student',
            old_name='varkA',
            new_name='A',
        ),
        migrations.RenameField(
            model_name='student',
            old_name='varkK',
            new_name='K',
        ),
        migrations.RenameField(
            model_name='student',
            old_name='varkR',
            new_name='R',
        ),
        migrations.RenameField(
            model_name='student',
            old_name='varkV',
            new_name='V',
        ),
    ]
