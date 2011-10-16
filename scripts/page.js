//create namespace
PBT.scaffolding.namespace('page');
//make namespace a publisher (that can 'subscribe' listeners)
PBT.scaffolding.pubSub.makePublisher(PBT.page);


//set up with methods
PBT.page.setup=function(){

	var	$=arguments[0], //jQuery
		//aliases
		slideshow=PBT.slideshow,
		that=this;

	//PUBSUB============================================================================================================

	this.pubSub=function(){

		//namespace subscibes its listeners to... <------------------------------------------------------------listeners
		//thumbLoad
		this.subscribe(this.sizeThumb,'thumbLoad');
		//thumbSize
		this.subscribe(this.showThumb,'thumbSize');
		//thumbFirst (if this is the first thumb inserted)
		this.subscribe(slideshow.showFull,'thumbFirst');
		this.subscribe(this.layout,'thumbFirst');
		//fullShow
		this.subscribe(slideshow.init,'fullShow');
	};

	//METHODS===========================================================================================================

	this.parseMedia=function(){

		var objArr=arguments[0],
			fullStore=[];

		//get thumbs first
		(function(){
			$(objArr).each(function(index){

				var $thumb=$(document.createElement('img')),
					$full=$(document.createElement('img'));

				//img data
				$.data($full[0],'meta',{title:this.title,desc:this.desc}); //link fulls and captions
				$.data($thumb[0],'full',$full[0]); //associate thumb with full

				//for all but the first image, defer loading of full sizes until after thumbs are down
				//(want to show first full as soon as possible)
				if(index===0){
					$full
						.attr('src',this.url)
						.bind('load',function(){
							$(this).attr('data-loaded','true');
						});
				}
				else{
					fullStore.push([$full,this.url]); //we'll glue these together only after all thumbs are down
				}

				//load thumb
				$thumb
					.attr('src',this.thumbnail)
					.bind('load',function(){
						that.publish($thumb,'thumbLoad'); //----------------------------------------------------------->
					});
			});
		}());

		//now pull down full sizes
		(function(){
			$(fullStore).each(function(index){
				this[0]
					.attr('src',this[1])
					.bind('load',function(){
						$(this).attr('data-loaded','true');
					});
			});
		}());
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

		var $container=$(document.createElement('li')),//style definitions applied in css
			$thumb=arguments[0];

		//center
		$thumb.css({
			left:-($thumb.width()-60)/2+'px',
			top:-($thumb.height()-60)/2+'px'
		});

		//insert
		$container
			.appendTo($('#thumbs ul'))
			.html($thumb);

		//if this is the first thumb we're inserting
		if($('#thumbs li').length===1){
			var args=[$thumb[0],'slideshow init flag'];
			this.publish(args,'thumbFirst') //----------------------------------------------------------------------->
		}
	}.bind(this);

	//positioning of control buttons relative to thumbs
	this.layout=function(){

		var left=$(arguments[0][0]).offset().left;

		$('#controls').css('padding-left',left+'px');
		$('body').css('visibility','visible');
		$(window).one('resize',function(){
			that.layout($('.thumbs li:eq(0)'));
		});
	};
};