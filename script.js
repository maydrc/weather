$(document).ready(function() {

  var defaultImage = "Images/mist-trees.jpg"; // default page image

  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {

        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        var units = "imperial"; // imperial is Fahrenheit, metric is Celsius

        // Open Weather API requires to create a free API key (3bc5e73c064f2bd80cbb659295a843c8)
        // Normally you want to avoid exposing API keys, but haven't been able to find a keyless API for weather
        $.getJSON("http://api.openweathermap.org/data/2.5/weather?units="+units+"&APPID=3bc5e73c064f2bd80cbb659295a843c8&lat=" + lat + "&lon=" + lon, function(response) {

            console.log(response);
            var city = response.name;
            var country = response.sys.country;
            // determining "date-time" starts here
            var weatherDescription = response.weather[0].description;
            var sunrise = new Date(response.sys.sunrise*1000);
            var sunset = new Date(response.sys.sunset*1000);
            var now = new Date();
            if (sunset.getDate() !== now.getDate()) {
              sunrise.setDate(sunrise.getDate()-1);
              sunset.setDate(sunset.getDate()-1);
            }
            var dayOrnight = "night";
            if (now >= sunrise && now <= sunset) {
               dayOrnight = "day";
            }
            // determining "date-time" ends here

           // "Image Search API" starts here
            var params = {
                // Request parameters
                // "q": city + " " + weatherDescription + " " + dayOrnight,
                "q": weatherDescription + " " + dayOrnight,
                "count": "10",
                "offset": "0",
                "mkt": "en-us",
                "safeSearch": "Moderate",
                // "size": "Wallpaper",
                "width": "1024",
                "Image Type": "Photo",
                "aspect": "Wide",
            };
            $.ajax({
                url: "https://bingapis.azure-api.net/api/v5/images/search?" + $.param(params),
                beforeSend: function(xhrObj){
                    // Request headers
                    // API Key 8e08ac9c8cc64e3bb88ff311ea1b77e9
                    xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","8e08ac9c8cc64e3bb88ff311ea1b77e9");
                },
                type: "GET",
                // Request body
                data: "{body}",
            })
            .done(function(data) {
                console.log(data);
                // getting a ramdom image
                var imageArray = data.value.length-1;
                var randomValue = Math.floor(Math.random() * (imageArray - 0 + 1)) + 0;
                if (imageArray < 0) { // if search doesn't return an image then assign defaultImage
                  $("#weatherImage").attr("src", defaultImage);
                  return 0;
                }
                var searchImage = data.value[randomValue].contentUrl;
                $("#weatherImage").attr("src", searchImage);
            })
            .fail(function() { // if "Image Search API" call fails then assign defaultImage
                $("#weatherImage").attr("src", defaultImage);
            });
            // "Image Search API" ends here

        });
      });
  }
});
