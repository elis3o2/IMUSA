import frappe

def execute():
    workspace_name = "Users"
    doctype_to_remove = "User"

    # 🔹 Eliminar el atajo
    frappe.db.delete("Workspace Shortcut", {
        "parent": workspace_name,
        "link_to": doctype_to_remove
    })

    # 🔹 Eliminar enlaces directos al Doctype "User"
    frappe.db.delete("Workspace Link", {
        "parent": "Users",
        "link_to": "User"
    })
    frappe.db.commit()
