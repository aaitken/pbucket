//create namespace
PBT.namespace('page');

//set up with methods
PBT.page.setup=function(){

		//imported
	var imported=arguments[0],
		$=imported.lib,
		//aliases
		data=PBT.data,
		//private, shared
		media; //set in getMedia; used in buildDisplay

	//sets shared media var to array of image/metadata objects
	this.getMedia=function(){
		media=data.jsonArr({
				uri:'feed/slideshow.json',
				lib:jQuery,
				cbk:this.loadMedia
			});
	};

	//callback for image/metadata receipt
	this.loadMedia=function(){

		var that=this;

		//load thumbnail
		//then pass to callback
		$(media).each(function(){

			var $thumb=$(document.createElement('img'))
					.attr('src',this.thumbnail)
					.bind('load',function(){
						$thumb.appendTo($('#thumbs')); //insert into DOM to grab dimensions
						that.sizeMedia($thumb);
					}),
				$full=$(document.createElement('img'))
					.attr('src',this.url);

			//attach data to DOM elements
			$.data($thumb[0],'full',$full); //link thumbs and fulls
			$.data($full[0],'meta',{title:this.title,desc:this.desc}); //link fulls and captions
		})
	}.bind(this); //since executed from the data context

	this.sizeMedia=function($thumb){

		var dimensions={w:$thumb.width(),h:$thumb.height()},
			longSide=dimensions.w>dimensions.h?dimensions.w:dimensions.h,
			multiplier=60/longSide;

		$thumb.attr('width',multiplier*dimensions.w);
		$thumb.attr('height',multiplier*dimensions.h);
		this.showMedia($thumb);
	};

	this.showMedia=function($thumb){

		var $container=$(document.createElement('span'));//style definitions applied in css

		$thumb.css({
			left:-($thumb.width()-60)/2+'px',
			top:-($thumb.height()-60)/2+'px'
		});
		$container
			.appendTo($('#thumbs > div:eq(0)'))
			.html($thumb);
	};
};