var screenid = 3;

function load_general() {
	if (instant_lock == true) {
		return;
	}
	if (instant_lock == false) {
		$.get('ajax/playlist3.csv', function(data) {
			process_data(data,position,"general");
			position++;
		}); 
	}
}

function load() {
	$.get('ajax/instant3.csv', function(data) {
		process_data(data,1,"instant");
		if (rotation_counter > rotation_count) {
			rotation_counter = 0;
		}
		if (instant_lock == false && rotation_counter == 0) {
			$.get('ajax/playlist3.csv', function(data) {
				process_data(data,position,"general");
				position++;
			}); 
		}
		rotation_counter++;
	}); 
}
