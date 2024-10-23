let barraPosActual = 0, barraVelActual = 0, barraAceleActual = 0;
let esferaPosActual = 0, esferaVelActual = 0, esferaAceleActual = 0;
let l = 10;
let t = 0;
let dt = 0.2;

//Colores
let bgColor = "#F0F0F0", roofColor = "#686898", barColor = "#6EAA78", ejeColor = "#fff", resorteColor = "#666";

function setup() {
    let canvasDiv = document.getElementById('sim_container');
    let canvas = createCanvas(canvasDiv.offsetWidth, canvasDiv.offsetHeight);
    canvas.parent('sim_container');
    windowResized(); //Llamamos a esta función para asegurar que el canvas se ajuste correctamente
    //noLoop();
}

function windowResized() {
    let canvasDiv = document.getElementById('sim_container');
    resizeCanvas(canvasDiv.offsetWidth, canvasDiv.offsetHeight);
}

function draw() {
    //Cálculos del movimiento
    barraPosActual = Math.cos(t/20); //Ajusta la rotación de la barra
    esferaPosActual = 10*Math.cos(t); //Ajusta posición de la esfera
    //esferaPosActual =0;
    //barraPosActual=0;

    //Ajustes generales del canvas
    let drawBarLenght = l*20;
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
    drawSpring(-extremoIzqBarra_x/2, -195, -(extremoIzqBarra_x/2), -extremoIzqBarra_y-5, 50); //x1, y1; x2, y2, numCoils

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
    drawSpring(-extremoDerBarra_x/2, extremoDerBarra_y, -extremoDerBarra_x/2, extremoSuperiorEsfera_y, 25);//x1, y1; x2, y2, numCoils

    //Dibujar resorte 3
    drawSpring(-extremoDerBarra_x/2, extremoInferiorEsfera_y, -extremoDerBarra_x/2, 196, 25);//x1, y1; x2, y2, numCoils

    //Dibujar la esfera
    fill(roofColor);
    circle(-extremoDerBarra_x/2, esferaPosActual+defaultPosEsfera, 20);

    // Incrementa el tiempo
    t += dt;
}
// Función para dibujar el resorte
function drawSpring(x1, y1, x2, y2, numCoilss) 
{
    //line(x1, y1, x2, y2);
    let numCoils = numCoilss;
    let springLength = dist(x1, y1, x2, y2);
    let coilSpacing = springLength / numCoils;
    
    strokeWeight(2);
    stroke(resorteColor);
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