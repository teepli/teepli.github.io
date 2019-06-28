document.addEventListener('DOMContentLoaded', function () {
    getVr();
    getStationsToArray();
}, false);

// Parse station code from URI-params
let paramsString = window.location.search;
let searchParams = new URLSearchParams(paramsString);
let city = searchParams.get("city");

const stationDatalist = document.getElementById("stations")

const stations = [];
const stationShorts = [];

/*Fetches json-data of trainstation shortcodes and corresponding station names
* Use: each city's index in array stations is equal to array stationShorts
* (also renders datalist for reasons unknown) */
function getStationsToArray() {
    fetch('https://rata.digitraffic.fi/api/v1/metadata/stations')
        .then((response) => response.json())
        .then(function (response) {
            return response.map(function (data) {
                stations.push(data.stationName);
                stationShorts.push(data.stationShortCode);
            })
        })
        .then(renderDatalist);
}


let url = 'https://rata.digitraffic.fi/api/v1/live-trains?arrived_trains=0&arriving_trains=0&departed_trains=0&departing_trains=100&station=' + city;

const currentCity = document.getElementById("city");
const trainTable = document.getElementById("trainTable");
const departureLink = document.getElementById("departure");

const arrivalLink = document.getElementById("arrival");

departureLink.innerHTML = '<a href="?city=' + city + '"> Lähtevät </a>';
arrivalLink.innerHTML = '<a href="../arrivals/?city=' + city + '"> Saapuvat </a>';

/*
* Fetches data from (digitraffic.fi)
* Filters out not passenger trains
* Sorts by time ascending
* Renders data to html
* @param url
*/
function getVr() {
    fetch(url)
        .then(response => response.json())
        .then(response => response.filter(value => value.trainCategory !== "Shunting"))
        .then(response => response.filter(value => value.trainCategory !== "Cargo"))
        .then(response => response.sort((a, b) =>
            new Date(b.timeTableRows[findCurrentStation(b)].scheduledTime) - new Date(a.timeTableRows[findCurrentStation(a)].scheduledTime)))
        .then(response => renderData(response))
        .catch(error => console.log(error));
}

/*
* findCurrentStation() is function to find index of current station (page currently at)
* @param json data
* @return index of station currently showing, use with data.timetablerows[]*/
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


/* Funtion for rendering data to html
* Creates table with 6 rows,
* TODO: clean horribad code
*
* @param json data
* @return table to html*/
function renderData(data) {
    trainTable.innerHTML = ""
    currentCity.innerHTML = "<a>" + cleanStationName(stations[stationShorts.indexOf(city)]) + "</a>";

    data.map(function (data) {
        let currentStationIndex = findCurrentStation(data);
        let lastIndexOfTimeTable;

        if (data.commuterLineID === "P" && data.timeTableRows[currentStationIndex].stationShortCode !== "LEN") {
            lastIndexOfTimeTable = handlePTrain(data.timeTableRows, currentStationIndex)
        } else if (data.commuterLineID === "I" && data.timeTableRows[currentStationIndex].stationShortCode !== "LEN") {
            lastIndexOfTimeTable = handlePTrain(data.timeTableRows, currentStationIndex)
        } else {
            lastIndexOfTimeTable = data.timeTableRows.length - 1;
        }

        let optiot = {hour: '2-digit', minute: '2-digit', hour12: false};

        let a = data.timeTableRows[currentStationIndex].scheduledTime;
        let scheduledTime = new Date(a).toLocaleString("fi", optiot);
        ;

        let b = data.timeTableRows[currentStationIndex].liveEstimateTime;
        let estimatedTime = new Date(b).toLocaleString("fi", optiot);
        ;
        estimatedTime = (b === undefined) ? scheduledTime : estimatedTime

        let c = data.timeTableRows[lastIndexOfTimeTable].scheduledTime;
        let arrivalTime = new Date(c).toLocaleString("fi", optiot);

        let stationCode = data.timeTableRows[currentStationIndex].stationShortCode
        let stationName = stations[stationShorts.indexOf(stationCode)]
        stationName = (stationName === undefined) ? "Ei saatavilla" : stationName;

        let lastStationCode = data.timeTableRows[lastIndexOfTimeTable].stationShortCode
        let lastStationName = stations[stationShorts.indexOf(lastStationCode)]
        lastStationName = (lastStationName === undefined) ? "Ei saatavilla" : lastStationName;

        stationName = cleanStationName(stationName)
        lastStationName = cleanStationName(lastStationName)

        let row = trainTable.insertRow(0);
        let cell1 = row.insertCell(0);
        let cell3 = row.insertCell(1);
        let cell4 = row.insertCell(2);
        let cell5 = row.insertCell(3);
        let cell6 = row.insertCell(4);
        let cell7 = row.insertCell(5);

        let commuterOrNot = (data.trainCategory === "Commuter") ? data.commuterLineID : data.trainType + data.trainNumber;
        cell1.innerHTML = '<a href="../YksittainenJuna/Juna.html?numero=' + data.trainNumber + '">'
            + commuterOrNot + '</a>';
        cell3.innerHTML = '<a href="?city=' + data.timeTableRows[lastIndexOfTimeTable].stationShortCode + '">'
            + lastStationName + '</a>';
        cell4.innerHTML = scheduledTime
        cell5.innerHTML = arrivalTime
        cell6.innerHTML = (scheduledTime !== estimatedTime) ? estimatedTime : "";
        cell6.style.color = "red";
        cell7.innerHTML = data.timeTableRows[currentStationIndex].commercialTrack
    })
}

/*
* cleanStationName() is helperfunction to clean abnormal station names
* @param Station name
* @return cleaned station name
* */
function cleanStationName(name) {
    name = name.replace("asema", "")
    name = name.replace("_(Finljandski)", "")
    name = name.replace("Lento", "Lentokenttä")
    return name;
}

/*
* handlePTrain() is helper function to handle circle lines I & P
* which returns incorrect arrival and/or departurestations if not handled
* @param json.timeTableRows
* @param index of current station/page currently at in arrays stationsShorts & stations
* @return index of Lentokenttä or if in way back, index of last station (Helsinki)
* */
function handlePTrain(data, index) {
    for (let i = index; i < data.length; i++) {
        if (data[i].stationShortCode === "LEN") {
            return i;
            console.log(i)
            break;
        }
    }
    return data.length - 1;
}

/*
* haedata() binded to search button in html
* takes value from datalist-text area
* redirects to new page with station shorcode as parameter*/
function haedata() {
    let stationInForm = document.getElementById("stationDatalist").value;
    let station = stationShorts[stations.indexOf(stationInForm)];
    document.getElementById("stationDatalist").value = station;
    city = station;
    window.location.href = "?city=" + city;
}

/*
* renderDatalist() fills datalist in hmtl
* with every station in array stationShorts/stations */
function renderDatalist() {
    stationShorts.forEach(function (station) {
        let option = document.createElement("option")
        option.value = stations[stationShorts.indexOf(station)]
        stationDatalist.appendChild(option)
    })
}
