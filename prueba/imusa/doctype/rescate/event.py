import frappe

def after_save(doc, method):
    if doc.adoptado == "Si":
        doc = frappe.get_doc("Animal", doc.animal)
        doc.documentop = doc.adoptante
        doc.save(ignore_permissions=True)
        frappe.log("SI")
