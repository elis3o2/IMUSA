# Copyright (c) 2025, Eliseo y Miguel and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class Rescate(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF
		from prueba.imusa.doctype.efector_fecha.efector_fecha import EfectorFecha

		adoptado: DF.Literal["Si", "No"]
		adoptante: DF.Link | None
		animal: DF.Link
		fecha_adopcion: DF.Date | None
		persona_ingresante: DF.Link
		tipo_entrada: DF.Literal["Policial", "Municipal", "Otro"]
		ubicacion: DF.Link | None
		ubicaciones: DF.Table[EfectorFecha]
	# end: auto-generated types

	pass
