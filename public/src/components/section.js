let arreglo = ["","","",""];

function allowDrop(ev){
    ev.preventDefault();
}

function drag(ev){
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev){
    if(arreglo[parseInt(ev.target.id)]==""){
        var data = ev.dataTransfer.getData("text");
        arreglo[parseInt(ev.target.id)] = data;
        ev.target.appendChild(document.getElementById(data));
    }
}