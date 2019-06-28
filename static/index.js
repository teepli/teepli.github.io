document.addEventListener('DOMContentLoaded', function () {
    getVr();
    getStationsToArray();
}, false);

var paramsString = window.location.search;
var searchParams = new URLSearchParams(paramsString);

const city = searchParams.get("city");
console.log(city)
const stations = [];
const stationShorts = [];

function getStationsToArray() {
    fetch('https://rata.digitraffic.fi/api/v1/metadata/stations')
        .then((response) => response.json())
        .then(function (response) {
            return response.map(function (data) {
                stations.push(data.stationName);
                stationShorts.push(data.stationShortCode);
            })
        })
}


let url = 'https://rata.digitraffic.fi/api/v1/live-trains?arrived_trains=0&arriving_trains=0&departed_trains=0&departing_trains=50&station='+city;

const trainTable = document.getElementById("trainTable");
const departureLink = document.getElementById("departure")

const arrivalLink = document.getElementById("arrival")

departureLink.innerHTML = '<a href="?city=' + city + '"> Lähtevät </a>';
arrivalLink.innerHTML = '<a href="../arrivals/?city=' + city + '"> Saapuvat </a>';


function getVr() {
    fetch(url)
        .then(response => response.json())
        .then(response => response.filter(value => value.trainCategory !== "Shunting"))
        .then(response => response.filter(value => value.trainCategory !== "Cargo"))
        .then( response => response.sort((a,b) =>
            new Date(b.timeTableRows[findCurrentStation(b)].scheduledTime) - new Date(a.timeTableRows[findCurrentStation(a)].scheduledTime)))
        .then(response => renderData(response))
        .catch(error => console.log(error));
}

function findCurrentStation(data) {
    let currentStationIndex = 0;
    for (let i = 0; i < data.timeTableRows.length; i++) {
        if (data.timeTableRows[i].stationShortCode === city && data.timeTableRows[i].type === "DEPARTURE") {
            currentStationIndex = i
            break;
        }
    }
    return currentStationIndex;
}

let traindata = [];
function renderData(data) {
    trainTable.innerHTML = ""
    traindata = data.map(x => x)

    data.map(function (data) {
        let currentStationIndex = findCurrentStation(data);
        let lastIndexOfTimeTable;

        if (data.commuterLineID === "P") {
            lastIndexOfTimeTable = handlePTrain(data.timeTableRows)
        } else {
            lastIndexOfTimeTable = data.timeTableRows.length - 1;
        }
        console.log(lastIndexOfTimeTable)

        let optiot = {hour: '2-digit', minute: '2-digit', hour12: false};

        let a = data.timeTableRows[currentStationIndex].scheduledTime;
        let scheduledTime = new Date(a).toLocaleString("fi", optiot);;

        let b = data.timeTableRows[currentStationIndex].liveEstimateTime;
        let estimatedTime = new Date(b).toLocaleString("fi", optiot);;
        estimatedTime = (b === undefined) ? scheduledTime : estimatedTime
        // console.log(data)
        let c = data.timeTableRows[lastIndexOfTimeTable].scheduledTime;
        let arrivalTime = new Date(c).toLocaleString("fi", optiot);

        let stationCode = data.timeTableRows[currentStationIndex].stationShortCode
        let stationName = stations[stationShorts.indexOf(stationCode)]
        stationName = (stationName === undefined) ? "Ei saatavilla" : stationName;

        let lastStationCode = data.timeTableRows[lastIndexOfTimeTable].stationShortCode
        let lastStationName = stations[stationShorts.indexOf(lastStationCode)]
        lastStationName = (lastStationName === undefined) ? "Ei saatavilla" : lastStationName;

        stationName = stationName.replace("asema", "");
        lastStationName = lastStationName.replace("asema", "");

        let row = trainTable.insertRow(0);
        let cell1 = row.insertCell(0);
        // let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(1);
        let cell4 = row.insertCell(2);
        let cell5 = row.insertCell(3);
        let cell6 = row.insertCell(4);

        cell1.innerHTML = data.trainType + data.trainNumber
        // cell2.innerHTML = '<a href="?city=' + data.timeTableRows[currentStationIndex].stationShortCode + '">'
        //     + stationName + '</a>'
        cell3.innerHTML = '<a href="?city=' + data.timeTableRows[lastIndexOfTimeTable].stationShortCode + '">'
            + lastStationName + '</a>';
        cell4.innerHTML = scheduledTime
        cell5.innerHTML = arrivalTime
        cell6.innerHTML = (scheduledTime !== estimatedTime) ? estimatedTime : "";
        cell6.style.color = "red";
    })
}

function handlePTrain(data) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].stationShortCode === "LEN") {
            return i;
            console.log(i)
            break;
        }
    }
}
// window.onscroll = function () {
//     myFunction()
// };
//
// let header = document.getElementById("myHeader");
// let sticky = header.offsetTop;
//
// function myFunction() {
//     if (window.pageYOffset > sticky) {
//         header.classList.add("sticky");
//     } else {
//         header.classList.remove("sticky");
//     }
// }
