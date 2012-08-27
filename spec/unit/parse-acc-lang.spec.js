var extract_first_accept_language = require("lib/parse-acc-lang").extract_first_accept_language;
var extract_all_accept_languages = require("lib/parse-acc-lang").extract_all_accept_languages;

describe("accept-language http header parser", function () {
	describe("in case of valid headers", function () {

		describe("when only one language is of interest extract_first_accept_language", function () {
			it("should extract the highest ranked language", function() {
				var acc_lang_header_content = "de";
				var result = extract_first_accept_language(acc_lang_header_content);
				expect(result.language).toEqual("de");
			});

			it("should not return any locale if not present", function () {
				var acc_lang_header_content = "de";
				var result = extract_first_accept_language(acc_lang_header_content);
				expect(result.locale).toBeUndefined();
			});

			it("should extract the highest ranked language and locale", function() {
				var acc_lang_header_content = "de-DE";
				var result = extract_first_accept_language(acc_lang_header_content);
				expect(result.language).toEqual("de");
				expect(result.locale).toEqual("DE");
			});

			it("should ensure that the language is in lower case", function () {
				var acc_lang_header_content = "DE-DE";
				var result = extract_first_accept_language(acc_lang_header_content);
				expect(result.language).toEqual("de");
			});

			it("should ensure that the locale is in upper case", function () {
				var acc_lang_header_content = "de-de";
				var result = extract_first_accept_language(acc_lang_header_content);
				expect(result.locale).toEqual("DE");
			});

			it("should handle the special any char (*) correctly", function () {
				var acc_lang_header_content = "*";
				var result = extract_first_accept_language(acc_lang_header_content);
				expect(result.language).toEqual("*");
			});
		});

		describe("when multiple languages are of interest extract_all_accept_languages", function () {
			it("should parse multiple languages like: de, en", function () {
				var acc_lang_header_content = "de, en";
				var result = extract_all_accept_languages(acc_lang_header_content);

				expect(result.length).toEqual(1);

				expect(result[0].language).toEqual("de");
				expect(result[1].language).toEqual("en");
			});
			
			it("should parse multiple languages with locale", function () {
				var acc_lang_header_content = "de-DE, en-GB";
				var result = extract_all_accept_languages(acc_lang_header_content);

				expect(result.length).toEqual(2);

				expect(result[0].language).toEqual("de");
				expect(result[0].locale).toEqual("DE");

				expect(result[1].language).toEqual("en");
				expect(result[1].locale).toEqual("GB");
			});
			
			it("should parse multiple languages with locale and priority extract_all_accept_languages", function () {
				var acc_lang_header_content = "de-DE,de;q=0.8,en-US;q=0.6,en;q=0.4";
				var result = extract_all_accept_languages(acc_lang_header_content);

				expect(result.length).toEqual(4);

				expect(result[0].language).toEqual("de");
				expect(result[0].locale).toEqual("DE");

				expect(result[1].language).toEqual("de");
				expect(result[1].locale).toBeUndefined();

				expect(result[2].language).toEqual("en");
				expect(result[2].locale).toEqual("US");

				expect(result[3].language).toEqual("en");
				expect(result[3].locale).toBeUndefined();
			});
		});
	});

	describe("in case of missing headers extract_all_accept_languages", function () {
		it("should be resilient to undefined input", function () {
			var acc_lang_header_content;
			var result = extract_all_accept_languages(acc_lang_header_content);

			expect(result).toBeUndefined();
		});
		
		it("should be resilient to empty headers", function () {
			var acc_lang_header_content = "";
			var result = extract_all_accept_languages(acc_lang_header_content);

			expect(result).toBeUndefined();
		});
	});

	describe("in case of invalid headers extract_all_accept_languages", function () {
		it("should be resilient to chines jibberisch", function () {
			var acc_lang_header_content = "8痂";
			var result = extract_all_accept_languages(acc_lang_header_content);

			expect(result).toBeUndefined();
		});

		it("should be resilient to none 2-ALPHA languages like: ded", function () {
			var acc_lang_header_content = "ded";
			var result = extract_all_accept_languages(acc_lang_header_content);

			expect(result).toBeUndefined();
		});

		it("should be resilient to jibberisch", function () {
			var acc_lang_header_content = "§$$&de";
			var result = extract_all_accept_languages(acc_lang_header_content);

			expect(result).toBeUndefined();
		});

		it("should be resilient to dashes", function () {
			var acc_lang_header_content = "-";
			var result = extract_all_accept_languages(acc_lang_header_content);

			expect(result).toBeUndefined();
		});
		
		it("should be resilient to numbers", function () {
			var acc_lang_header_content = "12364";
			var result = extract_all_accept_languages(acc_lang_header_content);

			expect(result).toBeUndefined();
		});
	});
});