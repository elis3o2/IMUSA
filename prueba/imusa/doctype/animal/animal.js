// Copyright (c) 2025, Eliseo y Miguel and contributors
// For license information, please see license.txt

frappe.ui.form.on('Animal', {
	refresh: function(frm) {
        
        permisos(frm);
        
        if(frm.doc.documentop){
            campos_virtuales(frm)
        }

        frm.toggle_display("raza", frm.doc.especie == "Perro" || frm.doc.especie == "Gato");

        frm.toggle_display("fecha_fallecimiento", frm.doc.estado == "Fallecido");

        frappe.call({
            method: "prueba.imusa.api.obtener_efectores",
            callback: function(r) {
                let opciones = r.message;
                      
                frm.fields_dict["atencion"].grid.get_field("efector").get_query = function(doc, cdt, cdn) {
                    var child = locals[cdt][cdn];
                    return {    
                        filters:[
                             ["Efector", "name", "in", opciones]
                        ]
                    }
                }
            }
        })

        vista_atencion(frm);
    },

    onload: function(frm) {

        if (frm.custom_tipo){ frm.custom_tipo.$wrapper.remove()}
		if (frm.custom_entrante){ frm.custom_entrante.$wrapper.remove()}


		if (frm.is_new()){
		    frm.toggle_display('documentop', frm.doc.animal_rescatado == 'No');
		    frm.toggle_reqd('documentop', frm.doc.animal_rescatado == 'No');
		}
		
		else{
		    frm.toggle_display('documentop', frm.doc.animal_rescatado == 'No' || frm.doc.documentop);
		}

        frm.set_query('raza', function() {
            return {
                filters: [
                    ['Raza', 'nombre_especie', 'in', [frm.doc.especie, "Sin especie"]]
                ]
            };
        });

        frm.medi_cant_before = {}
        frm.medi_cant_now = {}
        get_Medicamentos_Atencion(frm);
	},

    validate: function(frm) {
        
        campos_automatiocos(frm);
        
        if (frm.is_new()){frm.rescate_flag = 1}
        
        if (frm.is_new() && frm.doc.animal_rescatado == "Si" && (frm.custom_entrante.value == null || frm.custom_tipo == null)){
            frappe.msgprint({
                    message: __('Campos incompletos'),
                    title: __('Error de Validación'),
                    indicator: 'red'
                    });
            frappe.validated = false;
        }

        // Iterar sobre cada clave del diccionario medi_cant_now
        for (let atencion in frm.medi_cant_now) {
            // Verificar si alguna tupla en la lista tiene campos vacíos
            if (frm.medi_cant_now[atencion].some(([medicamento, cantidad]) => (medicamento.get_value() || cantidad.get_value()) 
                                                                        && !(medicamento.get_value() && cantidad.get_value()) )) {
                frappe.msgprint({
                        message: __('Hay campos de medicación sin completar'),
                        title: __('Error de Validación'),
                        indicator: 'red'
                        });
                frappe.validated = false;
            }
        }
    
    },

    after_save: function(frm){
	    
        if(frm.rescate_flag&& frm.rescate_flag==1 && frm.doc.animal_rescatado == 'Si'){
            frappe.call({
                method: "prueba.imusa.api.insertar_rescate",
                args: {
                    animal: frm.doc.name,
                    tipo_entrada: frm.custom_tipo.value,
                    persona_ingresante: frm.custom_entrante.value,
                }
            });
	    }
        if(frm.rescate_flag){
            frm.rescate_flag=0
        }

        insert_med_cantidad(frm)
	},
    
    estado: function(frm){
        frm.toggle_display("fecha_fallecimiento", frm.doc.estado == "Fallecido");
    },

    especie: function(frm) {
        frm.toggle_display("raza", frm.doc.especie == "Perro" || frm.doc.especie == "Gato");
        frm.set_value('raza', null);
        
        frm.set_query('raza', function() {
            return {
                filters: [
                    ['Raza', 'nombre_especie', 'in', [frm.doc.especie, "Sin especie"]]
                ]
            };
        });
    },

    animal_rescatado: function(frm){
	    if (frm.is_new()){
	    
	        frm.toggle_display('documentop', frm.doc.animal_rescatado == 'No');
	        frm.toggle_reqd('documentop', frm.doc.animal_rescatado == 'No');
	    
    	    if (frm.doc.animal_rescatado == 'Si'){
    	        
    	       frm.set_value("documentop", null)
    	        
        	   custom_create(frm)
    	    }
    	    
    	    else {
                //Si se cambia el valor de animal_rescatado se borran los custom
    	        if (frm.custom_tipo) { frm.custom_tipo.$wrapper.remove(); }
                if (frm.custom_entrante) {frm.custom_entrante.$wrapper.remove();}
    	    }
	    }
	},


})


