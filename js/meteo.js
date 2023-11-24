var temperature;
var wind_dir;
var wind_speed;
var is_day;
var weather_code;
var weather_description;
var weather_icon;
var list_of_weather_codes;

var date;
var date_options;
var date_formatter;
var french_date;

var first_load;


//Chargement de la page, envoi des requêtes JSON
document.addEventListener("DOMContentLoaded", function() {
    first_load = true;
    sendAPIRequest();
    sendWeatherCodesRequest();
})


function sendAPIRequest(){
    //Informations météos récupérées à partir de l'API MeteoFrance : https://open-meteo.com/en/docs/meteofrance-api#latitude=48.112&longitude=-1.6743&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=&timezone=Europe%2FBerlin
    //La latitude (48.112) et la longitude (-1.6743) renseignée sont celles de Rennes
    var requestURL = "https://api.open-meteo.com/v1/meteofrance?latitude=48.112&longitude=-1.6743&current=temperature_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,wind_direction_10m&timezone=Europe%2FBerlin";
    var requestWeather = new XMLHttpRequest();
    requestWeather.open("GET", requestURL);
    requestWeather.responseType = "json";
    requestWeather.send();

    requestWeather.onload = function () {
        var weather = requestWeather.response;
        getWeatherData(weather);
        //J'appelle fonction refresh et je démarre mon interval au premier chargement de la page
        if (first_load) {
            refresh();
            setInterval(refresh, 60000);
        }
    }
}


function sendWeatherCodesRequest(){
    //J'ai récupéré le fichier json suivant https://gist.github.com/stellasphere/9490c195ed2b53c707087c8c2db4ec0c et j'ai traduit les descriptions météos en français
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
    //A partir du fichier JSON généré, je stock les données météos dans les variables correspondantes
    temperature = jsonObj.current.temperature_2m + " " + jsonObj.current_units.temperature_2m;
    wind_dir = jsonObj.current.wind_direction_10m;
    wind_speed = jsonObj.current.wind_speed_10m + " " + jsonObj.current_units.wind_speed_10m;
    weather_code = jsonObj.current.weather_code;
    is_day = jsonObj.current.is_day;

    //Suivant le code météo et le cycle jour/nuit, je vais récupérer dans mon fichier json weather_code la description et l'icon météo correspondants
    if (is_day){
        weather_description = list_of_weather_codes[weather_code].day.description;
        weather_icon = list_of_weather_codes[weather_code].day.image;
    }
    else{
        weather_description = list_of_weather_codes[weather_code].night.description;
        weather_icon = list_of_weather_codes[weather_code].night.image;
    }
}


function refresh(){
    //Actualisation de la date et l'heure toutes les 60 secondes par l'action de mon Interval
    date = new Date();
    date_options = { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    formatter = new Intl.DateTimeFormat('fr-FR', date_options);    
    french_date = formatter.format(date);

    //Si la minute de ma date égal 0, cela signifie qu'une heure s'est passée et donc je renvoie une requête API afin de récupérer les données météo actuelle
    if (date.getMinutes() == 0 || first_load){
        first_load = false;
        sendAPIRequest();
        display("display all");
    }
    else{
        display("only hour");
    }
}


function display(elements){
    //Mise à jour de l'affichage suivant le paramètre renseigné
    switch (elements){
        case "display all":
            document.getElementById("time").innerHTML = french_date;
            document.getElementById("temp").innerHTML = temperature;
            document.getElementById("windIcon").style.transform = 'rotate('+ wind_dir + 'deg)';
            document.getElementById("windSpeed").innerHTML = wind_speed;
            document.getElementById("weatherDescription").innerHTML = weather_description;
            document.getElementById("weatherIcon").src = weather_icon;
            break;
        case "only hour":
            document.getElementById("time").innerHTML = french_date;
            break;
    }
}