# Copyright (c) 2025, Eliseo y Miguel and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class Direcciones(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		altura: DF.Int
		barrio: DF.Link | None
		codigo_calle: DF.Data | None
		coordenada_x: DF.Data | None
		coordenada_y: DF.Data | None
		distrito: DF.Link | None
		feature: DF.Data
		fraccion_censal: DF.Data | None
		lineas_tup: DF.LongText | None
		radio_censal: DF.Data | None
		vecinal: DF.Link | None
	# end: auto-generated types

	pass
