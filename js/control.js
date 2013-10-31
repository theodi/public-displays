$.ajaxSetup ({
    // Disable caching of AJAX responses
    cache: false
});

function switch_video(src) {
	$("#odilogo").fadeOut(2000, function() {
		$("#overlay").html('<div id="video_div" class="video_div"><video id="video" class="video" autoplay="false"><source src="'+src+'" type="video/mp4;"/></video></div>');
		$("#overlay").fadeIn(2000, function () {
			$("#video").get(0).play();
			$("#video").bind("ended", function() {
				$("#overlay").fadeOut(2000, function() {
					instant_lock = false;
					$("#odilogo").fadeIn(2000);
		                        $("#overlay").html('');
       		       		});
			});
		})	
	});
}

function switch_youtube(src) {
	$("#odilogo").fadeOut(2000, function() {
		$("#overlay").html('<div id="video_div" class="video_div"></div>');
		$("#overlay").fadeIn(2000, function () {
			jQuery("#video_div").tubeplayer({	
				width: 1540, // the width of the player
				height: 870, // the height of the player
				autoPlay: true,
				showinfo: false,
				showControls: 0,
				modestbranding: false,
				initialVideo: src, // the video that is loaded into the player
				preferredQuality: "hd720",// preferred quality: default, small, medium, large, hd720
				onPlayerEnded: function(){
					$("#overlay").fadeOut(2000, function() {
                                	        instant_lock = false;
                                        	$("#odilogo").fadeIn(2000);
                                       		$("#overlay").html('');
					});
				}, // after the player is stopped
			});
		});
	});
}

function switch_vimeo(src) {
	$("#odilogo").fadeOut(2000, function() {
		$("#overlay").html('<div id="video_div" class="video_div"><iframe id="player1" src="http://player.vimeo.com/video/'+src+'?api=1&player_id=player1&autoplay=1&controls=0" width="1540" height="870" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe></div>');
		$("#overlay").fadeIn(2000, function () {
			var iframe = $('#player1')[0],
   			player = $f(iframe),
			status = $('.status');
				
			player.addEvent('ready', function() {
    				player.addEvent('finish', function() {
					$("#overlay").fadeOut(2000, function() {
                                	        instant_lock = false;
                                        	$("#odilogo").fadeIn(2000);
                                       		$("#overlay").html('');
					});
    				
				});		
			});
		});
	});
}



function switch_image(src) {
	$("#odilogo").fadeOut(2000, function() {
		$("#overlay").css('background-color', 'black');
		$("#overlay").html('<div id="image_div" class="image_div"><img class="image" src="'+src+'"/></div>');
		$("#overlay").fadeIn(2000);
	});
}

function switch_image_current(src) {
	$("#image_div").fadeOut(2000, function() {
		$("#image_div").html('<img class="image" src="'+src+'"/>');
		$("#image_div").fadeIn(2000);
	});
}

function switch_html(src) {
	$("#overlay").fadeOut(2000, function () {
		$("#overlay").html('<div align="center"><div id="html_div" class="html_div"><div id="html_div_inner" class="html_div_inner"><iframe id="iframe" class="iframe" src="'+src+'"></iframe></div></div></div>');
		$("#overlay").fadeIn(2000);
	});
}

function switch_html_current(src) {
	$("#html_div_inner").fadeOut(2000, function () {
		$("#html_div_inner").html('<iframe id="iframe" class="iframe" src="'+src+'"></iframe>');
		$("#html_div_inner").fadeIn(2000);
	});
}


var current_type = "home";
var current_url = "home";
var timer_id;
var position = 1;
var instant_lock = false;

//Initial playlist counter
var rotation_counter = 0;
// How often we change in the general playlist
var rotation_count = 5;

function process_data(type,url,urgency) {
	if (type == "" || url == "") {
		if (current_type != "video") {
			instant_lock = false;
		}
		return;
	} else if (urgency == "instant" && type != "") {
	//	instant_lock = true;
	}
	if (instant_lock == true) {
		if (type == "video" || type == "youtube" || type == "vimeo") {
			$.post("http://screens.theodi.org/instant_unlock.php", { "screen": screenid  } );
		}
	}
	process_event(type,url);
}

function process_event(type, url) {
	if (type === current_type && current_url === url) {
		return;
	}
//	clearTimeout(timer_id_instant);
	if (type == "home") {
		if (current_type == "video") {
			$("#overlay").fadeOut(2000, function() { 
				$("#video").get(0).pause();
				$("#overlay").html('');
				eventGo(type,url);
			});
		} else {
			$("#overlay").fadeOut(2000, function() {
				eventGo(type,url);
			});
		}
	}
	if (current_type == type) {
		eventGo(type,url);
	} else if (current_type != "home") {
		$("#overlay").fadeOut(2000, function() { 
			$("#odilogo").fadeIn(2000, function() {
				eventGo(type,url);
			});
		});
	} else {
		eventGo(type,url);
	}
}	

