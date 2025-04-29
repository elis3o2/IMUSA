import frappe

def execute():
    
    print("Ejecutando el patch")
    
    fields_to_set_default_zero = [
        "form_sidebar",
        "timeline",
        "dashboard",
        "search_bar",
        "list_sidebar",
        "bulk_actions",
        "view_switcher"
    ]


    fields_to_hide = [
        "username",
        "middle_name",
        "role_profile_name",
        "roles_html",
        "roles",
        "sb_allow_modules",
        "short_bio",
        "navigation_settings_section",
        "list_settings_section",
        "form_settings_section",
        "document_follow_notifications_section",
        "email_settings",
        "workspace_section",
        "app_section",
        "desk_settings_section",
        "sb3",
        "third_party_authentication",
        "api_access",
        "sb2",
        "connections_tab"
    ]

    # Establecer valores predeterminados en cero
    for fieldname in fields_to_set_default_zero:
        frappe.db.set_value("DocField", {
            "parent": "User",
            "fieldname": fieldname
        }, "default", 0)

    # Ocultar campos
    for fieldname in fields_to_hide:
        frappe.db.set_value("DocField", {
            "parent": "User",
            "fieldname": fieldname
        }, "hidden", 1)

    frappe.clear_cache(doctype="User")


    # Quitar Quick Entry
    frappe.db.set_value("DocType", "User", "quick_entry", 0)
    print("Quick Entry disabled for User")

    # Muy importante: limpiar caché
    frappe.clear_cache()
    frappe.db.commit()
