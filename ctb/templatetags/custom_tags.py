###
# Copyright 2015-2019, Institute for Systems Biology
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
###
from __future__ import division
from django import template
from functools import reduce
from django.db.models import Q
from ctb.settings import SUPPORT_EMAIL
import logging

register = template.Library()

logger = logging.getLogger('main_logger')


@register.simple_tag(name='help_email')
def help_email():
    return SUPPORT_EMAIL


@register.simple_tag(takes_context=True)
def is_allowed(context, this_user):
    return (
        'RESTRICTED_ACCESS' not in context or (
            not context['RESTRICTED_ACCESS'] or (
                context['RESTRICTED_ACCESS'] and this_user.is_authenticated and this_user.groups.filter(
                    reduce(lambda q, g: q | Q(name__icontains=g), context['RESTRICTED_ACCESS_GROUPS'], Q())
                ).exists()
            )
        )
    )


@register.filter(name="add_classes")
def add_classes(value, arg):
    classes = value.field.widget.attrs.get("class", "")
    if classes:
        classes = classes.split(" ")
    else:
        classes = []
    new_classes = arg.split(" ")
    for c in new_classes:
        if c not in classes:
            classes.append(c)

    return value.as_widget(attrs={"class": " ".join(classes)})


@register.filter(name="duration")
def duration(td):
    total_seconds = int(td.total_seconds())
    hours = total_seconds // 3600
    minutes = (total_seconds % 3600) // 60
    if hours:
        if minutes:
            return '{} hr {} min'.format(hours, minutes)
        else:
            return '{} hr'.format(hours)