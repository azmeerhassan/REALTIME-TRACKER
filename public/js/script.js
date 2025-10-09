const socket = io()

if(navigator.geolocation){
    navigator.geolocation.watchPosition(
        (position)=>{
            const {latitude, longitude} = position.coords
            socket.emit("send-location", {latitude, longitude})
        },
        (error)=>{
            console.error(error)
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        }
    )
}

const map = L.map('map').setView([0, 0], 25)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution: 'Azmeer Hassan Ammad'
}).addTo(map)

const markers = {}

socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;
  console.log("Received from:", id, latitude, longitude);

  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    
    const color = Object.keys(markers).length === 0 ? "blue" : "red";
    const marker = L.circleMarker([latitude, longitude], {
      color: color,
      radius: 10,
      fillOpacity: 0.7,
    }).addTo(map);

    marker.bindTooltip(
      color === "red" ? "Mobile" : "Laptop",
      { permanent: true, direction: "top" }
    );

    markers[id] = marker;
    map.setView([latitude, longitude], 25);
  }
});


socket.on('user-disconnected', (id)=>{
    if(markers[id]){
        map.removeLayer(markers[id])
        delete markers[id]
    }
})

