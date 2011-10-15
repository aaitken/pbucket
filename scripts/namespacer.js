//Global namespace - no clobbering
var PBT=PBT||{};

PBT.namespace=function(name){
    var parts=name.split('.'),
        parent=PBT,
        i;
    
    //strip redundant leading global
    if(parts[0]==='PBT'){
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
};
