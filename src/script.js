const openWeatherMapAppKey = "add key here"
const openCageDataAppKey = "add key here"

let weather = {
    apiKey: openWeatherMapAppKey,

    getWeatherData: function (location) {
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q=" + location +
            "&units=metric&appid=" + this.apiKey
        )
            .then((response) => {
                if (!response.ok) {
                    alert("No weather found.")
                    throw new Error("No weather found.")
                }
                return response.json()
            })
            .then((data) => this.displayWeather(data))
    },

    displayWeather: function (data) {
        const {name} = data
        const {icon, description} = data.weather[0]
        const {feels_like, temp, humidity} = data.main
        const {deg, speed} = data.wind
        document.querySelector(".city").innerText = "Weather in " + name
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png"
        document.querySelector(".description").innerText = description
        document.querySelector(".temp").innerText = temp + "°C"
        document.querySelector(".feels-like").innerText = "Feels like: " + feels_like + "°"
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%"
        document.querySelector(".wind").innerText = `Wind speed: ${speed} km/h, Degree: ${deg}°`
        document.querySelector(".weather").classList.remove("loading")
        document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?" + name + "')"
    },

    search: function () {
        this.getWeatherData(document.querySelector(".search-bar").value)
    },
}

let geocode = {
    reverseGeocode: function (latitude, longitude) {
        const apikey = openCageDataAppKey

        const api_url = "https://api.opencagedata.com/geocode/v1/json"

        const request_url = api_url + "?" + "key=" + apikey +
            "&q=" + encodeURIComponent(latitude + "," + longitude) +
            "&pretty=1" + "&no_annotations=1"

        const request = new XMLHttpRequest()
        request.open("GET", request_url, true)

        request.onload = function () {
            let data
            if (request.status === 200) {
                data = JSON.parse(request.responseText)
                weather.getWeatherData(data.results[0].components.city)
                console.log(data.results[0].components.city)
            } else if (request.status <= 500) {
                console.log("error code: " + request.status)
                data = JSON.parse(request.responseText)
                console.log("error msg: " + data.status.message)
            } else {
                console.log("server error")
            }
        }

        request.onerror = function () {
            console.log("unable to connect to server")
        }

        request.send()
    },

    getLocation: function () {
        function success(data) {
            geocode.reverseGeocode(data.coords.latitude, data.coords.longitude)
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, console.error)
        } else {
            weather.getWeatherData("Dhaka")
        }
    }
}

document
    .querySelector(".search button").addEventListener("click",
    function () {
        weather.search()
    })

document
    .querySelector(".search-bar")
    .addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            weather.search()
        }
    })

weather
    .getWeatherData("Dhaka")

document
    .querySelector(".search-bar")
    .addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            weather.search()
        }
    })

geocode.getLocation()