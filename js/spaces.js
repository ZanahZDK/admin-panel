document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos de los estacionamientos
    fetch('https://16.16.207.11/parking_lot')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.querySelector('#parkingLotList');
        data.forEach((entry) => {
            const row = document.createElement('tr');
            row.setAttribute('data-id', entry.id);
            row.innerHTML = `
                <td>${entry.id}</td>
                <td>${entry.name}</td>
                <td>
                    <button class="edit-btn" data-id="${entry.id}">Editar</button>
                    <button class="actions-btn" data-id="${entry.id}">Añadir</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Error al recuperar datos:', error);
    });

    const tableBody = document.querySelector('#parkingLotList');
    tableBody.addEventListener('click', function(e) {
        if (e.target.matches('.actions-btn')) {
            const parkingLotId = e.target.dataset.id;
            mostrarModalAcciones(parkingLotId);
        }

    tableBody.addEventListener('click', function(e) {
        if (e.target.matches('.edit-btn')) {
            const parkingLotId = e.target.dataset.id;
            mostrarParkingSpaces(parkingLotId);
        }
    });
});

    document.getElementById('formAddParkingSpace').addEventListener('submit', function(e) {
        e.preventDefault();
    
        const parkingLotId = document.getElementById('parkingLotIdInput').value;
        const floor = document.getElementById('floorInput').value;
        const ubication = document.getElementById('ubicationInput').value;
        const available = document.getElementById('availableInput').checked;
    
        const parkingSpaceData = {
            floor: floor,
            ubication: ubication,
            available: available,
            parkingLotId: parkingLotId
        };
        addParkingSpace(parkingSpaceData);
    });

    document.getElementById('parkingSpacesContainer').addEventListener('click', function(e) {
        if (e.target.matches('.delete-space-btn')) {
            const spaceId = e.target.dataset.id;
            eliminarParkingSpace(spaceId);
        }
    });
});

function mostrarModalAcciones(parkingLotId) {
    document.getElementById('parkingLotIdInput').value = parkingLotId;
    document.getElementById('modalActions').style.display = 'block';
    
}

function cerrarModalAcciones() {
    document.getElementById('modalActions').style.display = 'none';
}


function addParkingSpace(parkingSpaceData) {
    // Extraer el parkingLotId y eliminarlo del objeto parkingSpaceData
    const parkingLotId = parkingSpaceData.parkingLotId;
    delete parkingSpaceData.parkingLotId;

    fetch(`https://16.16.207.11/parking_space/add/${parkingLotId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(parkingSpaceData)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            console.error('Error en la respuesta:', text);
            throw new Error('Algo salió mal al añadir el parking_space');
        }
    })
    .then(data => {
        console.log('Parking Space añadido:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function mostrarParkingSpaces(parkingLotId) {
    document.getElementById('parkingLotIdInput').value = parkingLotId;
    fetch(`https://16.16.207.11/parking_space/by-parking-lot/${parkingLotId}`)
    .then(response => response.json())
    .then(parkingSpaces => {
        const parkingSpacesContainer = document.getElementById('parkingSpacesContainer');
        parkingSpacesContainer.innerHTML = ''; 

        parkingSpaces.forEach(space => {
            const spaceDiv = document.createElement('div');
            spaceDiv.classList.add('parking-space');
            spaceDiv.textContent = space.ubication;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.classList.add('delete-space-btn');
            deleteButton.setAttribute('data-id', space.id);

            spaceDiv.appendChild(deleteButton);
            parkingSpacesContainer.appendChild(spaceDiv);
        });

        document.getElementById('modalParkingSpaces').style.display = 'block';
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function eliminarParkingSpace(spaceId) {
    fetch(`https://16.16.207.11/parking_space/delete/${spaceId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            console.log('Parking Space eliminado:', spaceId);
        } else {
            throw new Error('Error al eliminar el parking_space');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function cerrarModalParkingSpaces() {
    document.getElementById('modalParkingSpaces').style.display = 'none';
}

function filtrarPorPiso(piso) {
    const parkingLotId = document.getElementById('parkingLotIdInput').value;
    console.log("Filtrando por piso", piso, "del parking lot", parkingLotId);
    if (!parkingLotId) {
        console.error("No se ha seleccionado un parking_lot");
        return;
    }
    
    fetch(`https://16.16.207.11/parking_space/by-parking-lot/${parkingLotId}/floor/${piso}`)
    .then(response => response.json())
    .then(parkingSpaces => {
        console.log("Parking spaces recibidos:", parkingSpaces);
        const parkingSpacesContainer = document.getElementById('parkingSpacesContainer');
        parkingSpacesContainer.innerHTML = '';

        parkingSpaces.forEach(space => {
            const spaceDiv = document.createElement('div');
            spaceDiv.classList.add('parking-space');
            spaceDiv.textContent = space.ubication;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.classList.add('delete-space-btn');
            deleteButton.setAttribute('data-id', space.id);

            spaceDiv.appendChild(deleteButton);
            parkingSpacesContainer.appendChild(spaceDiv);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

document.getElementById('logout').addEventListener('click', function(e) {
    e.preventDefault();

    firebase.auth().signOut().then(() => {
        window.location.href = 'index.html';
    }).catch((error) => {
        console.error('Error al cerrar sesión:', error);
    });
});