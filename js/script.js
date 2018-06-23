$(document).ready(function(){
	var base_url = "D:/pizza_order/Pzza_order";
	getPizza();
	function getPizza(){
		$.get("server/pizzas.json", function(data, status){
			alert("Data: " + data + "\nStatus: " + status);
		});
	}
   

});