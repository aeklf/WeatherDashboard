localStorage.clear();

function findCity() {
    var cityName = titleCase($("#cityName")[0].value.trim());

    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=71311474f5b26fb7bbfa0bc1985b90cd";

    fetch(apiURL).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                $("#cityName")[0].textContent = cityName + "(" + moment().format("DD/MM/YYYY") + ")";
                $("#cityList").append('<button type="button" class="list-group-item list-group-item-light list-group-item-action cityName">' + cityName);
           
                const lat = data.coord.lat;
                const lon = data.coord.lon;

                var latLonPair = lat.toString() + "" + lon.toString();

                localStorage.setItem(cityName, latLonPair);

                apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&units=imperial&appid=71311474f5b26fb7bbfa0bc1985b90cd";

                fetch(apiURL).then(function (newResponse){
                    if (newResponse.ok) {
                        newResponse.json().then(function (newData) {
                            getCurrentWeather(newData);
                        })
                    }
                })
            })
        } else {
            alert("Place Not Found x.x");
        }
    })
} 

function getListCity(coordinates) {
    apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + coordinates[0] + "&lon" + coordinates[1] + "&exclude=minutely,hourly&units=imperial&appid=71311474f5b26fb7bbfa0bc1985b90cd";

    fetch(apiURL).then(function (response) {
        if (response.ok) {
            response.json().then(function(data) {
                getCurrentWeather(data);
            }
        )}
    })
}

function getCurrentWeather(data) {
    $(".resultsPanel").addClass("visible");

    $("#currentIcon")[0].src = "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png";
    $("#temperature")[0].textContent = "Temperature:" + data.current.temp.toFixed(1) + " \u2109";
    $("#humidity")[0].textContent = "Humidity:" + data.current.humidity + "%";
    $("#windSpeed")[0].textContent = "Wind Speed:" + data.current.wind_speed.toFixed(1) + "MPH";
    $("uvIndex")[0].textContent = "" + data.current.uvi;

    if (data.current.uvi < 3) {
        $("#uvIndex").removeClass("moderate severe");
        $("#uvIndex").addClass("favorable");
    } else if (data.current.uvi < 6) {
        $("#uvIndex").removeClass("favorable severe");
        $("#uvIndex").addClass("moderate");
    } else {
        $("#uvIndex").removeClass("favorable moderate");
        $("#uvIndex").addClass("severe");
    }

    getFutureWeather(data);
}

function getFutureWeather(data) {
    for (var i = 0; i < 5; i++) {
        var futureWeather = {
            date: convertUnixTime (data, i),
            icon:  "http://openweathermap.org/img/wn/" + data.daily[i + 1].weather[0].icon + "@2x.png",
            temp: data.daily[i + 1].temp.day.toFixed(1),
            humidity: data.daily[i + 1].humidity
        }

        var currentSelector = "#day-" + i;
        $(currentSelector)[0].textContent = futureWeather.date;
        currentSelector = "#img-" + i;
        $(currentSelector)[0].src = futureWeather.icon;
        currentSelector = "#temp-" + i;
        $(currentSelector)[0].textContent = "Temp: " + futureWeather.temp + "\u2109";
        currentSelector = "#hum-" + i;
        $(currentSelector)[0].textContent = "Humidity: " + futureWeather.humidity + "%";
    }
}

// Casing for Location
function titleCase(city) {
    var updatedCity = city.toLowerCase().split(" ");
    var returnedCity = "";
    for (var i = 0; i < updatedCity.length; i++) {
        updatedCity[i] = updatedCity[i][0].toUpperCase() + updatedCity[i].slice(1);
        returnedCity += "" + updatedCity[i];
    }
    return returnedCity;
}

// Formatting for Time
function convertUnixTime(data, index) {
    const dateObject = new Date(data.daily[index + 1].dt * 1000);

    return (dateObject.toLocaleDateString());
}

$("#searchButton").on("click", function (e) {
    e.preventDefault();
    findCity();
    $("form")[0].reset();
})

$(".cityListBox").on("click", ".cityName", function() {
    var coordinates = (localStorage.getItem($(this)[0].textContent)).split(" ");
    coordinates[0] = parseFloat(coordinates[0]);
    coordinates[1] = parseFloat(coordinates[1]);

    $("#cityName")[0].textContent = $(this)[0].textContent + "(" + moment().format("DD/MM/YYYY") + ")";

    getListCity(coordinates);
})