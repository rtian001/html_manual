$(document).ready(function () {
	


	// Autocomplete
	var sources = [];
	var $sources = $('section ul a');

	var refreshSources = function () {
		sources = [];

		$sources.each(function (i) {
			if (!$(this).hasClass('old-version')) {
				sources.push({
					label: $(this).text(),
					index: i
				});
			}
		});

		//$search.autocomplete('option', 'source', sources);
	}

	$('#version').change(function () {
		var value = $(this).val();
		var activate = false;

		$('section .old-version').removeClass('old-version removed');

		$(this).children().each(function () {
			var text = $(this).val();

			if (text == value) {
				activate = true;
			}

			if (!activate) {
				$(text).addClass('old-version removed');
			} else {
				$(text + '-d').addClass('old-version'); //Deprecated
				$(text + '-r').addClass('removed'); //Removed
			}
		});

		$('section ul').each(function () {
			if (!$(this).find('a:not(.old-version)').length) {
				$(this).parents('section').children('h2').addClass('old-version');
			} else {
				$(this).parents('section').children('h2').removeClass('old-version');
			}
		});

		refreshSources();
	});

	var initialVersion = document.location.hash;

	if (initialVersion) {
		initialVersion = 'a.v' + initialVersion.substr(1).replace('.', '-');
		$('#version').val(initialVersion);
	}

	$('#version').change();	

	
	
	var getSource = function (obj) {
		var output = [], temp;

		for (var i in obj) {
			if (obj.hasOwnProperty(i)) {
				temp = '"' + i + '"' + ":";

				switch (typeof obj[i]) {
					case "object" :
					temp += getSource(obj[i]);
					break;

					case "string" :
					temp += "\"" + obj[i] + "\"";    // add in some code to escape quotes
					break;

					default :
					temp += obj[i];
				}
				output.push(temp);
			}
		}
		return "{" + output.join() + "}";
	}

	// User Settings

	var settings = $.parseJSON($.cookie('settings')) || {};
	var $settings = $('#settings');
	var $themes = $('#theme');


	//Theme
	$themes.change(function () {
		settings.theme = $themes.val();
		$('#theme-styles').attr('href', $themes.val());
	});

	if (settings.theme) {
		$themes.val(settings.theme).change();
	}


	

	if (!settings.open_links) {
		settings.open_links = 'modal-window';
		settings.theme = 'css/colorfull.css';

		$.cookie('settings', getSource(settings), { expires: 365 });
	}

	$settings.find('input').click(function () {
		var $this = $(this);

		if ($this.is(':radio')) {
			settings[$this.attr('name')] = $this.val();
		} else if ($this.is(':checkbox')) {
			settings[$this.attr('name')] = $this.is(':checked');
		}
	});

	$('#settings-button').click(function () {
		$settings.dialog('open');
		return false;
	});


	

	

	
});
