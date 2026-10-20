const button = document.getElementById("btn_acquista");

button.addEventListener("click", () => {
    let eta = prompt("Inserisci eta':"),
        prezzo;

    if (
        eta == null || eta < 0 ||
        isNaN(eta) || eta.trim() == ""
    ){
        alert("Valore inserito non valido!");
        return;
    }

    if (eta < 5)
        prezzo = 0;
    else if (18 <= eta <= 25)
        prezzo = 3.50;
    else if (50 <= eta <= 55)
        prezzo = 5;
    else
        prezzo = 8;

    console.log(`${eta} anni - paghi ${prezzo.toFixed(2)}€`)
    alert(`${eta} anni - paghi ${prezzo.toFixed(2)}€`)
})