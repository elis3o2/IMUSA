frappe.listview_settings['Animal'] = {
    
    hide_name_column: true,
    

    refresh: function(listview) {

        
        if (!frappe.user_roles.includes("Creador"))  {
            $(".like-icon").remove(); // Oculta el ícono de "me gusta"
            $(".select-like").remove(); // Oculta los selectores similares
            $(".menu-btn-group").remove(); // Oculta el grupo de botones del menú
            $(".level-item.list-row-activity.hidden-xs").remove()
            $("div[data-fieldname = name]").hide();
            $(".btn.btn-primary.btn-sm.primary-action").show()
        }
    }

};


