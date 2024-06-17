const DISTANCE_RANGES = [10, 15, 30, 40, 60, 105, 150, 185];
const WEIGHT_RANGES = [50, 100, 300, 400, 700, 1000, 1300, 2000, 3000, 4000, 5000, 6000, 7000, 10000, 12000, 16000, 24000];
const PRICES = [
    [6.94, 9.25, 11.56, 15.61, 19.42, 21.97, 27.18, 35.84, 42.78, 48.56, 54.34, 63.59, 71.69, 89.6, 101.74, 184.9, 208.11],
    [9.25, 11.56, 15.03, 19.08, 24.05, 26.59, 31.8, 41.62, 48.56, 54.34, 60.12, 69.37, 78.62, 101.17, 115.62, 184.9, 208.11],
    [15.03, 17.34, 20.82, 26.59, 31.22, 33.53, 39.31, 49.71, 56.65, 63.59, 69.37, 79.78, 89.03, 112.73, 127.17, 231.23, 254.36],
    [19.65, 21.97, 25.43, 32.37, 36.99, 39.31, 45.09, 55.5, 62.44, 69.37, 76.3, 86.72, 95.97, 122.55, 136.43, 254.36, 312.17],
    [28.91, 31.22, 34.68, 41.62, 46.25, 49.71, 55.5, 65.9, 72.84, 80.93, 87.87, 100.58, 109.83, 136.43, 150.3, 277.48, 341.07],
    [55.5, 60.12, 63.59, 70.53, 75.15, 79.78, 87.87, 98.27, 105.21, 115.62, 128.34, 141.05, 156.08, 182.67, 196.55, 335.29, 398.87],
    [86.72, 91.34, 98.27, 105.21, 109.83, 114.46, 122.55, 132.96, 139.9, 156.08, 168.8, 181.52, 196.55, 223.14, 237.02, 375.76, 445.12],
    [208.11, 208.11, 223.14, 223.14, 223.14, 223.14, 231.23, 231.23, 231.23, 242.79, 242.79, 260.25, 260.25, 277.48, 300.6, 375.76, 446.15]
];

document.addEventListener('DOMContentLoaded', function() {
    fetch('pueblos.json')
        .then(response => response.json())
        .then(pueblos => {
            const pueblosDatalist = document.getElementById('pueblos');
            pueblos.forEach(pueblo => {
                const option = document.createElement('option');
                option.value = pueblo.km;
                option.textContent = `${pueblo.nombre} - ${pueblo.km} km`;
                pueblosDatalist.appendChild(option);
            });
        });
});

document.getElementById('priceForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const distance = parseFloat(document.getElementById('distance').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const volume = parseFloat(document.getElementById('volume').value);
    const isAdr = document.getElementById('adr').checked;
    const isPuertaElevadora = document.getElementById('puertaElevadora').checked;

    let basePrice = calculatePrice(distance, weight, volume, isAdr, isPuertaElevadora);
    let adrCost = isAdr ? basePrice * 0.3 : 0.0;
    let totalPrice = basePrice;

    document.getElementById('result').textContent = `Precio sin ADR: ${basePrice.toFixed(2)} € - Costo ADR: ${adrCost.toFixed(2)} € - Precio total: ${totalPrice.toFixed(2)} €`;

    addHistory(distance, weight, volume, isAdr, isPuertaElevadora, basePrice, adrCost, totalPrice);
});

document.getElementById('clearHistory').addEventListener('click', function() {
    document.getElementById('historyBody').innerHTML = '';
});

function calculatePrice(distance, weight, volume, isAdr, isPuertaElevadora) {
    let cubicWeight = volume * 270;
    let finalWeight = Math.max(weight, cubicWeight);

    let distanceIndex = findIndex(DISTANCE_RANGES, distance);
    let weightIndex = findIndex(WEIGHT_RANGES, finalWeight);

    let basePrice = PRICES[distanceIndex][weightIndex];

    if (isPuertaElevadora) {
        if (finalWeight <= 1500) {
            basePrice = 17.34;
        } else if (finalWeight <= 3000) {
            basePrice = 34.68;
        } else {
            basePrice = 52.02;
        }
    }

    return basePrice;
}

function findIndex(ranges, value) {
    for (let i = 0; i < ranges.length; i++) {
        if (value <= ranges[i]) {
            return i;
        }
    }
    return ranges.length - 1;
}

function addHistory(distance, weight, volume, isAdr, isPuertaElevadora, basePrice, adrCost, totalPrice) {
    const historyBody = document.getElementById('historyBody');
    const row = document.createElement('tr');

    let cubicWeight = volume * 270;
    let usedWeight = Math.max(weight, cubicWeight);
    let usedValue = weight > cubicWeight ? "Peso" : "Metros Cúbicos";

    row.innerHTML = `
        <td>${distance}</td>
        <td>${weight}</td>
        <td>${volume}</td>
        <td>${cubicWeight}</td>
        <td>${usedValue}</td>
        <td>${adrCost.toFixed(2)}</td>
        <td>${isPuertaElevadora ? basePrice.toFixed(2) : 0}</td>
        <td>${totalPrice.toFixed(2)}</td>
    `;

    historyBody.appendChild(row);
}
