//haetaan käyttäjän tiedot localStoragesta.
function haeEtunimentiedot() {
    var kirjautunut = localStorage.kirjautunutKayttaja;
    var kayttajaTiedot = JSON.parse(localStorage.getItem(kirjautunut));
    console.dir(kayttajaTiedot);
    //var etunimi = sessionStorage.etunimi;
    console.log("etunimi");
    var otsikko = document.getElementById("tervehdys");
    otsikko.innerHTML = "Olet kirjautunut nimellä " + kayttajaTiedot.etunimi + "!";
    console.log("miksi nimi ei tulostu?");
}

    haeEtunimentiedot();

    function avaaSivu() {
        localStorage.kirjautunutKayttaja = "";
        location.href = "Login.html";
    }
