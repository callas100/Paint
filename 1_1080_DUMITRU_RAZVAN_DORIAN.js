//#region definitii/start pagina
canvas = document.getElementById("myCanvas");
ctx = canvas.getContext('2d');


var drawBool = false,
    //stringul folosit pt schimbarea tool-ului
    tool = "default",
    //vaiabila in care se salveaza imageData
    screenShot,
    //pozitia de start a mouse-ului pe canvas
    mouseStart;

canvas.width = 900;
canvas.height = 500;

//sa nu se mai deschida meniul contextual la click dreapta
canvas.oncontextmenu = function(e) { e.preventDefault(); };

set();

function set() {

    //functia set() seteaza grosimea/strokeStyle-ul/fillStyle-ul si 
    //adauga 3 eventListeners pt interactiunea cu canvasul(mouseup, move si down)
    console.log("set");

    ctx.lineWidth = document.getElementById("toolSize").value;
    ctx.lineCap = "round";
    ctx.strokeStyle = document.getElementById("toolColor").value;
    ctx.fillStyle = document.getElementById("toolColor").value;

    canvas.addEventListener('mousedown', drawStart);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', drawStop);

}

function getMousePosition(event) {
    // asa aflam pozitiile mouse-ului in raport cu canvasul
    var x = event.clientX - canvas.getBoundingClientRect().left,
        y = event.clientY - canvas.getBoundingClientRect().top;

    return { x: x, y: y };
}
//#endregion
//#region take/restore
function takeScreenShot() {
    //pt a vedea outputul liniilor/figurilor cand facem mousemove pe canvas
    //pt functia drawStart()
    screenShot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function restoreScreenShot() {
    //pt functia draw() si drawStop()
    ctx.putImageData(screenShot, 0, 0);
}
//#endregion
//#region drawStart/draw/drawStop
function drawStart(e) {
    //validari pt btn click stanga
    if (e.button == 0) {

        drawBool = true;
        mouseStart = getMousePosition(e);
        takeScreenShot();
    }
}

function draw(e) {
    if (e.button == 0) {
        var position;
        if (drawBool == true) {
            restoreScreenShot();
            position = getMousePosition(e);
            switch (tool) {
                case "default":
                    drawDefault(position);
                    break;
                case "line":
                    drawLine(position);
                    break;
                case "circle":
                    drawCircle(position);
                    break;
                case "rectangle":
                    drawRect(position);
                    break;
                case "polygon":
                    drawPolygon(position, 6, Math.PI / 4);
                    break;
            }
        }
    }
}

function drawStop(e) {
    if (e.button == 0) {

        drawBool = false;
        restoreScreenShot();
        var position = getMousePosition(e);
        switch (tool) {
            case "default":
                drawDefault(position);
                break;
            case "line":
                drawLine(position);
                break;
            case "circle":
                drawCircle(position);
                break;
            case "rectangle":
                drawRect(position);
                break;
            case "polygon":
                drawPolygon(position, 6, Math.PI / 4);
                break;
        }
        ctx.beginPath();
    }
}
//#endregion
//#region functii pt fiecare tool

//pt default (pensula)
function drawDefault(position) {
    //cele 3-4 linii referitoare la style trebuie repetate in fiecare functie,
    //altfel nu se schimba grosimea, culoarea

    ctx.lineWidth = document.getElementById("toolSize").value;
    ctx.lineCap = "round";
    ctx.strokeStyle = document.getElementById("toolColor").value;

    ctx.lineTo(position.x, position.y);
    ctx.stroke();
    ctx.moveTo(position.clientX, position.clientY);
}

//pt linie 
function drawLine(position) {
    ctx.lineWidth = document.getElementById("toolSize").value;
    ctx.lineCap = "round";
    ctx.strokeStyle = document.getElementById("toolColor").value;

    ctx.beginPath();
    ctx.moveTo(mouseStart.x, mouseStart.y);
    ctx.lineTo(position.x, position.y);
    ctx.stroke();
}

//pt circle
function drawCircle(position) {

    ctx.lineWidth = document.getElementById("toolSize").value;
    ctx.lineCap = "round";
    ctx.strokeStyle = document.getElementById("toolColor").value;
    ctx.fillStyle = document.getElementById("toolColor").value;

    var radius = Math.sqrt(Math.pow((mouseStart.x - position.x), 2) +
        Math.pow((mouseStart.y - position.y), 2));
    ctx.beginPath();
    ctx.arc(mouseStart.x, mouseStart.y, radius, 0, 2 * Math.PI, false);
    //pt fiecare figura , daca checkBox-ul "umplereCb" are .checked ==true, 
    //figura va fi plina, contrar goala
    if (document.getElementById("umplereCb").checked == true)
        ctx.fill();
    else
        ctx.stroke();
}

//pt rect
function drawRect(position) {
    ctx.lineWidth = document.getElementById("toolSize").value;
    ctx.lineCap = "round";
    ctx.strokeStyle = document.getElementById("toolColor").value;
    ctx.fillStyle = document.getElementById("toolColor").value;

    ctx.beginPath();
    ctx.rect(mouseStart.x, mouseStart.y,
        position.x - mouseStart.x, position.y - mouseStart.y);
    if (document.getElementById("umplereCb").checked == true)
        ctx.fill();
    else
        ctx.stroke();
}

//pt polygon
function drawPolygon(position, sides, angle) {
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //mi-a iesit functia in asa fel 
    //incat pot sa schimb parametrul "sides" in draw() si drawStop()
    //asa pot desena triunghi, patrat, pentagon, hexagon etc...
    ctx.lineWidth = document.getElementById("toolSize").value;
    ctx.lineCap = "round";
    ctx.strokeStyle = document.getElementById("toolColor").value;
    ctx.fillStyle = document.getElementById("toolColor").value;

    // un array de int care tine coordonatele punctelor poligonului
    var coordinates = [],
        //aceeasi definitie de radius de la cerc
        radius = Math.sqrt(Math.pow((mouseStart.x - position.x), 2) +
            Math.pow((mouseStart.y - position.y), 2));

    for (var index = 0; index < sides; index++) {
        coordinates.push({
            x: mouseStart.x + radius * Math.cos(angle),
            y: mouseStart.y - radius * Math.sin(angle)
        });
        angle += (2 * Math.PI) / sides;
    }
    ctx.beginPath();
    ctx.moveTo(coordinates[0].x, coordinates[0].y);

    for (var index = 1; index < sides; index++) {
        ctx.lineTo(coordinates[index].x,
            coordinates[index].y);
    }
    ctx.closePath();
    if (document.getElementById("umplereCb").checked == true)
        ctx.fill();
    else
        ctx.stroke();
}
//#endregion
//#region eventListeners pt fiecare tool

//am initializat un string "tool=default" in regiunea definitii
//fiecare onclick pe imaginea tool-ului respectiv schimba string-ul
//switch-urile din draw() si drawStop() modifica outputul
document.getElementById("default").onclick = function() {
    tool = "default";
    console.log(tool);
}
document.getElementById("line").onclick = function() {
    tool = "line";
    console.log(tool);
}
document.getElementById("rectangle").onclick = function() {
    tool = "rectangle";
    console.log(tool);
}
document.getElementById("circle").onclick = function() {
    tool = "circle";
    console.log(tool);
}

document.getElementById("polygon").onclick = function() {
    tool = "polygon";
    console.log(tool);
}

//salvare jpg / png
document.getElementById("save").onclick = function onSave() {
    tool = "save";
    console.log(tool);

    var extensie = document.getElementById("saveSelect").value;
    //pt png(0)
    if (extensie == 0) {
        console.log(".png");

        save.href = canvas.toDataURL();
        save.download = "screenshot.png";
    }
    // pt jpg(1)
    if (extensie == 1) {
        console.log(".jpg");

        save.href = canvas.toDataURL();
        save.download = "screenshot.jpg";
    }
    //pt svg(2) TO DO

}

//to do culoare fundal
document.getElementById("bgColor").oninput = function changeBgColor() {

    canvas.style.backgroundColor =
        document.getElementById("bgColor").value;
}

//#endregion