//Datos de las entradas
let barra_l = 10;
let barra_m = 0;
let esfera_m = 0;
let k1 = 2;
let k2 = 1;
let k3 = 4;
let barra_pos_inicial = 0;
let esfera_pos_inicial = 0;

let I = 0;

//Datos Calculados
let barraPosActual = 0, barraVelActual = 0, barraAceleActual = 0;
let esferaPosActual = 0, esferaVelActual = 0, esferaAceleActual = 0;
let amplitud = 0;
//Datos sim
let t = 0;
let dt = 0.2;
modoVibracion = 0; //0 = general, 1 = primer modo vibración, 2 = segundo modo vibración

//Colores
let bgColor = "#F0F0F0", roofColor = "#686898", barColor = "#6EAA78", ejeColor = "#fff", resorte1Color = "#F00", resorte2Color = "#0F0",
    resorte3Color = "#00F", esferaColor = "#dd671e";

window.onload = function () {
    inicializarEcuaciones();
}

document.addEventListener('modeUpdated', function (e) {
    const inputData = e.detail;
    console.log('Modo vibración:', inputData);
    modoVibracion = parseInt(inputData.mode);
});

document.addEventListener('inputDataUpdated', function (e) {
    const inputData = e.detail;
    console.log('Datos recibidos:', inputData);
    barra_m = parseFloat(inputData.barra_masa);
    barra_l = parseFloat(inputData.barra_longitud);
    esfera_m = parseFloat(inputData.esfera_masa);
    k1 = parseFloat(inputData.k1);
    k2 = parseFloat(inputData.k2);
    k3 = parseFloat(inputData.k3);
    barra_pos_inicial = parseFloat(inputData.barra_pos_inicial);
    esfera_pos_inicial = parseFloat(inputData.esfera_pos_inicial);
    I = (barra_m * (barra_l * barra_l)) / 12;

    inicializarEcuaciones();
});

document.addEventListener('startAnimation', function (e) {
    pauseAnimation();
});

function setup() {
    let canvasDiv = document.getElementById('sim_container');
    let canvas = createCanvas(canvasDiv.offsetWidth, canvasDiv.offsetHeight);
    canvas.parent('sim_container');
    windowResized();
    noLoop();
}

function windowResized() {
    let canvasDiv = document.getElementById('sim_container');
    resizeCanvas(canvasDiv.offsetWidth, canvasDiv.offsetHeight);
}

