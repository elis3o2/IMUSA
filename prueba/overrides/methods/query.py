# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: MIT. See LICENSE

"""build query for doclistview and return results"""

import json
from functools import lru_cache

from sql_metadata import Parser

import frappe
import frappe.permissions
from frappe.desk.reportview import get_form_params, compress, execute
from frappe import _
from frappe.core.doctype.access_log.access_log import make_access_log
from frappe.model import child_table_fields, default_fields, get_permitted_fields, optional_fields
from frappe.model.base_document import get_controller
from frappe.model.db_query import DatabaseQuery
from frappe.model.utils import is_virtual_doctype
from frappe.utils import add_user_info, cint, format_duration
from frappe.utils.data import sbool
from frappe.types import Filters, FilterSignature, FilterTuple
from frappe.database.utils import DefaultOrderBy, FallBackDateTimeStr, NestedSetHierarchy


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



def build_and_run_custom(self):
	if (self.doctype == "Animal" or self.doctype == "Veterinario"):
		args = self.prepare_args()
		args.limit = self.add_limit()
		if not args.fields:
			# apply_fieldlevel_read_permissions has likely removed ALL the fields that user asked for
			return []
		
		if(self.doctype == "Animal"):
			args["conditions"] = args["conditions"].replace("`tabAnimal`.`nombrep`", "`tabPersona_1`.`nombre`")
			args["conditions"] = args["conditions"].replace("`tabAnimal`.`apellidop`", "`tabPersona_1`.`apellido`")
			args["order_by"] = args["order_by"].replace("`tabAnimal`.nombrep", "`nombrep`")
			args["order_by"] = args["order_by"].replace("`tabAnimal`.apellidop", "`apellidop`")

		if(self.doctype == "Veterinario"):
			args["conditions"] = args["conditions"].replace("`tabVeterinario`.`nombrep`", "`tabPersona_1`.`nombre`")
			args["conditions"] = args["conditions"].replace("`tabVeterinario`.`apellidop`", "`tabPersona_1`.`apellido`")
			args["order_by"] = args["order_by"].replace("`tabVeterinario`.`nombrep`", "`nombrep`")
			args["order_by"] = args["order_by"].replace("`tabVeterinario`.`apellidop`", "`apellidop`")
		

		if args.conditions:
			args.conditions = "where " + args.conditions

		if self.distinct:
			args.fields = "distinct " + args.fields
			args.order_by = ""  # TODO: recheck for alternative

		# Postgres requires any field that appears in the select clause to also
		# appear in the order by and group by clause
		if frappe.db.db_type == "postgres" and args.order_by and args.group_by:
			args = self.prepare_select_args(args)
		
		if args["fields"]== '`tabAnimal`.name' or args["fields"]== '`tabVeterinario`.name':
			args["conditions"] = ""

		query = """select {fields}
		from {tables}
		{conditions}
		{group_by}
		{order_by}
		{limit}
		""".format(**args)
		return frappe.db.sql(
			query,
			as_dict=not self.as_list,
			debug=self.debug,
			update=self.update,
			ignore_ddl=self.ignore_ddl,
			run=self.run,
		)
	
	else:
		return DatabaseQuery.build_and_run_original(self)



DatabaseQuery.build_and_run_original = DatabaseQuery.build_and_run

# Sobrescribir la función en la clase DatabaseQuery
DatabaseQuery.build_and_run = build_and_run_custom
