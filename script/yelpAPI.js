let yelpRequestURL = "https://api.yelp.com/v3/businesses/search?term=food,restaurants,drink,cafes&location=Denver&categories=food,restaurants,All"
let autocompleteURL = "https://api.yelp.com/v3/autocomplete?text=del&latitude=39.7392&longitude=104.9903"
let apiKey = 'pvzvB7jQZHeR9y2ed-VZ0rPwPWVnYYTMsXP7D4A3downW0uTM62QUVIahorS8voPTS18BK_LL4vc4tzQKba8wOlFgw5KSKu6c-y7kB59sYU0O0kCWDr1uJAlx9SOYnYx';

// ------------------------------------------------------------------------------
function saveSearch(event) 
{
  event.preventDefault();
  let coordinates = $("#searchSelectD").val().trim().split(";");
  let searchQuery = searchSelectD.options[searchSelectD.selectedIndex].text.split(",")
  searchQuery = searchQuery[0].replaceAll(" ", "-")
  console.log(searchQuery)
  console.log(searchSelectD.options[searchSelectD.selectedIndex].text)
  console.log(coordinates[0]);
  console.log(coordinates[1]);
   
    fetch ("https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=" + searchQuery + "&latitude=" + coordinates[1] + "&longitude=" + coordinates[0],
    {
      method: "GET",
      headers:
      {
        Authorization: `Bearer ${apiKey}`
      }
    })
    .then((result) => 
    {
      console.log(result)
      if (result.ok) 
      {
        result.json().then(function (data) 
        {
          console.log(data)
          console.log(data.businesses[0])
          getReviews(data.businesses[0].alias)
        }
        )}
        else{
          console.log(data.features[0].properties.address);
        } 
      })
  }

// ------------------------------------------------------------------------------
function getReviews(alias)
{
  fetch ("https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/" + alias + "/reviews",
  {
    method: "GET",
    headers:
    {
      Authorization: `Bearer ${apiKey}`
    }
  })
  .then((result) => 
    {
      console.log(result)
      if (result.ok) 
      {
        result.json().then(function (data) 
        {
          modalHandler();
          console.log(data);
        }
        )}
        else{
          // console.log(data.features[0].properties.address);
        } 
      })
}

// ------------------------------------------------------------------------------
//this is to make the api call on the selection of a destination
$('#searchSelectD').change(saveSearch);

// ------------------------------------------------------------------------------
function modalHandler() 
{
    // Get the modal
  var modal = $('#myModal');
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];
  console.log($('#searchD'))
  console.log(modal)
  // make modal display 
  modal.style.display = "block";
  
  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}