//Solo se puede editar/borrar formularios creados en el dia y por el mismo usuario
function permisos(frm){
    if (!frm.is_new()){
	        
        const today = frappe.datetime.get_today();
        const creation_date = frappe.datetime.str_to_obj(frm.doc.creation).toISOString().split('T')[0];
        
        if (creation_date !== today && frm.doc.owner !== frappe.session.user){
            frm.set_df_property('sexo', 'read_only', 1);
            frm.set_df_property('animal_rescatado', 'read_only', 1);
            frm.set_df_property('especie', 'read_only', 1);
            frm.set_df_property('raza', 'read_only', 1);
            frm.set_df_property('tamano', 'read_only', 1);
            frm.set_df_property('color_pelaje', 'read_only', 1);
            if (frm.doc.estado_castracion == "Castrado"){
                frm.set_df_property('estado_castracion', 'read_only', 1)
            }
            if (frm.doc.animal_rescatado == "Si"){
                frm.set_df_property('estado_castracion', 'read_only', 1)
            }
            if (frm.doc.fecha_nacimiento){
                frm.set_df_property('fecha_nacimiento', 'read_only', 1);
            }
            if (frm.doc.estado == "Fallecido"){
                 frm.set_df_property('estado', 'read_only', 1);
                frm.set_df_property('fecha_fallecimiento', 'read_only', 1);
            }
        }
        
        frm.fields_dict["atencion"].grid.grid_rows.forEach(row => {
            
            const creation_date_row = frappe.datetime.str_to_obj(row.doc.ingreso).toISOString().split('T')[0];
            
            if (row.doc.owner !== frappe.session.user || creation_date_row  !== today) {
                
                frm.set_df_property('atencion', 'read_only', 1, frm.docname, 'boton_medicacion', row.doc.name)
                frm.set_df_property('atencion', 'hidden', 1, frm.docname, 'boton_eliminar', row.doc.name)
                frm.set_df_property('atencion', 'read_only', 1, frm.docname, 'peso', row.doc.name)
                frm.set_df_property('atencion', 'read_only', 1, frm.docname, 'tipo', row.doc.name)
                frm.set_df_property('atencion', 'read_only', 1, frm.docname, 'persona_ingresante', row.doc.name)
                frm.set_df_property('atencion', 'hidden', 1, frm.docname, 'boton_firma_ingreso', row.doc.name)
                frm.set_df_property('atencion', 'hidden', 1, frm.docname, 'boton_firma_egreso', row.doc.name)
                frm.set_df_property('atencion', 'read_only', 1, frm.docname, 'ingreso', row.doc.name)  
                frm.set_df_property('atencion', 'read_only', 1, frm.docname, 'egreso', row.doc.name)
                frm.set_df_property('atencion', 'read_only', 1, frm.docname, 'efector', row.doc.name)
                frm.set_df_property('atencion', 'read_only', 1, frm.docname, 'estado_sanitario', row.doc.name)
            }
        })
    }
}


