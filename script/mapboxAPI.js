//
//
//
//
//  This is the initial code for the mapboxAPI - CAL



//  Mapbox info - 
mapboxgl.accessToken = "pk.eyJ1IjoidmVzdXJvMzAiLCJhIjoiY2wzbWF1MXNwMDJ0MTNkbXV5b2Jsb29jbCJ9.XUukxisLocgMFsuDcyDoDQ";
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-104.9922, 39.7453], // starting position
  zoom: 17
});


//  Set the boundaries of the map - May implement this...
//  However, do we really want to limit the users interaction to ONLY the boundaries set forth,
//  or do we want to allow the user to select destinations all over the state of Colorado?
//  If we limit the boundaries we will only be able to allow the user to select destinations WITHIN
//  those boundaries.  If we leave th boundaries open, and just set an initial start point (center of the map)
//  we can force the map to START in the downtown area, but not be confined to the downtown Denver area.
//  What if the user wants to visit the mountains, or a ski resort, or any destination outside the downtown area?
//  If we enforce boundaries here the user will not be able to select areas/destinations outside the downtown area.



// const bounds = [
//   [-123.069003, 45.395273],
//   [-122.303707, 45.612333]
// ];
// map.setMaxBounds(bounds);



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







//  Variable to define starting point coordinates  --  Allow user to select this either by utilizing the users device location,
//  or allow user to input an address as their starting point ?
var lastDestinationCoords = [];
var start = [-104.9922, 39.7453];
var mode = "driving";
var layerID = "initialID";

//----------------------------------------------------------------------------------
// create a function to make a directions request
async function getRoute(end) 
{
  // make a directions request - this one uses cycling travel method -- (change or add variable to allow the user to select which mode of travel they would like to use)
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

if(start[0] !== end[0] || start[1] !== end[1])
{
//  Loop to create each step of the route as its own list element
for (const step of steps) 
{
  tripInstructions += `<li>${step.maneuver.instruction}</li>`;
}
//  ********  remove cycling icon/character and replace with a simple word describing the travel method   ********
instructions.innerHTML = `<p><strong>Trip duration: ${Math.floor(data.duration / 60)} min </strong></p><ol>${tripInstructions}</ol>`;
}
}

//---------------------------------------------------------------------------------
// map.on('load', function() 
// {
//   // make an initial directions request that
//   // starts and ends at the same location
//   getRoute(start);

//   // Add starting point to the map
//   map.addLayer({
//     id: 'point',
//     type: 'circle',
//     source: {
//       type: 'geojson',
//       data: {
//         type: 'FeatureCollection',
//         features: 
//         [
//           {
//             type: 'Feature',
//             properties: {},
//             geometry: 
//             {
//               type: 'Point',
//               coordinates: start
//             }
//           }
//         ]
//       }
//     },
//     paint: 
//     {
//       //  Marker size and color
//       'circle-radius': 10,
//       'circle-color': '#3887be'
//     }
//   });
  
// });



//----------------------------------------------------------------------------------
//  Create click handler to handle getting the lat and long coordinates for the
//  destination, and adding a line to represent travel directions
  map.on('click', function(event)
  {
    mode = $("input[name='mapRadio']:checked").val();
    const coords = Object.keys(event.lngLat).map((key) => event.lngLat[key]);
    setDestination(coords);
    // lastDestinationCoords = coords;

    // const end = {
    //   type: 'FeatureCollection',
    //   features: 
    //   [
    //     {
    //       type: 'Feature',
    //       properties: {},
    //       geometry: 
    //       {
    //         type: 'Point',
    //         coordinates: coords
    //       }
    //     }
    //   ]
    // };
    // if (map.getLayer('end')) 
    // {
    //   map.getSource('end').setData(end);
    // } 
    // else 
    // {
    //   map.addLayer({
    //     id: 'end',
    //     type: 'circle',
    //     source: 
    //     {
    //       type: 'geojson',
    //       data: 
    //       {
    //         type: 'FeatureCollection',
    //         features: 
    //         [
    //           {
    //             type: 'Feature',
    //             properties: {},
    //             geometry: 
    //             {
    //               type: 'Point',
    //               coordinates: coords
    //             }
    //           }
    //         ]
    //       }
    //     },
    //     paint: 
    //     {
    //       //  Marker size and color
    //       'circle-radius': 10,
    //       'circle-color': '#f30'
    //     }
    //   });
    //   $("#mapRadio").hide();
    // }
    // getRoute(coords);
  });


//---------------------------------------------------------------------------------------
$("#searchBar").submit(function(e)
{
  e.preventDefault();
  
var searchText = encodeURI($("#search").val());
$.get("https://api.mapbox.com/geocoding/v5/mapbox.places/" + searchText + ".json?access_token=pk.eyJ1IjoidmVzdXJvMzAiLCJhIjoiY2wzbWF1MXNwMDJ0MTNkbXV5b2Jsb29jbCJ9.XUukxisLocgMFsuDcyDoDQ&country=us", null, function(response)
{
  $("#searchSelect").empty().append("<option value=\"0\" selected>Select the starting location below</option>");

  for (let i = 0; i < 5; i++) {
    $("#searchSelect").append("<option value=" + response.features[i].geometry.coordinates[0] + ";" + response.features[i].geometry.coordinates[1] + ">" + response.features[i].place_name + "</option>")
  }
  $("#searchSelect").addClass("show");
});
});

//---------------------------------------------------------------------------------------
//  Destination submit handler
$("#destination").submit(function(e)
{
  e.preventDefault();
  
var searchText = encodeURI($("#searchD").val());
$.get("https://api.mapbox.com/geocoding/v5/mapbox.places/" + searchText + ".json?access_token=pk.eyJ1IjoidmVzdXJvMzAiLCJhIjoiY2wzbWF1MXNwMDJ0MTNkbXV5b2Jsb29jbCJ9.XUukxisLocgMFsuDcyDoDQ&country=us", null, function(response)
{
  $("#searchSelectD").empty().append("<option value=\"0\" selected>Select the starting location below</option>");

  for (let i = 0; i < 5; i++) {
    $("#searchSelectD").append("<option value=" + response.features[i].geometry.coordinates[0] + ";" + response.features[i].geometry.coordinates[1] + ">" + response.features[i].place_name + "</option>")
  }
  $("#searchSelectD").addClass("show");
});
});

//---------------------------------------------------------------------------------------
//  Starting location change handler

$("#searchSelect").change(function()
{
  var searchCoordinates = $("#searchSelect").val();
  start = searchCoordinates.split(";");
  setStartingPoint();
  map.flyTo({
    center: start,
    essential: true // this animation is considered essential with respect to prefers-reduced-motion
    });
});

//---------------------------------------------------------------------------------------

//  Destination change handler
$("#searchSelectD").change(function()
{
  var searchCoordinates = $("#searchSelectD").val();
  var destinationCoords = searchCoordinates.split(";");
  setDestination(destinationCoords);
  // setStartingPoint();
  map.flyTo({
    center: destinationCoords,
    essential: true // this animation is considered essential with respect to prefers-reduced-motion
    });
});

//---------------------------------------------------------------------------------------

function setStartingPoint()
{
  if (map.getLayer(layerID)) 
  {
    map.removeLayer(layerID);
    layerID = `l${getTime()}`;
  }

  getRoute(start);
  $("#mapRadio").show();

 // Add starting point to the map
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

$("#waypointButton").click(function()
{
  start = lastDestinationCoords;
  setStartingPoint();
});


//---------------------------------------------------------------------------------------
// function for setting a destination
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