//
//
//
//
//  This is the code for the mapboxAPI - Created by Chris Ledford

//  Global variables
//  Coordinates of the users last destination
var lastDestinationCoords = [];
//  Variable to define starting point coordinates
var start = [-104.9922, 39.7453];
//  Variable to determine which mode of transportation the user wants to use
var mode = "driving";
//  Initial map layer ID
var layerID = "initialID";
//  initialization of lastTripDirections to store the previous directions for concatenation with a new set of directions
var lastTripDirections = "";
//  initialization of currentDestination for later use in directions instructions
var currentDestination = "";
//  initialization of previousDestination for later use in directions instructions
var previousDestination = "";

//  Mapbox info - This does all the work to create the map on page load
mapboxgl.accessToken = "pk.eyJ1IjoidmVzdXJvMzAiLCJhIjoiY2wzbWF1MXNwMDJ0MTNkbXV5b2Jsb29jbCJ9.XUukxisLocgMFsuDcyDoDQ";
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11', // map style
  center: [-104.9922, 39.7453], //  starting position
  zoom: 17  //  starting zoom level on page load.  This can be changed by a simple roll of the mouse wheel 
});


//  Set the boundaries of the map - this has been implemented to set the Colorado border as the bounds
//  You cannot view more than the state of Colorado with this functionality

const bounds = [
  [-109.02988935088155, 36.99671558478978],
  [-102.0743378757649, 40.972669291459]
];
map.setMaxBounds(bounds);



// map.addControl(
//   new MapboxDirections({
//       accessToken: mapboxgl.accessToken
//   }),
//   'top-left'
// );

//  Add an address search bar to the map.  
//  This will be used to search for locations, and could serve to set the start coords
// map.addControl(
//   new MapboxGeocoder({
//   accessToken: mapboxgl.accessToken,
//   mapboxgl: mapboxgl,
//   zoom: 18,
//   countries: "US",
//   enableGeolocation: true,
//   addressAccuracy: "street"
//   }), "top-left"
//   );








//  Hide HTML elements upon page load for later use
$("#destinationSearchBox").hide();
$("#waypointButton").hide();
$("#newStartButton").hide();
$("#destinationCardInstructions").hide();
//----------------------------------------------------------------------------------
// create a function to make a directions request
async function getRoute(end) 
{
  // make a directions request mode is the mode of travel start and end are coordinates
  const query = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/${mode}/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
    { method: 'GET' }
    );

    


  const json = await query.json();
  const data = json.routes[0];
  const route = data.geometry.coordinates;
  const geojson = {
    type: 'Feature',
    properties: {},
    geometry: 
    {
      type: 'LineString',
      coordinates: route
    }
  };
  //  If the route already exists on the map, it will be reset using setData
  if (map.getSource('route')) 
  {
    map.getSource('route').setData(geojson);
  }
  //  Else add a new request / destination.  Can we get these to chain?  Provide the user directions to one destination, and then another, and another, etc.
  else 
  {
    map.addLayer({
      id: 'route',
      type: 'line',
      source: {
        type: 'geojson',
        data: geojson
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        // route line size and color
        'line-color': '#3887be',
        'line-width': 5,
        'line-opacity': 0.75
      }
    });
  }

  // get the instructions div and add the route directions to it
const instructions = document.getElementById('instructions');
const steps = data.legs[0].steps;

let tripInstructions = '';
lastTripDirections = $("#instructions").html();
if(start[0] !== end[0] || start[1] !== end[1])
{
//  Loop to create each step of the route as its own list element
for (const step of steps) 
{
  tripInstructions += `<li>${step.maneuver.instruction}</li>`;
}
if(lastTripDirections)
{
  //  If there are existing directions for a last trip concatenate new trip directions to last trip directions
  instructions.innerHTML = lastTripDirections + `<h5>Directions from: ${previousDestination},</h5><h5>To: ${currentDestination}</h5><h6>Trip duration: ${Math.floor(data.duration / 60)} min ${mode}</h6><ol>${tripInstructions}</ol>`;
}
else{
//  Install initial trip directions and store them to lastTripDirections for later use
instructions.innerHTML = `<h5>Directions to: ${currentDestination}</h5><h6>Trip duration: ${Math.floor(data.duration / 60)} min ${mode}</h6><ol>${tripInstructions}</ol>`;
}
lastTripDirections = tripInstructions;
previousDestination = currentDestination;
}
}


//----------------------------------------------------------------------------------
//  Create click handler to handle getting the lat and long coordinates for the
//  destination, and adding a line to represent travel directions
  map.on('click', function(event)
  {
    mode = $("input[name='mapRadio']:checked").val();
    const coords = Object.keys(event.lngLat).map((key) => event.lngLat[key]);
    setDestination(coords);
  
  });


//---------------------------------------------------------------------------------------
//  Starting location submit handler
$("#searchBar").submit(function(e)
{
  e.preventDefault();
  
var searchText = encodeURI($("#search").val());
//  Geocoding API call - this limits the search results to the USA and also limits any search results to the bbox (boundary box)
//  established by the coordinates below.  Coordinates are for the SW and NE corners of Colorado encompassing the entire state
$.get("https://api.mapbox.com/geocoding/v5/mapbox.places/" + searchText + ".json?access_token=pk.eyJ1IjoidmVzdXJvMzAiLCJhIjoiY2wzbWF1MXNwMDJ0MTNkbXV5b2Jsb29jbCJ9.XUukxisLocgMFsuDcyDoDQ&country=us&autocomplete=true&bbox=-109.02988935088155,36.99671558478978,-102.0743378757649,40.972669291459", null, function(response)
{
  $("#searchSelect").empty().append("<option value=\"0\" selected>Select the starting location below</option>");

  for (let i = 0; i < 5; i++) {
    $("#searchSelect").append("<option value=" + response.features[i].geometry.coordinates[0] + ";" + response.features[i].geometry.coordinates[1] + ">" + response.features[i].place_name + "</option>")
  }
  $("#searchSelect").addClass("show");
  $("#destinationSearchBox").show();
  
});
});