//Una vez guardado el formulario completa los campos de dueno, veterinario y direccion
//en la atencion nueva
async function campos_automatiocos(frm){
    if (frm.doc.atencion && frm.doc.atencion.length > 0) {
        let idx = frm.doc.atencion.length - 1;
        let child_doc = frm.doc.atencion[idx];

        if (child_doc.name.startsWith("new-atencion-")) {
            frappe.model.set_value(child_doc.doctype, child_doc.name, "dueno", frm.doc.documentop);
            frappe.model.set_value(child_doc.doctype, child_doc.name, "direccion", frm.doc.direccion);

            let usuario_actual = frappe.session.user;

            frappe.call({
                method: "frappe.client.get_value",
                args: {
                    doctype: "User",
                    filters: { name: usuario_actual },
                    fieldname: "persona"
                },
                callback: function (response) {
                    if (response.message.persona) {
                        frappe.model.set_value(child_doc.doctype, child_doc.name, "veterinario", response.message.persona);
                    } 
                }
            })

            if (child_doc.tipo === "Castración") {
                frm.set_value("estado_castracion", "Castrado");
            }
        }
    }
}


//Completa los datos del dueño
function campos_virtuales(frm){
    frappe.call({
        method: 'frappe.client.get',
        args: {
            doctype: 'Persona',
            name: frm.doc.documentop
            },
        callback: function(r) {
            if (r.message) {
                frm.set_value('nombrep', r.message.nombre);
                frm.set_value('apellidop', r.message.apellido);
                frm.set_value('telefono', r.message.telefono);
                frm.set_value('direccion', r.message.direccion);
                frm.set_value('correo', r.message.correo);
                frm.refresh_field('nombrep');
                frm.refresh_field('apellidop');
                frm.refresh_field('telefono');
                frm.refresh_field('direccion');
                frm.refresh_field('correo');
            }
        }
    });
}


//Crea las ventanas para insertar los valores para un animal rescatado
function custom_create(frm){
    frm.custom_tipo = frappe.ui.form.make_control({
        parent: frm.fields_dict["animal_rescatado"].wrapper,
        df: {
            label: "Tipo entrada",
            fieldname: "tipo_entrada",
            fieldtype: "Select",
            options: ["Policial",
                     "Municipal",
                    "Otro"]
        },
        render_input: true
    });

    frm.custom_entrante = frappe.ui.form.make_control({
        parent: frm.fields_dict["animal_rescatado"].wrapper,
        df: {
            label: "Persona ingresante",
            fieldname: "persona_ingresante",
            fieldtype: "Link",
            options: "Persona"
        },
        render_input: true
    });
}


// Obtener los registros de Medicamentos_Atencion
function get_Medicamentos_Atencion(frm){
    frappe.db.get_list('Medicamentos_Atencion', {
        filters: { 'animal': frm.doc.name },  // Filtrar por el animal actual
        fields: ['name']  // Obtener el nombre del documento y el campo atencion
    }).then((guardados) => {
        // Procesar los registros obtenidos
        guardados.forEach((item) => {
            // Obtener los detalles de la tabla hija para cada documento
            frappe.call({
                method: "frappe.client.get",
                args: {
                    doctype: "Medicamentos_Atencion",
                    name: item.name  // Nombre del documento principal
                },
                callback: function (response) {
                    if (response.message) {
                        let doc = response.message;
                        // Inicializar la lista para esta atención si no existe
                        if (!frm.medi_cant_before[doc.atencion]) {
                            frm.medi_cant_before[doc.atencion] = [];
                        }
                        // Recorrer la tabla hija de medicamentos
                        doc.medicamentos.forEach((medicamento) => {
                            // Agregar la tupla (medicamento, cantidad) a la lista correspondiente
                            frm.medi_cant_before[doc.atencion].push([
                                medicamento.medicamento,
                                medicamento.cantidad
                            ]);
                        });
                    }
                }
            });
        });
    })
}

