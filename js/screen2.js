var screenid = 2;

function load_general() {
	if (instant_lock == true) {
		return;
	}
	if (instant_lock == false) {
		$.get('ajax/playlist2.csv', function(data) {
			process_data(data,position,"general");
			position++;
		}); 
	}
}

function load() {
	$.get('ajax/instant2.csv', function(data) {
		process_data(data,1,"instant");
		if (rotation_counter > rotation_count) {
			rotation_counter = 0;
		}
		if (instant_lock == false && rotation_counter == 0) {
			$.get('ajax/playlist2.csv', function(data) {
				process_data(data,position,"general");
				position++;
			}); 
		}
		rotation_counter++;
	}); 
}
