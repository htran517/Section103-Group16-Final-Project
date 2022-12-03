function initMap() {
  console.log('initMap');
  const map = L.map('map').setView([38.9897, -76.9374], 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  return map;
}

function markerPlace(array, map) {
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      layer.remove();
    }
  });

  array.forEach((item, index) => {
    const coordinates = item.location;
    L.marker([coordinates.latitude, coordinates.longitude]).addTo(map);
    if (index === 0) {
      map.setView([coordinates.latitude, coordinates.longitude], 10);
    }
  });
}

function filterList(list, filterInputValue) {
  return list.filter((item) => {
    if (!item.street_number.concat(' ', item.street_name).concat(' ', item.street_type)) {
      return;
    }
    const lowerCaseName = item.street_number.concat(' ', item.street_name.toLowerCase()).concat(' ', item.street_type.toLowerCase());
    const lowerCaseQuery = filterInputValue.toLowerCase();
    return lowerCaseName.includes(lowerCaseQuery);
  });
}

async function getData() {
  const url = 'https://data.princegeorgescountymd.gov/resource/9hyf-46qb.json';
  const data = await fetch(url);
  const json = await data.json();

  const reply = json.filter((item) => Boolean(item.location)).filter((item) => Boolean(item.location.longitude)).filter((item) => Boolean(item.location.latitude)).filter((item) => Boolean(item.property_id));
  return reply;
}

async function mainEvent() {
  const data = await getData();
  console.table(data);
  console.log(data[0]);
  console.log(
    `${data[0].street_number} ${data[0].street_name} ${data[0].street_type}, ${data[0].city}, ${data[0].state} ${data[0].zip_code}`
  );

  const pageMap = initMap();
  const form = document.querySelector('.main_form');
  const submit = document.querySelector('#get-prop');
  markerPlace(data, pageMap);

  if (data?.length > 0) {
    form.addEventListener('input', (event) => {
      console.log(event.target.value);
      const filteredList = filterList(data, event.target.value);
      markerPlace(filteredList, pageMap);
    });
  }
}

document.addEventListener('DOMContentLoaded', async () => mainEvent());