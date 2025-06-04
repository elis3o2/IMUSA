import frappe

def on_update(doc, method=None):
    if doc.adoptado == "Si":
        docan = frappe.get_doc("Animal", doc.animal)
        docan.documentop = doc.adoptante
        docan.save(ignore_permissions=True)
