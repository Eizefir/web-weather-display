var temperature;
var wind_dir;
var wind_speed;
var is_day;
var weather_code;
var weather_description;
var icon;
var list_of_weather_codes;

var date;
var hours;
var minutes;
var formatted_time;




function sendAPIRequest(){
    //https://open-meteo.com/en/docs/meteofrance-api#latitude=48.112&longitude=-1.6743&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=&timezone=Europe%2FBerlin
    var requestURL = "https://api.open-meteo.com/v1/meteofrance?latitude=48.112&longitude=-1.6743&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=Europe%2FBerlin";
    var requestWeather = new XMLHttpRequest();
    requestWeather.open("GET", requestURL);
    requestWeather.responseType = "json";
    requestWeather.send();

    requestWeather.onload = function () {
        var weather = requestWeather.response;
        getWeatherData(weather);
    }
}

function sendWeatherCodesRequest(){
    //https://gist.github.com/stellasphere/9490c195ed2b53c707087c8c2db4ec0c
    var jsonWeatherCodesRoot = "json/weather_codes.json";
    var requestWeatherCodes = new XMLHttpRequest();
    requestWeatherCodes.open("GET", jsonWeatherCodesRoot);
    requestWeatherCodes.responseType = "json";
    requestWeatherCodes.send();

    requestWeatherCodes.onload = function(){
        list_of_weather_codes = requestWeatherCodes.response;
    }
}



function getWeatherData(jsonObj) {
    temperature = jsonObj.current.temperature_2m + " " + jsonObj.current_units.temperature_2m;
    wind_dir = jsonObj.current.wind_direction_10m + " " + jsonObj.current_units.wind_direction_10m;
    wind_speed = jsonObj.current.wind_speed_10m + " " + jsonObj.current_units.wind_speed_10m;
    weather_code = jsonObj.current.weather_code;
    is_day = jsonObj.current.is_day;

    if (is_day){
        weather_description = list_of_weather_codes[weather_code].day.description;
        icon = list_of_weather_codes[weather_code].day.image;
    }
    else{
        weather_description = list_of_weather_codes[weather_code].night.description;
        icon = list_of_weather_codes[weather_code].night.image;
    }
    display();
}

function refresh(){
    date = new Date();
    hours = date.getHours();
    minutes = date.getMinutes();
    formatted_time = hours + ":" + (minutes < 10 ? "0" + minutes : minutes);

    if (minutes == 0){
        sendAPIRequest();
    }

    display();
}

function display(){
    document.getElementById("time").innerHTML = formatted_time;
    document.getElementById("temp").innerHTML = temperature;
    document.getElementById("wind_dir").innerHTML = wind_dir;
    document.getElementById("wind_speed").innerHTML = wind_speed;
    document.getElementById("weather_description").innerHTML = weather_description;
    document.getElementById("icon").src = icon;
    console.log("actualized");
}

document.addEventListener("DOMContentLoaded", function() {
    sendAPIRequest();
    sendWeatherCodesRequest();
    refresh();
    setInterval(refresh, 60000);
})