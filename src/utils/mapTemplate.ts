export function generateMapHtml(
  incidents: any[],
  latitude: number,
  longitude: number
) {
  const markers = incidents.map((incident) => {
    const color =
      incident.riskLevel === "Alto"
        ? "#ef4444"
        : incident.riskLevel === "Medio"
        ? "#f59e0b"
        : "#22c55e";

    const icon =
      incident.type === "Robo"
        ? "🛡️"
        : incident.type === "Accidente"
        ? "🚗"
        : incident.type === "Acoso"
        ? "👤"
        : incident.type === "Vandalismo"
        ? "🔨"
        : "📍";

    const popup = `
      <div style="min-width:180px;font-family:Arial;color:white">
        <h3 style="margin:0 0 8px 0">${icon} ${incident.type}</h3>
        <div style="margin-bottom:8px">${incident.description}</div>
        <div><b>Riesgo:</b> <span style="color:${color}">${incident.riskLevel}</span></div>
        <div><b>Estado:</b> ${incident.status}</div>
      </div>`.replace(/`/g,"");

    return `
L.marker([${incident.latitude}, ${incident.longitude}],{
        icon:L.divIcon({
          className:'',
          html:'<div class="marker" style="background:${color}">${icon}</div>',
          iconSize:[40,40],
          iconAnchor:[20,40]
        })
      }).addTo(map).bindPopup({popup});
    `;
  }).join("");

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<style>
html,body,#map{margin:0;padding:0;width:100%;height:100%;background:#111827;}
.leaflet-tile{
filter:invert(.9) hue-rotate(180deg) brightness(.6) contrast(1.1);
}
.marker{
width:40px;height:40px;border-radius:20px;
display:flex;align-items:center;justify-content:center;
font-size:22px;color:white;border:3px solid white;
box-shadow:0 4px 10px rgba(0,0,0,.4);
}
.leaflet-popup-content-wrapper,.leaflet-popup-tip{
background:#111827;color:white;
}
.legend{
position:absolute;top:10px;left:10px;z-index:9999;
background:#111827;color:white;padding:10px 14px;
border-radius:12px;font-family:Arial;
}
</style>
</head>
<body>
<div class="legend">🛡️ Robo &nbsp; 🚗 Accidente &nbsp; 👤 Acoso &nbsp; 🔨 Vandalismo</div>
<div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
const map=L.map('map').setView([${latitude},${longitude}],14);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(map);

L.circleMarker([${latitude},${longitude}],{
radius:10,
color:'#2563eb',
fillColor:'#2563eb',
fillOpacity:1
}).addTo(map).bindPopup('📍 Tu ubicación');

${markers}
</script>
</body>
</html>`;
}
