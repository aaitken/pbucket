//ES5 Native binding====================================================================================================
//EcmaScript 5 spec adds a bind method to Function.prototype = binding becomes as easy as call
//or apply. Function below makes implementation bullet-proof for pre-ES5 environments
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