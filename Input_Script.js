const updateDataButton = document.getElementById("updateDataButton");
const startAnimButton = document.getElementById("startAnimButton");
let isAnimationPlaying = false;

//  inicializa los sliders a conveniencia, recibe el id del range y del texto mostrado en pantalla, además de un máximo y un mínimo para los valores iniciales
function initializeInput(inputId) 
{
    const input = document.getElementById(inputId);

    input.addEventListener("input", function() {
        updateDataButton.style.backgroundColor = "#e09363";
    });
}

//  almacena en una variable la información de los input range
function getInputData() {
    const data = {
        barra_masa: document.getElementById("bar_mass_input").value,
        barra_longitud: document.getElementById("bar_lenght_input").value,
        esfera_masa: document.getElementById("sphere_mass_input").value,
        k1: document.getElementById("k1_input").value,
        k2: document.getElementById("k2_input").value,
        k3: document.getElementById("k3_input").value
    };
    //  pasar esta información al otro script
    const onInputDataUpdated = new CustomEvent('inputDataUpdated', {
        detail: data
    });
    updateDataButton.style.backgroundColor = "#7898a8";
    // dispara el evento
    document.dispatchEvent(onInputDataUpdated);
}

function startAnim()
{
    const onStartAnimation = new CustomEvent('startAnimation');

    if(isAnimationPlaying) {
        startAnimButton.innerHTML = "Reanudar Animación";
        isAnimationPlaying = false;
    }
    else {
        startAnimButton.innerHTML = "Pausar Animación";
        isAnimationPlaying = true;
    }

    document.dispatchEvent(onStartAnimation);
}

initializeInput("bar_mass_input");
initializeInput("bar_lenght_input");
initializeInput("sphere_mass_input");
initializeInput("k1_input");
initializeInput("k2_input");
initializeInput("k3_input");


updateDataButton.addEventListener("click", getInputData);
startAnimButton.addEventListener("click", startAnim);