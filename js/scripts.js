$( document ).ready(function() {
	getCountries();

	var countriesArr = [],
			countriesObj = {};
	var regionsArr = [],
			regionsObj = {};	
	var citiesArr = [],
			citiesObj = {};					

	$('#region').attr('disabled', 'disabled');
	$('#city').attr('disabled', 'disabled');

	function getCountries() {
		$.ajax({
	    url: "http://api.vk.com/method/database.getCountries?v=5.69",
	    dataType: "jsonp",
	    success: function( data ) {
				var countriesRaw = data['response']['items'];
			  console.log( countriesRaw );

			  countriesArr = countriesRaw.map(function(country) {
			  	return country.title;
			  });
			  console.log(countriesArr);

			  countriesRaw.forEach(function(country) {
			  	countriesObj[country.title] = country.id;
			  });
			  console.log(countriesObj);

				document.getElementById('countryOuter').style.display = 'block';
			  
				$( "#country" ).autocomplete({
					delay: 0.5,
					source: countriesArr,
					select: function(event, ui) {
						$('#country').attr('disabled', 'disabled');
						$('#region').removeAttr('disabled');					
	          console.log(event, countriesObj[ui.item.label]);
	          getRegions(countriesObj[ui.item.label]);
		      }
				});	
	    }		    
		});
	};

	function getRegions(countryId) {
		$.ajax({
	    url: "http://api.vk.com/method/database.getRegions?v=5.69&country_id=" + countryId,
	    dataType: "jsonp",
	    success: function( data ) {
				var regionsRaw = data['response']['items'];
			  console.log( regionsRaw );

			  regionsArr = regionsRaw.map(function(region) {
			  	return region.title;
			  });
			  console.log(regionsArr);

			  regionsRaw.forEach(function(region) {
			  	regionsObj[region.title] = region.id;
			  });
			  console.log(regionsObj);

			  console.log('____countryId', countryId);

				$( "#region" ).autocomplete({
					delay: 0.5,
					source: regionsArr,
					select: function(event, ui) {
						$('#region').attr('disabled', 'disabled');
						$('#city').removeAttr('disabled');					
	          console.log(event, ui);
	          getCitiesOut(countryId, regionsObj[ui.item.label]);
		      }
				});		
			}		    	
	  })	
	};

	function getCitiesOut(countryId, regionId) {
		console.log('countryId, regionId', countryId, regionId);
		getCities();

		function getCities( offset, limit ) {
	    if( ! limit || limit > 1000 ) limit = 1000; //число запрашиваемых городов, максимально 1000, по умолчанию 1000
	    if( ! offset ) offset = 0; //по умолчанию 0

	    $.ajax({
		    url: "http://api.vk.com/method/database.getCities?v=5.69&need_all=0&count="+limit+"&country_id=" + countryId +"&region_id=" + regionId +"&offset="+(offset*limit),
		    dataType: "jsonp",
		    success: function( data ) {
	        console.log('data', data);
	        var allCities = data.response.count;
	        console.log('allCities', allCities);
	        var citiesRaw = data['response']['items'];
	        //с помощью concat можно объеденить 2 массива.
	        citiesArr = citiesArr.concat(citiesRaw.map(function(city) {
	          return city.title;
	        }));
	        //если в текущем ответе не все города то делаем ещё запрос с новым offset
	        if( allCities > offset*limit + limit)
	           getCities(offset+1, limit);   

	        console.log('citiesArr', citiesArr);   

					$( "#city" ).autocomplete({
						delay: 0.5,
						source: citiesArr,
						select: function(event, ui) {
							$('#city').attr('disabled', 'disabled');
		          console.log(event, ui);
		          alert('Код страны' + countryId + ', Код региона' + regionId + ', Код города' + citiesObj[ui.item.label]);
			      }
					});		             
		    }           
		  });
		};	
	}

	/*function getCities(countryId, regionId) {
		$.ajax({
	    url: "http://api.vk.com/method/database.getCities?v=5.69&need_all=0&country_id=" + countryId + "&region_id=" + regionId,
	    dataType: "jsonp",
	    success: function( data ) {
	    	console.log('data', data);
				var citiesRaw = data['response']['items'];
			  console.log( citiesRaw );

			  citiesArr = citiesRaw.map(function(city) {
			  	return city.title;
			  });
			  console.log(citiesArr);

			  citiesRaw.forEach(function(city) {
			  	citiesObj[city.title] = city.id;
			  });
			  console.log(citiesObj);

				$( "#city" ).autocomplete({
					delay: 0.5,
					source: citiesArr,
					select: function(event, ui) {
						$('#city').attr('disabled', 'disabled');
	          console.log(event, ui);
	          alert('Код страны' + countryId + ', Код региона' + regionId + ', Код города' + citiesObj[ui.item.label]);
		      }
				});	
	    }		    
		});
	};	*/
});