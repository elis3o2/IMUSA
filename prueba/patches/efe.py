import frappe 
from prueba.prueba.api import get_features, insertar_direccion, get_direccion_data
import json
import os

l = [
  {
    "efector": "Escuela N° 1027",
    "tipo_efector": "Escuela",
    "dirección": "HUMBERTO Primo 5301"
  }
]
def execute():
    efectores_fallidos = []

    for ef in l:
        
        fff = frappe.get_doc("Efector", ef['efector'])
        
        print("Procesando:", ef,"\n\n")
        r = get_features(ef['dirección'])  # CORREGIDO: usar ef, no l

        
        print("Resultados:", r,"\n\n")

        # Verificar que r tenga al menos un elemento no None
        if r and len(r) > 0 and r[0] is not None:
            encontrado = False

            for feat in r:
                print("Feat:", feat,"\n\n")
                if ('geometry' in feat and feat['geometry'] and
                    'coordinates' in feat['geometry']):

                    props = feat['properties']
                    coords = feat['geometry']['coordinates']

                    print("OK\n\n")
                    print(props['codigoCalle'],
                        props['altura'],
                        props['bis'])
                    

                    try:
                        dir = get_direccion_data(
                            props['codigoCalle'],
                            props['altura'],
                            props['bis'],
                            props['letra']
                        )
                    except Exception as e:
                        print(f"❌ Error obteniendo dirección: {e}")
                        efectores_fallidos.append(ef)
                        continue

                    print("Dir: ", dir,"\n\n")

                    # Validar longitud de divsAdmins antes de acceder
                    if ('divsAdmins' in dir and len(dir['divsAdmins']) > 5 and
                        dir['divsAdmins'][4]['valor'] == fff.fracción_censal and
                        dir['divsAdmins'][5]['valor'] ==fff.radio_censal):

                        insertar_direccion(
                            props['codigoCalle'],
                            props['altura'],
                            props['bis'],
                            props['letra'],
                            props['name'],
                            coords[0],
                            coords[1]
                        )

                        dir_doc = frappe.get_doc("Direcciones", props['name'])

                        nuevo = frappe.get_doc({
                            "doctype": "Efectores",
                            "direccion": dir_doc.name,
                            "tipo_efector": ef['tipo_efector'],
                            "nombre": ef['efector']
                        })
                        nuevo.insert(ignore_permissions=True)

                        encontrado = True
                        break  # coincidencia encontrada

            if not encontrado:
                print(f"No coincidencia censal para: {ef['dirección']}")
                efectores_fallidos.append(ef)

        else:
            print(f"Sin features válidos para: {ef['dirección']}")
            efectores_fallidos.append(ef)

    output_path = os.path.join(frappe.get_site_path(), "efectores_fallidos.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(efectores_fallidos, f, indent=2, ensure_ascii=False)



