// -------------- creating empty object and properties to use in Ajax  call --------------
var petApp = {};
	petApp.apiKey = '6e0b64b1d094adcd97940c98d9e86423';
	petApp.apiUrlPup = 'http://api.petfinder.com/pet.find';
	petApp.apiUrlShelter = 'http://api.petfinder.com/shelter.find';

// --------------- making ajax call for pet data --------------
petApp.getPet = function (query) {
	return $.ajax({
			url: petApp.apiUrlPup,
			method: 'GET',
			dataType: 'JSONP',
			data: {
				key: petApp.apiKey,
				location: query,
				format: 'json',
				animal: "dog",
				count: 200
			} // /data
	});// /$.ajax
};// /.getPet
// ---------------- making ajax call for shelter data --------------
petApp.getShelter = function (query) {
	return $.ajax({
			url: petApp.apiUrlShelter,
			method: 'GET',
			dataType: 'JSONP',
			data: {
				key: petApp.apiKey,
				location: query,
				format: 'json',
				count: 100
			} // /data
	});// /$.ajax
};// /.getShelter
// ------------------ initiating App --------------
petApp.init = function () {
// ------------------ when form is submitted--------------
	$('.searchForm').on('submit', function(e) {
// ------------------ prevent default form page refreshing action--------------
	    e.preventDefault();
	    $('.svgWrapper').fadeIn();
// ------------------ grab the user's locaiton input value--------------
	    petApp.locationInput = $('input[name=location]').val();
// ------------------ clearing the input field when user has entered a location--------------
	    $('input[name=location]').val('');
// ------------------ pass on the location as the API's location search query--------------
		$.when(petApp.getPet(petApp.locationInput), petApp.getShelter( petApp.locationInput))
// ------------------ when the app's data is returned to us --------------
			.done(function(gotPet, gotShelter){
// ------------------ grab the pet array from pet data and store it in a new variable--------------
				var pets = gotPet[0].petfinder.pets.pet;
// ------------------ grab the shelter array from shelter data and store it in a new variable--------------
				var shelters = gotShelter[0].petfinder.shelters.shelter;
// ------------------ looping through shelter array--------------
				//put this into it's own function - RANJAN
				shelters.forEach(function(shelterObj) {
// ------------------ inside the loop, look for a match between shelters and pets--------------
// ------------------ store the result in a shelter as the key to a new pet property--------------
					shelterObj.pet = pets.filter(function(petObj) {
						return petObj.shelterId.$t === shelterObj.id.$t;
					});// /.filter
// ------------------ creating a new property inside petApp, return all the shelters that have pets
				});// forEach--------------
				petApp.shelterWithPets = shelters.filter(function(shelterObj){
					return shelterObj.pet.length > 0;
				});// /.filter
// ------------------ if no map, start map. this statement hides map when page first loads--------------
				if (petApp.mymap === undefined) {
					petApp.initMap();
					$("main").removeClass("hide");
					$("footer").removeClass("hide");
					setTimeout(function(){
						$('html, body').animate({scrollTop:750}, 700);
					}, 1000);
					if (document.documentElement.clientWidth <= 500) {
						setTimeout(function(){
							$('html, body').animate({scrollTop:680}, 650);
						}, 1000);
					}
				} // if
// ------------------ calling function to display shelter, pass query to only display shelter that have pets.
// --------------  In map.js, we grab those shelter's longtitude and latitude and assign them to makers	--------------
				petApp.displayShelter(petApp.shelterWithPets);
			}) //.done
			.fail(function(err1, err2) {
				alert('No Puppies for you :/');
			}); //.fail
	}); // form on submit
// ------------------ defining eventlistener, when the status of checkboxes change--------------
	$('input[type=checkbox]').on('change', function (e) {
		// e.preventDefault();
		var checkedInputsAge = $('input[name=age]:checked');
		var checkedValuesAge = checkedInputsAge.map(function(index, input) {
			return $(input).val();
		}).toArray();
		checkedValuesAgeDefault = ["Baby", "Young", "Adult", "Senior"];

		var checkedInputsSize = $('input[name=size]:checked');
		var checkedValuesSize = checkedInputsSize.map(function(index, input) {
			return $(input).val();
		}).toArray();
		checkedValuesSizeDefault = ["S", "M", "L", "XL"];

		var checkedInputsSex = $('input[name=sex]:checked');
		var checkedValuesSex = checkedInputsSex.map(function(index, input) {
			return $(input).val();
		}).toArray();
		checkedValuesSexDefault = ["F", "M"];

		petApp.mymap.removeLayer(petApp.markerGroup);

		var filteringPets = function (shelterDataset, checkedValues, checkedDefault, filterCategory, petName, petName2) {

			petApp.newShelter = shelterDataset.map(function(shelter){
				if (checkedValues.length !== 0) {
					var filteredPets = checkedValues.map(function(criteria){
						return shelter[petName].filter(function(pet){
							if (filterCategory === 'age') {
								return pet.age.$t === criteria;
							} else if (filterCategory === 'size') {
								return pet.size.$t === criteria;
							} else if (filterCategory === 'sex') {
								return pet.sex.$t === criteria;
							}
						}); // /.filter
					});// /.map
				} else {
					var filteredPets = checkedDefault.map(function(criteria){
					return shelter[petName].filter(function(pet){
						if (filterCategory === 'age') {
							return pet.age.$t === criteria;
						} else if (filterCategory === 'size') {
							return pet.size.$t === criteria;
						} else if (filterCategory === 'sex') {
							return pet.sex.$t === criteria;
						}
					});
				});
				}
				shelter[petName2] = flattenedPets = $.map(filteredPets, function(n){
					return n;
				});// /$.map, a flatten method
				return shelter;
			}).filter(function(shelter){
				return shelter[petName2].length > 0;
			});	// /.filter
		};

		filteringPets(petApp.shelterWithPets, checkedValuesAge, checkedValuesAgeDefault, 'age', 'pet', 'finalpet');
		filteringPets(petApp.newShelter, checkedValuesSize, checkedValuesSizeDefault, 'size', 'finalpet', 'finalpet2');
		filteringPets(petApp.newShelter, checkedValuesSex, checkedValuesSexDefault, 'sex', 'finalpet2', 'finalpet3');

		// petApp.newShelter.forEach(function(shelter){
		// 	shelter.finalpet.forEach(function(finalPets){
		// 		console.log(finalPets.age.$t);
		// 	});
		// });
		console.log(petApp.newShelter);
		petApp.newShelter.forEach(function(shelter){
			shelter.finalpet3.forEach(function(finalPets){
				console.log(finalPets.size.$t);
				console.log(finalPets.age.$t);
				if (finalPets.sex.$t === "M") {
					console.log("Male");
				} else if (finalPets.sex.$t === "F"){
					console.log("Female");
				}
			});
		});
		petApp.displayShelter(petApp.newShelter);
	}); // /.$('input[type=checkbox]').on('change',....)

}; // /.petApp.init()
// ------------------ when document is ready, aka when page is loaded, start running petApp.--------------
$(function() {
	petApp.init();

}); // /.documentReady
