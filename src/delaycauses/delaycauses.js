var myohaiset=[];
var syyKoodit=[];

// Code for day selection from calendar
var input = '';
document.getElementById("paiva").addEventListener("change", function () {
    input = this.value;
    requested = new Date(input)
    today = new Date();
    var taulu = document.getElementById("trainTable")
    taulu.innerHTML=''
    if (requested >= today){
        taulu.innerHTML= "Älä kysele tulevaa!";
    }
    console.log(input)
    console.log(input); //e.g. 2015-11-13
    haeSyyt()});

//Function fetches delay cause categories and their explanations
function haeSyyt(){
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange=readystagechange;
    xhr.open("GET", "https://rata.digitraffic.fi/api/v1/metadata/detailed-cause-category-codes");
    xhr.send();
}
function readystagechange() {
    if (xhr.readyState === 4) {
        var syyt = JSON.parse(xhr.responseText);
        console.dir(syyt)
        syyKoodit = syyt;
        console.log("syyt");
        console.dir(syyKoodit)
        haePaivanJunat()
    }
}
//Function fetches all trains of selected day
function haePaivanJunat(){
    xh = new XMLHttpRequest();
    xh.onreadystatechange=readystagechangetoka;
    xh.open("GET", "https://rata.digitraffic.fi/api/v1/trains/"+input);
    xh.send();
}
function readystagechangetoka() {
    if (xh.readyState === 4) {
        var junat = JSON.parse(xh.responseText);
        console.dir(junat)
        myohaiset = junat;
        console.log("Myöhäiset:")
        console.dir(myohaiset);
        printtaa(myohaiset)
    }
}
//And finally delay causes are picked from data
function printtaa(syy) {
    var myohassa = document.getElementById("trainTable")
    for (j of syy) {
        console.log("tulostus");
        // Here an array within an array is put to variable "selitys"
        for (var i = 0;i< j.timeTableRows.length; i++)
            if (j.timeTableRows[i].causes.length > 0) {
                console.log(j.timeTableRows[i].causes);
                var selitys = [];
                selitys = j.timeTableRows[i].causes;
//From variable "selitys" cause codes are feched, changed into their real meaning and rendered for everyone to see
                for (se of selitys) {
                    var selittely = se.detailedCategoryCode;
                    for (s of syyKoodit)
                        if (selittely === s.detailedCategoryCode) {
                            selittely = s.detailedCategoryName;
                            myohassa.innerHTML += "<tr><td>" + j.trainType + " juna "+ j.trainNumber+" </td><td>" + selittely + "</td><td>"+j.timeTableRows[i].differenceInMinutes+"</td></tr>"
                        }

                }
            }
    }
}





