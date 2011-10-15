//create namespace
PBT.scaffolding.namespace('data');
//make namespace a publisher (that can 'subscribe' listeners)
PBT.scaffolding.pubSub.makePublisher(PBT.data);


//set up with methods
PBT.data.setup=function(){

	var $=arguments[0], //jQuery
		//Aliases
		page=PBT.page,
		that=this; //re-usable reference for inner function convention

	//PUBSUB============================================================================================================

	this.pubSub=function(){

		//namespace subscibes its listeners to... <------------------------------------------------------------listeners
		//dataReceipt
		this.subscribe(page.parseMedia,'dataReceipt');
	};

	//METHODS===========================================================================================================

	//Get json w/map: uri:[resource locator]
	this.getJson=function(map){
		$.ajax({
			url:map.uri,
			dataType:'json',
			success:function(data){
				that.publish(data,'dataReceipt'); //------------------------------------------------------------------->
			}
		});
	};
};

