// Copyright (c) 2025, Eliseo y Miguel and contributors
// For license information, please see license.txt
frappe.ui.form.on('Rescate', {
    
    onload: function(frm) {

        frm.fields_dict["ubicaciones"].grid.get_field("ubicacion").get_query = function(doc, cdt, cdn) {
            var child = locals[cdt][cdn];
            return {    
                filters:[
                     ["Efector", "tipo_efector", "=", "Canil"]
                ]
            }
        }
        


    },

    refresh: function(frm) {
		frm.toggle_display('adoptante', frm.doc.adoptado == 'Si');
		frm.toggle_reqd('adoptante', frm.doc.adoptado == 'Si');

        frm.toggle_display('ubicacion_actual', frm.doc.adoptado == 'No');
        


        completar_campos(frm);
    
        vista_ubicacion(frm)

        permisos(frm)
        
    },
    
	adoptado: function(frm) {
        if(frm.doc.adoptado == 'Si'){
            if (frm.doc.ubicaciones.length > 0){
                let n = frm.doc.ubicaciones.length
                if (!frm.doc.ubicaciones[n -1].fecha_salida) {
                    frappe.msgprint("Debe cerrar la ubicación antes poder ser adoptado")
                    frm.set_value('adoptado', "No");
                }

                else{
                    frm.toggle_display('adoptante', frm.doc.adoptado == 'Si');
                    frm.toggle_reqd('adoptante', frm.doc.adoptado == 'Si');
                }
            }
        }

	},
	
    

	after_save: function(frm){

        
        if (frm.doc.ubicaciones.length > 0){
            let n = frm.doc.ubicaciones.length
            if (!frm.doc.ubicaciones[n -1].fecha_salida) {
                let ultima_ubicacion = frm.doc.ubicaciones[n-1].ubicacion;
                
                frappe.db.set_value("Rescate", frm.doc.name,"ubicacion_actual", ultima_ubicacion);
            }
            else{
                frappe.db.set_value("Rescate", frm.doc.name,"ubicacion_actual", null);
            }
        }
    },

    animal: function(frm){
        completar_campos(frm)
    }
})

function completar_campos(frm) {
    if (frm.doc.animal) {
        frappe.call({
            method: 'frappe.client.get',
            args: {
                doctype: 'Animal',
                name: frm.doc.animal
            },
            callback: function(r) {
                if (r.message) {
                    frm.set_value('nombre', r.message.nombre);
                    frm.set_value('sexo', r.message.sexo);
                    frm.set_value('fecha_nacimiento', r.message.fecha_nacimiento);
                    frm.set_value('especie', r.message.especie);
                    frm.set_value('raza', r.message.raza);
                    frm.set_value('estado_castracion', r.message.estado_castracion);
                    frm.set_value('tamano', r.message.tamano);
                    frm.set_value('color_pelaje', r.message.color_pelaje);
                    frm.set_value('estado', r.message.estado);
                    frm.set_value('fecha_fallecimiento', r.message.fecha_fallecimiento);
                    frm.refresh_field('nombre');
                    frm.refresh_field('sexo');
                    frm.refresh_field('fecha_nacimiento');
                    frm.refresh_field('especie');
                    frm.refresh_field('raza');
                    frm.refresh_field('estado_castracion');
                    frm.refresh_field('tamano');
                    frm.refresh_field('color_pelaje');
                    frm.refresh_field('estado');
                    frm.refresh_field('fecha_fallecimiento');
                }
            }
        });
    }
}

//Solo se puede editar/borrar formularios creados en el dia y por el mismo usuario
function permisos(frm){
    if (!frm.is_new()){
	        
        const today = frappe.datetime.get_today();
        const creation_date = frappe.datetime.str_to_obj(frm.doc.creation).toISOString().split('T')[0];
        
        if (creation_date !== today && frm.doc.owner !== frappe.session.user){
            frm.set_df_property('tipo_entrada', 'read_only', 1);
            frm.set_df_property('persona_ingresante', 'read_only', 1);
            if (frm.doc.adoptado == "Si"){
                frm.set_df_property('adoptado', 'read_only', 1)
                frm.set_df_property('adoptante', 'read_only', 1)
            }
        }
        
        frm.fields_dict["ubicaciones"].grid.grid_rows.forEach(row => {
            const doc = row.doc;

            if (doc.fecha_salida) {
                frm.set_df_property('ubicaciones', 'read_only', 1, frm.docname, 'fecha_salida', doc.name)
            }
            
            const creation_date_row = frappe.datetime.str_to_obj(doc.fecha_entrada).toISOString().split('T')[0];
            if (doc.owner !== frappe.session.user || creation_date_row !== frappe.datetime.get_today()) {
                frm.set_df_property('ubicaciones', 'read_only', 1, frm.docname, 'efector', doc.name)
                frm.set_df_property('ubicaciones', 'read_only', 1, frm.docname, 'fecha_entrada', doc.name)
            }
        });
    }
}



