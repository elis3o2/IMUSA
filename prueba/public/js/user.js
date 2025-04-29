

frappe.ui.form.on('User', {
    refresh: function(frm) {
        
        vista(frm)

        
        frappe.db.exists('Veterinario', frm.doc.persona).then(exists => {
            if (!exists) {
                frm.set_query('role_profiles', function() {
                    return {
                        filters: [
                            ['Role Profile', 'role_profile', '!=', "Veterinario"]
                        ]};
                });
            }
        });

        if (frappe.user_roles.includes("System Manager") && frm.doc.name == frappe.session.user 
            && !frappe.user_roles.includes("Creador") ) {
            frm.set_df_property('role_profiles', 'read_only', 1);  // Deshabilita la edición del campo
		}

    },

    onload: function(frm){
        frm.set_df_property('first_name', 'read_only', 1);
        frm.set_df_property('last_name', 'read_only', 1);
        frm.set_df_property('email', 'read_only', 1);
    },
    
    
    persona: function(frm) {
		
		frappe.call({
                method: 'frappe.client.get',
                args: {
                    doctype: 'Persona',
                    name: frm.doc.persona
                    },
                callback: function(r) {
                    if (r.message) {
                        frm.set_value('first_name', r.message.nombre);
                        frm.set_value('last_name', r.message.apellido);
                        frm.set_value('email', r.message.correo);
                        frm.refresh_field('first_name');
                        frm.refresh_field('last_name');
                        frm.refresh_field('email');
                    }
                }
            });
		
	}
})

function vista(frm){
    if (!frappe.user_roles.includes("Creador")){
                    
        frm.$wrapper.find(".btn.btn-default.ellipsis").remove();

        frm.toggle_display('sb3', false);

    
    }
}