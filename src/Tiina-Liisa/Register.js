function save() {
    console.log("Save")
// haetaan käyttäjätunnus (sähköposti) etc. html lomakkeesta.
    var käyttäjätunnus = document.getElementById("sähköposti").value;
    console.log(käyttäjätunnus)
    var emailValue = document.getElementById('sähköposti').value;
    console.log(emailValue);
    var salasanaValue = document.getElementById('salasana').value;
    console.log(salasanaValue);
    var salasanaUudelleenValue = document.getElementById('SalasanaUudelleen').value;
    console.log(salasanaUudelleenValue);
    var etunimiValue = document.getElementById('etunimi').value;
    console.log(etunimiValue);
    var sukunimiValue = document.getElementById('sukunimi').value;
    console.log(sukunimiValue);
    // asetetaan käyttäjätunnukselle JSONin avulla arvoksi salasana, etunimi ja sukunimi.
    var kayttajaJSON = `{"salasana":"${salasanaValue}", "etunimi":"${etunimiValue}", "sukunimi":"${sukunimiValue}"}`;
    localStorage.setItem(emailValue, kayttajaJSON);

    //tarkistetaan onko salasana oikein.
    if (salasanaValue == salasanaUudelleenValue) {
        console.log("Olet nyt rekisteröitynyt!");
        localStorage.kirjautunutKayttaja=emailValue;
        location.href = "OmaSivu.html";
    } else {
        console.log("Antamasi salasanat eivät täsmää!")
        window.alert("Antamasi salasanat eivät täsmää, yritä uudelleen!");

    }
}