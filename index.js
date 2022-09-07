
const letrasEquivocadas = document.getElementById('letras-equivocadas');
const palabrasSecretas = ['CSS','HTML','ORACLE','BUG','MOUSE','MYSQL','JAVA','RELOJ','HOLA','CHAU','PERRO','GATO','PAJARO'];
var letrasIngresadas = [];
var letrasIncorrectas = [];
let palabraSecreta="";
var palabraIngresada = ["","","","","","","",""];
let intentos = 0;
let intentosMax = 9;
var letraCapturada = "";


//MUESTRA EL INICIO DEL JUEGO
function inicio(){
    document.getElementById("main-juego").style.display = "none";
    document.getElementById("main-ppal").style.display = "block";
    document.getElementById("main-palabra").style.display = "none";
}

//MUESTRA LA PAGINA DEL JUEGO
function muestraJuego(){
    document.getElementById("main-juego").style.display = "block";
    document.getElementById("main-ppal").style.display = "none";
    document.getElementById("main-palabra").style.display = "none";
}

//MUESTRA LA PAGINA DE AGREGAR PALABRA
function agregarPalabra(){
    document.getElementById("main-juego").style.display = "none";
    document.getElementById("main-ppal").style.display = "none";
    document.getElementById("main-palabra").style.display = "block";
}

//COMIENZA UN NUEVO JUEGO
function nuevoJuego(){
    intentos = 0;
    limpiarDibujo();
    sortearPalabra();
    muestraJuego();
    dibujarInicio();
    ocultarPerdio();
    ocultarGano();
    ocultarPalabra();
    letraCapturada="";
    letrasIngresadas=[];
    letrasIncorrectas=[];
    palabraIngresada = ["","","","","","","",""];
    document.getElementById("mobile").value="";
    letrasEquivocadas.textContent="";
    detectarPresionada();
    dibujarLineas(palabraSecreta);
}


//GUARDA LA PALABRA INGRESADA POR EL USUARIO
function guardarPalabra(){
    let entrada = document.getElementById("ingreso").value;

    if(!controlarCantidad(entrada) && esMayusculas(entrada)){
        palabrasSecretas.push(entrada);
        nuevoJuego();
    }
    else{
        document.getElementById("advertencia").style.display = "block";
    }
}          

//SI LA PALABRA TIENE MAS DE 8 LETRAS DEVUELVE TRUE
function controlarCantidad(palabra){
    return palabra.length > 8;
}

//COMPRUEBA SI UNA CADENA SE INGRESO CON LETRAS MAYUSCULAS
function esMayusculas(palabra){
    var patron = new RegExp("^[A-Z\\s]+$");
    return patron.test(palabra);
}


//DEVUELVE UNA PALABRA SORTEADA
function sortearPalabra(){
    let indice = Math.round(Math.random()*palabrasSecretas.length);
    palabraSecreta = palabrasSecretas[indice];
    console.log("palabra elegida "+palabraSecreta);
}

//COMPRUEBA SI ES UNA LETRA O NO
function esLetra (caracter){
    var patron = new RegExp("^[A-Za-z]+$");
    return patron.test(caracter);
}

//COMPRUEBA SI LA CADENA CONTIENE LA LETRA INGRESADA
function esLetraCorrecta(letra){
    return palabraSecreta.indexOf(letra.toUpperCase()) !== -1;
}

//COMPRUEBA SI UNA LETRA YA FUE INGRESADA
function esRepetida(letra){
    return letrasIngresadas.indexOf(letra) !== -1;
}

//MUESTRA LA PALABRA SECRETA
function mostrarPalabra(){
    document.getElementById("cartel-palabra").style.display = "block";
    document.getElementById("palabra-perdida").innerHTML = palabraSecreta;
}

//OCULTA LA PALABRA SECRETA
function ocultarPalabra(){
    document.getElementById("cartel-palabra").style.display = "none";
}


//EVENTO QUE ESPERA A QUE CUALQUIER TECLA SEA PRESIONADA
function detectarPresionada(){
        document.addEventListener('keydown', (event) => {
            letraCapturada = event.key;

            if(intentos<intentosMax){
                if(esLetra(letraCapturada) && !esRepetida(letraCapturada)){

                    //SE AGREGA AL ARRAY LA LETRA CAPTURADA SEA O NO CORRECTA
                    letrasIngresadas.push(letraCapturada);

                    if(esLetraCorrecta(letraCapturada)){
                        for(i = 0 ; i< palabraSecreta.length; i++){
                            if(palabraSecreta[i] == letraCapturada.toUpperCase()){
                                palabraIngresada.splice(i,1,letraCapturada.toUpperCase());
                                dibujarLetra(letraCapturada,posicionX(i),70);
                            }
                        }
                        //COMPRUEBA SI YA GANO
                        if(palabraIngresada.join("") == palabraSecreta){
                            mostrarGano();
                        } 
                    }
                    else{
                        intentos++;
                        if(intentos>=intentosMax){
                            mostrarPerdio();
                            mostrarPalabra();
                        }
                        //GUARDO LA LETRA CAPTURADA EN UN ARRAY
                        guardarIncorrectas(letraCapturada);
                        dibujar();
                    }
                }
            }
            else{
                mostrarPerdio();
                mostrarPalabra();
            }
        }, false);
}


//GUARDA LA LETRA INCORRECTA EN UN ARRAY Y MUESTRA LA CADENA
function guardarIncorrectas(letraCapturada){
    letrasIncorrectas.push(letraCapturada);
    letrasEquivocadas.textContent = letrasIncorrectas.join("").toUpperCase();
}

