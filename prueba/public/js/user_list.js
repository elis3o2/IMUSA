frappe.listview_settings['User'] = {
    
    refresh:function(listview) {
        if (!frappe.user_roles.includes("Creador")) { 
            $(".like-icon").hide(); 
            $(".list-header-checkbox.list-check-all").hide(); 
            $(".level-item.select-like").hide();
            $(".custom-actions").hide(); 
            $(".menu-btn-group").hide(); 
            $(".layout-side-section").hide(); 
            $('input[data-fieldname="user_type"]').closest("div").hide(); 
            $('.level-item.list-row-activity.hidden-xs').hide();
        }
    }
};
