(function(ctxt){

	//app namespace is PBT
	ctxt.PBT={

		//scaffolding = namespacing and pubsub architectural components
		scaffolding:{

			//non-clobbering convenience namespacer
			namespace:function(name){

				var parts=name.split('.'),
					parent=PBT,
					parentString='PBT',
					i;

				//strip redundant leading global
				if(parts[0]===parentString){
					parts=parts.slice(1);
				}

				for(i=0;i<parts.length;i++){
					//create property if it doesn't exist
					if(typeof parent[parts[i]]==='undefined'){
						parent[parts[i]]={};
					}
					parent=parent[parts[i]];
				}
				return parent;
			},

			//publisher/subscriber implementation per Stefanov
			//(which I prefer using over a jQuery custom event implementation)
			pubSub:{
				publisher:{
					subscribers:{
						any:[]//default catcher
					},
					subscribe:function(fn,type){
						type=type||'any';
						if(typeof this.subscribers[type]==='undefined'){
							this.subscribers[type]=[];//if subscription passes a type we don't have, make new array for this
						}
						this.subscribers[type].push(fn);//push subscriber function to default 'any' or explicitly-provided type array
					},
					unsubscribe:function(fn,type){
						this.visitSubscribers('unsubscribe',fn,type);
					},
					publish:function(publication,type){//publication is what we're putting out, type defines who we put it out to (based on consumer's subscription)
						this.visitSubscribers('publish',publication,type);
					},
					visitSubscribers:function(action,arg,type){//communicate the published event to subscribers - arg is parameter of client function for 'publish,' client function itself for 'unsubscribe'

						var pubtype=type||'any',
							subscribers=this.subscribers[pubtype]||null,
							i,
							max;

						if(subscribers){
							max=subscribers.length;
							for(i=0;i<max;i++){
								if(action==='publish'){
									subscribers[i](arg);//fire that bad boy with its argument
								}
								else{//action==='unsubscribe'
									if(subscribers[i]===arg){
										subscribers.splice(i,1);//remove from subscribers array
									}
								}
							}
						}
					}
				},

				//function for turning an object into a publisher through mix-in of generic publisher's methods
				makePublisher:function(o){

					var i;

					for(i in this.publisher){
						if(this.publisher.hasOwnProperty(i)&&typeof this.publisher[i]==='function'){
							o[i]=this.publisher[i];
						}
					}
					o.subscribers={
						any:[]
					};
				}
			}
		}
	};

	//x-browser implementation of ES5's bind
	if(typeof Function.prototype.bind==='undefined'){
		Function.prototype.bind=function(thisArg){
			var fn=this,
				slice=Array.prototype.slice,
				args=slice.call(arguments,1);
			return function(){
				return fn.apply(thisArg,args.concat(slice.call(arguments)));
			};
		}
	}
}(window));