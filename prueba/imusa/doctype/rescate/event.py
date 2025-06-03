import frappe

def after_save(doc, method):
    if doc.adoptado == "Si":
        frappe.db.set_value(
            "Animal",
            doc.animal,
            "documentop",
            doc.adoptante,
            update_modified=False
        )
        # Ignorar permisos
        frappe.db.commit()
