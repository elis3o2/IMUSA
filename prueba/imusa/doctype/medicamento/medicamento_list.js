// Copyright (c) 2025, Eliseo y Miguel and contributors
// For license information, please see license.txt

frappe.listview_settings['Medicamento'] = {
    refresh: function(listview) {
        if (!frappe.user_roles.includes("Creador"))  { // Verifica si el usuario tiene el rol "Sys User"
            // Ocultar elementos específicos para el rol "Sys User"
            $(".frappe-timestamp").remove(); // Oculta las marcas de tiempo
            $(".like-icon").remove(); // Oculta el ícono de "me gusta"
            $(".checkbox").remove(); // Oculta las casillas de selección
            $(".custom-actions").remove(); // Oculta las acciones personalizadas
            $(".select-like").remove(); // Oculta los selectores similares
            $(".menu-btn-group").remove(); // Oculta el grupo de botones del menú
            $(".layout-side-section").remove(); // Oculta la barra lateral
            $(".level-item.list-row-activity.hidden-xs").remove()
            $(".sort-selector").remove(); // Oculta el selector de ordenación
        }
	}
}