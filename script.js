// Mapeo de nombres de Pokémon a sus tipos y colores
const pokemonData = {
    "Pikachu": { "type": "Electrico", "color": "#FFFF00" },
    "Jolteon": { "type": "Electrico", "color": "#FFD700" },
    "Zapdos": { "type": "Electrico", "color": "#F4C542" },

    "Charmander": { "type": "Fuego", "color": "#FFA500" },
    "Flareon": { "type": "Fuego", "color": "#FF4500" },
    "Moltres": { "type": "Fuego", "color": "#FF6347" },

    "Squirtle": { "type": "Agua", "color": "#00BFFF" },
    "Vaporeon": { "type": "Agua", "color": "#1E90FF" },
    "Gyarados": { "type": "Agua", "color": "#4169E1" },

    "Bulbasaur": { "type": "Planta", "color": "#7CFC00" },
    "Leafeon": { "type": "Planta", "color": "#32CD32" },
    "Venusaur": { "type": "Planta", "color": "#228B22" }
};

// Lista de nombres de Pokémon para generación aleatoria (solo los definidos en pokemonData)
const pokemonNames = Object.keys(pokemonData);

// Función para generar un color aleatorio en formato hexadecimal (se mantiene por si se necesita)
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Función para actualizar el cuadro de previsualización de color
function updateColorPreview(input) {
    const previewId = input.name + '-preview';
    const previewElement = document.getElementById(previewId);
    if (previewElement) {
        previewElement.style.backgroundColor = input.value;
    }
}

// Función para generar un Pokémon aleatorio individual respetando las asociaciones
function generateRandomPokemon(player, pokemonNum) {
    // Generar un nombre único que no esté en uso
    let randomName;
    do {
        randomName = pokemonNames[Math.floor(Math.random() * pokemonNames.length)];
    } while (isNameInUse(randomName, player));

    const nameInput = document.querySelector(`[name="${player}-pokemon${pokemonNum}-name"]`);
    nameInput.value = randomName;

    // Obtener tipo y color basados en el mapeo
    const type = pokemonData[randomName].type;
    const color = pokemonData[randomName].color;

    // Establecer el tipo en el select correspondiente
    const typeSelect = document.querySelector(`[name="${player}-pokemon${pokemonNum}-type"]`);
    let typeFound = false;
    for (let i = 0; i < typeSelect.options.length; i++) {
        if (typeSelect.options[i].value.toLowerCase() === type.toLowerCase()) {
            typeSelect.selectedIndex = i;
            typeFound = true;
            break;
        }
    }
    // Si el tipo no está en el select, agregarlo
    if (!typeFound) {
        const newOption = document.createElement("option");
        newOption.value = type;
        newOption.text = type.charAt(0).toUpperCase() + type.slice(1);
        typeSelect.add(newOption);
        typeSelect.selectedIndex = typeSelect.options.length - 1;
    }

    // Establecer el color
    const colorInput = document.querySelector(`[name="${player}-pokemon${pokemonNum}-color"]`);
    colorInput.value = color;
    updateColorPreview(colorInput); // Actualizar el cuadro de previsualización

    // Generar vida aleatoria
    const randomLife = Math.floor(Math.random() * 401) + 100; // 100 a 500
    const lifeInput = document.querySelector(`[name="${player}-pokemon${pokemonNum}-life"]`);
    lifeInput.value = randomLife;
    document.getElementById(`${player}-pokemon${pokemonNum}-life-value`).textContent = randomLife;
}

// Función para verificar si un nombre ya está en uso para el mismo jugador
function isNameInUse(name, player) {
    const name1 = document.querySelector(`[name="${player}-pokemon1-name"]`).value;
    const name2 = document.querySelector(`[name="${player}-pokemon2-name"]`).value;
    return name === name1 || name === name2;
}

// Función para generar todos los Pokémon aleatorios
function generateAllRandomPokemon() {
    generateRandomPokemon('player1', 1);
    generateRandomPokemon('player1', 2);
    generateRandomPokemon('player2', 1);
    generateRandomPokemon('player2', 2);
    generateQRCode();
}

// Función para copiar la información al portapapeles
function copyToClipboard() {
    if (!document.getElementById('pokemon-form').checkValidity()) {
        alert('Por favor, completa todos los campos antes de copiar el texto.');
        return;
    }
    const formData = new FormData(document.getElementById('pokemon-form'));
    let resultString = '';

    const playerKeys = ['player1', 'player2'];
    playerKeys.forEach(player => {
        resultString += `Pokemon ${player}[2] = {\n`;
        for (let i = 1; i <= 2; i++) {
            const name = formData.get(`${player}-pokemon${i}-name`);
            const type = formData.get(`${player}-pokemon${i}-type`);
            const color = formData.get(`${player}-pokemon${i}-color`);
            const life = formData.get(`${player}-pokemon${i}-life`);
            const rgb = hexToRgb(color);
            const trueValue = i === 1 ? 'true' : 'false';

            resultString += `    {"${name}", "${type}", ${rgb.r}, ${rgb.g}, ${rgb.b}, ${life}, false, ${trueValue}},  // ${i === 1 ? 'Primer' : 'Segundo'} Pokémon del ${player === 'player1' ? 'jugador 1' : 'jugador 2'} \n`;
        }
        resultString += `};\n\n`;
    });

    navigator.clipboard.writeText(resultString).then(() => {
        alert('El texto se ha copiado al portapapeles');
    }, () => {
        alert('No se pudo copiar el texto al portapapeles');
    });
}

