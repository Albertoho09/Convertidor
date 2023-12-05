from  pytube import YouTube

def devolverDatosVideo(url):
    yt = YouTube(url)
    return yt


def descargar(url, tipo, resolucion):
    yt = YouTube(url)
    print(url)
    print(tipo)
    print(resolucion)

    if tipo == "mp3":
        stream = yt.streams.filter(only_audio=True).first()
        stream.download(filename=f"{yt.title}.{tipo}", output_path="musica/")
    else:
        stream = yt.streams.filter(file_extension="mp4", res=resolucion).first()
        print(stream)
        stream.download(output_path="musica/")


def devolverResolucion(yt):
    print(yt.streams.filter(file_extension="mp4", type="video"))
    all_streams = yt.streams.filter(file_extension="mp4")
    resoluciones = []

    for e in all_streams:
        resoluciones.append(e.resolution)

    return resoluciones