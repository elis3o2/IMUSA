import frappe

def execute():
    # Lista de ítems que se quieren conservar
    allowed_labels = ["Reload", "User Settings", "Toggle Theme", "Log out"]

    # Obtener los ítems que deben eliminarse
    items_to_delete = frappe.get_all(
        "Navbar Item",
        filters={
            "parentfield": "settings_dropdown",
            "item_label": ["not in", allowed_labels]
        },
        pluck="name"
    )

    for name in items_to_delete:
        frappe.delete_doc("Navbar Item", name, force=True)

    frappe.db.commit()