// Función para convertir hexadecimal a RGB
function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}

// Función para validar los nombres y sus asociaciones
function validateNames(player) {
    const name1 = document.querySelector(`[name="${player}-pokemon1-name"]`).value;
    const name2 = document.querySelector(`[name="${player}-pokemon2-name"]`).value;

    if (name1 && name2 && name1 === name2) {
        alert('Los nombres de los Pokémon no pueden ser iguales para el mismo jugador.');
        return;
    }

    // Validar cada Pokémon individualmente
    [1, 2].forEach(pokemonNum => {
        const name = document.querySelector(`[name="${player}-pokemon${pokemonNum}-name"]`).value;
        if (pokemonData[name]) {
            const typeSelect = document.querySelector(`[name="${player}-pokemon${pokemonNum}-type"]`);
            const colorInput = document.querySelector(`[name="${player}-pokemon${pokemonNum}-color"]`);
            const expectedType = pokemonData[name].type;
            const expectedColor = pokemonData[name].color.toLowerCase();

            // Validar Tipo
            if (typeSelect.value.toLowerCase() !== expectedType.toLowerCase()) {
                alert(`El tipo de ${name} debe ser ${expectedType}. Se ajustará automáticamente.`);
                // Ajustar el tipo automáticamente
                let typeFound = false;
                for (let i = 0; i < typeSelect.options.length; i++) {
                    if (typeSelect.options[i].value.toLowerCase() === expectedType.toLowerCase()) {
                        typeSelect.selectedIndex = i;
                        typeFound = true;
                        break;
                    }
                }
                // Si el tipo no está en el select, agregarlo
                if (!typeFound) {
                    const newOption = document.createElement("option");
                    newOption.value = expectedType;
                    newOption.text = expectedType.charAt(0).toUpperCase() + expectedType.slice(1);
                    typeSelect.add(newOption);
                    typeSelect.selectedIndex = typeSelect.options.length - 1;
                }
            }

            // Validar Color
            if (colorInput.value.toLowerCase() !== expectedColor) {
                alert(`El color de ${name} debe ser ${expectedColor}. Se ajustará automáticamente.`);
                // Ajustar el color automáticamente
                colorInput.value = pokemonData[name].color;
                updateColorPreview(colorInput); // Actualizar el cuadro de previsualización
            }
        }
    });
}

//Funcion de generar un id unico
function generateShareableId() {
    if (!document.getElementById('pokemon-form').checkValidity()) {
        alert('Por favor, completa todos los campos antes de copiar el texto.');
        return;
    }
    const players = ['player1', 'player2'];
    const data = {};

    players.forEach(player => {
        data[player] = [];
        for (let i = 1; i <= 2; i++) {
            const name = document.querySelector(`[name="${player}-pokemon${i}-name"]`).value;
            const type = document.querySelector(`[name="${player}-pokemon${i}-type"]`).value;
            const color = document.querySelector(`[name="${player}-pokemon${i}-color"]`).value;
            const life = document.querySelector(`[name="${player}-pokemon${i}-life"]`).value;

            data[player].push({ name, type, color, life });
        }
    });

    const jsonString = JSON.stringify(data);
    const compressed = LZString.compressToEncodedURIComponent(jsonString); // Compactar
    navigator.clipboard.writeText(compressed).then(() => {
        alert('El texto se ha copiado al portapapeles');
    }, () => {
        alert('No se pudo copiar el texto al portapapeles');
    });
    return compressed;
}

