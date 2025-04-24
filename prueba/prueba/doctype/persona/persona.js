// Copyright (c) 2025, Eliseo y Miguel and contributors
// For license information, please see license.txt

frappe.ui.form.on('Persona', {
    refresh: function(frm) {
        
        if (!frm.is_new()){
            frm.set_df_property('buscar', 'hidden', 1);
        }

        frm.toggle_display('mapa', frm.doc.direccion)

    },

    onload: function(frm){
        
        if (!frm.is_new()){
        
            show_dirreccion(frm)
        
        }
    },

    buscar: function(frm) {
    
        if (!frm.doc.numero_documento){
            frappe.msgprint("Debe ingresar un documento");
        }
        
        else{
            
            let name = `${frm.doc.numero_documento}-${frm.doc.sexo}`
            frappe.db.exists("Persona", name).then(r => {

                if(r){
                    frappe.msgprint("La persona ya se encuentra en el sistema");
                }
            
                else{   
                    load_persona(frm)
                }

            });
            
        }
    },

    direccion: function(frm) {
    
        if (frm.doc.direccion){
            
            options_handler(frm)
        
        }
    },
    
    validate: function(frm){
        if (frm.custom_opciones){
            if (frm.custom_opciones.value != null){
                frm.set_value('direccion', frm.custom_opciones.value);
            }
            
            else{
                frappe.msgprint({
                        message: __('Debe seleccionar una dirección valida'),
                        title: __('Error de Validación'),
                        indicator: 'red'
                        });
                frappe.validated = false;
            }
        }
    },
    
    after_save: function(frm){
        
        if (frm.custom_opciones){
            
            setTimeout(() => {
                
                frm.custom_opciones.$wrapper.remove();
                frm.custom_opciones = null;
                
            }, 250); 
            
            if (parametros !== null){
                frappe.call({
                    method: "prueba.prueba.api.insertar_direccion", 
                    args: parametros,
                })
            }
        }
    }

});


/* 
Busca la persona en Renaper y carga los campos de forma correspondiente 
*/
function load_persona(frm){
    frappe.call({  
        method: "prueba.prueba.api.get_persona_data", 
        args: { 
            dni: frm.doc.numero_documento,  
            sexo: frm.doc.sexo
        },
        callback: function(response) {
           
            if(response.message){
                if (!response.message.error) {
                    let respuesta = response.message.ciudadano;

                    if (response.message.fallecido == "SI"){
                        frappe.msgprint({
                        message: __('Persona fallecida.'),
                        title: __('Error de Validación'),
                        indicator: 'red'
                        });
                        frm.set_value('nombre', null);
                        frm.set_value('apellido', null);
                        frm.set_value('direccion', null);
                    }
                    
                    else{
                        frm.set_value('nombre', respuesta.nombre);
                        frm.set_value('apellido', respuesta.apellido);
                        frm.set_value('direccion', respuesta.domicilio);
                        frm.refresh_fields(['nombre', 'apellido', 'direccion']);
                    }
                }
                
                else{
                    frappe.msgprint({
                    message: __('El ciudadano no se encuentra en RENAPER.'),
                    title: __('Error de Validación'),
                    indicator: 'red'
                    });
                    frm.set_value('nombre', null);
                    frm.set_value('apellido', null);
                    frm.set_value('direccion', null);
                }
            }
        }
    });
}

/*
Busca la direccion en la tabla Direcciones y la muestra en el mapa
*/
function show_dirreccion(frm){
    frappe.db.get_value('Direcciones', frm.doc.direccion, fields=['coordenada_x', 'coordenada_y']).then((s) => {s
        frappe.call({
            method: "prueba.prueba.api.conversion",
            args: { x: s.message.coordenada_x,
                    y: s.message.coordenada_y }, 
                
            callback: function(response) {
                let {lat, lon}= response.message
                show_map(frm, lat,lon)
            }
        })
    })
};
/*
Dada lat y lon lo muestra en el mapa
*/
function show_map(frm, lat, lon) {
    frm.toggle_display('mapa', true);
    
    let map = frm.fields_dict.mapa.map;

    // Si ya hay un marcador, eliminarlo antes de agregar uno nuevo
    if (frm.marker) {
        map.removeLayer(frm.marker);
    }
    map.setView([lat, lon], 15);

    // Agregar nuevo marcador en la ubicación correcta
    frm.marker = L.marker([lat, lon]).addTo(map);

    // Centrar el mapa en el marcador
    map.setView([lat, lon], 15);
};
    
/*
Carga y actualiza el campo opciones y se encarga de mostrarlo en el mapa
*/
function options_handler(frm){
    
    frappe.call({
        method: "prueba.prueba.api.get_features", 
        args: { direccion: frm.doc.direccion }, 

        callback: function(response) {
            console.log(response)
            if (response.message) {
                let features = {}; 

                response.message.forEach(feature => {
                    if (feature.properties.altura && feature.properties.codigoCalle 
                        && feature.properties.bis !== undefined && feature.geometry.coordinates){
                        features[feature.properties.name] = {
                            altura: feature.properties.altura,
                            idCalle: feature.properties.codigoCalle,
                            bis: feature.properties.bis,
                            coord_x: feature.geometry.coordinates[0],
                            coord_y: feature.geometry.coordinates[1]
                        };
                    }
                });
            let opciones = Object.keys(features).join("\n");

            
                    // Eliminar el campo anterior si existe
                if (frm.custom_opciones) {
                    frm.custom_opciones.$wrapper.remove();
                    frm.custom_opciones = null;
                }

                // Crear el campo "opciones"
                frm.custom_opciones = frappe.ui.form.make_control({
                    parent: frm.fields_dict["direccion"].wrapper,
                    df: {
                        fieldname: "opciones",
                        fieldtype: "Select",
                        options: opciones
                    },
                    render_input: true
                });

                frm.custom_opciones.refresh();

                // Evento para detectar cambios en "opciones"
                $(frm.custom_opciones.$input).on("change", function() {
                        
                    let seleccion = $(this).val();
                    if (features[seleccion]) {
                        let coord_x = features[seleccion].coord_x
                        let coord_y = features[seleccion].coord_y
                            
                        frappe.call({
                            method: "prueba.prueba.api.conversion",
                            args: { x: coord_x,
                                    y: coord_y }, 
                                
                            callback: function(response) {
                                let {lon, lat} = response.message

                                
                                show_map(frm, lat,lon)
                            }
                        })
                        
                        parametros = {
                                    feature: seleccion,
                                    ...features[seleccion]
                                };
                    }       
                });
            }        
        }
    })
}

