// Initialize the map
var map = L.map('map').setView([20.5937, 78.9629], 5);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Variable to store clicked location
let selectedLatLng = null;

// Click event to open noise form
map.on('click', function(event) {
    selectedLatLng = event.latlng; // Store selected location
    document.getElementById('noiseFormContainer').style.display = 'block';
});

// Close form when clicking cancel
document.getElementById('closeForm').addEventListener('click', function() {
    document.getElementById('noiseFormContainer').style.display = 'none';
});

// Submit noise report
document.getElementById('submitReport').addEventListener('click', function() {
    let noiseLevel = document.getElementById('noiseLevel').value;
    let description = document.getElementById('description').value;

    if (selectedLatLng && noiseLevel && description) {
        let lat = selectedLatLng.lat;
        let lng = selectedLatLng.lng;

        addMarker(lat, lng, noiseLevel, description);

        document.getElementById('noiseFormContainer').style.display = 'none';
    } else {
        alert("Please select a location and fill out all fields.");
    }
});

// Function to add a marker
function addMarker(lat, lng, noiseLevel, description) {
    let marker = L.marker([lat, lng]).addTo(map);
    marker.bindPopup(`<b>Noise Level:</b> ${noiseLevel}<br>${description}`);
}