function importFromId(sharedId) {
    try {
        const jsonString = LZString.decompressFromEncodedURIComponent(sharedId); // Descomprimir
        const data = JSON.parse(jsonString);

        Object.keys(data).forEach(player => {
            data[player].forEach((pokemon, index) => {
                const pokemonNum = index + 1;
                document.querySelector(`[name="${player}-pokemon${pokemonNum}-name"]`).value = pokemon.name;
                document.querySelector(`[name="${player}-pokemon${pokemonNum}-type"]`).value = pokemon.type;
                document.querySelector(`[name="${player}-pokemon${pokemonNum}-color"]`).value = pokemon.color;
                document.querySelector(`[name="${player}-pokemon${pokemonNum}-life"]`).value = pokemon.life;
                document.getElementById(`${player}-pokemon${pokemonNum}-life-value`).textContent = pokemon.life;

                updateColorPreview(document.querySelector(`[name="${player}-pokemon${pokemonNum}-color"]`));
            });
        });

        alert("Configuración importada exitosamente.");
    } catch (error) {
        console.error(error);
        alert("ID inválido. Por favor verifica e intenta nuevamente.");
    }
}
// Función para generar el QR con la información
function generateQRCode() {
    if (!document.getElementById('pokemon-form').checkValidity()) {
        document.getElementById('qrcode').innerHTML = ""; // Limpiar el QR si no están todos los campos completos
        return;
    }
    const players = ['player1', 'player2'];
    const data = {};

    players.forEach(player => {
        data[player] = [];
        for (let i = 1; i <= 2; i++) {
            const name = document.querySelector(`[name="${player}-pokemon${i}-name"]`).value;
            const type = document.querySelector(`[name="${player}-pokemon${i}-type"]`).value;
            const color = document.querySelector(`[name="${player}-pokemon${i}-color"]`).value;
            const life = document.querySelector(`[name="${player}-pokemon${i}-life"]`).value;

            data[player].push({ name, type, color, life });
        }
    });

    const jsonString = JSON.stringify(data);
    const compressed = LZString.compressToEncodedURIComponent(jsonString); // Compactar

    const qrCodeContainer = document.getElementById('qrcode');
    qrCodeContainer.innerHTML = ""; // Limpiar el contenedor del QR
    new QRCode(qrCodeContainer, {
        text: compressed,
        width: 200,
        height: 200
    });
}

// Agregar event listeners para actualizar el QR automáticamente cuando los campos cambien
document.addEventListener('input', () => {
    generateQRCode();
});

document.addEventListener('DOMContentLoaded', () => {
    generateQRCode();
});

function openPopup() {
    const popup = document.getElementById('import-popup');
    popup.style.display = 'flex';
}

function closePopup() {
    const popup = document.getElementById('import-popup');
    popup.style.display = 'none';
}

let cameraStream = null;

function activateCamera() {
    const video = document.getElementById('camera-preview');
    const canvas = document.getElementById('camera-canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    // Solicitamos permisos para usar la cámara
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then((stream) => {
            cameraStream = stream; // Guardamos el stream para detenerlo después
            video.srcObject = stream;
            video.play();

            function scanQRCode() {
                if (video.readyState === video.HAVE_ENOUGH_DATA) {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const code = jsQR(imageData.data, canvas.width, canvas.height);

                    if (code) {
                        // Si el QR es leído correctamente, importamos los datos
                        importFromId(code.data);
                        closePopup(); // Cerrar el popup
                        alert('QR escaneado con éxito: ' + code.data);
                        return;
                    }
                }

                // Continuamos escaneando si no hemos detectado un código QR
                requestAnimationFrame(scanQRCode);
            }

            // Inicia el bucle de escaneo
            requestAnimationFrame(scanQRCode);
        })
        .catch((err) => {
            console.error('Error al activar la cámara:', err);
            alert('No se pudo activar la cámara. Verifica los permisos y vuelve a intentarlo.');
        });
}

function closePopup() {
    // Detenemos la cámara si está activa
    if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
        cameraStream = null;
    }

    const popup = document.getElementById('import-popup');
    popup.style.display = 'none';
}


// Función para importar datos desde un código QR
function importFromQRCode() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        try {
            const imageDataUrl = await readFileAsDataURL(file);
            const image = new Image();
            image.src = imageDataUrl;
            image.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                ctx.drawImage(image, 0, 0);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, canvas.width, canvas.height);

                if (code) {
                    importFromId(code.data);
                    closePopup(); // Cerrar el popup al importar exitosamente
                    alert('QR importado con éxito: ' + code.data);
                } else {
                    alert('No se pudo leer el código QR. Por favor intenta nuevamente.');
                }
            };
        } catch (error) {
            console.error(error);
            alert('No se pudo leer el código QR. Por favor intenta nuevamente.');
        }
    };

    input.click();
}

// Función para importar datos desde un código QR usando la cámara
function importFromCamera(callbacks = {}) {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let stream;

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then((mediaStream) => {
            stream = mediaStream;
            video.srcObject = stream;
            video.setAttribute('playsinline', true); // Requerido para iOS
            video.play();
            requestAnimationFrame(tick);
        })
        .catch((err) => {
            console.error(err);
            if (callbacks.onError) callbacks.onError(err);
        });

    function tick() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, canvas.width, canvas.height);

            if (code) {
                importFromId(code.data);
                if (callbacks.onSuccess) callbacks.onSuccess(code.data);
                stream.getTracks().forEach(track => track.stop());
                return;
            }
        }
        requestAnimationFrame(tick);
    }
}

// Utilidad para leer el archivo como Data URL
function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}