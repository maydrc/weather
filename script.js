var defaultImage = "Images/mist-trees.jpg"; // default page image
var weatherImage = $("#weatherImage");
var overlay = $(".overlay");
var body = $("body");
var degF = $("#degF");
var degC = $("#degC");
var txtValue = $("#txt_value");
var icono = $("#icon");
var degree = $("#degree");
var units = "imperial"; // Fahrenheit will be the default metric
var iconLookupGeneric = { // OpenWeatherMap API- Weather Condition Codes (day)
  // Group 2xx: Thunderstorm
  200: "wi wi-thunderstorm", // thunderstorm with light rain
  201: "wi wi-thunderstorm", // thunderstorm with rain
  210: "wi wi-thunderstorm", // light thunderstorm
  221: "wi wi-thunderstorm", // ragged thunderstorm
  230: "wi wi-thunderstorm", // thunderstorm with Light drizzle
  231: "wi wi-thunderstorm", // thunderstorm with drizzle
  // Group 3xx: Drizzle
  300: "wi wi-sprinkle", // light intensity drizzle
  301: "wi wi-sprinkle", // drizzle
  311: "wi wi-raindrops", // drizzle rain
  // Group 5xx: Rain
  500: "wi wi-raindrops", // light rain
  504: "wi wi-hail", // extreme rain
  // Group 6xx: Snow
  611: "wi wi-sleet", // sleet
  // Group 7xx: Atmosphere
  701: "wi wi-cloudy-windy", // mist
  711: "wi wi-smoke", // smoke
  721: "wi wi-day-haze", // haze
  731: "wi wi-sandstorm", // sand, dust whirls
  751: "wi wi-sandstorm", // sand
  761: "wi wi-dust", // dust
  762: "wi wi-volcano", // volcanic ash
  781: "wi wi-tornado", // tornado
  // Group 800: Clear
  800: "wi wi-", // clear sky
  // Group 80x: Clouds
  801: "wi wi-night-partly-cloudy", // few clouds
  802: "wi wi-night-partly-cloudy", // scattered clouds
  803: "wi wi-cloudy", // broken clouds
  804: "wi wi-cloudy", // overcast clouds
  // Group 90x: Extreme
  900: "wi wi-tornado", // tornado
  901: "wi wi-hurricane", // tropical storm
  902: "wi wi-hurricane", // hurricane
  903: "wi wi-snowflake-cold", // cold
  904: "wi wi-hot", // hot
  905: "wi wi-windy", // windy
  // Group 9xx: Additional
  951: "wi wi-wind-beaufort-0", // calm
  952: "wi wi-wind-beaufort-2", // light breeze
  953: "wi wi-wind-beaufort-3", // gentle breeze
  954: "wi wi-wind-beaufort-4", // moderate breeze
  955: "wi wi-wind-beaufort-5", // fresh breeze
  956: "wi wi-wind-beaufort-6", // strong breeze
  957: "wi wi-wind-beaufort-7", // high wind, near gale
  958: "wi wi-gale-warning", // gale
  959: "wi wi-strong-wind", // severe gale
  961: "wi wi-wind-beaufort-11", // violent storm
  962: "wi wi-hurricane", // hurricane
};
var iconLookupDayOrNight = { // OpenWeatherMap API- Weather Condition Codes (night)
  // Group 2xx: Thunderstorm
  202: "wi wi--thunderstorm", // thunderstorm with heavy rain
  211: "wi wi--thunderstorm", // thunderstorm
  212: "wi wi--thunderstorm", // heavy thunderstorm
  232: "wi wi--thunderstorm", // thunderstorm with heavy drizzle
  // Group 3xx: Drizzle
  302: "wi wi--sprinkle", // heavy intensity drizzle
  310: "wi wi--sprinkle", // light intensity drizzle rain
  312: "wi wi--sprinkle", // heavy intensity drizzle rain
  313: "wi wi--sprinkle", // shower rain and drizzle
  314: "wi wi--sprinkle", // heavy shower rain and drizzle
  321: "wi wi--sprinkle", // shower drizzle
  // Group 5xx: Rain
  501: "wi wi--rain", // moderate rain
  502: "wi wi--rain-wind", // heavy intensity rain
  503: "wi wi--rain-wind", // very heavy rain
  511: "wi wi--rain-mix", // freezing rain
  520: "wi wi--showers", // light intensity shower rain
  521: "wi wi--showers", // shower rain
  522: "wi wi--showers", // heavy intensity shower rain
  531: "wi wi--showers", // ragged shower rain
  // Group 6xx: Snow
  600: "wi wi--snow", // light snow
  601: "wi wi--snow", // snow
  602: "wi wi--snow", // heavy snow
  612: "wi wi--sleet", // shower sleet
  615: "wi wi--rain-mix", // light rain and snow
  616: "wi wi--rain-mix", // rain and snow
  620: "wi wi--snow", // light shower snow
  621: "wi wi--snow", // shower snow
  622: "wi wi--snow", // heavy shower snow
  // Group 7xx: Atmosphere
  741: "wi wi--fog", // fog
  771: "wi wi--cloudy-gusts", // squalls
  // Group 90x: Extreme
  906: "wi wi--hail", // hail
  // Group 9xx: Additional
  960: "wi wi--storm-showers", // storm
};

