
function rekisteröidy() {
    location.href="Register.html";
}
var käyttäjätunnus;
var kayttaja;

function avaaSivu() {

     käyttäjätunnus=document.getElementById("sähköposti").value;
    console.log(käyttäjätunnus)


    var salasanayritys=document.getElementById("salasana").value;
    console.dir(document.getElementById("salasana"));
    //parsitaan käyttäjätiedot storagesta.
    kayttaja=JSON.parse(localStorage.getItem(käyttäjätunnus));
    tallennettusalasana = kayttaja.salasana
    console.log(tallennettusalasana);

    if (tallennettusalasana===salasanayritys) {
        console.log("kirjautuminen onnistui!");
        /*sessionStorage.kirjautunut=käyttäjätunnus;
        sessionStorage.etunimi=kayttaja.etunimi;
        sessionStorage.sukunimi=kayttaja.sukunimi;*/
        localStorage.kirjautunutKayttaja=käyttäjätunnus;
       //window.open("OmaSivu.html");
        location.href = "OmaSivu.html";
    }else{
        console.log("Salasana väärin!")
        window.alert("Salasana väärin, yritä uudestaan!");

    }
}

function peruuta() {
    //tähän linkki etusivulle
    location.href = "../frontpage/index.html";
}

function hassua() {
location.href = "https://en.wiktionary.org/wiki/hassua"
}