//MUESTRA EL CARTEL DE LA VERGUENZA
function mostrarPerdio(){
    document.getElementById("cartel-perdiste").style.display = "block";
}

//OCULTA EL CARTEL DE LA VERGUENZA
function ocultarPerdio(){
    document.getElementById("cartel-perdiste").style.display = "none";
}

//MUESTRA EL CARTEL GANADOR
function mostrarGano(){
    document.getElementById("cartel-ganaste").style.display = "block";
}

//OCULTA EL CARTEL GANADOR
function ocultarGano(){
    document.getElementById("cartel-ganaste").style.display = "none";
}


/********** FUNCIONES RELACIONADAS CON LOS DIBUJOS ********/

//LIMPIA LAS LINEAS DE LA PALABRA
function limpiarLineas(){
    let pantalla = document.getElementById("lineas");
	pantalla.width=pantalla.width;
    pantalla.height=pantalla.height
}

//LIMPIA EL DIBUJO DEL AHORCADO
function limpiarDibujo(){
    let pantalla = document.getElementById("dibujo");
	pantalla.width=pantalla.width;
    pantalla.height=pantalla.height
}

//DIBUJA LA LETRA CORRESPONDIENTE A MEDIDA QUE SE INGRESA
function dibujarLetra(letra,x,y) {
    let pantalla = document.getElementById("lineas");
    let cxt1 = pantalla.getContext("2d");
    letra = letra.toUpperCase();
    cxt1.beginPath() //iniciar ruta
    cxt1.fillStyle="#0A3871"; //color de relleno
    cxt1.font="bold 35px arial"; //estilo de texto
    cxt1.fillText(letra,x,y); //texto con método fill
}

//DETECTA LA POSICION DE LA LETRA
function posicionX(posicion){
    x = 25;
    x = x + (posicion * 45);
    return x;
}

//DIBUJA LA CANTIDAD DE LINEAS SEGUN LA CANTIDAD DE LETRAS
function dibujarLineas(palabraSecreta){
    limpiarLineas();
    let pantalla = document.getElementById("lineas");
    let pincel = pantalla.getContext("2d");
    pincel.fillStyle = "#0A3871";
    let x = 25;
    for(let i=0;i<palabraSecreta.length;i++){
        pincel.fillRect(x,80,30,3);
        x+=45;
    }
}

let pincel;

//PREPARA TODOS LOS ELEMENTOS PARA EMPREZA A DIBUJAR EN EL CANVAS
function prepararCanvas(){
    let pantalla = document.getElementById("dibujo");
    pincel = pantalla.getContext("2d");
    pincel.fillStyle = "#0A3871";
}


function dibujarInicio(){
    prepararCanvas();
    //piso
    pincel.fillRect(5,355,285,3);
}

function dibujarAsta(){
    prepararCanvas();
    //asta
    pincel.fillRect(15,15,3,340);
}

function dibujarHorizontal(){
    prepararCanvas();
    //linea horizontal
    pincel.fillRect(15,15,150,3);
}

function dibujarCuerda(){
    prepararCanvas();
    //cuerda
    pincel.fillRect(165,15,3,50);
}

function dibujarCabeza(){
    prepararCanvas();
    //cabeza
    pincel.beginPath();
    pincel.arc(166,85,20,0,2*3.14);
    pincel.fill();
    pincel.fillStyle = "white";
    pincel.beginPath();
    pincel.arc(166,85,18,0,2*3.14);
    pincel.fill();
}

function dibujarTorso(){
    prepararCanvas();  
    //torso
    pincel.fillRect(165,105,3,70);
}

function dibujarBrazoDer(){
    prepararCanvas();
    //brazo derecho
    pincel.beginPath(); //comienza un ruta
    pincel.lineWidth = 3;
	pincel.moveTo(165,103); 
	pincel.lineTo(200,150); 
    pincel.stroke();
}

function dibujarBrazoIzq(){
    prepararCanvas();  
    //brazo izquierdo
    pincel.beginPath(); //comienza un ruta
	pincel.moveTo(165,105); 
	pincel.lineTo(130,150); 
    pincel.stroke(); 
}

function dibujarPiernaDer(){
    prepararCanvas();  
    //pierna derecha
    pincel.beginPath(); //comienza un ruta
    pincel.moveTo(165,173); 
    pincel.lineTo(200,225); 
    pincel.stroke();   
}

function dibujarPiernaIzq(){
    prepararCanvas();  
    //pierna izquierda
    pincel.beginPath(); //comienza un ruta
	pincel.moveTo(165,176);
	pincel.lineTo(130,225); 
    pincel.stroke(); 
}

//VA DIBUJANDO EL AHORCADO A MEDIDA DE LA CANTIDAD DE INTENTOS REALIZADOS
function dibujar(){
    switch (intentos) {
        case 1:
            dibujarAsta()
            break;

        case 2:
            dibujarHorizontal();
            break;

        case 3:
            dibujarCuerda();
            break;

        case 4:
            dibujarCabeza();
            break;

        case 5:
            dibujarTorso();
            break;
          
        case 6:
            dibujarBrazoDer();
            break;

        case 7:
            dibujarBrazoIzq();
            break;

        case 8:
            dibujarPiernaDer();
            break;

        case 9:
            dibujarPiernaIzq();
            break;
      }

}
