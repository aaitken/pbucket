//make all methods available
PBT.data.setup(jQuery);
PBT.page.setup(jQuery);
PBT.slideshow.setup(jQuery);

//set up pubsub
PBT.data.pubSub();
PBT.page.pubSub();
PBT.slideshow.pubSub();

//kick it off
PBT.data.getJson({uri:'feed/slideshow.json'});

