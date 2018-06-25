var orderList = [];//variable to maintain pizza order list
var orderQuantity = [];
$(document).ready(function(){

	

	var base_url = "D:/pizza_order/Pzza_order";
	var pizzaData = [];
	
	$('#place-order-btn').attr("disabled", "disabled");

	getPizza();
	
	//ajax call to get data from server/pizzas.jon 
	function getPizza(){
		var url = "server/pizzas.json"; //url for pizzas.jon
		$.get(url, function(data, status){
			//console.log("Data: " + data + "\nStatus: " + status);
			if(status == "success"){
				showPizzas(data);
			}
		});
	}

	//show pizzas in list
	function showPizzas(data){
		console.log("Data :",data);
		pizzaData = data;
		var pizzaStrng = '';
		for (const key in pizzaData) {
			var pizzaDataStrng = JSON.stringify(pizzaData[key]);
			
			var ingredientsArr = pizzaData[key].ingredients;
			var ingredients = "";
			for (const item in ingredientsArr) {
				ingredients += '<span class="ingredient"> '+ingredientsArr[item].name+' </span>';
			}

			pizzaStrng += `<div  class="col-lg-4 pizza">
			<center>
				<h4><strong>`+pizzaData[key].name+`</strong></h4>
				<img src="`+"img/"+pizzaData[key].image+`" alt="">
				<p class="ingredients">
					`+ingredients+`
				</p>
				<h5>`+pizzaData[key].price+" &#8377;"+`</h5>
				<button type="button" onclick='addPizzaOrder(`+pizzaDataStrng+`)' class="btn btn-primary">ADD</button>
			</center>
		</div>`;
		}

		$('.pizzalist').html(pizzaStrng);
	}
   

});

//function to push pizza in orderlist
function pushPizzaOrder(addPizzaData){
	
	orderList.push(addPizzaData);
	for (const key in orderList) {
		(orderList[key].quantity)? '': orderList[key].quantity = 1;
	   }
}
//fuction for adding pizzas to order list
function addPizzaOrder(addPizzaData){

	if(orderList.length != 0){
		var flag = 0;
		for (const key in orderList) {
			
			if (orderList[key].pizza_id == addPizzaData.pizza_id){
				orderList[key].quantity += 1;
				flag++;
			}
			
		}
		if(flag==0){
			pushPizzaOrder(addPizzaData);
		}
	}else{
		pushPizzaOrder(addPizzaData);
	}
	
	showOrderList();
	totalPizzaPrice();
}

//removing elements from pizza list
function removePizzaOrder(key){

	//if pizza quantity is greater then 1 then reduce the quantity
	if(orderList[key].quantity > 1){
		orderList[key].quantity--;
	}else{
		orderList.splice(key,1); //else remove the pizza from the list
	}
	
	
	showOrderList();
	totalPizzaPrice();
}

function showOrderList(){
	var orderListStrng = '';
	for (const key in orderList) {
		orderListStrng += `<tr>
		<td>`+orderList[key].name+`</td>
		<td>`+orderList[key].quantity+`</td>
		<td>`+(orderList[key].price * orderList[key].quantity)+" &#8377;"+`</td>
		<td>
			<button type="button" onclick='removePizzaOrder(`+key+`)' class="close" aria-label="Close">
				<span aria-hidden="true">&times;</span>
			</button>
		</td>
	</tr>`;
	}

	$('.orderList').html(orderListStrng);

}

//function to calculate total price
function totalPizzaPrice(){

	var total = 0;
	var discount = 11.5;
	for (const key in orderList) {
		total += orderList[key].price * orderList[key].quantity;
	}

	var totalstrng = "";
	if(orderList.length > 0){
		totalstrng = `<tr>
		<td>Discount</td>
		<td>`+discount+`%</td>
		<td>`+(discount/100 * total).toFixed(2)+" &#8377;"+`</td>
		<td></td>
	</tr>`;

	}
	
	totalstrng += `<tr>
	<td><strong>Total</strong></td>
	<td></td>
	<td><strong>`+(total - ((discount/100 * total).toFixed(2)))+" &#8377;"+`</strong></td>
	<td></td>
	</tr>`;

	$('.orderList').append(totalstrng);
	if(orderList.length > 0){
		$('#place-order-btn').removeAttr("disabled");
		$(".confirmBtn").removeAttr("disabled");
	}else{
		$('#place-order-btn').attr("disabled", "disabled");
		$(".confirmBtn").attr("disabled", "disabled");
	}
}

function confirmOrder(){

	
	//ajax call to post the data to server/order.jon 
	var url = "server/order.json"; //url for pizzas.jon
	// $.post(url, {order : orderList} ,function(data, status){
	// 	console.log("status :",status);
	// 	//console.log("Data: " + data + "\nStatus: " + status);
	// 	if(status == "success"){
	// 		//showPizzas(data);
	// 		alert("Order confirmed");
	// 	}else{
	// 		alert("Order not confirmed");
	// 	}

	// });


	$.post( url, function() {
		//alert( "success" );
	  }).always(function() {
		  //alert( "finished" );
			$(".alert").show();
			$("#overlay").show();
		});


	console.log("After post call");


}

function closeAlert(){
	$(".alert").hide();
	$("#overlay").hide();
	orderList = [];
	showOrderList();
	totalPizzaPrice();
	
}
function off() {
   // document.getElementById("overlay").style.display = "none";
}