localStorage.clear();

function findCity() {
    var cityName = titleCase($("#cityName")[0].value.trim());

    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=71311474f5b26fb7bbfa0bc1985b90cd";

    fetch(apiURL).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                $("#cityName")[0].textContent = cityName + "(" + moment().format("DD/MM/YYYY") + ")";
            }
            )
        }
    }
    )
}
