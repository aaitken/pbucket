//make all methods available
PBT.data.setup(jQuery);
PBT.page.setup(jQuery);

//set up pubsub
PBT.data.pubSub();
PBT.page.pubSub();

//kick it off
PBT.data.getJson({uri:'feed/slideshow.json'});
