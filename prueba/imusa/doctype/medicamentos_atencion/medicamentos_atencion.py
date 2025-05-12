# Copyright (c) 2025, Eliseo y Miguel and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class Medicamentos_Atencion(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.model.document import Document
		from frappe.types import DF

		animal: DF.Link | None
		atencion: DF.Data | None
		medicamentos: DF.Table[Document]
	# end: auto-generated types

	pass