//---------------------------------------------------------------------------------------
//  Destination submit handler
$("#destination").submit(function(e)
{
  e.preventDefault();
  
var searchText = encodeURI($("#searchD").val());
//  Geocoding API call - this limits the search results to the USA and also limits any search results to the bbox (boundary box)
//  established by the coordinates below.  Coordinates are for the SW and NE corners of Colorado encompassing the entire state
$.get("https://api.mapbox.com/geocoding/v5/mapbox.places/" + searchText + ".json?access_token=pk.eyJ1IjoidmVzdXJvMzAiLCJhIjoiY2wzbWF1MXNwMDJ0MTNkbXV5b2Jsb29jbCJ9.XUukxisLocgMFsuDcyDoDQ&country=us&autocomplete=true&bbox=-109.02988935088155,36.99671558478978,-102.0743378757649,40.972669291459", null, function(response)
{
  $("#searchSelectD").empty().append("<option value=\"0\" selected>Select your destination below</option>");

  for (let i = 0; i < 5; i++) {
    $("#searchSelectD").append("<option value=" + response.features[i].geometry.coordinates[0] + ";" + response.features[i].geometry.coordinates[1] + ">" + response.features[i].place_name + "</option>")
  }
  $("#searchSelectD").addClass("show"); 
});
});

//---------------------------------------------------------------------------------------
//  Starting location change handler - once the user has made a selection this handler
//  submits that selection as the starting location.

$("#searchSelect").change(function()
{
  var searchCoordinates = $("#searchSelect").val();
  start = searchCoordinates.split(";");
  setStartingPoint();
    //  allows the map to fly to, or center on the selected starting location
  map.flyTo({
    center: start,
    essential: true 
    });
});

//---------------------------------------------------------------------------------------

//  Destination location change handler - once the user has made a selection this handler
//  submits that selection as the destination.
$("#searchSelectD").change(function()
{
  mode = $("input[name='mapRadio']:checked").val();
  var searchCoordinates = $("#searchSelectD").val();
  var destinationCoords = searchCoordinates.split(";");
  setDestination(destinationCoords);
  //  allows the map to fly to, or center on the selected destination
  map.flyTo({
    center: destinationCoords,
    essential: true 
    });
    $("#searchBox").hide();
    $("#waypointButton").show();
    $("#newStartButton").show();
    currentDestination = searchSelectD.options[searchSelectD.selectedIndex].text
    $("#destinationCardTitle").html("Would you like to add another destination to your trip?");
    $("#destinationCardInstructions").show();
    $("#mapRadioTitle").hide();
});

//---------------------------------------------------------------------------------------
//  Function to set a starting point on the map. (blue dot)
function setStartingPoint()
{
  //  If there is already a layer with the current layerID, remove that layer
  //  and create a new unique layer so the user can view the starting and destination points
  if (map.getLayer(layerID)) 
  {
    map.removeLayer(layerID);
    layerID = `l${getTime()}`;
  }

  getRoute(start);
  $("#mapRadio").show();

 // Add starting point layer to the map
  map.addLayer({
    id: layerID,
    type: 'circle',
    source: {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: 
        [
          {
            type: 'Feature',
            properties: {},
            geometry: 
            {
              type: 'Point',
              coordinates: start
            }
          }
        ]
      }
    },
    paint: 
    {
      //  Marker size and color
      'circle-radius': 10,
      'circle-color': '#3887be'
    }
  });
  }


//---------------------------------------------------------------------------------------
//  Click handler for start from last destination button.  This button changes your starting point to
//  the last destination you selected.
$("#waypointButton").click(function()
{
  start = lastDestinationCoords;
  setStartingPoint();
});


//---------------------------------------------------------------------------------------
// function for setting a destination (red dot)
function setDestination(coords)
{
  lastDestinationCoords = coords;

  const end = {
    type: 'FeatureCollection',
    features: 
    [
      {
        type: 'Feature',
        properties: {},
        geometry: 
        {
          type: 'Point',
          coordinates: coords
        }
      }
    ]
  };
  if (map.getLayer('end')) 
  {
    map.getSource('end').setData(end);
  } 
  else 
  {
    map.addLayer({
      id: 'end',
      type: 'circle',
      source: 
      {
        type: 'geojson',
        data: 
        {
          type: 'FeatureCollection',
          features: 
          [
            {
              type: 'Feature',
              properties: {},
              geometry: 
              {
                type: 'Point',
                coordinates: coords
              }
            }
          ]
        }
      },
      paint: 
      {
        //  Marker size and color
        'circle-radius': 10,
        'circle-color': '#f30'
      }
    });
    $("#mapRadio").hide();
  }
  getRoute(coords);
}

//---------------------------------------------------------------------------------------
//  Click handler to show the search box again upon users request and allow the user to create 
//  a new starting location via the starting location search box
$("#newStartButton").click(function()
{
  $("#searchBox").show();
  $("#destinationCardInstructions").hide();
  $("#destinationCardTitle").html("Add another destination to your trip here.");
});

//---------------------------------------------------------------------------------------