const modal = document.getElementById("modal");
const btnAgregar = document.getElementById("btnAgregar");
const body = document.body;

// Obtener referencias a los elementos dentro del modal

const idInput = document.getElementById("txtId");
const nombreInput = document.getElementById("idNombre");
const apellidoInput = document.getElementById("idApellido");
const fechaInput = document.getElementById("idFecha");
const tipoSelect = document.getElementById("tipo");
const labelTipo1 = document.getElementById("label-tipo1");
const inputTipo1 = document.getElementById("idInputTipo1");

const btnCrear = document.getElementById("btnCrear");
const btnEliminar = document.getElementById("btnEliminar");
const btnModificar = document.getElementById("btnModificar");
const btnCancelar = document.getElementById("btnCancelar");

function limpiarCampos() {
    document.getElementById("txtId").value = "";
    document.getElementById("idNombre").value = "";
    document.getElementById("idApellido").value = "";
    document.getElementById("idFecha").value = "";
    document.getElementById("idInputTipo1").value = "";
}

function getID() {
    let id;
    let idExistente = true;

    do 
    {
        id = Math.floor(Math.random() * 1000);
        // Verificar si el ID generado ya existe en el array personasArray
        idExistente = personasArray.filter(persona => persona.id === id).length > 0;
    } while (idExistente);

    return id;
}

function abrirModal() {
    limpiarCampos();
    let id = getID();
    btnCrear.hidden = false;
    btnModificar.hidden = true;
    btnEliminar.hidden = true;

    const idInput = document.getElementById("txtId");
    idInput.value = id;
    idInput.readOnly = true; 
    idInput.style.background = "rgba(0,0,0,0.1)";

    body.classList.add('modal-open');
    modal.style.display = "block";
}

btnAgregar.onclick = abrirModal;

btnCancelar.onclick = function(event) {
    event.preventDefault();
    body.classList.remove('modal-open');
    modal.style.display = "none";
}

btnCrear.onclick = function(event) {
    event.preventDefault();

    const id = idInput.value;
    const nombre = nombreInput.value;
    const apellido = apellidoInput.value;
    const fecha = fechaInput.value;
    const tipo = tipoSelect.value;
    const valorTipo1 = inputTipo1.value;

    if (!id || !nombre || !apellido || !fecha || !tipo || !valorTipo1) {   
        return;
    }

    const nuevaPersona = {
        id: parseInt(id),
        nombre: nombre,
        apellido: apellido,
        fechaNacimiento: parseInt(fecha),
    };

    if (tipo === "Ciudadano") {
        nuevaPersona.dni = valorTipo1;
        arrayCiudadanos.push(nuevaPersona);
    } else {
        nuevaPersona.paisOrigen = valorTipo1;
        arrayExtranjeros.push(nuevaPersona);
    }

    personasArray.push(nuevaPersona);

    alert(`${tipo} agregado con éxito!`);
    llenarTablaPersonas();

    body.classList.remove('modal-open');
    modal.style.display = "none";
}

btnEliminar.onclick = function(event){
    event.preventDefault();

    const id = idInput.value;

    const index = personasArray.findIndex(persona => persona.id.toString() === id);

    personasArray.splice(index, 1);
    alert(`${nombreInput.value} ${apellidoInput.value} eliminada correctamente.`);
    llenarTablaPersonas();

    body.classList.remove('modal-open');
    modal.style.display = "none";
    
} 

btnModificar.onclick = function(event){
    event.preventDefault();

    const id = idInput.value;
    const nombre = nombreInput.value;
    const apellido = apellidoInput.value;
    const fecha = fechaInput.value;
    const tipo = tipoSelect.value;
    const valorTipo1 = inputTipo1.value;

    const personaModificada = personasArray.find(persona => persona.id.toString() === id);

    if (!id || !nombre || !apellido || !fecha || !tipo || !valorTipo1) {   
        return;
    }
    console.log(personaModificada);
    personaModificada.nombre = nombre;
    personaModificada.apellido = apellido;
    personaModificada.fecha = parseInt(fecha);

    if (tipo === "Ciudadano") {
        personaModificada.dni = valorTipo1;
        personaModificada.paisOrigen = "-";
    } else {
        personaModificada.dni = "-";
        personaModificada.paisOrigen = valorTipo1;
    }

    alert(`${tipo} actualizado con éxito!`);
    llenarTablaPersonas();

    body.classList.remove('modal-open');
    modal.style.display = "none";
}

function llenarModal(persona) {
    idInput.value = persona.id;
    nombreInput.value = persona.nombre;
    apellidoInput.value = persona.apellido;
    fechaInput.value = persona.fechaNacimiento;
    btnCrear.hidden = true;
    btnModificar.hidden = false;
    btnEliminar.hidden = false;

    if (persona.hasOwnProperty("dni")) {
        tipoSelect.value = "Ciudadano";
        labelTipo1.textContent = "DNI:";
        inputTipo1.value = persona.dni;
    } else {
        tipoSelect.value = "Extranjero";
        labelTipo1.textContent = "Pais de origen:";
        inputTipo1.value = persona.paisOrigen;
    }
    idInput.readOnly = true; 
    idInput.style.background = "rgba(0,0,0,0.1)";

    body.classList.add('modal-open');
    modal.style.display = "block";
}


tabla.addEventListener("click", function(event) {
    if (event.target.tagName === "TD") {
        const idPersona = event.target.parentElement.cells[0].textContent;
        const persona = personasArray.find(persona => persona.id.toString() === idPersona);

        llenarModal(persona);
    }
});

document.addEventListener("DOMContentLoaded", function () {

    function actualizarCamposComplementarios() {
        if (tipoSelect.value === "Ciudadano") {
            labelTipo1.textContent = "DNI:";       
        } else {
            labelTipo1.textContent = "Pais de origen:";
        }
    }

    tipo.addEventListener("change", actualizarCamposComplementarios);

    actualizarCamposComplementarios();
});


nombreInput.addEventListener('input', function(event) {
    const valor = event.target.value;
    if (!/^[A-Za-z]+$/.test(valor)) {
        event.target.value = valor.slice(0, -1);
    }
});

apellidoInput.addEventListener('input', function(event) {
    const valor = event.target.value;
    if (!/^[A-Za-z]+$/.test(valor)) {
        event.target.value = valor.slice(0, -1);
    }
});

// Validar que el máximo de caracteres en el campo fecha sea 8
fechaInput.addEventListener('input', function(event) {
    const valor = event.target.value;
    if (valor.length > 8) {
        event.target.value = valor.slice(0, 8);
    }
});

tipoSelect.addEventListener('change', function(event) {
    inputTipo1.value = "";
    const tipo = event.target.value;
    if (tipo === "Extranjero") {
        inputTipo1.addEventListener('input', validarLetras);
    } else {
        inputTipo1.removeEventListener('input', validarLetras);
    }
    if (tipo === "Ciudadano") {
        inputTipo1.addEventListener('input', validarNumeros);
    } else {
        inputTipo1.removeEventListener('input', validarNumeros);
    }
});

function validarNumeros(event) {
    const valor = event.target.value;
    if (!/^\d*$/.test(valor)) { 
        event.target.value = valor.replace(/\D/g, '');
    }
}
function validarLetras(event) {
    const valor = event.target.value;
    if (!/^[A-Za-z]+$/.test(valor)) {
        event.target.value = valor.slice(0, -1); 
    }
}

if (tipoSelect.value === "Extranjero") {
    inputTipo1.addEventListener('input', validarLetras);
}