var baseurl = "https://rata.digitraffic.fi/api/v1/live-trains/station/";
//  /live-trains/station/<departure_station_code>/<arrival_station_code>?departure_date=<departure_date>&from=<from>&to=<to>&limit=<limit>

//station names and shortcodes in arrays
const stationsOrg = [];
const stationShorts = [];
getStationsToArray();

function getStationsToArray() {
    fetch('https://rata.digitraffic.fi/api/v1/metadata/stations')
        .then((response) => response.json())
        .then(function (response) {
            return response.map(function (data) {
                if (data.passengerTraffic === true) {
                    stationsOrg.push(data.stationName);
                    stationShorts.push(data.stationShortCode);

                }
            })
        })
        .then(renderDatalist)
}

//station datalists
const departureDatalist = document.getElementById("departures")
const arrivalDatalist = document.getElementById("arrivals")

function renderDatalist() {
    stationShorts.forEach(function (station) {

        let option = document.createElement("option")
        option.value = stationsOrg[stationShorts.indexOf(station)]

        let option2 = document.createElement("option")
        option2.value = stationsOrg[stationShorts.indexOf(station)]

        arrivalDatalist.appendChild(option)
        departureDatalist.appendChild(option2)
    })
}

//read date and time from user
var input = '';
document.getElementById("date").addEventListener("change", function () {
    input = this.value;
    var dateEntered = new Date(input);
    console.log(input); //e.g. 2015-11-13
});
var timeinput = '';

document.getElementById("time").addEventListener("change", function () {
    timeinput = this.value;
    console.log(timeinput);
});

//printing out results in table
var lista = document.getElementById("trainTable");

var xhr = new XMLHttpRequest();
var arrivalStation = '';
var departureStation = '';

xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            var tulos = JSON.parse(xhr.responseText);
            console.dir(tulos);
            kasitteletulos(tulos);
        } else {
            alert("Pyyntö epäonnistui");
            document.getElementById("hae").innerText = "Reittiä ei löytynyt, tee uusi haku:";
        }
    }
};

function kasitteletulos(tulos) {
    while (lista.firstChild) {
        lista.removeChild(lista.firstChild);
    }
    var optiot = {hour: '2-digit', minute: '2-digit', hour12: false};
    for (var i = 0; i < tulos.length; ++i) {
        var elem = document.createElement("tr");
        var juna = tulos[i];
        var vikarivi = juna.timeTableRows[juna.timeTableRows.length - 1];
        var lahtoaikaAsemalta = "";
        var laituri = "";
        //departure time from station
        for (var j = 0; j < juna.timeTableRows.length; j++) {
            if (juna.timeTableRows[j].stationShortCode === departureStation && juna.timeTableRows[j].type === "DEPARTURE") {
                lahtoaikaAsemalta = new Date(juna.timeTableRows[j].scheduledTime).toLocaleTimeString("fi", optiot);
                laituri = juna.timeTableRows[j].commercialTrack;
            }
        }
        var maaraasema = stationsOrg[vikarivi.stationShortCode];
        if (!maaraasema) maaraasema = vikarivi.stationShortCode;

        maaraasema = stationsOrg[stationShorts.indexOf(maaraasema)];
        let maaraasemaCleaned = cleanStationName(maaraasema);

        // arrival time to destination
        for (var ind = 1; ind < juna.timeTableRows.length; ++ind) {
            if (juna.timeTableRows[ind].stationShortCode === arrivalStation) {
                var haettusaapumisaika = new Date(juna.timeTableRows[ind].scheduledTime).toLocaleTimeString("fi", optiot);
                break;
            }
        }
        var junatunnus = juna.trainCategory === "Commuter" ? juna.commuterLineID : juna.trainType + juna.trainNumber;
        var solut = [];
        //train type, commuter or other
        var junatyyppitd = document.createElement("td");
        var traintype = juna.trainCategory;
        if(traintype === "Commuter"){
            traintype = "Lähijuna";
        }else{
            traintype = "Kaukojuna";
        }
        junatyyppitd.innerText = traintype;

        solut.push(junatyyppitd);
        var junatunnustd = document.createElement("td");
        junatunnustd.innerHTML = '<a href="src/YksittainenJuna/Juna.html?numero=' + juna.trainNumber + '">' + junatunnus + '</a>'
        // junatunnustd.innerText = junatunnus;
        // junatunnustd.setAttribute("href", "../YksittainenJuna/Juna.html?numero=" + juna.trainNumber);
        solut.push(junatunnustd);
        var lahteetd = document.createElement("td");
        lahteetd.innerText = lahtoaikaAsemalta;
        solut.push(lahteetd);
        var perillatd = document.createElement("td");
        perillatd.innerText = haettusaapumisaika;
        solut.push(perillatd);
        solut.push(document.createElement("td"));
        var maaraasematd = document.createElement("td");
        maaraasematd.innerHTML = '<a href="src/departures/?city=' + vikarivi.stationShortCode + '">' + maaraasemaCleaned + '</a>'
        // maaraasematd.innerText = maaraasema;
        solut.push(maaraasematd);
        var lahtolaituritd = document.createElement("td");
        lahtolaituritd.innerText = laituri;
        solut.push(lahtolaituritd);

        for (var j = 0; j < solut.length; ++j) {
            elem.appendChild(solut[j]);
        }
        lista.appendChild(elem);
    }
    document.getElementById("hae").innerText = "Tee uusi haku: ";
}

//fetching data from rest
function haedata() {
    arrivalStation = document.getElementById("arrivalDatalist").value;
    arrivalStation = stationShorts[stationsOrg.indexOf(arrivalStation)];
    departureStation = document.getElementById("departureDatalist").value;
    departureStation = stationShorts[stationsOrg.indexOf(departureStation)];
    xhr.open('get', baseurl + departureStation + "/" + arrivalStation + "?startDate=" + input + "T" + timeinput + ":00%2B03:00");
    xhr.send();
}

function cleanStationName(name) {
    name = name.replace("asema", "")
    name = name.replace("_(Finljandski)", "")
    name = name.replace("Lento", "Lentokenttä")
    return name;
}




