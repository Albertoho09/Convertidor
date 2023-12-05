function convertirSegundosAHorasMinutosSegundos(segundos) {
    var horas = Math.floor(segundos / 3600);
    var minutos = Math.floor((segundos % 3600) / 60);
    var segundosRestantes = segundos % 60;

    // Asegurarse de que haya dos dígitos en cada parte (agregar ceros a la izquierda si es necesario)
    horas = String(horas).padStart(2, '0');
    minutos = String(minutos).padStart(2, '0');
    segundosRestantes = String(segundosRestantes).padStart(2, '0');

    return horas + ":" + minutos + ":" + segundosRestantes;
}

function crearElementoCancion(data){
    // Crear elementos de la tarjeta
    var tarjetaContainer = document.getElementById("tarjeta-container");

    var tarjeta = document.createElement("div");
    tarjeta.classList.add("card", "cartaBox");

    var tarjetaBody = document.createElement("div");
    tarjetaBody.classList.add("card-body", "carta");
    
    var contenidoIzquierdo = document.createElement("div");
    contenidoIzquierdo.classList.add("contenido-izquierdo");
    
    var titulo = document.createElement("h5");
    titulo.classList.add("card-title");
    titulo.textContent = data.titulo;
    
    var autor = document.createElement("p");
    autor.classList.add("card-text");
    autor.textContent = "Autor: " + data.autor;
    
    var duracion = document.createElement("p");
    duracion.classList.add("card-text");
    duracion.textContent = "Duración: " + convertirSegundosAHorasMinutosSegundos(data.tiempo);
    
    var visitas = document.createElement("p");
    visitas.classList.add("card-text");
    visitas.textContent = "Visitas: " + data.visitas;

    if(data.tipo == "mp4"){
        var selector = document.createElement("select");
        selector.id = "selectorRes";
        selector.classList.add("selectorRes");
        for (let index = 0; index < data.resoluciones.length; index++) {
            opcion = document.createElement("option");
            opcion.textContent = data.resoluciones[index];
            selector.append(opcion);
        }
    }else{
        var selector = document.createElement("select");
        selector.id = "selectorRes";
        selector.textContent = "none"
        selector.style.display = "none";
    }

    var botonDescarga = document.createElement("button");
    botonDescarga.classList.add("btn", "btn-primary");
    botonDescarga.textContent = "Descargar";
    botonDescarga.addEventListener("click", function () {
        var contenedor = botonDescarga.parentNode;
        var selector = contenedor.querySelector('#selectorRes');
        deshabilitarBoton(botonDescarga, "Descarga en curso...", true);
        console.log(selector.value)
        fetch('http://localhost:8000/descargar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"URL": data.url,"TIPO": data.tipo , "RES":selector.value}),
        })
        .then(response => response.json())
        .then(data => {
            // Manejar la respuesta del servidor
            console.log('Respuesta del servidor:', data.respuesta);
            deshabilitarBoton(botonDescarga, "Volver a descargar", false);
        })
        .catch(error => {
            console.error('Error al realizar la petición:', error);
        });
    
    });
    // Crear elemento de imagen
    var imagen = document.createElement("img");
    imagen.src = data.miniatura;
    imagen.classList.add("imagen-derecha");
    
    // Agregar elementos al DOM
    contenidoIzquierdo.appendChild(titulo);
    contenidoIzquierdo.appendChild(autor);
    contenidoIzquierdo.appendChild(duracion);
    contenidoIzquierdo.appendChild(visitas);
    contenidoIzquierdo.appendChild(botonDescarga);
    contenidoIzquierdo.appendChild(selector);
    
    tarjetaBody.appendChild(contenidoIzquierdo);
    
    tarjeta.appendChild(tarjetaBody);
    tarjetaBody.appendChild(imagen);
    tarjetaContainer.appendChild(tarjeta);
}
async function deshabilitarBoton(boton, texto ,boolean){
    boton.textContent = texto;
    boton.disabled = boolean;
}

document.getElementById("miFormulario").addEventListener("submit", function (event) {
    // Prevenir el envío normal del formulario
    event.preventDefault();

    var url = document.getElementById("urlInput").value;
    var tipo = document.getElementById("selectorTipo").value;
    var botonSubmit = document.getElementById("botonSubmit");

    if (url == null || url == ''){
        alert("Introduce una url antes de aceptar.")
    }else{
        deshabilitarBoton(botonSubmit, "Cargando...", true);

        fetch('http://localhost:8000/convertir', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"URL": url,"TIPO": tipo }),
        })
        .then(response => response.json())
        .then(data => {
            // Manejar la respuesta del servidor
            deshabilitarBoton(botonSubmit, "Convertir", false);
            console.log('Respuesta del servidor:', data);
            crearElementoCancion(data)
        })
        .catch(error => {
            console.error('Error al realizar la petición:', error);
        });

    }
});
