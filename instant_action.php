<?php

	$screen = $_POST['screen'];
	$action = $_POST['action'];
	

	$handle = fopen('ajax/instant' . $screen . '.csv',"w");
	fwrite($handle,$action);
	fclose($handle);


?>
