frappe.listview_settings['Animal'] = {
    
    hide_name_column: true,
    
    add_field:["nombre"],

    refresh: function(listview) {

        
      
        if (!frappe.user_roles.includes("Creador"))  {
            // Ocultar elementos específicos para el rol "Sys User"
            $(".frappe-timestamp").remove(); // Oculta las marcas de tiempo
            $(".like-icon").remove(); // Oculta el ícono de "me gusta"
            $(".checkbox").remove(); // Oculta las casillas de selección
            $(".custom-actions").remove(); // Oculta las acciones personalizadas
            $(".select-like").remove(); // Oculta los selectores similares
            $(".menu-btn-group").remove(); // Oculta el grupo de botones del menú
            $('li[standard-filter-selection="name"]').remove(); // Oculta el filtro por "name"
            $(".layout-side-section").remove(); // Oculta la barra lateral
            $(".sort-selector").remove(); // Oculta el selector de ordenación
            $(".level-item.list-row-activity.hidden-xs").remove()
            $('input[data-fieldname="name"]').closest("div").remove(); // Oculta el campo "name"
        }
    }

};


