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
		that=this; //re-usable reference for inner function convention

	//PUBSUB============================================================================================================

	this.pubSub=function(){

		//namespace subscibes its listeners to... <------------------------------------------------------------listeners
		//thumbClick
		this.subscribe(this.displayFull,'thumbClick');
		this.subscribe(this.displayFull,'slideshowReq');
		//this.subscribe(this.assignClasses,'thumbClick');
		//fullShow
		this.subscribe(this.init,'fullShow'); //first time only
		this.subscribe(page.layout,'fullShow');
		//buttons
		//this.subscribe(this.assignClasses,'ctrlClick');
		this.subscribe(this.doControl,'ctrlClick');

	};

	//METHODS===========================================================================================================

	this.displayFull=function(){

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

	this.doControl=function(){

		var request=arguments[0],
			//functions
			pause,
			play,
			next,
			slow,
			medium,
			fast,
			reverse,
			restart,
			publish,
			//shared by functions
			speed=3000, //default slideshow interval
			interval,
			getter='next'; //direction indicator

		//core functions
		pause=function(){
			clearInterval(interval);
		};
		play=function(){
			interval=setInterval(function(){
				var $li=$('li.active:eq(0)')[getter]();
				if($li.length>0){
					publish($li.find('img')[0]);
				}
				else{
					pause();
				}
			},speed)
		};
		next=function(){
			publish($('li.active:eq(0)')[getter]().find('img')[0]);
		};
		slow=function(){
			speed=5000,
			restart();
		};
		medium=function(){
			speed=3000, //default
			restart();
		};
		fast=function(){
			speed=1000,
			restart();
		};
		reverse=function(){
			getter=getter==='next'?'prev':'next';
		};
		
		//helpers
		restart=function(){
			clearInterval();
			play();
		};
		publish=function(pub,evt){
			that.publish(pub,'slideshowReq'); //----------------------------------------------------------------------->
		};

		//execute
		switch(request){
			case 'pause':pause();break;
			case 'play':play();break;
			case 'next':next();break;
			case 'slow':slow();break;
			case 'medium':medium();break;
			case 'fast':fast();break;
			case 'reverse':reverse();break;
			default: break;
		}

	}.bind(this);

	this.init=function(){

		//run init on first fullShow only
		if(i>1){return}

		//add hand icon to thumbnails to indicate active state
		$('.thumbs ul').removeClass('uninitialized');

		//delegated thumb clicks
		$('#thumbs').bind('click',function(e){
			if(e.target.src&&$(e.target).parent().is(':not(.active)')){ //could be the li for scaled-down image
				that.publish(e.target,'thumbClick'); //---------------------------------------------------------------->
			}
		});

		//delegated button clicks
		$('#controls').bind('click',function(e){

			var $targ=$(e.target),
				toggles={a:$targ,b:$targ.parent()}; //elements which might have class=disabled

			if($targ.attr('type')==='button'){

				//diabled buttons don't do anything
				for(var i in toggles){if(toggles[i].hasClass('disabled')){return false}}

				that.publish($targ[0].id,'ctrlClick'); //--------------------------------------------------------------->
			}
		});

		//start slideshow
		that.publish('play','ctrlClick'); //---------------------------------------------------------------------------->

	};
}
