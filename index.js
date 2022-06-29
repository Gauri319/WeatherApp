const app=document.querySelector("#main-container");
//  const icon=document.querySelector(".icon");
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

const days=['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

const API_KEY=`43617025d885774f9935f8a31ed7fbdf`;

setInterval(()=>{
    const time=new Date();
    const month=time.getMonth();
    const date=time.getDate();
    const day=time.getDay(); 
    const hour=time.getHours();
    const hoursIn12=hour>=13?hour%12:hour;
    const Minute=time.getMinutes();
    const m=Minute<10?'0'+Minute:Minute;

    const ampm=hour>=12?'PM':'AM';

    timeEl.innerHTML=hoursIn12+":"+m+' '+`<span id="am-pm">${ampm}</span>`;

    DateEl.innerHTML=days[day]+','+date+' '+months[month];
},1000);

let latitude,longitude;
getweatherData();
function getweatherData(){
    navigator.geolocation.getCurrentPosition((sucess)=> {
       latitude=sucess.coords.latitude;
       longitude=sucess.coords.longitude;
       fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`).then(res=>res.json()).then(data=>{
        getWeather(data.name);
       }) 
    })
}


function showeatherdata(data){
    console.log(data);
       let{humidity,pressure,sunrise,sunset,wind_speed,feels_like,clouds,visibility,dew_point}=data.current;

       detailsEl.innerHTML=`
                    <h4>Weather Details</h4>
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

            ExtraInfoEl.innerHTML=`<ul>
                    <li>Visibility:<span>${visibility}Km</span></li>
                    <li>Dewpoint:<span>${dew_point}</span></li>
                    <li>latitude:<span>${data.lat}</span></li>
                    <li>longitude:<span>${data.lon}</span></li>
                    </ul>`; 
                    
            place.innerHTML=`${data.timezone}`;
              
    
                    let otherDayForecast='';
            data.daily.forEach((day,idx )=> {
                if(idx==0){

                }
                else{
                    otherDayForecast+=`
                    <div class="weather-forecast-item">
                        <div class="day">${window.moment(day.dt*1000).format("ddd")}</div>
                        <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather-icon" class="w-icon">
                        <div class="temp">Night-${day.temp.night}&#176; C</div>
                        <div class="temp">Day-${day.temp.day}&#176; C</div>
                    </div> `
                }
            });
            weather_forecast.innerHTML=otherDayForecast;

            // let timeofDay='day';
            const code=data.current.weather[0].id;

            if(code==800){
                app.style.backgroundImage='url(./images/day/clear.webp)';
                btn.style.background="#e5ba92"
            }
            else if(code>=801||code<=804){
                    app.style.backgroundImage=`url(./images/day/cloud.jpg)`;
                    btn.style.backgroundColor="#808080"

                }
            else if(code>=500||code<=531) {
                app.style.backgroundImage='url(./images/day/ranny.jpg)';
                btn.style.background="#fa6d1b"
            } 
            else{
                app.style.backgroundImage='url(./images/day/snowfall.jpg)';
                btn.style.background="#fa6d1b"
            }  
   }

let cityinput="London";
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

const getWeather = async(city) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();
    showWeather(data);

    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&units=metric&appid=${API_KEY}`).then(res=>res.json()).then(data=>{
        showeatherdata(data);
    })
    
}

function showWeather(data){
    console.log(data);
    MainInfoEl.innerHTML=`
            <h1 class="name">${data.name},<span>${data.sys.country}</span></h1>
            <h1 id="temp"><img src="images/icons/cloud.png" alt="icon" width="40" height="40" class="img"><span> ${data.main.temp}&#176;C</span></h1>
            <span class="condition">${data.weather[0].main}</span> `

    country.innerHTML=`${data.sys.country}`;        
}
