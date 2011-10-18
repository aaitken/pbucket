//create namespace
PBT.scaffolding.namespace('slideshow');
//make namespace a publisher (that can 'subscribe' listeners)
PBT.scaffolding.pubSub.makePublisher(PBT.slideshow);


//set up with methods
PBT.slideshow.setup=function(){

	var $=arguments[0], //jQuery
		//Aliases
		page=PBT.page,
		i=0, //show counter, used by init
		playInterval, //shared between play and pause controls
		that=this; //re-usable reference for inner function convention

	//PUBSUB============================================================================================================

	this.pubSub=function(){

		//namespace subscibes its listeners to... <------------------------------------------------------------listeners
		//thumbClick
		this.subscribe(this.showFull,'thumbClick');
		//firstShow
		this.subscribe(this.init,'fullShow');
		this.subscribe(page.layout,'fullShow');
		//fullCalculate
		this.subscribe(this.showFull,'fullCalculate');
		//main buttons
		this.subscribe(this.playShow,'btnPlay');
		this.subscribe(this.pauseShow,'btnPause');
		this.subscribe(this.goNext,'btnNext');

	};

	//METHODS===========================================================================================================

	this.showFull=function(){ //takes a single array param for overloading

		var thumb=arguments[0],
			full=$.data(thumb,'full'),
			title=$.data(full,'meta').title,
			desc=$.data(full,'meta').desc,
			int;

		//don't show until full image is down
		int=setInterval(function(){
			if($(full).attr('data-loaded')){
				clearInterval(int);

				var $figure=$('#image figure:eq(0)'),
					$figcaption=$('#image figcaption:eq(0)');

				//show counter
				i++;

				//insert full img...
				$('#image, #image img').removeAttr('style');
				$figcaption.prev().detach(); //save for re-insertion
				$figcaption.before(full);
				$('#image h1:eq(0)').html(title); //and its title...
				$('#image p:eq(0)').html(desc); //and description

				//fade in
				$figure.fadeOut(0);
				$figure.css('visibility','visible');
				$figure.fadeIn(250);

				//active thumb class
				$('#thumbs li').removeClass('active');
				$(thumb).parent().addClass('active');

				that.publish(full,'fullShow'); //---------------------------------------------------------------------->
			}
		},50)
	},

	this.pauseShow=function(){
		clearInterval(playInterval);
	};
	this.playShow=function(){
		//playInterval available one up in scope chain for sharing
		playInterval=setInterval(function(){
			var $activeLi=$('li.active:eq(0)');
			if($activeLi.next().length>0){
				that.publish($activeLi.next().find('img')[0],'thumbClick'); //----------------------------------------->
			}
		},3000)
	};
	this.goNext=function(){
		that.publish($('li.active').next().find('img')[0],'thumbClick'); //-------------------------------------------->
	};

	this.init=function(){

		//run init on first fullShow only
		if(i>1){return}

		//add hand icon to thumbnails to indicate active state
		$('.thumbs ul').removeClass('uninitialized');

		//delegated thumb clicks
		$('#thumbs').bind('click',function(e){
			if(e.target.src&&$(e.target).parent().is(':not(.active)')){ //could be the li for scaled-down images

				//kinda ugle here...
				clearInterval(playInterval);
				$('#controls span').addClass('disabled');
				$('#controls span:eq(0)').removeClass('disabled').find('button').removeClass('disabled');
				$('#controls span:eq(0) button:eq(0)').addClass('disabled');

				that.publish(e.target,'thumbClick'); //---------------------------------------------------------------->
			}
		});

		//delegated main button clicks
		$('#controls span:eq(0)').bind('click',function(e){
			if(e.target.type==='button'){

				var $targ=$(e.target),
					event=null,
					toggleClasses=function(){
						$targ.parent().find('button').removeClass('disabled');
						$targ.addClass('disabled');
					};

				if($targ.hasClass('disabled')){return false;}
				switch(e.target.id){
					case 'btnPause':
						toggleClasses();
						event='btnPause';
						break;
					case 'btnPlay':
						toggleClasses();
						event='btnPlay';
						break;
					case 'btnNext':
						event='btnNext';
						break;
					default:
						break;
				}

				that.publish(e.target,event); //----------------------------------------------------------------------->
			}
		});

		//start slideshow
		$('#btnPlay').trigger('click');

	};
}
