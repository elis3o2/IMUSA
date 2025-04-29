import frappe

def get_permission_query_conditions(user):
    if not user:
        user = frappe.session.user

    if user == "Administrator":
        return None

    es_creador = frappe.db.exists("Has Role", {
        "parent": user,
        "role": "Creador"
    })

    if es_creador:
        return None

    return """
        (
            `tabUser`.name IN (
                SELECT parent FROM `tabHas Role`
                WHERE role IN ("Veterinario", "System Manager")
                  AND parent NOT IN (
                      SELECT parent FROM `tabHas Role`
                      WHERE role = "Creador"
                  )
                  AND parenttype = "User"
            )
            OR
            `tabUser`.name NOT IN (
                SELECT DISTINCT parent FROM `tabHas Role`
                WHERE parenttype = "User"
            )
        )
    """
