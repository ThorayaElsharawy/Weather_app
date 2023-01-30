const wrapper = document.querySelector(".wrapper");
const inputPart = wrapper.querySelector(".input-part");
const infoText = inputPart.querySelector(".info-text");
const inputField = inputPart.querySelector("input");
const locationBtn = inputPart.querySelector("button");
const weatherIcon = document.querySelector(".Weather-part img");
const arrowBack = document.querySelector("header i");
const body = document.querySelector('body')

let apiKey = "cf4f6d40ffd2b6fcd9a54bf019efee3e";
let url;

arrowBack.addEventListener("click", () => {
  wrapper.classList.remove("active");
});

locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Your browser not support geolocation api");
  }
});

inputField.addEventListener("keyup", (e) => {
  if (e.key == "Enter" && inputField.value !== "") {
    requestApi(inputField.value);
  }
});

function onSuccess(position) {
  const { latitude, longitude } = position.coords;
  url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
  fetchData();
}

function onError(error) {
  infoText.innerHTML = `${error.message}`;
  infoText.classList.add("error");
}

function requestApi(city) {
  url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  fetchData();
}

function fetchData() {
  infoText.classList.add("pending");
  infoText.innerHTML = "Getting weather details....";

  fetch(url)
    .then((response) => response.json())
    .then((result) => weatherDetails(result));
}

function weatherDetails(info) {
  if (info.cod === "404") {
    infoText.classList.replace("pending", "error");
    return (infoText.innerHTML = `${inputField.value} is'n a vaild city name`);
  }

  infoText.classList.remove("pending", "error");
  wrapper.classList.add("active");

  const city = info.name;
  const country = info.sys.country;
  const { description, id } = info.weather[0];
  const { feels_like, humidity, temp } = info.main;

  wrapper.querySelector(".temp .numb").innerHTML = Math.floor(temp);
  wrapper.querySelector(".weather").innerHTML = description;
  wrapper.querySelector(".location span").innerHTML = `${city}, ${country}`;
  wrapper.querySelector(".temp .numb-2").innerHTML = Math.floor(feels_like);
  wrapper.querySelector(".humidity span").innerHTML = `${humidity} %`;

  if (id === 800) {
    weatherIcon.src = "./assets/Weather Icons/clear.svg";
  } else if (id >= 200 && id <= 232) {
    weatherIcon.src = "./assets/Weather Icons/storm.svg";
  } else if (id >= 600 && id <= 622) {
    weatherIcon.src = "./assets/Weather Icons/snow.svg";
  } else if (id >= 701 && id <= 781) {
    weatherIcon.src = "./assets/Weather Icons/haze.svg";
  } else if (id >= 801 && id <= 804) {
    weatherIcon.src = "./assets/Weather Icons/cloud.svg";
  } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
    weatherIcon.src = "./assets/Weather Icons/rain.svg";
  }

  console.log(info);
  console.log(id);
}
