<?php

	$screenid = $_POST["screen"];
	
	$handle = fopen('ajax/instant' . $screenid . '.csv',"w");
	fwrite($handle,"");
	fclose($handle);
?>
