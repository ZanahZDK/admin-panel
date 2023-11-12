// MOSTRAR MODAL DE AGREGAR UN NUEVO ESTACIONAMIENTO
function mostrarModalAgregar() {
    document.getElementById('modalAgregar').style.display = 'block';
}

// MOSTRAR MODAL DE EDITAR UN NUEVO ESTACIONAMIENTO
function mostrarModalEditar() {
    document.getElementById('modalEditar').style.display = 'block';
}

// CERRAR MODAL DE AGREGAR UN NUEVO ESTACIONAMIENTO
function cerrarModalAgregar() {
    document.getElementById('modalAgregar').style.display = 'none';
}

// CERRAR MODAL DE EDITAR UN ESTACIONAMIENTO
function cerrarModal() {
    document.getElementById('modalEditar').style.display = 'none';
  }

  function fetchParkingLots() {
    fetch('http://16.170.227.32:8080/parking_lot')
        .then(response => response.json())
        .then(data => {
        })
        .catch(error => {
            console.error('Error al recuperar estacionamientos:', error);
        });
}

document.addEventListener('DOMContentLoaded', function() {

    //FUNCION AÑADIR ESTACIONAMIENTO
    function addParkingLot(parkingLotData) {
        fetch('http://16.170.227.32:8080/parking_lot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(parkingLotData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Estacionamiento añadido:', data);
            fetchParkingLots();
        })
        .catch(error => {
            console.error('Error al añadir estacionamiento:', error);
        });
    }

    //FUNCION EDITAR ESTACIONAMIENTO
    function editar(id) {
        fetch(`http://16.170.227.32:8080/parking_lot/${id}`)
            .then(response => response.json())
            .then(data => {
                document.getElementById('editarId').value = id;
                document.getElementById('editarDireccion').value = data.direction;
                document.getElementById('editarLatitud').value = data.latitud;
                document.getElementById('editarLongitud').value = data.longitud;
                document.getElementById('editarNombre').value = data.name;
                document.getElementById('editarPrecioHora').value = data.hourPrice;
                document.getElementById('editarPrecioMinuto').value = data.minutePrice;
                
                document.getElementById('modalEditar').style.display = 'block';
            })
            .catch(error => {
                console.error('Error al recuperar los datos del estacionamiento:', error);
            });
        }
    
    //FUNCION ELIMINAR ESTACIONAMIENTO
    function eliminarEstacionamiento(id) {
        if (!confirm(`¿Estás seguro de que deseas eliminar el estacionamiento con id ${id}?`)) {
            return;
        }

        fetch(`http://16.170.227.32:8080/parking_lot/${id}`, {
            method: 'DELETE'
        })  
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al eliminar: ${response.statusText}`);
            }
            return response.text();
        })
        .then(() => {
            console.log(`Estacionamiento con id ${id} eliminado.`);
            document.querySelector(`button[data-id="${id}"]`).closest('tr').remove();
        })
        .catch(error => {
            console.error('Error al eliminar:', error);
        });
    }

    // CARGAR DATOS DE LOS ESTACIONAMIENTOS
    fetch('http://16.170.227.32:8080/parking_lot')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('table tbody');
            data.forEach((entry) => {
                const row = document.createElement('tr');
                row.setAttribute('data-id', entry.id);
                row.innerHTML = `
                    <td>${entry.id}</td>
                    <td>${entry.direction}</td>
                    <td>${entry.latitud}</td>
                    <td>${entry.longitud}</td>
                    <td>${entry.name}</td>
                    <td>${entry.hourPrice}</td>
                    <td>${entry.minutePrice}</td>
                    <td>
                        <button class="edit-btn" data-id="${entry.id}">Editar</button>
                        <button class="delete-btn" data-id="${entry.id}">Eliminar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error al recuperar datos:', error);
        });

    const tableBody = document.querySelector('table tbody');

     // Evento de clic delegado para editar y eliminar
     tableBody.addEventListener('click', function(e) {
        if (e.target.matches('.edit-btn')) {
            const id = e.target.dataset.id;
            editar(id);
        } else if (e.target.matches('.delete-btn')) {
            const id = e.target.getAttribute('data-id');
            eliminarEstacionamiento(id); 
        }
    });

    // Event listener para añadir estacionamientos
    document.getElementById('formAgregar').addEventListener('submit', function(e) {
        e.preventDefault();

        const nameInput = document.getElementById('agregarNombre');
        const directionInput = document.getElementById('agregarDireccion');
        const latitudInput = document.getElementById('agregarLatitud');
        const longitudInput = document.getElementById('agregarLongitud');
        const hourPriceInput = document.getElementById('agregarPrecioHora');
        const minutePriceInput = document.getElementById('agregarPrecioMin');

        const parkingLotData = {
            name: nameInput.value,
            direction: directionInput.value,
            latitud: parseFloat(latitudInput.value),
            longitud: parseFloat(longitudInput.value),
            hourPrice: parseInt(hourPriceInput.value, 10),
            minutePrice: parseInt(minutePriceInput.value, 10)
    };
    addParkingLot(parkingLotData);
    });

    // Event listener para editar estacionamientos
    document.getElementById('formEditar').addEventListener('submit', function(e) {
        e.preventDefault();
        const id = document.getElementById('editarId').value;
        const direccion = document.getElementById('editarDireccion').value;
        const latitud = document.getElementById('editarLatitud').value;
        const longitud = document.getElementById('editarLongitud').value;
        const nombre = document.getElementById('editarNombre').value;
        const hourPrice = document.getElementById('editarPrecioHora').value;
        const minutePrice = document.getElementById('editarPrecioMinuto').value;
    
        const estacionamientoActualizado = {
        direction: direccion,
        latitud: latitud,
        longitud: longitud,
        name: nombre,
        hourPrice: hourPrice,
        minutePrice: minutePrice
    };
  
    fetch(`http://16.170.227.32:8080/parking_lot/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(estacionamientoActualizado)
    })
    .then(response => {
      if(response.ok) {
        cerrarModal();
        console.log('Estacionamiento actualizado');
      } else {
        console.error('Error al actualizar el estacionamiento');
      }
    })
    .catch(error => {
      console.error('Error al realizar la solicitud:', error);
    });
    });
});

document.getElementById('logout').addEventListener('click', function(e) {
    e.preventDefault();

    firebase.auth().signOut().then(() => {
        window.location.href = 'index.html';
    }).catch((error) => {
        console.error('Error al cerrar sesión:', error);
    });
});