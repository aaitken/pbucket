//create namespace
PBT.scaffolding.namespace('utils');

PBT.utils={
	//http://james.padolsey.com/javascript/get-document-height-cross-browser/
	getDocHeight:function(){
		var D = document;
		return Math.max(
			Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
			Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
			Math.max(D.body.clientHeight, D.documentElement.clientHeight)
		);
	}
};