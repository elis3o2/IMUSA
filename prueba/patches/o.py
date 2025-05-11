import frappe

def execute():
    usuario = "Administrator"
    roles_a_agregar = ["Creador", "Veterinario"]

    for rol in roles_a_agregar:
        print("Agregando:", rol)
        ya_tiene = frappe.db.exists("Has Role", {"parent": usuario, "role": rol})
        if not ya_tiene:
            print("AAA")
            frappe.get_doc({
                "doctype": "Has Role",
                "parent": usuario,
                "parenttype": "User",
                "parentfield": "roles",
                "role": rol
            }).insert(ignore_permissions=True)

    frappe.db.commit()
