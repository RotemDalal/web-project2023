const getBranches = async () => {
  const response = await fetch("/branch");
  const branches = await response.json();
  return branches;
};

async function initMap() {
  const mapDiv = document.createElement("div");
  mapDiv.classList.add("map");
  mapDiv.id = "map"
  mapDiv.style.height = "250px";
  mapDiv.style.width = "100%";

  const mapContainer = document.getElementById("map-container");
  mapContainer.appendChild(mapDiv);

  var map = new Microsoft.Maps.Map(document.getElementById("map"), {
    credentials:
      "ApGxw1ZS3h-TmyLeeV4h8J-tXJjnEHKB6lW5ou7Nv7fH374ekbj54QP428A8QkOaA",
    center: new Microsoft.Maps.Location(31.9649, 34.8049),
    zoom: 10,
  });

  function addPushpin(latitude, longitude, name) {
    var location = new Microsoft.Maps.Location(latitude, longitude);
    var pin = new Microsoft.Maps.Pushpin(location);
    map.entities.push(pin);

    if (name) {
      var infobox = new Microsoft.Maps.Infobox(location, {
        title: name,
        visible: false,
      });

      Microsoft.Maps.Events.addHandler(pin, "click", function () {
        infobox.setOptions({ visible: true });
      });
      map.entities.push(infobox);
    }
  }

  const branches = await getBranches();
  branches.forEach((branch) => {
    addPushpin(branch.latitude, branch.longitude, branch.name);
  });
}