/*
function draw() {
    //Cálculos del movimiento
    if(modoVibracion == 1){
        barraPosActual = Math.cos(t/4)/2;
        esferaPosActual = -10*Math.sin(t/4)/2;
    }
    else if(modoVibracion == 2){
        barraPosActual = Math.cos(t/4)/2;
        esferaPosActual = 10*Math.sin(t/4)/2;
    }
    else{
        barraPosActual = Math.cos(t/20); //Ajusta la rotación de la barra
        esferaPosActual = 10*Math.cos(t/4); //Ajusta posición de la esfera
    }

    //Ajustes generales del canvas
    let drawBarLenght = barra_l*20;
    if(drawBarLenght > 200) drawBarLenght = 200; 
    background(bgColor);
    noStroke();
    strokeWeight(1);

    // Dibuja el techo y piso
    fill(roofColor);
    rect(20, 0, 600, 8); //x, y, width, height
    rect(20, 400, 600, 8);

    // Traslada el sistema de coordenadas al origen de la barra
    translate(200 + (drawBarLenght / 2) - 20, 200 + 4);

    //Obtener coordenadas del extremo derecho de la barra
    let extremoIzqBarra_x = drawBarLenght * Math.cos(barraPosActual); //Coordenada en x del extremo izquierdo de la barra
    let extremoIzqBarra_y = drawBarLenght/2 * Math.sin(barraPosActual); //Coordenada en y del extremo izquierdo de la barra

    //Dibujar resorte 1
    drawSpring(-extremoIzqBarra_x/2, -195, -(extremoIzqBarra_x/2), -extremoIzqBarra_y-5, 50, resorte1Color); //x1, y1; x2, y2, numCoils

    // Rota el sistema de coordenadas
    rotate(barraPosActual);

    // Dibuja la barra
    fill(barColor);
    rect((-drawBarLenght / 2), -10, drawBarLenght, 20);

    // Dibuja el eje de rotación
    fill(ejeColor);
    circle(0, 0, 3);

    //Rotar el sistema a la posición original
    rotate(2*Math.PI-barraPosActual);

    //Obtener coordenadas del extremo derecho de la barra
    let extremoDerBarra_x = -drawBarLenght * Math.cos(barraPosActual); //Coordenada en x del extremo izquierdo de la barra
    let extremoDerBarra_y = drawBarLenght/2 * Math.sin(barraPosActual); //Coordenada en y del extremo izquierdo de la barra
    //fill("#000");
    //circle(-extremoDerBarra_x/2, extremoDerBarra_y, 5); //Punto ref

    //Obtener coordenadas de la distancia entre el extremo derecho de la barra y el suelo
    //circle(-extremoDerBarra_x/2, 196, 5); //Punto ref

    //Obtener un punto medio entre la barra y el suelo
    let defaultPosEsfera = (extremoDerBarra_y+196)/2;
    //fill("#f00");
    //circle(-extremoDerBarra_x/2, defaultPosEsfera, 10); //Punto ref

    //Translada el sistema de coordenadas al medio exacto entre la barra y el piso
    //translate(-extremoDerBarra_x/2, defaultPosEsfera);

    //Obtener coordenadas de los extremos superior e inferior de la esfera
    let extremoSuperiorEsfera_y = defaultPosEsfera+esferaPosActual-10;
    let extremoInferiorEsfera_y = defaultPosEsfera+esferaPosActual+10;
    //fill("#ff0");
    //circle(-extremoDerBarra_x/2, extremoSuperiorEsfera_y, 5); //Punto ref
    //circle(-extremoDerBarra_x/2, extremoInferiorEsfera_y, 5); //Punto ref

    //Dibujar resorte 2
    drawSpring(-extremoDerBarra_x/2, extremoDerBarra_y, -extremoDerBarra_x/2, extremoSuperiorEsfera_y, 25, resorte2Color);//x1, y1; x2, y2, numCoils

    //Dibujar resorte 3
    drawSpring(-extremoDerBarra_x/2, extremoInferiorEsfera_y, -extremoDerBarra_x/2, 196, 25, resorte3Color);//x1, y1; x2, y2, numCoils

    //Dibujar la esfera
    fill(esferaColor);
    circle(-extremoDerBarra_x/2, esferaPosActual+defaultPosEsfera, 20);

    // Incrementa el tiempo
    t += dt;
}

*/

