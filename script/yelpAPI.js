let yelpRequestURL = "https://api.yelp.com/v3/businesses/search?term=food,restaurants,drink,cafes&location=Denver&categories=food,restaurants,All"

let apiKey = '_PReAIxG28p6Iyda5XpILzYTUgknyFOJUKNnMs5o7fVPZTN8-WeDqcwTwA9VP9Ey9hCRkjVAZUVuBr25HRdsfTO9dd2YQdtv2RG6RLxMF4esVZIYD2630csV3mOVYnYx';


fetch(yelpRequestURL, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${apiKey}`,
  }
  .then(function (response) {
    return response.json();
  })
})