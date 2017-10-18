(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

const tmdb = require("./tmdb");

const apiKeys = () => {
	return new Promise((resolve, reject) => {
		$.ajax("./db/apiKeys.json").done((data) => {
			resolve(data.apiKeys);
		}).fail((error) => {
			reject(error);
		});
	});
};

const retrieveKeys = () => {
	apiKeys().then((results) => {
		tmdb.setKeys(results.tmdb.apiKey);
	}).catch((error) => {
			console.log("error", error);
	});
};

module.exports = {retrieveKeys};
},{"./tmdb":5}],2:[function(require,module,exports){
"use strict";

const domString = (movieArray) => {
	let domStrang = "";
	for (let i=0; i<movieArray.length; i++) {
		if (i % 3 === 0) {
			domStrang +=	`<div class="row">`;
		}
		domStrang +=			`<div class="col-sm-6 col-md-4">`;
		domStrang +=				`<div class="thumbnail">`;
		domStrang +=					`<img src="" alt="">`;
		domStrang +=					`<div class="caption">`;
		domStrang +=						`<h3>${movieArray[i].original_title}</h3>`;
		domStrang +=						`<p>${movieArray[i].overview}</p>`;
		domStrang +=						`<p><a href="#" class="btn btn-primary" role="button">Review</a> <a href="#" class="btn btn-default" role="button">Watchlist</a></p>`;
		domStrang +=					`</div>`;
		domStrang +=				`</div>`;
		domStrang +=			`</div>`;
		if (i % 3 === 2 || i === movieArray.length - 1) {
			domStrang +=	`</div>`;
		}
	}

	printToDom(domStrang);
};

const printToDom = (strang) => {
	$("#movies").append(strang);
};


const clearDom = () => {
	$("#movies").empty();
};

module.exports = {domString, clearDom};
},{}],3:[function(require,module,exports){
"use strict";

const tmdb = require("./tmdb");

const pressEnter = () => {
	$(document).keypress((event) => {
		if (event.key === "Enter") {
			let searchText = $("#search-bar").val();
			let query = searchText.replace(/ /g, "%20");
			tmdb.searchMovies(query);
		} 
	});


};

module.exports = {pressEnter};
},{"./tmdb":5}],4:[function(require,module,exports){
"use strict";

let events = require("./events");
let apiKeys = require("./apiKeys");

apiKeys.retrieveKeys();
events.pressEnter();
},{"./apiKeys":1,"./events":3}],5:[function(require,module,exports){
"use strict";

let tmdbKey;
const dom = require("./dom");

const searchTMDB = (query) => {
	return new Promise((resolve, reject) => {
		$.ajax(`https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&language=en-US&page=1&include_adult=false&query=${query}`).done((data) => {
			resolve(data.results);
		}).fail((error) => {
			reject(error);
		});
	});
};

const searchMovies = (query) => {
	searchTMDB(query).then((data) => {
			showResults(data);
	}).catch((error) => {
		console.log("error in search movies", error);
	});
};

const setKeys = (apiKey) => {
	tmdbKey = apiKey;
};

const showResults = (movieArray) => {
	dom.clearDom();
	dom.domString(movieArray);
};

module.exports = {setKeys, searchMovies};
},{"./dom":2}]},{},[4]);
