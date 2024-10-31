const updateDataButton = document.getElementById("updateDataButton");
const startAnimButton = document.getElementById("startAnimButton");

const generalModeButton = document.getElementById("generalMode");
const firstModeButton = document.getElementById("firstMode");
const secondModeButton = document.getElementById("secondMode");

let currentMode = 0;
let isAnimationPlaying = false;

function initializeInput(inputId) 
{
    const input = document.getElementById(inputId);

    input.addEventListener("input", function() {
        updateDataButton.style.backgroundColor = "#e09363";
    });
}
/*
generalModeButton.style.backgroundColor = "#686898";
function vibrationMode_0()
{
    currentMode = 0;
    const data = {
        mode: currentMode
    };
    const onModeUpdated = new CustomEvent('modeUpdated', {
        detail: data
    });

    generalModeButton.style.backgroundColor = "#686898";
    firstModeButton.style.backgroundColor = "#7898a8";
    secondModeButton.style.backgroundColor = "#7898a8";

    document.dispatchEvent(onModeUpdated);
}
*//*
function vibrationMode_1()
{
    currentMode = 1;
    const data = {
        mode: currentMode
    };
    const onModeUpdated = new CustomEvent('modeUpdated', {
        detail: data
    });

    firstModeButton.style.backgroundColor = "#686898";
    generalModeButton.style.backgroundColor = "#7898a8";
    secondModeButton.style.backgroundColor = "#7898a8";

    document.dispatchEvent(onModeUpdated);
}

function vibrationMode_2()
{
    currentMode = 2;
    const data = {
        mode: currentMode
    };
    const onModeUpdated = new CustomEvent('modeUpdated', {
        detail: data
    });
    
    secondModeButton.style.backgroundColor = "#686898";
    firstModeButton.style.backgroundColor = "#7898a8";
    generalModeButton.style.backgroundColor = "#7898a8";

    document.dispatchEvent(onModeUpdated);
}
*/
//  almacena en una variable la información de los input range
function getInputData() {
    const data = {
        barra_masa: document.getElementById("bar_mass_input").value,
        barra_longitud: document.getElementById("bar_lenght_input").value,
        esfera_masa: document.getElementById("sphere_mass_input").value,
        k1: document.getElementById("k1_input").value,
        k2: document.getElementById("k2_input").value,
        k3: document.getElementById("k3_input").value,
        barra_pos_inicial: document.getElementById("bar_initial_pos_input").value,
        esfera_pos_inicial: document.getElementById("sphere_initial_pos_input").value
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
initializeInput("bar_initial_pos_input");
initializeInput("sphere_initial_pos_input");


updateDataButton.addEventListener("click", getInputData);
startAnimButton.addEventListener("click", startAnim);