// Inserta medicamentos-cantidad en la tabla correspondiente
function insert_med_cantidad(frm){
    for (let atencion in frm.medi_cant_now) {

        if(!frm.medi_cant_before[atencion] || hay_cambios(frm.medi_cant_before[atencion], atencion)){

            let atencion_name = atencion
            if (atencion.startsWith("new-atencion-")){
                atencion_name =  frm.doc.atencion[frm.doc.atencion.length - 1].name
            }

            frappe.call({
            method: "prueba.imusa.api.insertar_medicamentos_en_atencion",
            args: {
                animal: frm.doc.name,
                atencion: atencion_name,
                medicamentos: frm.medi_cant_now[atencion]
                  .filter((item) => item[0]?.value && item[1]?.value)
                  .map((item) => item[0].value),

                cantidades: frm.medi_cant_now[atencion]
                  .filter((item) => item[0]?.value && item[1]?.value)
                  .map((item) => item[1].value),

                }
            })
        }
    }
}

function vista_atencion(frm){
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

frappe.ui.form.on('Atencion', {
    atencion_add: function(frm, cdt, cdn) {
        
        //Solo se permite cargar una atención a la vez
        frm.$wrapper.find('.btn.btn-xs.btn-secondary.grid-add-row').remove()

        
        if(frm.doc.documentop){
            frappe.model.set_value(cdt, cdn, 'persona_ingresante', frm.doc.documentop);
        }

        let now = frappe.datetime.now_datetime();
        frappe.model.set_value(cdt, cdn, 'ingreso', now);    

        if (frm.doc.estado_castracion === "Castrado") {
            const opciones_filtradas = [
            "Consulta",
            "Cirugía compleja",
            "Vacunación"
            ];

            frm.fields_dict.atencion.grid.update_docfield_property(
                'tipo',
                'options',
                opciones_filtradas.join('\n')
            );
        }

        frm.$wrapper.find(".col.grid-static-col.pointer").hide();
        frm.$wrapper.find(".row-check.sortable-handle.col").hide()
    },

    form_render: function(frm,cdt,cdn){
	    
        borrar_botones(frm,cdt,cdn)
        let row = locals[cdt][cdn]

        if(frm.doc.animal_rescatado == "Si" && frm.doc.documentop == null){
            atencion_rescatado(frm, cdt,cdn)
        }
        else{
	        frm.set_df_property('atencion', 'reqd', 1, frm.docname, 'persona_ingresante', row.name)
	        frm.set_df_property('atencion', 'reqd', 1, frm.docname, 'firma_igreso', row.name)
        }

	    if (!row.egreso){
	        frm.set_df_property('atencion', 'hidden', 1, frm.docname, 'section_break_skll', row.name) 
	    }
        else{
	        frm.set_df_property('atencion', 'hidden', 0, frm.docname, 'section_break_skll', row.name)
	        frm.set_df_property('atencion', 'hidden', 1, frm.docname, 'boton_egreso', row.name)
	    }

        restore_medicamento(frm,cdt,cdn)
	},


    boton_firma_ingreso: function(frm, cdt, cdn) {    
        
        abrir_dialogo(frm, cdt, cdn, "ingreso");
    },

    boton_firma_egreso: function(frm, cdt, cdn) {
        
        abrir_dialogo(frm, cdt, cdn, "egreso");
    },

	boton_egreso: function(frm,cdt,cdn){
	    
        let row = locals[cdt][cdn]
        
        if (!row.efector) {frappe.msgprint("Debe especificar un efector");return;}      
        if(frm.doc.documentop ){
            if(!row.persona_ingresante ) {frappe.msgprint("Debe cargar al responsable");return;}
            //if(!row.firma_ingreso) {frappe.msgprint("Falta firma del responsable");return;}
        }
        let now = frappe.datetime.now_datetime();
        frappe.model.set_value(cdt, cdn, 'egreso', now);
	    frm.set_df_property('atencion', 'hidden', 1, frm.docname, 'boton_egreso', row.name)
	    frm.set_df_property('atencion', 'hidden', 0, frm.docname, 'section_break_skll', row.name)
        frm.set_df_property('atencion', 'hidden', 1, frm.docname, 'boton_eliminar', row.name)
        frm.set_df_property('atencion', 'reqd', 1, frm.docname, 'egreso', row.name)
        if (frm.doc.documentop){
	        //frm.set_df_property('atencion', 'reqd', 1, frm.docname, 'firma_egreso', row.name)
        }
        else{frm.set_df_property('atencion', 'hidden', 1, frm.docname, 'boton_firma_egreso', row.name)}
    },

    ingreso: function(frm, cdt, cdn) {
        validar_ingreso_egreso(frm, cdt, cdn);
    },
    
    egreso: function(frm, cdt, cdn) {
        validar_ingreso_egreso(frm, cdt, cdn);
    },

    boton_medicacion: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        
        frm.dirty();
        
        let boton = $(frm.fields_dict["atencion"].grid.get_row(cdn).wrapper)
            .find('[data-fieldname="boton_medicacion"]');

        if (frm.medi_cant_now[cdn] && frm.medi_cant_now[cdn].some(([medicamento, cantidad]) => !medicamento.get_value() || !cantidad.get_value())) {
            frappe.msgprint("Completa los campos antes de agregar más.");
            return;
        }
        
        frm.set_df_property('atencion', 'hidden', 0, frm.docname, 'boton_eliminar', row.name)

        // Agregar nuevo campo de medicación debajo del botón
        agregar_campo_medicacion(frm, cdn, "", "", boton);
    },

    boton_eliminar: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        
        const last = frm.medi_cant_now[cdn].pop()

        console.log(last)
        last[0].wrapper.remove();
        last[1].wrapper.remove();

        if (frm.medi_cant_now[cdn].length == 0){
            frm.set_df_property('atencion', 'hidden', 1, frm.docname, 'boton_eliminar', row.name)
        }
    
    }


});


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

