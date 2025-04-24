# Copyright (c) 2025, Eliseo y Miguel and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class Atencion(Document):
	# begin: auto-generated types
	# ruff: noqa

	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		direccion: DF.Link | None
		dueno: DF.Link | None
		efector: DF.Link
		egreso: DF.Datetime | None
		estado_sanitario: DF.Text | None
		huella_dactilar_persona_que_ingresa: DF.AttachImage | None
		ingreso: DF.Datetime
		parent: DF.Data
		parentfield: DF.Data
		parenttype: DF.Data
		persona_ingresante: DF.Link | None
		peso: DF.Data | None
		tipo: DF.Literal["Castraci\u00f3n", "Consulta", "Cirug\u00eda compleja", "Vacunaci\u00f3n"]
		veterinario: DF.Link | None
	# ruff: noqa
	# end: auto-generated types


	pass
