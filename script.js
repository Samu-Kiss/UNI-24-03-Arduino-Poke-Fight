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