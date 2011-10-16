//create namespace
PBT.scaffolding.namespace('slideshow');
//make namespace a publisher (that can 'subscribe' listeners)
PBT.scaffolding.pubSub.makePublisher(PBT.slideshow);


//set up with methods
PBT.slideshow.setup=function(){

	var $=arguments[0], //jQuery
		//Aliases
		page=PBT.page,
		that=this; //re-usable reference for inner function convention

	//PUBSUB============================================================================================================

	this.pubSub=function(){

		//namespace subscibes its listeners to... <------------------------------------------------------------listeners
		this.subscribe(this.showFull,'thumbClick')
	};

	//METHODS===========================================================================================================

	this.showFull=function(){

		var full=$.data(arguments[0],'full'),
			title=$.data(full,'meta').title,
			desc=$.data(full,'meta').desc;

		alert(title);
	},

	this.init=function(){

		//delegated thumb clicks
		$('#thumbs').bind('click',function(e){
			if(e.target.src){ //could be the li for scaled-down images
				that.publish(e.target,'thumbClick');
			}
		});

	};
};