function draw() {
    //Cálculos del movimiento
    if (modoVibracion == 1) {
        barraPosActual = Math.cos(t / 4) / 2;
        esferaPosActual = -10 * Math.sin(t / 4) / 2;
    }
    else if (modoVibracion == 2) {
        barraPosActual = Math.cos(t / 4) / 2;
        esferaPosActual = 10 * Math.sin(t / 4) / 2;
    }
    else {
        barraPosActual = Math.cos(t / 20); //Ajusta la rotación de la barra
        esferaPosActual = 10 * Math.cos(t / 4); //Ajusta posición de la esfera
    }

    //Ajustes generales del canvas
    let drawBarLenght = barra_l * 20;
    if (drawBarLenght > 200) drawBarLenght = 200;
    background(bgColor);
    noStroke();
    strokeWeight(1);

    // Dibuja el techo y piso
    fill(roofColor);
    rect(20, 0, 600, 8); //x, y, width, height
    rect(20, 400, 600, 8);

    // Traslada el sistema de coordenadas al origen de la barra
    translate(200 + (drawBarLenght / 2) - 20, 200 + 4);

    //Obtener coordenadas del extremo derecho de la barra
    let extremoIzqBarra_x = drawBarLenght * Math.cos(barraPosActual); //Coordenada en x del extremo izquierdo de la barra
    let extremoIzqBarra_y = drawBarLenght / 2 * Math.sin(barraPosActual); //Coordenada en y del extremo izquierdo de la barra

    //Dibujar resorte 1
    drawSpring(-drawBarLenght / 2, -195, -(extremoIzqBarra_x / 2), -extremoIzqBarra_y - 5, 50, resorte1Color); //x1, y1; x2, y2, numCoils
    //fill("#48e")
    //circle(-drawBarLenght/2, -195, 10);
    // Rota el sistema de coordenadas
    rotate(barraPosActual);

    // Dibuja la barra
    fill(barColor);
    rect((-drawBarLenght / 2), -10, drawBarLenght, 20);

    // Dibuja el eje de rotación
    fill(ejeColor);
    circle(0, 0, 3);

    //Rotar el sistema a la posición original
    rotate(2 * Math.PI - barraPosActual);

    //Obtener coordenadas del extremo derecho de la barra
    let extremoDerBarra_x = -drawBarLenght * Math.cos(barraPosActual); //Coordenada en x del extremo izquierdo de la barra
    let extremoDerBarra_y = drawBarLenght / 2 * Math.sin(barraPosActual); //Coordenada en y del extremo izquierdo de la barra
    //fill("#000");
    //circle(-extremoDerBarra_x/2, extremoDerBarra_y, 5); //Punto ref

    //Obtener coordenadas de la distancia entre el extremo derecho de la barra y el suelo
    //circle(-extremoDerBarra_x/2, 196, 5); //Punto ref

    //Obtener un punto medio entre la barra y el suelo
    let defaultPosEsfera_x = -((drawBarLenght / 2) + (-extremoDerBarra_x / 2)) / 2;
    let defaultPosEsfera_y = (extremoDerBarra_y + 196) / 2;
    fill("#f00");
    //circle(((drawBarLenght/2)+(-extremoDerBarra_x/2))/2, defaultPosEsfera_y, 10); //Punto ref
    //circle(0, 0, 20);
    //fill("#ff0");
    //circle((drawBarLenght/2), 0, 4);
    //circle((-extremoDerBarra_x/2), 0, 4);

    //Translada el sistema de coordenadas al medio exacto entre la barra y el piso
    //translate(-extremoDerBarra_x/2, defaultPosEsfera);

    //Obtener coordenadas de los extremos superior e inferior de la esfera
    let extremoSuperiorEsfera_y = defaultPosEsfera_y + esferaPosActual - 10;
    let extremoInferiorEsfera_y = defaultPosEsfera_y + esferaPosActual + 10;
    let extremoSuperiorEsfera_x = -defaultPosEsfera_x;
    let extremoInferiorEsfera_x = -defaultPosEsfera_x;
    //fill("#ff0");
    //circle(-extremoDerBarra_x/2, extremoSuperiorEsfera_y, 5); //Punto ref
    //circle(-extremoDerBarra_x/2, extremoInferiorEsfera_y, 5); //Punto ref

    //Dibujar resorte 2
    drawSpring(-extremoDerBarra_x / 2, extremoDerBarra_y, extremoSuperiorEsfera_x, extremoSuperiorEsfera_y, 25, resorte2Color);//x1, y1; x2, y2, numCoils

    //Dibujar resorte 3
    drawSpring(extremoSuperiorEsfera_x, extremoInferiorEsfera_y, drawBarLenght / 2, 196, 25, resorte3Color);//x1, y1; x2, y2, numCoils

    //Dibujar la esfera
    fill(esferaColor);
    circle(-defaultPosEsfera_x, esferaPosActual + defaultPosEsfera_y, 20);

    // Incrementa el tiempo
    t += dt;
}

function drawSpring(x1, y1, x2, y2, numCoilss, color) {
    //line(x1, y1, x2, y2);
    let numCoils = numCoilss;
    let springLength = dist(x1, y1, x2, y2);
    let coilSpacing = springLength / numCoils;

    strokeWeight(2);
    stroke(color);
    strokeJoin(ROUND);

    noFill();

    beginShape();
    for (let i = 0; i <= numCoils; i++) {
        let t = i / numCoils;
        let x = lerp(x1, x2, t);
        let y = lerp(y1, y2, t);
        if (i % 2 === 0) {
            vertex(x + 5, y);
        } else {
            vertex(x - 5, y);
        }
    }
    endShape();

    strokeWeight(1);
    noStroke();
}

function pauseAnimation() {
    if (isLooping()) {
        noLoop();
    }
    else {
        loop();
    }
}

