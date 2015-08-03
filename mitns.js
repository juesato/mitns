/* The MIT People directory answers queries based on substring matches.
 * Kerberos emails can contain letters, numbers, underscores, periods, and dashes. They are 8 characters or less
 * It is not case-sensitive.
 * I ignore unusual punctuation, these users are caught through other parts of their handle.
 * For example, j_uesato would not match j_* but would match ues*
 */

var request = require('request'),
	cheerio = require('cheerio');

var usernames = {};

var validChars = 'abcdefghijklmnopqrstuvwxyz1234567890';
var base_url = 'http://web.mit.edu/bin/cgicso?options=general&query=';

function scrape(str) {
	request(base_url + str + '*', function(err, res, body) {
		$ = cheerio.load(body);
		$(".dir").each(function(idx) {
			var txt = $(this).text().trim();
			var lines = txt.split('\n');
			var last = lines[lines.length - 1];
			// console.log(last);
			// console.log(lines);
			if (last == "Did not understand query." || last == "more information.  For example, for j* Smith, try john_smith.") {
				console.log("didnt understand");
			}
			else {
				var html = $(this).html();
				var links = html.match(/<a href="(.*?)"/g);
				for (var i = 0; i < links.length; i++) {
					var inner = links[i].slice(9, -1);
					getLink(inner);
				}
			}
		});
	});
}

function getLink(url) {
	var base = 'http://web.mit.edu';
	request(base + url, function(err, res, body) {
		$ = cheerio.load(body);
		$(".dir").each(function(idx) {
			var txt = $(this).text().trim();
			var regexp = /email: (.*?)@/;
			var match = regexp.exec(txt);
			console.log(match);
			var username = match[1];
			console.log(username);

			// console.log(match[0]);
		});
	});
}

scrape('abad');
