// Copyright (c) 2025, Eliseo y Miguel and contributors
// For license information, please see license.txt
frappe.ui.form.on('Rescate', {
    

    refresh: function(frm) {
		frm.toggle_display('adoptante', frm.doc.adoptado == 'Si');
		frm.toggle_reqd('adoptante', frm.doc.adoptado == 'Si');
		frm.toggle_display('fecha_adopcion', frm.doc.adoptado == 'Si');
		frm.toggle_reqd('fecha_adopcion', frm.doc.adoptado == 'Si');
        if (frm.doc.adoptado == "Si") {
            const hoy = frappe.datetime.get_today();
            frm.set_value('fecha_adopcion', hoy);
        }
        completar_campos(frm);
    },
    
	adoptado: function(frm) {
		frm.toggle_display('adoptante', frm.doc.adoptado == 'Si');
		frm.toggle_reqd('adoptante', frm.doc.adoptado == 'Si');
		frm.toggle_display('fecha_adopcion', frm.doc.adoptado == 'Si');
		frm.toggle_reqd('fecha_adopcion', frm.doc.adoptado == 'Si');
	},
	
    validate: function(frm) {
        if (frm.doc.fecha_adopcion) {
            const hoy = frappe.datetime.get_today();
            if (frm.doc.fecha_adopcion > hoy) {
                frappe.msgprint({
                    message: __('La fecha de adopción no puede ser posterior a hoy.'),
                    title: __('Error de Validación'),
                    indicator: 'red'
                });
    
                // Limpiar el campo con la fecha inválida
                frm.set_value('fecha_adopcion', null);
                frappe.validated = false;
            }
        }
    },
    

	after_save: function(frm){
	    if (frm.doc.adoptado == "Si"){
	        frappe.db.set_value("Animal", frm.doc.animal, "documentop", frm.doc.adoptante)
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
