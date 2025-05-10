import frappe
from frappe.model.db_query import DatabaseQuery as OriginalDatabaseQuery

class CustomDatabaseQuery(OriginalDatabaseQuery):
	def build_and_run(self):
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