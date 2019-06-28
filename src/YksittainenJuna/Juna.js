
var asemanimet=[];
haeAsemanNimi();
var paramsString = window.location.search;
var searchParams = new URLSearchParams(paramsString);

const numero = searchParams.get("numero");

//Haetaan yksittäisen junan aikataulutiedot
function hae(){
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange=readystagechange;
    xhr.open("GET", "https://rata.digitraffic.fi/api/v1/trains/latest/"+numero);
    xhr.send();
}
function readystagechange() {
    if (xhr.readyState === 4) {
        var junat = JSON.parse(xhr.responseText);
        console.dir(junat)
        tulosta(junat);
    }
}
//Funktion renders  timetable of selected train to website
function tulosta(juna) {
    var tyyppi;
    for (var j of juna) {
        if (j.trainCategory === "Commuter") {
            tyyppi = "Lähi"
        } else {
            tyyppi = "Kauko";
        }
    }
// Here function checks whether train is a local train or long distance train
    for (var j of juna) {
        var otsikko = document.getElementById("otsikko");
        otsikko.innerHTML += tyyppi + "junan " + j.trainNumber + " aikataulut päivämäärällä  " + j.departureDate + " ovat seuraavat:"
        var myTrain = document.getElementById("myTrain");

//  Station name is changed from shortcode into real name.
        for (var i = 0; i < j.timeTableRows.length; i++) {
            var asema = j.timeTableRows[i].stationShortCode;
            for (a of asemanimet){
                if(asema === a.stationShortCode){
                    asema = a.stationName;
                }
            }
// And finally actual timetable is rendered
            if (j.timeTableRows[i].trainStopping == true) {
                var optiot = {hour: '2-digit', minute: '2-digit', hour12: false};
                aikakaksi = new Date(j.timeTableRows[i].scheduledTime).toLocaleTimeString("fi", optiot);

                if (i == j.timeTableRows.length - 1) {
                    aikalahtotoka = "Juna jää asemalle";
                } else {
                    aikalahtotoka = new Date(j.timeTableRows[i + 1].scheduledTime).toLocaleTimeString("fi", optiot);
                }

                if (i == 0) {
                    myTrain.innerHTML += "<tr><td><a href=../departures/index.html?city="+j.timeTableRows[i].stationShortCode+">" +asema+"</a></td><td>" + aikakaksi + "</td><td>" + aikakaksi + "</td>" +
                        "<td>" + j.timeTableRows[i].commercialTrack + "</td></tr>"
                }

                if (j.timeTableRows[i].type === "ARRIVAL") {

                    myTrain.innerHTML += "<tr><td><a href=../departures/index.html?city="+j.timeTableRows[i].stationShortCode+">"+ asema + "</a></td><td>" + aikakaksi + "</td><td>" + aikalahtotoka + "</td>" +
                        "<td>" + j.timeTableRows[i].commercialTrack + "</td></tr>"
                }
            }
        }


    }
}
//Funktion fetches trainstations names
    function haeAsemanNimi(){
        xh = new XMLHttpRequest();
        xh.onreadystatechange=readystagechangetoka;
        xh.open("GET", "https://rata.digitraffic.fi/api/v1/metadata/stations");
        xh.send();
    }
    function readystagechangetoka() {
        if (xh.readyState === 4) {
            var asemat = JSON.parse(xh.responseText);
            console.dir(asemat)
            asemanimet = asemat;
            console.log(asemanimet)
            hae();
        }
    }

