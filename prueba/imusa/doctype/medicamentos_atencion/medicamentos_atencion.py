# Copyright (c) 2025, Eliseo y Miguel and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class Medicamentos_Atencion(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF
		from prueba.prueba.doctype.medicamentos_cantidad.medicamentos_cantidad import Medicamentos_Cantidad

		animal: DF.Link | None
		atencion: DF.Data | None
		medicamentos: DF.Table[Medicamentos_Cantidad]
	# end: auto-generated types

	pass
