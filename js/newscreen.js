var playlist = [];
var flickr_api_key = "";

$.getJSON( "config.json", function( data ) {
	flickr_api_key = data.flickr_api_key;
});

function init() {
	updatePinboardData("theodi");
	loadStaticPlaylist("ajax/static.csv");
	loadGDSSearch("getContent.php?url=http://contentapi.theodi.org/with_tag.json?person=team","http://theodi.org/team/");
	loadGDSSearch("getContent.php?url=http://contentapi.theodi.org/with_tag.json?type=creative_work","http://theodi.org/culture/");
	loadGDSSearch("getContent.php?url=http://contentapi.theodi.org/with_tag.json?article=news","http://theodi.org/news/");
	loadFlickrPhotos(flickr_api_key,"93591348@N03");
	next();
	timer_id = setInterval("next();",5000);
}
