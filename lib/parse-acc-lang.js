function parse_lang_range (lang_range) {
	var reg = /^([a-z]{2}|\*)(-([a-z]{2}))?(;q=[0-9.]*)?$/i;
	var match = lang_range.trim().match(reg); 
	
	if (match) {
		var result = {};
		if (match[1]) { // language
			result.language = match[1].toLowerCase();
		}
		if (match[3]) { // locale
			result.locale = match[3].toUpperCase();
		}
		return result;
	}
	return undefined;
}

function extract_first_accept_language(acc_lang_header) {
	// return if input is invalid
	if (!acc_lang_header) {
		return undefined;
	}
	
	var split = acc_lang_header.split(",");
	if (split[0]) {
		return parse_lang_range(split[0]);
	} else {
		return undefined;
	}
}


function extract_all_accept_languages(acc_lang_header) {
	// return if input is invalid
	if (!acc_lang_header) {
		return undefined;
	}

	var split = acc_lang_header.split(",");
	if (split.length > 0) {
		var result = [];
		split.forEach( function (i) {
			var extretion = parse_lang_range(i);
			if (extretion) {
				result.push(extretion);
			}
		});

		if (result.length > 0) {
			return result;
		} else {
			return undefined;
		}
	} else {
		return undefined;
	}
}

exports.extract_first_accept_language = extract_first_accept_language;
exports.extract_all_accept_languages = extract_all_accept_languages;