

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

        if (frappe.user_roles.includes("Administrador") && frm.doc.name == frappe.session.user) {
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
                    
        frm.$wrapper.find(".comment-input-wrapper").hide(); // Si es una clase
        frm.$wrapper.find(".role-editor").hide();
        frm.$wrapper.find(".menu-btn-group").hide();
        
        frm.toggle_display('sb_allow_modules', false);
        
        frm.$wrapper.find('#awesomplete_list_5 li').filter(function() {
            return $(this).text().trim() === "Crear: Perfil de Rol";
        }).hide();
        
        frm.toggle_display('desk_settings_section', false); // Ocultar la sección de escritorio
        frm.toggle_display('navigation_settings_section', false); // Ocultar la sección de navegación
        
        frm.toggle_display('list_settings_section', false); // Ocultar la sección de escritorio
        
        frm.toggle_display('form_settings_section', false); // Ocultar la sección de navegación
        
        frm.toggle_display('document_follow_notifications_section', false); // Ocultar la sección de escritorio
        
        frm.toggle_display('email_settings', false); // Ocultar la sección de navegación
        
        frm.toggle_display('workspace_section', false); // Ocultar la sección de escritorio
        frm.toggle_display('app_section', false); // Ocultar la sección de navegación
        frm.toggle_display('sb3', false);
        frm.toggle_display('third_party_authentication', false);
        frm.toggle_display('api_access', false);
        frm.$wrapper.find(".layout-side-section.right").hide();
        frm.$wrapper.find(".btn.btn-default.ellipsis").hide();
        frm.$wrapper.find(".text-muted.btn.btn-default.icon-btn").hide();

        frm.$wrapper.find('#awesomplete_list_5[role="option"]').hide();

        
    }
}