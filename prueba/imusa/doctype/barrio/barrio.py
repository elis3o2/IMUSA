# Copyright (c) 2025, Eliseo y Miguel and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class Barrio(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		barrio: DF.Data
		distrito: DF.Link
	# end: auto-generated types

	pass
