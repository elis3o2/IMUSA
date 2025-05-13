import frappe
from frappe import get_print
import socks
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email import encoders
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from prueba.credenciales import MUNI_PASS, MUNI_USER


# Configuración del correo
SMTP_SERVER = "smtp.rosario.gov.ar"
SMTP_PORT = 587
EMAIL_USER = f"{MUNI_USER}@rosario.gov.ar"
EMAIL_PASSWORD = MUNI_PASS



@frappe.whitelist()
def send_pdf(doctype:str, name:str, print_format: str, destino:str):


    # Crear el mensaje
    msg = MIMEMultipart()
    msg['From'] = EMAIL_USER
    msg['To'] = destino
    msg['Subject'] = "ESTERELIZACION"
    msg.attach(MIMEText("FUNICONA", 'plain'))

    pdf_content = get_print(doctype, name, print_format=print_format, as_pdf=True)

    # Definir la ruta del archivo donde se guardará el PDF
    filename = f"/tmp/{name}.pdf"

    # Guardar el PDF en la ruta especificada
    with open(filename, "wb") as f:
        f.write(pdf_content)


    # Ahora sí, abrir el archivo para adjuntarlo al correo
    with open(filename, "rb") as attachment:
        # Agregar el archivo como adjunto
        part = MIMEBase("application", "octet-stream")
        part.set_payload(attachment.read())

    # Codificar el archivo en base64 para que pueda enviarse por correo
    encoders.encode_base64(part)

    # Add header as key/value pair to attachment part
    part.add_header(
        "Content-Disposition",
        f"attachment; filename= {filename}",
    )

    # Add attachment to message and convert message to string
    msg.attach(part)
    text = msg.as_string()


    try:
       with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()  # Activa TLS después de la conexión
            server.login(EMAIL_USER, EMAIL_PASSWORD)
            server.sendmail(EMAIL_USER, [destino], msg.as_string())
            frappe.msgprint("Correo enviado con éxito")

    except Exception as e:
        print(f"Error al enviar el correo: {e}")
        frappe.msgprint("Error al enviar el correo")


