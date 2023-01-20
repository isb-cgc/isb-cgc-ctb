###
# Copyright 2015-2022, Institute for Systems Biology
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
import logging

register = template.Library()

# logger = logging.getLogger('main_logger')


@register.filter
def format_num_with_commmas(value):
    try:
        return "{:,}".format(int(value))
    except ValueError:
        return "0"