function calcularFrecuenciasNaturales() {
    // Calcular coeficientes según las definiciones dadas
    let I = (barra_m * (barra_l * barra_l)) / 12;

    let a = I * esfera_m;  // a = Im

    let b = (-I * (k2 + k3) - esfera_m * (k1 * barra_l * barra_l / 4 + k2 * barra_l * barra_l / 4));  // b = (-I(k1 + k2) - m[kl²/4 + k1l²/4])

    let c = ((k1 * barra_l * barra_l / 4 + k2 * barra_l * barra_l / 4) * (k2 + k3) - Math.pow(k2 * barra_l / 2, 2));  // c = [kl²/4 + k1l²/4](k1 + k2) - (k1l/2)²

    // Calcular las frecuencias usando la fórmula cuadrática
    let omega1 = Math.sqrt((-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a));
    let omega2 = Math.sqrt((-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a));

    console.log('Freqs:', omega1, omega2);
    return [omega1, omega2];

}

function calcularAmplitud(omega) {


    let I = (barra_m * (barra_l * barra_l)) / 12;

    amplitud = (k2 * barra_l / 2) / [-I * omega * omega + k1 * (barra_l * barra_l / 4) + k2 * (barra_l * barra_l / 4)]; // A/B

    A = (k2 * barra_l / 2);
    B = [-I * omega * omega + k1 * (barra_l * barra_l / 4) + k2 * (barra_l * barra_l / 4)]

    //console.log('A/B = ' + amplitud);

    //console.log(`${A} ${B} ${A / B}`);

    console.log('----------------------------');

    return amplitud;

}

function calcularAmplitudes() {

}

function primerModoVibracion() {

}

//document.getElementById('').innerHTML = ``; //Fórmula document.getElementById('').innerHTML = ``; //Valor

function calcularAmplitudes(Theta0, X0, relacionA1B1, relacionA2B2) {

    // Resolver B1 y B2 usando las ecuaciones 1 y 2
    let B1 = (Theta0 - (relacionA2B2 * X0)) / (1 + relacionA2B2); 
    let B2 = X0 - B1; // De la segunda ecuación

    // Ahora calculamos A1 y A2
    let A1 = B1 / relacionA1B1;
    let A2 = B2 / relacionA2B2;

    console.log('----------------------------');
    console.log(`${Theta0}, ${X0}, ${relacionA1B1}, ${relacionA2B2}`);
    console.log(`A1 = ${A1.toFixed(3)}, B1 = ${B1.toFixed(3)}`);
    console.log(`A2 = ${A2.toFixed(3)}, B2 = ${B2.toFixed(3)}`);
    console.log('----------------------------');

    return { B1, A1, B2, A2 };

    //CALCULAR A2
    //A1 + A2 = θ
    //B1 + B2 = X

    
}

