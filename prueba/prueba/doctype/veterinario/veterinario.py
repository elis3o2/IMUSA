# Copyright (c) 2025, Eliseo y Miguel and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class Veterinario(Document):
	# begin: auto-generated types
	# ruff: noqa

	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF
		from prueba.prueba.doctype.veterinario_efector.veterinario_efector import VeterinarioEfector

		documentop: DF.Link
		efectores: DF.Table[VeterinarioEfector]
		matricula: DF.Data
	# ruff: noqa
	# end: auto-generated types


	pass
