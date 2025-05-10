# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: MIT. See LICENSE

"""build query for doclistview and return results"""

import json

from sql_metadata import Parser

import frappe
from frappe.desk.reportview import get_form_params, compress, execute
from frappe import _
from frappe.model.base_document import get_controller
from frappe.model.utils import is_virtual_doctype



@frappe.whitelist()
@frappe.read_only()
def custom_get():
	args = get_form_params()
	if args['doctype'] == "Animal" or args['doctype'] == "Veterinario" :
		args['fields'].append('`tabPersona_1`.`nombre` as `nombrep`')
		args['fields'].append('`tabPersona_1`.`apellido` as `apellidop`')

	# If virtual doctype, get data from controller get_list method
	if is_virtual_doctype(args.doctype):
		controller = get_controller(args.doctype)
		data = compress(frappe.call(controller.get_list, args=args, **args))
	else:
		data = compress(execute(**args), args=args)
	
	return data