function inicializarEcuaciones() {
    //Variables
    let I = (barra_m * (barra_l * barra_l)) / 12;

    let a = I * esfera_m;  // a = Im

    let b = (-I * (k2 + k3) - esfera_m * (k1 * barra_l * barra_l / 4 + k2 * barra_l * barra_l / 4));  // b = (-I(k1 + k2) - m[kl²/4 + k1l²/4])

    let c = ((k1 * barra_l * barra_l / 4 + k2 * barra_l * barra_l / 4) * (k2 + k3) - Math.pow(k2 * barra_l / 2, 2));  // c = [kl²/4 + k1l²/4](k1 + k2) - (k1l/2)²

    // Calcular las frecuencias usando la fórmula cuadrática
    let omega1 = Math.sqrt((-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a));
    let omega2 = Math.sqrt((-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a));

    let amplitud1 = calcularAmplitud(omega1);
    let amplitud2 = calcularAmplitud(omega2);

    let amplitudes = calcularAmplitudes(barra_pos_inicial, esfera_pos_inicial, amplitud1, amplitud2);

    console.log('W = ' + omega1);

    //Lagrangriano
    document.getElementById('formula_lagrangiano').innerHTML = `L = (1/2)I(θ')² + (1/2)m(x')² - [(1/2)k₀(l/2θ)² + (1/2)k₁(l/2θ + x)² + (1/2)k₂x² + mgx]`; //Fórmula
    document.getElementById('formula_evaluada_lagrangiano').innerHTML = `L = (1/2)(${I.toFixed(3)})(θ')² + (1/2)(${esfera_m})(x')² - [(1/2)(${k1})(l/2θ)² + (1/2)(${k2})(l/2θ + x)² + (1/2)(${k3})x² + (${esfera_m})(9.8)x]`; //Valor

    //Ecuaciones Diferenciales
    document.getElementById('formula_ED_1').innerHTML = `I(θ'') + (k₀l²/4)θ + (k₁l²/4)θ + (k₁l/2)x = 0`; //Fórmula
    document.getElementById('formula_ED_2').innerHTML = `m(x'') + (k₁l/2)θ + (k₁ + k₂)x + mg = 0`; //Fórmula

    document.getElementById('formula_evaluada_ED_1').innerHTML = `I(θ'') + ((${k1})(${barra_l})²/4)θ + ((${k2})(${barra_l})²/4)θ + ((${k2})(${barra_l})/2)x = 0`; //valor
    document.getElementById('formula_evaluada_ED_2').innerHTML = `(${esfera_m})(x'') + ((${k2})(${barra_l})/2)θ + ((${k2}) + (${k3}))x + (${esfera_m})(9.8) = 0`; //Valor

    //Frecuencias naturales
    document.getElementById('formula_general_frecuencia_1').innerHTML = `aω⁴ + bω² + c = 0`; //Fórmula

    //Fórmula de a
    document.getElementById('formula_coeficiente_a').innerHTML = `a = Lm`; //Fórmula 
    document.getElementById('formula_evaluada_coeficiente_a').innerHTML = `a = ${a}`; //Valor

    //Fórmula de b
    document.getElementById('formula_coeficiente_b').innerHTML = `b = (-I(k₁ + k₂) - m[k₀l²/4 + k₁l²/4])`; //Fórmula 
    document.getElementById('formula_evaluada_coeficiente_b').innerHTML = `b = ${b}`; //Valor

    //Fórmula de c
    document.getElementById('formula_coeficiente_c').innerHTML = `c = [k₀l²/4 + k₁l²/4](k₁ + k₂) - (k₁l/2)²`; //Fórmula 
    document.getElementById('formula_evaluada_coeficiente_c').innerHTML = `c = ${c}`; //Valor

    //Fórmula w1 y w2
    document.getElementById('formula_evaluada_frecuencia_1').innerHTML = `ω₁ = ${omega1}`; //Valor
    document.getElementById('formula_evaluada_frecuencia_2').innerHTML = `ω₂ = ${omega2}`; //Valor


    document.getElementById('amplitud1').innerHTML = `A₁/B₁ = ${amplitud1}`; //Valor
    document.getElementById('amplitud2').innerHTML = `A₂/B₂ = ${amplitud2}`; //Valor

    //Fórmula sol de osciladores
    document.getElementById('formula_sol_ED_1').innerHTML = `θ(t) = A₁Cos(ω₁t + Φ) + A₂Cos(ω₂t + Φ)`; //Barra
    document.getElementById('formula_sol_ED_2').innerHTML = `X(t) = B₁Cos(ω₁t + Φ) + B₂Cos(ω₂t + Φ)`; //Esfera

    //MODOS DE VIBRACION
    document.getElementById('primer_modo').innerHTML = `θ₁(t) = ${amplitud1.toFixed(3)}B₁Cos(ω₁t) <br>
    X₁(t) = B₁Cos(ω₁t + Φ)`;
    document.getElementById('segundo_modo').innerHTML = `θ₂(t) = ${amplitud2.toFixed(3)}B₂Cos(ω₂t) <br>
    X₂(t) = B₂Cos(ω₂t + Φ)`;

    //EVALUANDO LAS AMPLITUDES
    document.getElementById('modo1').innerHTML = `θ₁(t) = ${amplitudes.A1.toFixed(3)}Cos(ω₁t) <br>
    X₁(t) = ${amplitudes.B1.toFixed(3)}Cos(ω₁t)`;

    document.getElementById('modo2').innerHTML = `θ₂(t) = ${amplitudes.A2.toFixed(3)}Cos(ω₂t) <br>
    X₂(t) = ${amplitudes.B2.toFixed(3)}Cos(ω₂t)`;
}