function atencion_rescatado(frm,cdt,cdn){
    row = locals[cdt][cdn]

    frm.set_df_property('atencion', 'hidden', 1, frm.docname, 'persona_ingresante', row.name)
    frm.set_df_property('atencion', 'reqd', 0, frm.docname, 'persona_ingresante', row.name)
    frm.set_df_property('atencion', 'hidden', 1, frm.docname, 'boton_firma_ingreso', row.name)
    frm.set_df_property('atencion', 'reqd', 0, frm.docname, 'firma_ingreso', row.name)
}


//Muestra una ventana emergente con el campo para firmar
function abrir_dialogo(frm, cdt, cdn, opcion) {
    let d = new frappe.ui.Dialog({
        title: 'Firma',
        fields: [
            {
                fieldname: 'firma',
                fieldtype: 'Signature'
            }
        ],
        size: 'small', 
        primary_action_label: 'Confirmar',
        primary_action(values) {
            let field_name = (opcion === "ingreso") ? 'firma_ingreso' : 'firma_egreso';
            frappe.model.set_value(cdt, cdn, field_name, values.firma);
            d.hide();  // Oculta el diálogo sin eliminarlo inmediatamente
        }
    });

    d.show();
}

//Controlar que la fecha ingreso y egreso de la atencion sean validas
function validar_ingreso_egreso(frm, cdt, cdn) {
    const child = locals[cdt][cdn];  // Referencia a la fila actual
    const ingreso = new Date(child.ingreso);
    const now = new Date(frappe.datetime.now_datetime());

    let egreso = child.egreso ? new Date(child.egreso) : null;

    if (!ingreso&&ingreso > egreso) {
        frappe.msgprint({
            message: __('La fecha y hora de ingreso no puede ser posterior a la de egreso.'),
            title: __('Error de Validación'),
            indicator: 'red'
        });
        frappe.model.set_value(cdt, cdn, 'egreso', null);
    } 

    else if (!egreso && egreso > now) {
        frappe.msgprint({
            message: __('La fecha y hora de egreso no puede ser posterior a la actual.'),
            title: __('Error de Validación'),
            indicator: 'red'
        });
        frappe.model.set_value(cdt, cdn, 'egreso', null);
    }
}


