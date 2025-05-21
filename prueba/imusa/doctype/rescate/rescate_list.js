frappe.listview_settings['Rescate'] = {
    
    hide_name_column: true,
    
    onload: function(listview) {
        listview.page.fields_dict.ubicacion_actual.get_query = function() {
            return {
                filters: {
                    tipo_efector: 'Canil'
                }
            };
        };
    },


    refresh: function(listview) {
        if (!frappe.user_roles.includes("Creador"))  {
            $(".like-icon").remove(); // Oculta el ícono de "me gusta"
            $(".select-like").remove(); // Oculta los selectores similares
            $(".menu-btn-group").remove(); // Oculta el grupo de botones del menú
            $(".level-item.list-row-activity.hidden-xs").remove()
            $("div[data-fieldname = name]").hide();

        }
    },

};

