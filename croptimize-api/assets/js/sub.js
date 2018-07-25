function sub(){

	var id = Number(document.getElementById("id-sub").value);
	io.socket.get("/comment/" + id + "/subscribe");
	console.log("Suscrito a " + id);

	document.getElementById("borrar").innerHTML = "Suscrito a la guitarra ID " + id + " (agregar mensajes desde un cliente REST y esta pagina recibe un mensaje por consola de parte del servidor)";

}


io.socket.on('guitar',function(obj){
	console.log("Llego un nuevo mensaje");
	console.log(obj);
});

