import frappe

def execute():
    # Lista de Workspaces a actualizar
    workspaces = ["Users", "Build", "Integrations", "Tools", "Website"]

    for workspace in workspaces:
        # Verificar si ya existe el rol para evitar duplicados
        exists = frappe.db.exists(
            "Has Role",
            {
                "parent": workspace,
                "parenttype": "Workspace",
                "parentfield": "roles",
                "role": "Creador"
            }
        )
        if not exists:
            frappe.get_doc({
                "doctype": "Has Role",
                "parent": workspace,
                "parenttype": "Workspace",
                "parentfield": "roles",
                "role": "Creador"
            }).insert()
            frappe.db.commit()
