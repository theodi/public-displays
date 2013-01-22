<?php
$person = $_GET["person"];
$contents = file_get_contents("http://www.theodi.org/people/" . $person);
$contents = substr($contents,strpos($contents,'<div id="content" class="column span9" role="main">')+strlen('<div id="content" class="column span9" role="main">'),strlen($contents));
$contents = substr($contents,0,strpos($contents,'<aside id="sidebar_second"'));
get_header();
get_branding();
echo '
<style>
.screen {
	display: inline-block;
	margin: 0.5em;
	text-align: center;
	font-size: 2em;
	padding-top: 1em;
	width: 150px;
	height: 50px;
	border: 1px solid blue;
	border-radius: 10px;
	cursor: pointer;
}
.all_off {
	float: right;
}
</style>
<script>
var screens = [];
/*
$.ajaxSetup({
	cache: false;
});
*/
function toggle(number) {
	if (screens[number]) {
		$("#screen"+number).css("background-color","");
		screens[number] = false;
	} else {
		$("#screen"+number).css("background-color","blue");
		screens[number] = true;
	}	
}
function all_off() {
	$.get("http://screens.theodi.org/all_off.php", function(data) {});
}
function all_run() {
	$.get("http://screens.theodi.org/all_run.php", function(data) {});
}
function all_refresh() {
	$.get("http://screens.theodi.org/refresh.php", function(data) {});
}
function process_instant_action() {
	action = $("#actions").val();
	for (var i=0;i<screens.length;i++) {
		if (screens[i] == true) {
			write_instant(i,action);
		}
	}
}
function write_instant(screenid,action) {
	$.post("instant_action.php", { "screen": screenid, "action": action } );
}

</script>
';

echo '<div align="center">';
echo '<div align="left" style="padding: 1em; width: 95%; border: 1px solid black; border-radius: 10px;">';

echo '<h1>Instant Control</h1>';
echo '<div class="screen" id="screen1" onclick="toggle(1);">Screen 1</div>';
echo '<div class="screen" id="screen2" onclick="toggle(2);">Screen 2</div>';
//echo '<div class="screen" style="opacity: 0.5" id="screen3" onclick="toggle(3);">Screen 3</div>';
echo '<div class="screen all_off" onclick="all_refresh();">Reload</div>';
echo '<div class="screen all_off" onclick="all_off();">All Off!</div>';
echo '<div class="screen all_off" onclick="all_run();">Run All</div>';

$options = get_options();
output_option_box($options);

echo '<div align="center"><button onclick="process_instant_action()">Process Action</button></div>';

echo '</div></div>';

#echo '<div id="content" style="font-size: 1.4em;" role="main">';
#echo $contents;
get_footers();


function output_option_box($options) {
	echo '<div align="center">';
	echo '<select id="actions" style="font-size: 1.4em; width: 90%; height: 30px;">';
	for($i=0;$i<count($options);$i++) {
		$parts = explode(",",$options[$i]);
		$type = $parts[0];
		$url = $parts[1];
		echo '<option value="' . $options[$i] . '">' . strtoupper($type) . ' - ' . $url . '</option>';
	}
	echo '</select>';
	echo '</div>';
}

function get_options() {
	$options = array();
	if ($handle = opendir('ajax')) {
		while (false !== ($entry = readdir($handle))) {
			if ($entry != "." && $entry != "..") {
				if (substr($entry,-3) == "csv") {
					$in_options = process_file("ajax/" . $entry);
					if (is_array($in_options)) {
						$options = array_merge($options,$in_options);
					}
				}
			}
		}
		closedir($handle);
	}
	$done["home,home"] = true;
	for($i=0;$i<count($options);$i++) {
		if (!$done[trim($options[$i])]) {
			$out[] = trim($options[$i]);
			$done[trim($options[$i])] = true;
		}
	}
	return $out;
}
function process_file($path) {
	$handle = fopen($path,"r");
	while (!feof($handle)) {
		$line = fgets($handle);
		if ($line != "") {
			$options[] = $line;
		}
	}
	fclose($handle);
	return $options;
}

function get_branding() {
echo '
<header id="header" role="banner">
    <div class="branding">
          <a href="/" title="Home" rel="home" id="logo">
          
          <img src="http://www.theodi.org/sites/default/files/logo.svg" alt="Home" class="b_svg" width="131" height ="54">
          <img src="http://www.theodi.org/sites/default/files/logo.png" alt="Home" class="b_png" width="131" height ="54">        </a>
      
              <hgroup id="name-and-slogan">

                                  <h1 id="site-name">
              <a href="/" title="Open Data Institute" rel="home">
                              
          <img src="http://www.theodi.org/sites/default/files/logo_a.svg" alt="Open Data Institute" class="b_svg" width="326" height ="30">
          <img src="http://www.theodi.org/sites/default/files/logo_a.png" alt="Open Data Institute" class="b_png" width="326" height ="30">                            </a>
            </h1>
          
                                  <h2 id="site-slogan">
                          
          <span class="mission">Knowledge For Everyone</span>
	</h2>
                  </hgroup>
	  <div style="float: right; margin-right: 1em; margin-top: 0.5em;">
	  	<h1 style="font-weight: bold;">Screen Control</h1>
	  </div>
          </div>
</header>
';
}	
function get_header() {
	echo '
<!DOCTYPE html>
<html>
<head>
<style>@import url("http://www.theodi.org/modules/system/system.base.css?mc3hpr");
@import url("http://www.theodi.org/modules/system/system.messages.css?mc3hpr");
@import url("http://www.theodi.org/modules/system/system.theme.css?mc3hpr");</style>
<style>@import url("http://www.theodi.org/modules/aggregator/aggregator.css?mc3hpr");
@import url("http://www.theodi.org/sites/all/modules/date/date_api/date.css?mc3hpr");
@import url("http://www.theodi.org/modules/field/theme/field.css?mc3hpr");
@import url("http://www.theodi.org/modules/node/node.css?mc3hpr");
@import url("http://www.theodi.org/modules/user/user.css?mc3hpr");
@import url("http://www.theodi.org/sites/all/modules/views/css/views.css?mc3hpr");</style>
<style>@import url("http://www.theodi.org/sites/all/modules/ckeditor/ckeditor.css?mc3hpr");</style>
<style>@import url("http://www.theodi.org/sites/all/themes/odi/css/print.css?mc3hpr");
@import url("http://www.theodi.org/sites/all/themes/odi/css/odi.css?mc3hpr");</style>
<script src="http://code.jquery.com/jquery-1.7.2.min.js"></script>
<link rel="apple-touch-icon" href="apple-touch-icon.png" />
<link rel="apple-touch-icon" sizes="72x72" href="apple-touch-icon-72.png" />
<link rel="apple-touch-icon" sizes="114x114" href="apple-touch-icon-114.png" />
</head>
<body class="html not-front not-logged-in one-sidebar sidebar-second page-node page-node- page-node-45 node-type-team-member section-people" >
';
}

function get_footers() {
echo '</body></html>';
}

?>
