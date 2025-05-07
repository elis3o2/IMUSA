import frappe

def execute():
    if not frappe.db.exists("Email Account", "ssp_dirinformatica@rosario.gov.ar"):
        doc = frappe.get_doc({
            "doctype": "Email Account",
            "email_id": "efeuli0@rosario.gov.ar",
            "email_account_name": "ssp_dirinformatica@rosario.gov.ar",
            "enable_outgoing": 1,
            "auth_method": "Basic",
            "password": "Eliseo2003", 
            "use_tls": 1,
            "default_outgoing": 1,
            "always_use_account_email_id_as_sender": 1,
            "always_use_account_name_as_sender_name": 1,
            "send_unsubscribe_message": 1,
            "smtp_server": "smtp.rosario.gov.ar",
            "smtp_port": 587
        })

        doc.insert(ignore_permissions=True)
        frappe.db.commit()
        frappe.msgprint("Cuenta de correo creada con éxito.")
    else:
        frappe.msgprint("Ya existe una cuenta con ese nombre.")