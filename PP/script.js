class Persona {
    constructor(id, nombre, apellido, fechaNacimiento) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.fechaNacimiento = fechaNacimiento;
    }

    toString() {
        return `${this.id} ${this.nombre} ${this.apellido} ${this.fechaNacimiento}`;
    }
}

class Ciudadano extends Persona {
    constructor(id, nombre, apellido, fechaNacimiento, dni) {
        super(id, nombre, apellido, fechaNacimiento);
        this.dni = dni;
    }

    toString() {
        return `${super.toString()} - Dni: ${this.dni}`;
    }
}

class Extranjero extends Persona {
    constructor(id, nombre, apellido, fechaNacimiento, paisOrigen) {
        super(id, nombre, apellido, fechaNacimiento);
        this.paisOrigen = paisOrigen;
    }

    toString() {
        return `${super.toString()} - Pais de Origen: ${this.paisOrigen}`;
    }
}

// Separar ciudadanos y extranjeros
const ciudadanos = personasArray.filter(obj => obj.hasOwnProperty("dni"));
const extranjeros = personasArray.filter(obj => obj.hasOwnProperty("paisOrigen"));
// Crear array de las clases correspondientes
const arrayCiudadanos = ciudadanos.map(ciudadano => new Ciudadano(ciudadano.id, ciudadano.nombre, ciudadano.apellido, ciudadano.fechaNacimiento, ciudadano.dni));
const arrayExtranjeros = extranjeros.map(extranjero => new Extranjero(extranjero.id, extranjero.nombre, extranjero.apellido, extranjero.fechaNacimiento, extranjero.paisOrigen));


const tabla = document.getElementById("tabla-datos");
const tbody = tabla.querySelector("tbody");

let btnCalcular = document.getElementById("btnCalcular");
let inputEdadPromedio = document.getElementById("txtEdad");

// Event listener para cambios en los checkbox
const checkboxes = document.querySelectorAll('input[type="checkbox"]');

function llenarTablaPersonas() {
    // Limpiar el contenido actual de la tabla
    tbody.innerHTML = "";

    personasArray.forEach(persona => {

        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${persona.id}</td>
            <td>${persona.nombre}</td>
            <td>${persona.apellido}</td>
            <td>${persona.fechaNacimiento}</td>
            <td>${persona.hasOwnProperty("dni") ? persona.dni : "-"}</td>
            <td>${persona.hasOwnProperty("paisOrigen") ? persona.paisOrigen : "-"}</td>
        `;
        tbody.appendChild(fila);
    });
}


function llenarTablaCiudadanos() {

    tbody.innerHTML = "";

    arrayCiudadanos.forEach(ciudadano => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${ciudadano.id}</td>
            <td>${ciudadano.nombre}</td>
            <td>${ciudadano.apellido}</td>
            <td>${ciudadano.fechaNacimiento}</td>
            <td>${ciudadano.dni}</td>
            <td>-</td>
        `;
        tbody.appendChild(fila);
    });
}

function llenarTablaExtranjeros() {

    tbody.innerHTML = "";

    arrayExtranjeros.forEach(extranjero => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${extranjero.id}</td>
            <td>${extranjero.nombre}</td>
            <td>${extranjero.apellido}</td>
            <td>${extranjero.fechaNacimiento}</td>
            <td>-</td>
            <td>${extranjero.paisOrigen}</td>
        `;
        tbody.appendChild(fila);
    });
}

function marcarCheckboxes() {
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
        checkbox.dispatchEvent(new Event('change')); // Simular evento de cambio
    });
}

const select = document.querySelector('select[name="select"]');
select.addEventListener('change', function() {
    const valorSeleccionado = select.value;
    if (valorSeleccionado === "Todos") {
        llenarTablaPersonas();
    } else if (valorSeleccionado === "Ciudadanos") {
        llenarTablaCiudadanos();
    } else if (valorSeleccionado === "Extranjeros") {
        llenarTablaExtranjeros();
    }
    marcarCheckboxes();
});

llenarTablaPersonas();


btnCalcular.addEventListener('click', function(event) {
    event.preventDefault();

    const valorSeleccionado = select.value;
    let personas;

    if (valorSeleccionado === "Todos") {
        personas = personasArray;
    } else if (valorSeleccionado === "Ciudadanos") {
        personas = arrayCiudadanos;
    } else if (valorSeleccionado === "Extranjeros") {
        personas = arrayExtranjeros;
    }

    const edades = personas.map(persona => {
        const fechaNacimiento = persona.fechaNacimiento.toString();
        const añoNacimiento = parseInt(fechaNacimiento.substring(0, 4));
        const añoActual = new Date().getFullYear();
        return añoActual - añoNacimiento;
    });

    const sumarEdades = edades.reduce((total, edad) => total + edad, 0);
    const edadPromedio = sumarEdades / edades.length;

    inputEdadPromedio.value = edadPromedio.toFixed(2);
});

function ordenarColumnaClickeada(table, column, asc = true){
    const direccion = asc ? 1 : -1;
    const tbody = table.tBodies[0];
    const filas = Array.from(tbody.querySelectorAll("tr"));
    
    const filasOrdenadas = filas.sort((a, b) => {
        const valorA = a.querySelector(`td:nth-child(${column + 1})`).textContent.trim();
        const valorB = b.querySelector(`td:nth-child(${column + 1})`).textContent.trim();

        const esValorNumericoA = !isNaN(valorA) && valorA !== '';
        const esValorNumericoB = !isNaN(valorB) && valorB !== '';

        if (esValorNumericoA && esValorNumericoB) {
            return (parseInt(valorA) - parseInt(valorB)) * direccion;
        } else {
            return valorA.localeCompare(valorB) * direccion;
        }
    });

    // Remove trs
    while(tbody.firstChild){
        tbody.removeChild(tbody.firstChild);       
    }

    // Re-add
    tbody.append(...filasOrdenadas);

    // column actualmente ordenada
    table.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
    table.querySelector(`th:nth-child(${column + 1})`).classList.toggle("th-sort-asc", asc);
    table.querySelector(`th:nth-child(${column + 1})`).classList.toggle("th-sort-desc", !asc);
}

document.querySelectorAll(".table-sortable th").forEach(encabezado => {
    encabezado.addEventListener("click", () => {
        const tableElemento = encabezado.parentElement.parentElement.parentElement;
        const indexTh = Array.prototype.indexOf.call(encabezado.parentElement.children, encabezado);
        const actualmenteAsc = encabezado.classList.contains("th-sort-asc");

        ordenarColumnaClickeada(tableElemento, indexTh, !actualmenteAsc);
    });
});

function actualizarColumnasMostradas() {
    const columnas = tabla.querySelectorAll("th");

    columnas.forEach((columna, index) => {
        const nombreColumna = columna.textContent.trim().toLowerCase().replace(/\s/g, '');
        const checkbox = document.getElementById(`${nombreColumna}Check`);
        if (checkbox && !checkbox.checked) {
            // Si el checkbox está desmarcado, ocultar la columna
                tabla.querySelectorAll(`td:nth-child(${index + 1}), th:nth-child(${index + 1})`).forEach(elemento => {
                elemento.style.display = "none";
            });
        } else {
                tabla.querySelectorAll(`td:nth-child(${index + 1}), th:nth-child(${index + 1})`).forEach(elemento => {
                elemento.style.display = "";
            });
        }
    });
}

// Event listener para cambios en los checkbox
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', actualizarColumnasMostradas);
});