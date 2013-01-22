<?php

	for($i=0;$i<5;$i++) {
		$handle = fopen("ajax/instant" . $i . ".csv","w");
		$line = "home,home";
		fwrite($handle,$line);
		fclose($handle);
	}

?>
