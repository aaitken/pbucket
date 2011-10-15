//create namespace
PBT.namespace('data');

//set up with methods
PBT.data.setup=function(){

	//Module to get and expose json string converted to object
	//function param = 2-part map
	//uri - what we hit to return json string
	//lib - jQuery
	//cbk - callback
	this.jsonArr=function(){

			//imported
		var imported=arguments[0], //map
			cbk=imported.cbk, //callback
			uri=imported.uri,
			$=imported.lib,
			//local
			jsonArr=[]; //returned json Array - updated asynchronously by reference

		//request and handle
		$.ajax({
			url:uri,
			dataType:'json',
			success:function(data){
				$(data).each(function(){jsonArr.push(this)});
				cbk();
			}
		});

		return jsonArr;
	};
};

