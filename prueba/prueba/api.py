import frappe
import requests
import json
#pip install pyproj --no-binary pyproj
from pyproj import Proj
from pyproj import Transformer
import ast
from frappe.utils import nowdate

@frappe.whitelist()
def get_persona_data(dni: str, sexo: str):

    proxies = {
        "http": "http://efeuli0:Eliseo2003@proxyespecial.svc.rosario.gov.ar:3128",
        "https": "http://efeuli0:Eliseo2003@proxyespecial.svc.rosario.gov.ar:3128"  
    }

    url = f"https://salud1.dyndns.org/api/ciudadanopuco/?dni={dni}&sexo={sexo}&api_key=b4d9fb57-5033-4fdd-b717-68705df38d35"

    
    response = requests.get(url, proxies=proxies)  
    try:
        return response.json()  # Intentar parsear JSON directamente
    except json.JSONDecodeError:
        return json.loads(response.text.strip())


@frappe.whitelist()
def conversion(x:str, y:str):
    transformer = Transformer.from_crs("epsg:22185", "epsg:4326", always_xy=True)
    lon, lat = transformer.transform(x, y)
    return {'lat':lat, 'lon':lon}


@frappe.whitelist()
def get_direccion_data(idCalle:str, altura:str, bis:str, letra:str):
    
    url =f'https://ws.rosario.gob.ar/ubicaciones/public/direccion?idCalle={idCalle}&altura={altura}&bis={bis}&letra={letra}'

    response = requests.get(url)
    try:
        return response.json()  # Intentar parsear JSON directamente
    except json.JSONDecodeError:
        return json.loads(response.text.strip())

@frappe.whitelist()
def insertar_direccion(idCalle: int, altura: int, bis:bool, letra:str ,feature:str, coord_x:float, coord_y:float):
    
    if (not frappe.db.exists("Direcciones", feature)):

        respuesta = get_direccion_data(str(idCalle), str(altura), str(bis), letra)


        if (not frappe.db.exists("Vecinal", respuesta['divsAdmins'][1]['valor'])):
            doc = frappe.get_doc({
                "doctype": "Vecinal",
                "nombre": respuesta['divsAdmins'][1]['valor']
            })
            doc.insert()

        if (not frappe.db.exists("Barrio", respuesta['divsAdmins'][2]['valor'])):
            doc = frappe.get_doc({
                "doctype": "Barrio",
                "barrio": respuesta['divsAdmins'][2]['valor'],
                "distrito": respuesta['divsAdmins'][0]['valor']
            })
            doc.insert()            

        doc = frappe.get_doc({
            "doctype": "Direcciones",
            "feature": feature,
            "codigo_calle": idCalle,
            "altura": altura,
            "bis": bis,
            "distrito": respuesta['divsAdmins'][0]['valor'],
            "vecinal": respuesta['divsAdmins'][1]['valor'],
            "barrio": respuesta['divsAdmins'][2]['valor'],
            "fraccion_censal": respuesta['divsAdmins'][4]['valor'],
            "radio_censal": respuesta['divsAdmins'][5]['valor'],
            "coordenada_x": coord_x,
            "coordenada_y": coord_y,
            "lineas_tup" : ', '.join(respuesta['lineasTup'])
        })
        doc.insert()
    

@frappe.whitelist()
def insertar_rescate(animal: str, tipo_entrada: str, persona_ingresante: str):
    # Crear el documento principal (Rescate)
    doc = frappe.get_doc({
        "doctype": "Rescate",
        "animal": animal,
        "tipo_entrada": tipo_entrada,
        "persona_ingresante": persona_ingresante,
    })
    doc.insert()


@frappe.whitelist()
def insertar_medicamentos_en_atencion(animal: str, atencion: str, medicamentos: str, cantidades: str):
    # Convertir las cadenas de medicamentos y cantidades a listas
    medicamentos = ast.literal_eval(medicamentos)
    cantidades = ast.literal_eval(cantidades)

    # Verificar si ya existe un documento con el mismo animal y atención
    doc_exists = frappe.db.exists("Medicamentos_Atencion", {"animal": animal, "atencion": atencion})
    
    if doc_exists:
        # Si el documento existe, obtenerlo
        doc = frappe.get_doc("Medicamentos_Atencion", doc_exists)
        # Eliminar todos los medicamentos existentes
        doc.medicamentos = []
    else:
        # Si el documento no existe, crear uno nuevo
        doc = frappe.get_doc({
            "doctype": "Medicamentos_Atencion",
            "animal": animal,
            "atencion": atencion,
        })

    # Agregar los nuevos medicamentos y cantidades
    for i in range(len(medicamentos)):
        doc.append("medicamentos", {
            "medicamento": medicamentos[i],
            "cantidad": cantidades[i]
        })

    # Guardar el documento
    doc.save()

    return "Medicamentos actualizados correctamente."



@frappe.whitelist()
def obtener_efectores():
    # Obtener el usuario actual
    usuario_actual = frappe.session.user
    
    # Obtener la persona asociada al usuario
    persona = frappe.get_value("User", usuario_actual, "persona")
    if not persona:
        return []
    
    # Obtener el nombre del veterinario asociado a la persona
    veterinario = frappe.get_value("Veterinario", {"persona": persona}, "name")
    if not veterinario:
        return []

    # Obtener los efectores asociados al veterinario con la condición de fecha_hasta
    efectores = frappe.get_all(
        "Veterinario-Efector",
        filters={
            "parent": veterinario,
        },
        fields=["efector"]
    )
    return [e["efector"] for e in efectores]



@frappe.whitelist()
def get_features(direccion: str): 

    url = f"https://ws.rosario.gob.ar/ubicaciones/public/geojson/ubicaciones/all/all/{direccion}"

    response = requests.get(url)
    try:
        return response.json()['features']  # Intentar parsear JSON directamente
    except json.JSONDecodeError:
        return json.loads(response.text['features'])

        

        
