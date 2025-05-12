import frappe

def asignar_rol_administrator():
    user = frappe.get_doc("User", "Administrator")
    if not any(role.role == "Creador" for role in user.roles):
        user.append("roles", {"role": "Creador"})
        user.save()
        frappe.db.commit()
        frappe.logger().info("Rol 'Creador' asignado al usuario Administrator.")