function vista_ubicacion(frm){
    frm.$wrapper.find(".row-check.sortable-handle.col").remove();
    frm.$wrapper.find('use[href="#icon-setting-gear"]').parent().remove();        
    var css = document.createElement('style');
    css.type = 'text/css';

    var styles = '.row-index {display:none;}';

    if (css.styleSheet){
        css.styleSheet.cssText = styles
    }
    else{
        css.appendChild(document.createTextNode(styles));
    }

    document.getElementsByTagName("head")[0].appendChild(css);
    
    frm.$wrapper.on('click', 'col.grid-static-col.pointer', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    });
    let config =frm.$wrapper.find('.col.grid-static-col.pointer').attr("readonly", true)
        .css({
            "pointer-events": "none",
            "cursor": "default",
            "background": "#f5f5f5",
            "opacity": "0.6"  // Opcional: hace que parezca deshabilitado
        })
        .off("click")
}


frappe.ui.form.on('Efector-Fecha', {
    
    ubicacion_add: function(frm,cdt,cdn){

    },


    form_render: function(frm,cdt,cdn){
	    
        borrar_botones(frm,cdt,cdn)
    },

    fecha_entrada: function(frm, cdt, cdn) {
        validar_ingreso_egreso(frm, cdt, cdn)
    },
    
    fecha_salida: function(frm,cdt, cdn){
        validar_ingreso_egreso(frm, cdt, cdn)
    }
})



function validar_ingreso_egreso(frm, cdt, cdn) {
    const child = locals[cdt][cdn];  // Referencia a la fila actual
    const fecha_entrada = new Date(child.fecha_entrada);
    const now = new Date(frappe.datetime.now_datetime());

    let fecha_salida = child.fecha_salida ? new Date(child.fecha_salida) : null;
    if (fecha_salida && fecha_entrada > fecha_salida) {
        frappe.msgprint({
            message: __('La fecha de egreso no puede ser anterior a la de ingreso.'),
            title: __('Error de Validación'),
            indicator: 'red'
        });
        frappe.model.set_value(cdt, cdn, 'fecha_salida', null);
    } 

    else if (!fecha_salida && fecha_salida > now) {
        frappe.msgprint({
            message: __('La fecha de salida no puede ser posterior a la actual.'),
            title: __('Error de Validación'),
            indicator: 'red'
        });
        frappe.model.set_value(cdt, cdn, 'fecha_salida', null);
    }
}


function borrar_botones(frm,cdt, cdn){
    let row = locals[cdt][cdn];
        
    frm.$wrapper.find('.btn.btn-secondary.btn-sm.pull-right.grid-insert-row-below.hidden-xs').remove()
    frm.$wrapper.find('.btn.btn-secondary.btn-sm.pull-right.grid-insert-row.hidden-xs').remove()
    frm.$wrapper.find('.btn.btn-secondary.btn-sm.pull-right.grid-duplicate-row.hidden-xs').remove()
    frm.$wrapper.find('.btn.btn-secondary.btn-sm.pull-right.grid-move-row.hidden-xs').remove()
    frm.$wrapper.find('.grid-footer-toolbar.hidden-xs.flex.justify-between').remove()
    
    const creation_date_row = frappe.datetime.str_to_obj(row.ingreso).toISOString().split('T')[0];
    if (row.owner !== frappe.session.user || creation_date_row  !== frappe.datetime.get_today()) {
        frm.$wrapper.find('.btn.btn-danger.btn-sm.pull-right.grid-delete-row').remove()
    }
}