function eventGo(type,url) {
	if (type == "video") {
		instant_lock = true;
		current_type = "video";
		current_url = url;
		switch_video(url);
	}	
	if (type == "youtube") {
		instant_lock = true;
		current_type = "video";
		current_url = url;
		switch_youtube(url);
	}	
	if (type == "vimeo") {
		instant_lock = true;
		current_type = "video";
		current_url = url;
		switch_vimeo(url);
	}	
	if (type == "home") {
		$("#odilogo").fadeIn(2000);
		current_type = "home";
		current_url = "home";
	}
	if (type == "html") {
		if (current_type == "html") {
			switch_html_current(url);
		} else {
			switch_html(url);
		}
		current_type = "html";
		current_url = url;
	}
	if (type == "img") {
		if (current_type == "img") {
			switch_image_current(url);
		} else {
			switch_image(url);
		}
		current_type = "img";
		current_url = url;
	}
//	timer_id_instant = setInterval("load_instant();",10000);
	
}

function loadStaticPlaylist(url) {
	console.log("Loading pre-defined playlist from " + url);
	$.get(url, function(data) {
		lines = data.split(/\r\n|\n/);
		for(i=0;i<lines.length;i++) {
			entry = lines[i].split(',');
			var tmp = {};
			tmp.type = entry[0];
			tmp.link = entry[1];
			if (tmp.link) {
				playlist.push(tmp);
			}
		}
	});
}

function loadGDSSearch(url,prefix) {
     console.log("Loading data from GDS system for " + prefix);
     $.ajax({
          url:url,
	  async: false,
          dataType:'json',
	  contentType: "application/json",
          success: function(data) {
		results = data.results;
		$.each(results, function(index, item) {
			tmp = {};  
			tmp.type = "html";
			tmp.link = prefix + item.slug;
			playlist.push(tmp);
		});
	}
     });
}

function loadFlickrPhotos(flickr_api_key,user_id) {
     console.log("Loading data from Flickr");
     url = "http://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key="+flickr_api_key+"&user_id="+user_id+"&format=json&jsoncallback=?";
     $.getJSON( url, function( data ) {
	photos = data.photos.photo;
	$.each(photos, function(index, item) {
		url2 = url = "http://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key="+flickr_api_key+"&photo_id="+item.id+"&format=json&jsoncallback=?";
		$.getJSON( url2, function( data2 ) {
			sizes = data2.sizes.size;
			pos = sizes.length -1;
			var tmp = {};
			tmp.type = "img";
			tmp.link = sizes[pos].source;
			playlist.push(tmp);
		});
	});
     }); 
}


function updatePinboardData(user) {
     console.log("Loading data from pinboard"); 
     $.ajax({
          url:'http://feeds.pinboard.in/json/u:' + user,
          jsonp:"cb",
          dataType:'jsonp',
          success: function(data) {
		$.each(data, function(index, item){
			var tmp = {};
			tmp.link = item.u;
			tmp.title = item.d;
			tmp.type = getType(item.u);
			if (tmp.type != "html") {
				tmp.link = getLink(item.u,tmp.type);
			}
			playlist.push(tmp);
		});
          } //success
     }); //ajax
}

function getType(url) {
	if (url.indexOf("youtube") > 0) {
		return "youtube";
	}
	if (url.indexOf("vimeo") > 0) {
		return "vimeo";
	}
	return "html";
}

function getLink(url,type) {
	if (type == "youtube") {
		url = url.substring(url.indexOf("v=")+2,url.length);
		if (url.indexOf("&") > 0) {
			url = url.substring(0,url.indexOf("&"));
		}
		return url;
	} 
	if (type == "vimeo") {
		url = url.substring(url.lastIdexOf("/"),url.length);
		if (url.indexOf("&") > 0) {
			url = url.substring(0,url.indexOf("?"));
		}
		return url;
	}
	return url;
}

function next() {
	if (rotation_counter > rotation_count) {
		rotation_counter = 0;
	}
	if (instant_lock == false && rotation_counter == 0 && playlist.length > 0) {
		var length = playlist.length + 1;
		var random = Math.floor(Math.random()*length);
		var item = playlist[random];
		console.log("Loading " + item.link + " ("+item.type+")");
		process_data(item.type,item.link,"");
	}
	rotation_counter++;
}
