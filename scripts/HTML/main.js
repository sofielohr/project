// Sofie Löhr, 11038926

window.onload = function() {

  var requests = [d3v5.json("tourism_year_data.json")];
  Promise.all(requests).then(function(response) {
  
  	// process tourism data
	var tourism_data = process(response[0]);
    var bubble_data = process_bubble(tourism_data);

    bubble(bubble_data);
    console.log('hoi')

    slider(bubble_data)
  
  }).catch(function(e){
    throw(e);
  })


}