function restore_medicamento(frm, cdt, cdn){
    let row = locals[cdt][cdn];
    
    const creation_date_row = frappe.datetime.str_to_obj(row.ingreso).toISOString().split('T')[0];
    let bool =(row.owner == frappe.session.user && creation_date_row == frappe.datetime.get_today())
 
    let grid_row = frm.fields_dict["atencion"].grid.get_row(cdn);
    $(grid_row.wrapper)
        .find(`[data-fieldname="boton_medicacion"]`)
        .toggle(bool); 


    if (frm.medi_cant_now[cdn]){
        
        let medi_cant_temp = [];

        frm.medi_cant_now[cdn].forEach(([medicamentoControl, cantidadControl]) => {
            medi_cant_temp.push([medicamentoControl.value, cantidadControl.value]);
        });

        delete frm.medi_cant_now[cdn]; // Limpiar la variable global
        
        let boton = $(frm.fields_dict["atencion"].grid.get_row(cdn).wrapper)
            .find('[data-fieldname="boton_medicacion"]');
        
        // Restaurar los valores guardados
        medi_cant_temp.forEach(([medicamento, cantidad]) => {
            agregar_campo_medicacion(frm, cdn, medicamento, cantidad, boton, bool);
        });
    }
    else{
        if(frm.medi_cant_before[cdn]){
            
            let boton = $(frm.fields_dict["atencion"].grid.get_row(cdn).wrapper)
            .find('[data-fieldname="boton_medicacion"]');
            
                        // Restaurar los valores guardados
            frm.medi_cant_before[cdn].forEach(([medicamento, cantidad]) => {
                agregar_campo_medicacion(frm, cdn, medicamento, cantidad, boton, bool);
            });
        }
    }
}

// Función para agregar un nuevo campo de medicación
function agregar_campo_medicacion(frm, cdn, medicamento_valor = "", cantidad_valor = "", boton, bool=true) {
    
    let index = frm.medi_cant_now[cdn]? frm.medi_cant_now[cdn].length : 0
    
    let num = bool? 0 : 1
    
    let medicamento = frappe.ui.form.make_control({
        parent: boton.parent()[0], // Se inserta directamente debajo del botón
        df: {
            label: "Medicacion",
            fieldname: "medicacion_" + index,
            fieldtype: "Link",
            options: "Medicamento",
            read_only: num
        },
        render_input: true
    });

    let cantidad = frappe.ui.form.make_control({
        parent: boton.parent()[0], // Se inserta directamente debajo del botón
        df: {
            label: "Cantidad Suministrada (ml)",
            fieldname: "cantidad_" + index,
            fieldtype: "Float",
            read_only: num
        },
        render_input: true
    });

    medicamento.set_value(medicamento_valor);
    cantidad.set_value(cantidad_valor);

    // Guardar la referencia en la variable global
    if (frm.medi_cant_now[cdn]) {
        // Si la clave ya existe, agregar la tupla a la lista existente
        frm.medi_cant_now[cdn].push([medicamento, cantidad]);
    } else {
        // Si la clave no existe, crear una nueva lista con la tupla
        frm.medi_cant_now[cdn] = [[medicamento, cantidad]];
    }
}


// Función para detectar cambios entre dos listas de medicamentos
function hay_cambios(before, now) {
    // Si las longitudes son diferentes, hay cambios
    if (before.length !== now.length) {
        return true;
    }

    // Comparar cada tupla de medicamentos y cantidades
    for (let i = 0; i < now.length; i++) {
        let med_cant_now = now[i];
        let med_cant_before = before[i];

        // Si alguna tupla es diferente, hay cambios
        if (med_cant_now[0] !== med_cant_before[0] || med_cant_now[1] !== med_cant_before[1]) {
            return true;
        }
    }

    // No hay cambios
    return false;
}


