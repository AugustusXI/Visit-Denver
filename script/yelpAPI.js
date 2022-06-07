let yelpRequestURL = "https://api.yelp.com/v3/businesses/search?term=food,restaurants,drink,cafes&location=Denver&categories=food,restaurants,All"
let autocompleteURL = "https://api.yelp.com/v3/autocomplete?text=del&latitude=39.7392&longitude=104.9903"
let apiKey = 'pvzvB7jQZHeR9y2ed-VZ0rPwPWVnYYTMsXP7D4A3downW0uTM62QUVIahorS8voPTS18BK_LL4vc4tzQKba8wOlFgw5KSKu6c-y7kB59sYU0O0kCWDr1uJAlx9SOYnYx';

// jQuery.ajaxPrefilter(function(options) {
//   if (options.crossDomain && jQuery.support.cors) {
//     options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
//   }
// });

function saveSearch(event) 
{
  event.preventDefault();
  let coordinates = $("#searchSelectD").val().trim().split(";");
  console.log(coordinates[0]);
  console.log(coordinates[1]);
   
// $.get("https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/north-india-restaurant-san-francisco"), null, function(response){ console.log(response)};
  // fetch ("https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/north-india-restaurant-san-francisco", 
  // fetch ("https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?latitude=37.786882&longitude=-122.399972",
  fetch ("https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?latitude=" + coordinates[0] + "&longitude=" + coordinates[1], 
  {
    method: "GET",
    headers:
    {
      Authorization: `Bearer ${apiKey}`
    }
  })
  .then((response) => 
  {
    console.log(response)
    console.log("hello")
    if (response.ok) 
    {
      response.json().then(function (data) 
      {
        console.log(data)
        console.log(data.name)
      }
      )}
    })
  }

// $.ajax(
// {
//   url:"https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?latitude=37.786882&longitude=-122.399972",
//   method:"GET",
//   headers:
//   {
//     accept: application/json,
//     "Access-Control-Allow-Origin":"*",
//     Authorization: `Bearer ${apiKey}`
//   }
//   success: (function(response){
//   console.log(response);
//   })
// });






  
  $('#searchSelectD').change(saveSearch);
  
  
  // const foodSearchWrapper = document.querySelector(".nav-wrapper");
  // const foodSearchInput = document.getElementById("SearchD");
  // Function to search for local restaurants with autocomplete
  // foodSearchInput.onkeyup = (e)=>{
  //   // fetch(autocompleteURL)
  //   console.log(e.target.value)
  // }
  
  // autoComplete function(){
  //   GET https://api.yelp.com/v3/autocomplete?text=del&latitude=37.786882&longitude=-122.399972
  
  // }
  // fetch("https://api.yelp.com/v3/businesses/search")
  // .then