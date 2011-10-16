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
		//thumbClick
		this.subscribe(this.showFull,'thumbClick');
		//firstShow
		this.subscribe(this.init,'firstShow');
	};

	//METHODS===========================================================================================================

	this.calculateFull=function(){

		var thumb=arguments[0],
			full=$.data(thumb,'full'),
			int; //polling interval to detect full image load

		int=setInterval(function(){
			if($(full).attr('data-loaded')){
				clearInterval(int);
				$('body').append(full); //for picking up dimensions

				var imgW=$(full).width(),
					imgH=$(full).height(),
					cntW=$('#image').width(),
					cntH=$('#image').width(),
					winW=$(window).width(),
					winH=$(window).height(),
					bodW=$(window).width(),
					bodH=$(window).height(),
					ctrlsAndThumbsH=$('#controls').outerHeight()+$('#thumbs').outerHeight()+20;



			}
		},50);
	};

	this.showFull=function(){ //takes a single array param for overloading

		var args=arguments[0],
			thumb=args[0],
			full=$.data(thumb,'full'),
			title=$.data(full,'meta').title,
			desc=$.data(full,'meta').desc,
			int;

		//don't show until full image is down
		int=setInterval(function(){
			if($(full).attr('data-loaded')){
				clearInterval(int);
				$('body').append(full); //for picking up dimensions

				var imgLeft,
					capLeft,
					w=$(full).width(),
					h=$(full).height(),
					$figure=$('#image figure:eq(0)'),
					$figcaption=$('#image figcaption:eq(0)');

				$(full).css('margin-top',((642-h)/2)+'px');

				//insert full img...
				$figcaption.prev().detach(); //save for re-insertion
				$figcaption.before(full);

				$('#image h1:eq(0)').html(title); //and its title...
				$('#image p:eq(0)').html(desc); //and description
				capLeft=$figcaption.offset().left;
				imgLeft=$('#image img:eq(0)')[0].offsetLeft;
				$figcaption.css('padding-left',imgLeft-capLeft+'px'); //align caption info to photo
				$figure.fadeOut(0);
				$figure.css('visibility','visible');
				$figure.fadeIn(250);
				$('#thumbs li').removeClass('active');
				$(thumb).parent().addClass('active');

				if(args[1]){ //call from page NS overloaded to indicate first load
					that.publish(null,'firstShow') //------------------------------------------------------------------>
				}
			}
		},50)








	},

	this.init=function(){

		//add hand icon to thumbnails to indicate active state
		$('.thumbs li img').addClass('initialized');

		//delegated thumb clicks
		$('#thumbs').bind('click',function(e){
			if(e.target.src){ //could be the li for scaled-down images
				that.publish([e.target],'thumbClick');
			}
		});

	};
};