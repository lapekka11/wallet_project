//Constanti che definiscono gli slider per i valori del cambio di immagini sul personaggio

const headSlider = document.getElementById('headSlider');
const eyeSlider = document.getElementById('eyeSlider');
const torsoSlider = document.getElementById('torsoSlider');
const eyeColour = document.getElementById('eyeColour');
const outfitColour = document.getElementById('outfitColour');



//Constanti che identificano e storano le reference per le variabili di testo che verranno cambiate quando gli slider vengono utilizzati
const headText = document.getElementById('headText');
const eyesText = document.getElementById('eyesText');
const mouthText = document.getElementById('mouthText');
const torsoText = document.getElementById('torsoText');
const armText = document.getElementById('armText');
const legsText = document.getElementById('legsText');
const footText = document.getElementById('footText');


//Constanti con riferimenti alle imaggini che verrano cambiate a seconda dei valori degli slider
const head = document.getElementById('headImg');
const eyes = document.getElementById('eyeImg');
const torso = document.getElementById('torsoimg');
const leg1 = document.getElementById('leg1');
const leg2 = document.getElementById('leg2');




//Listener per lo slider della testa. Quando viene alterato il valore dell'imagine cambia
headSlider.addEventListener('input', function(event) {
    console.log('Slider value:', event.target.value);
    headText.innerHTML="Head: " + event.target.value;
    head.src = "images/head" + event.target.value + ".png";
    
});

//Listener per il valore degli occhi. Quando cambia, l'immagine cambia.
eyeSlider.addEventListener('input', function(event) {
    console.log('Slider value:', event.target.value);
    eyesText.innerHTML="Eyes: " + event.target.value;
    eyes.src = "images/eye" + event.target.value + ".png";
});


//Listener per il valore del torso. Quando cambia, l'immagine cambia.
torsoSlider.addEventListener('input', function(event) {
    console.log('Slider value:', event.target.value);
    torsoText.innerHTML="Torso: " + event.target.value;
    torso.src = "images/torso" + event.target.value + ".png";
});

//Listener per lo slider che appartiene al valore del colore degli occhi. Quando viene alterato il filtro sugli occhi viene alterato.
eyeColour.addEventListener('input', function(event) {
    console.log('Slider value:', event.target.value);
    eyeColourText.innerHTML="Eye colour: " + event.target.value;
    eyes.style.filter = "hue-rotate(" + event.target.value + "deg)"
});

//Listener per lo slider del colore outfit. Questo cambia il colore solo dell'outfit (non cambia testa, braccia o occhi)
outfitColour.addEventListener('input', function(event) {
    console.log('Slider value:', event.target.value);
    outfitColourText.innerHTML="Outfit RGB: " + event.target.value;
    torso.style.filter = "hue-rotate(" + event.target.value + "deg)"
    leg1.style.filter = "hue-rotate(" + event.target.value + "deg)"
    leg2.style.filter = "hue-rotate(" + event.target.value + "deg)"

});
