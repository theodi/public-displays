<?php

	$file = 'ajax/refresh.count';

	$count = file_get_contents($file);
	$count = trim($count);
	$count = $count + 1;
	$handle = fopen($file,'w');
	fwrite($handle,$count);
	fclose($handle);


?>
