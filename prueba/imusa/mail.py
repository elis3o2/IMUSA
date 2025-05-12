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

"""""
# Datos del proxy (ajusta según tu red)
PROXY_HOST = "proxyespecial.svc.rosario.gov.ar"
PROXY_PORT = 3128  # O el puerto correcto de tu proxy
PROXY_USER = "efeuli0"
PROXY_PASS = "Eliseo2003"
 
# Configurar el proxy en la conexión
socks.setdefaultproxy(socks.SOCKS5, PROXY_HOST, PROXY_PORT, True, PROXY_USER, PROXY_PASS)
socks.wrapmodule(smtplib)

"""""
# Configuración del correo
SMTP_SERVER = "smtp.rosario.gov.ar"
SMTP_PORT = 587
EMAIL_USER = "efeuli0@rosario.gov.ar"
EMAIL_PASSWORD = "Eliseo2003"



@frappe.whitelist()
def send_pdf(doctype:str, name:str, print_format: str, destino:str):


    # Crear el mensaje
    msg = MIMEMultipart()
    msg['From'] = EMAIL_USER
    msg['To'] = "eli.feuli37@gmail.com"
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