function getGeolocation (units) {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        // overlay.removeClass("hidden");
        // body.addClass("no-scroll");
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        getWeather(units, lat, lon);
      }, function(err) {
        // console.log(err);
        // console.warn('ERROR(' + err.code + '): ' + err.message);
        alert(err.message);
        overlay.addClass("hidden");
        body.removeClass("no-scroll");
      });
  }
}

function getWeather (units, lat, lon, zipcode) {
  // listener to Check if an image is NOT loaded, when error it assigns defaultImage
  weatherImage.on('error', function() {
    // console.log("error loading image");
    weatherImage.attr("src", defaultImage);
  });

  var postalCode = "http://api.openweathermap.org/data/2.5/weather?units="+units+"&APPID=3bc5e73c064f2bd80cbb659295a843c8&zip="+zipcode+",us";
  var currentLocation = "http://api.openweathermap.org/data/2.5/weather?units="+units+"&APPID=3bc5e73c064f2bd80cbb659295a843c8&lat="+lat+"&lon="+lon;
  var query = currentLocation;
  if (zipcode) {
     query = postalCode;
  }
  // Open Weather API requires to create a free API key (3bc5e73c064f2bd80cbb659295a843c8)
  // Normally you want to avoid exposing API keys, but haven't been able to find a keyless API for weather
   $.getJSON(query, function(response) {
    console.log(response);
    var city = response.name;
    var country = response.sys.country;
    var weatherIcon = response.weather[0].id;
    var temperature = response.main.temp;
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
    // "Weather Icon - Search" starts here
    var icon = iconLookupGeneric[weatherIcon];
    if (weatherIcon === 800) { // TERNARY OPERATOR
      icon += (dayOrnight === "day") ? "day-sunny" : "night-clear"; // clear sky at day/night
    }
    if (!icon) { // when the icon is not "generic", insert "day" or "night"
      icon = iconLookupDayOrNight[weatherIcon];
      icon = icon.substring(0,6) + dayOrnight + icon.substring(6);
    }
    // "Weather Icon - Search" ends here
    // "displaying weater data" starts here
    $("#city").html(city);
    $("#country").html(country);
    icono.removeClass();
    icono.addClass(icon + " weatherIcon");
    $("#weatherDescription").html(weatherDescription);
    $("#temperature").html(temperature);
    degree.removeClass();
    degree.addClass("wi wi-fahrenheit icon");
    if (units === "metric") { //metric is Celsius
      degree.removeClass();
      degree.addClass("wi wi-celsius icon");
    }
    // "displaying weater data" ends here
    // "Image Search API" starts here
    var params = {
        // Request parameters
        "q": city + " " + weatherDescription + " " + dayOrnight,
        // "q": weatherDescription + " " + dayOrnight,
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
          weatherImage.attr("src", defaultImage);
          overlay.addClass("hidden");
          body.removeClass("no-scroll");
          return 0;
        }
        var searchImage = data.value[randomValue].contentUrl;
        weatherImage.attr("src", searchImage);
        overlay.addClass("hidden");
        body.removeClass("no-scroll");
    })
    .fail(function() { // if "Image Search API" call fails then assign defaultImage
        weatherImage.attr("src", defaultImage);
        overlay.addClass("hidden");
        body.removeClass("no-scroll");
    });
    // "Image Search API" ends here

  }, function(err) {
  // console.log(err);
  // console.warn('ERROR(' + err.code + '): ' + err.message);
  // alert(err.message);
  alert("Weather's Information is currently unavailable");
  overlay.addClass("hidden");
  body.removeClass("no-scroll");
  });
}

function callApis() {
  var zipcode = txtValue.val();
  var error = false;
  if (zipcode) {
    var isValid = /^\d{5}(?:[\s-]\d{4})?$/.test(zipcode);
    if (isValid) {
      getWeather (units, null, null, zipcode);
    } else {
      alert('Please enter a valid ZIP / Postal Code');
      error = true;
    }
  } else {
    getGeolocation(units);
  }
  if (!error) {
    overlay.removeClass("hidden");
    body.addClass("no-scroll");
  }
}

$(document).ready(function() {
  getGeolocation(units); //getting weather for current location when starting (or re-loading) the page
  degF.click(function() { //getting weather for current location when user clicks on the "F degrees"
    units = "imperial"; //imperial is Fahrenheit
    degF.addClass("selected");
    degC.removeClass("selected");
    callApis();
  });
  degC.click(function() { //getting weather for current location when user clicks on the "C degrees"
    units = "metric"; //metric is Celsius
    degC.addClass("selected");
    degF.removeClass("selected");
    callApis();
  });
  $("#mapMarkerIcon").click(function() { //getting weather for current location when user clicks on the map-marker
    txtValue.val("");
    callApis();
  });
  $("#search").click(function() { //getting weather for current location when user clicks on the map-marker
    callApis();
  });
  txtValue.keyup(function(event){ //Triggers the search button when clicking Enter key in the Zipcode text box
    if(event.keyCode == 13) {
        callApis();
    }
  });
});
