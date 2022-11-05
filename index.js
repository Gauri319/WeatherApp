const app=document.querySelector("#main-container");
const icon=document.querySelector(".icon1");
const search=document.querySelector(".search");
const btn=document.querySelector(".submit");
const form=document.querySelector("#SearchInput");
const MainInfoEl=document.querySelector(".main-info");
const ExtraInfoEl=document.querySelector("#extra-info");
const place=document.getElementById("time-Zone");
const country=document.getElementById("country");

const timeEl=document.getElementById("time");
const DateEl=document.getElementById("date");
const detailsEl=document.querySelector("#details");
const weather_forecast=document.getElementById("future-forecast");

var ctx=document.getElementById("mychart");

const days=['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];


// Code to show the Current Date and Time

setInterval(()=>{
    const time=new Date();
    const month=time.getMonth();
    const date=time.getDate();
    const day=time.getDay(); 
    const hour=time.getHours();
    const hoursIn12=hour>=13?hour%12:hour;
    const Minute=((time.getMinutes()).toString()).padStart(2,'0');
    const ampm=hour>=12?'PM':'AM';

    timeEl.innerHTML=((hoursIn12).toString()).padStart(2,'0')+":"+Minute+' '+`<span id="am-pm">${ampm}</span>`;

    DateEl.innerHTML=days[day]+','+date+' '+months[month];
},1000);

// Api key to featch the  Api
const API_KEY=`43617025d885774f9935f8a31ed7fbdf`;

// Geolocation.getCurrentPosition() method is used to get the current position of the device.
// showcoordinates A callback function that takes a GeolocationPosition object as its sole input parameter.

getCurrentLocation= function(){
  
    if (navigator.geolocation) {
        // alert("Please! ON Your Device Location");
        navigator.geolocation.getCurrentPosition(showcoordinates,error);

    } else {
        alert( "The browser doesn't support Geolocation.");
    }
}
function showcoordinates(myposition) {

        // when the current position of the  user is sucessfull get by hte navigator.geolocation the sucess callback is called and it givesor return
        //  a object of the current location . the coords is the inner object of that object and latitude and longitude is the
        //  properties of theat coords object


        let latitude= myposition.coords.latitude;
        let longitude=myposition.coords.longitude;

        // to feach the weather of any location using one call api we required the latitude and longitude of that location  and api key
        // this api is used only for get the city name of user using latitude or longitude

        // Current weather data
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
       .then(res=>res.json())
       .then(data=>{
            getWeather(data.name);
       }) 
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}
getCurrentLocation();





// this  code for if user enter any city then featch the weather of that city


form.addEventListener("submit",(event)=>{
    if(search.value.length==0){
        alert("Please! Enter city Name");
    }
    else{
        cityinput=search.value;
        console.log(search.value);

        getWeather(cityinput);
        search.value="";
    }
    event.preventDefault();
})







// this code for get all weather using city name
const getWeather = async(city) => {
    // Current weather data
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();
    showCityName(data);

    // One Call API 1.0
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&units=metric&appid=${API_KEY}`)
    .then(res=>res.json())
    .then(data=>{
        console.log(data)
        showeatherdata(data);
    })
    
}
function showeatherdata(data){
    // console.log(data);
    let{humidity,pressure,sunrise,sunset,wind_speed,feels_like,clouds}=data.current;

        detailsEl.innerHTML=`
                    <li>
                        <span>Humidity:</span>
                        <span id="humidity">${humidity}%</span>
                    </li>
                    <li>
                        <span>cloudy:</span>
                        <span id="cloud">${clouds}</span>
                    </li>
                    <li>
                        <span>Pressure:</span>
                        <span id="pressure">${pressure}</span>
                    </li>
                    <li>
                        <span>Feels_like:</span>
                        <span id="feel-like">${feels_like}</span>
                    </li>
                    <li>
                        <span>Wind speed:</span>
                        <span id="wind">${wind_speed}km/h</span>
                    </li>
                    <li>
                        <span>Sunrise:</span>
                        <span id="wind">${window.moment(sunrise*1000).format("HH:mm a")}</span>
                    </li>
                    <li>
                        <span>Sunset:</span>
                        <span id="wind">${window.moment(sunset*1000).format("HH:mm a")}</span>
                    </li>`
                  
            place.innerHTML=`${data.timezone}`;
              
    
            let otherDayForecast='';
            otherDayForecast+=` <legend>Daily weather</legend>`;
            data.daily.forEach((day)=> {
                    let day1=window.moment(day.dt*1000).format("ddd");
                    if(day1=="Sun"){
                        day1='Sunday'
                    }
                    else if(day1=="Mon"){
                        day1='Monday'
                    }
                    else if(day1=="Tue"){
                        day1='Tuesday'
                    }
                    else if(day1=="Wed"){
                        day1='Wednesday'
                    }
                    else if(day1=="Thu"){
                        day1='Thursday'
                    }
                    else if(day1=="Sat"){
                        day1='Saturday'
                    }
                    else if(day1=="Fri"){
                        day1='Friday';
                    }
                    otherDayForecast+=`
                    <div class="weather-forecast-item">
                        <div class="day">${day1}</div>
                        <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather-icon" class="w-icon">
                        <div class="temp">Night-${day.temp.night}&#176; C</div>
                        <div class="temp">Day-${day.temp.day}&#176; C</div>
                    </div> `
                
            });
            
            weather_forecast.innerHTML=otherDayForecast;


            // code for hourly data

            google.charts.load('current', {'packages':['corechart']});
            google.charts.setOnLoadCallback(drawChart);
      
            function drawChart() {
              var data1 = google.visualization.arrayToDataTable([
                
                ['temp', 'weather'],
                ['12AM',  data.hourly[0].temp],
                ['2AM',  data.hourly[5].temp],
                ['4AM',  data.hourly[10].temp],
                ['8AM',  data.hourly[15].temp],
                ['10AM',  data.hourly[20].temp],
                ['12PM',  data.hourly[25].temp],
                ['2PM', data.hourly[30].temp],
                ['4PM', data.hourly[35].temp],
                ['8PM', data.hourly[40].temp],
                ['10PM', data.hourly[45].temp]
              ]);
              var options = {
                hAxis: {
                  color: '#FFF',
                },
                vAxis: {minValue: 0,textStyle:{color: '#FFF'}},
              };
      
              var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
            //   chart.draw(data1, options);
              chart.draw(data1, { backgroundColor: { fill:'transparent' } })
            }

            // let timeofDay='day';
           
}
function showCityName(data){
    if(data.cod=='404'){
       alert("City Not Found !please try Another");
    }
    MainInfoEl.innerHTML=`
            <h1 class="name">${data.name},<span>${data.sys.country}</span></h1>
            <h1 id="temp"><img src="http://openweathermap.org/img/wn/10d@2x.png" alt="icon" width="50" height="50" class="img"><span> ${data.main.temp}&#176;C</span></h1>
            <span class="condition">${data.weather[0].description}</span> 
            <div id="extra-info">
            <ul>
                <li>Visibility:<span>${data.visibility}Km</span></li>
                <li>Pressure:<span>${data.main.pressure}</span></li>
                 <li>latitude:<span>${data.coord.lat}&#176;</span></li>
                 <li>longitude:<span>${data.coord.lon}km/h;</span></li>
   
            </ul>
        </div>`

    country.innerHTML=`${data.sys.country}`;   
}
