# Copyright (c) 2025, Eliseo y Miguel and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class Animal(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF
		from prueba.imusa.doctype.atencion.atencion import Atencion

		animal_rescatado: DF.Literal["Si", "No"]
		atencion: DF.Table[Atencion]
		color_pelaje: DF.Literal["Negro", "Gris", "Naranja", "Blanco"]
		documentop: DF.Link | None
		especie: DF.Literal["Perro", "Gato"]
		estado: DF.Literal["Vivo", "Fallecido"]
		estado_castracion: DF.Literal["Castrado", "No castrado"]
		fecha_fallecimiento: DF.Date | None
		fecha_nacimiento: DF.Date | None
		nombre: DF.Data | None
		raza: DF.Link
		sexo: DF.Literal["Macho", "Hembra"]
		tamano: DF.Literal["Mini", "Chico", "Mediano", "Grande", "Gigante"]
	# end: auto-generated types

	pass
