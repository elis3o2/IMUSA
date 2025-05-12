# Copyright (c) 2025, Eliseo y Miguel and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class Persona(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		apellido: DF.Data
		correo: DF.Data | None
		direccion: DF.Data | None
		localidad: DF.Literal["Rosario", "Funes", "Otro"]
		nombre: DF.Data
		numero_documento: DF.Data
		sexo: DF.Literal["M", "F"]
		telefono: DF.Data | None
	# end: auto-generated types

	pass
