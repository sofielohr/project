// Sofie Löhr, 11038926

function line_data(tourism, climate){

	console.log(tourism, climate)

	var data = {}
	var years = ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018'];

	// make objects for all the years
	for (index in years){
		var Year = years[index]
		data[Year] = {};

		// go over all the countries
		Object.values(tourism).forEach(function(d){

			// check if right year and make objects
			if (d["Year"] == Year){

				if (d["GEO"] in data[Year]){

					var country_variables = {}
					country_variables.month = d.Month
					country_variables.tourism = d.Average
					country_variables.country = d.GEO

					// add to the dataframe
					data[Year][d.GEO][d.Month] = country_variables

				}
				else {

					data[Year][d.GEO] = {}

					var country_variables = {}
					country_variables.month = d.Month
					country_variables.tourism = d.Average
					country_variables.country = d.GEO

					// add to the dataframe
					data[Year][d.GEO][d.Month] = country_variables
				}      
			}
		})
	}

	// add climate data
	Object.values(climate).forEach(function(d){
		
		if (d.Year < 2019){
			if (d.Name in data[d.Year]){
			data[d.Year][d.Name][d.Month]["temperature"] = d.Average
			}
		}
	})

	console.log(data)
	return data
}