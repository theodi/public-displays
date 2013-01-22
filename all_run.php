<?php

	for($i=0;$i<5;$i++) {
		$handle = fopen("ajax/instant" . $i . ".csv","w");
		$line = "";
		fwrite($handle,$line);
		fclose($handle);
	}

?>
