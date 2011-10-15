//create namespace
PBT.scaffolding.namespace('page');
//make namespace a publisher (that can 'subscribe' listeners)
PBT.scaffolding.pubSub.makePublisher(PBT.page);


//set up with methods
PBT.page.setup=function(){

	var	$=arguments[0], //jQuery
		//aliases
		that=this;

	//PUBSUB============================================================================================================

	this.pubSub=function(){

		//namespace subscibes its listeners to... <------------------------------------------------------------listeners
		//thumbLoad
		this.subscribe(this.sizeThumb,'thumbLoad');
		//thumbSize
		this.subscribe(this.showThumb,'thumbSize');
		//thumbFirst (if this is the first thumb inserted)
		this.subscribe(this.showFull,'thumbFirst');
	};

	//METHODS===========================================================================================================

	this.parseMedia=function(){

		var objArr=arguments[0];

		$(objArr).each(function(){

			var $thumb=$(document.createElement('img')),
				$full=$(document.createElement('img'));

			//img data
			$.data($full[0],'meta',{title:this.title,desc:this.desc}); //link fulls and captions
			$.data($thumb[0],'full',$full[0]); //associate thumb with full

			//img src + load
			$full
				.attr('src',this.url)
				.bind('load',function(){
					$(this).attr('data-loaded','true');
				});
			$thumb
				.attr('src',this.thumbnail)
				.bind('load',function(){
					that.publish($thumb,'thumbLoad'); //---------------------------------------------------------------->
				});
		})
	};

	this.sizeThumb=function(){
		arguments[0].appendTo($('#thumbs')); //insert into DOM to grab dimensions

		var $thumb=arguments[0],
			dimensions={w:$thumb.width(),h:$thumb.height()},
			longSide=dimensions.w>dimensions.h?dimensions.w:dimensions.h,
			multiplier=60/longSide;

		$thumb.attr('width',multiplier*dimensions.w);
		$thumb.attr('height',multiplier*dimensions.h);
		this.publish($thumb,'thumbSize'); //--------------------------------------------------------------------------->
	}.bind(this);

	this.showThumb=function(){

		var $container=$(document.createElement('span')),//style definitions applied in css
			$thumb=arguments[0];

		//center
		$thumb.css({
			left:-($thumb.width()-60)/2+'px',
			top:-($thumb.height()-60)/2+'px'
		});

		//insert
		$container
			.appendTo($('#thumbs > div:eq(0)'))
			.html($thumb);

		//if this is the first thumb we're inserting
		if($('#thumbs > div:eq(0) span').length===1){
			this.publish($thumb,'thumbFirst') //----------------------------------------------------------------------->
		}
	}.bind(this);

	this.showFull=function(){

		var $thumb=arguments[0],
			full=$.data($thumb[0],'full'),
			int;

		//don't show until full image is down
		int=setInterval(function(){
			if($(full).attr('data-loaded')){
				$('#image figcaption').before(full);
				clearInterval(int);
			}
		},50)
	};
};