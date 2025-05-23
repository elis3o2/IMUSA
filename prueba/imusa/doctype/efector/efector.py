# Copyright (c) 2025, Eliseo y Miguel and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class Efector(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		direccion: DF.Link
		nombre: DF.Data
		tipo_efector: DF.Literal["Centro de Salud", "Hospital", "Centro Cultural", "Instituci\u00f3n Deportiva y Social", "Veterinaria", "Vecinal", "Distrito", "Escuela", "Biblioteca", "Centro de Jubilados y Pensionados", "Asociaci\u00f3n Civil", "SUM", "M\u00f3vil IMUSA", "Canil"]
	# end: auto-generated types

	pass
