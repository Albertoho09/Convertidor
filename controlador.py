from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import Convertidor

# Definir el controlador (handler) personalizado
class controlador(BaseHTTPRequestHandler):
    def do_POST(self):
        ruta = self.path  # La ruta de la solicitud
        if ruta == "/convertir":
            # Leer el cuerpo de la solicitud
            longitud_contenido = int(self.headers['Content-Length'])
            cuerpo_solicitud = self.rfile.read(longitud_contenido).decode('utf-8')
            datos = json.loads(cuerpo_solicitud)

            yt = Convertidor.devolverDatosVideo(datos["URL"])
            if datos["TIPO"] == "mp4":
                respuesta = {'titulo': yt.title,
                             'tiempo': yt.length,
                             'autor': yt.author,
                             'visitas': yt.views,
                             'miniatura': yt.thumbnail_url,
                             'url': datos["URL"],
                             'tipo': datos["TIPO"],
                             'resoluciones': list(set(Convertidor.devolverResolucion(yt)))}

                self.enviar_datosVideo(respuesta)
            else:
                respuesta = {'titulo': yt.title,
                             'tiempo': yt.length,
                             'autor': yt.author,
                             'visitas': yt.views,
                             'miniatura': yt.thumbnail_url,
                             'url': datos["URL"],
                             'tipo': datos["TIPO"]}

                self.enviar_datosVideo(respuesta)
        else:
            longitud_contenido = int(self.headers['Content-Length'])
            cuerpo_solicitud = self.rfile.read(longitud_contenido).decode('utf-8')
            datos = json.loads(cuerpo_solicitud)
            Convertidor.descargar(datos["URL"], datos["TIPO"], datos["RES"])

            respuesta = {'respuesta':"todo correcto"}
            self.enviar_datosVideo(respuesta)



    def enviar_datosVideo(self, datos):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

        # Convertir y enviar los datos como JSON
        cuerpo_respuesta = json.dumps(datos)
        self.wfile.write(cuerpo_respuesta.encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()


# Configurar el servidor con el controlador personalizado
def run():
    puerto = 8000
    direccion = ('', puerto)
    servidor = HTTPServer(direccion, controlador)
    print(f"Iniciando servidor en el puerto {puerto}")

    try:
        servidor.serve_forever()
    except KeyboardInterrupt:
        print("\nDeteniendo el servidor")
        servidor.server_close()