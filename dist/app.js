(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

const tmdb = require("./tmdb");
const firebaseApi = require("./firebaseApi");

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
		firebaseApi.setKey(results.firebaseKeys);
		firebase.initializeApp(results.firebaseKeys);
	}).catch((error) => {
			console.log("error", error);
	});
};

module.exports = {retrieveKeys};
},{"./firebaseApi":4,"./tmdb":6}],2:[function(require,module,exports){
"use strict";

const domString = (movieArray, imgConfig, divName) => {
	let domStrang = "";
	for (let i=0; i<movieArray.length; i++) {
		if (i % 3 === 0) {
			domStrang +=	`<div class="row">`;
		}
		domStrang +=			`<div class="col-sm-6 col-md-4">`;
		domStrang +=				`<div class="thumbnail">`;
		domStrang +=					`<img src="${imgConfig.base_url}/w342/${movieArray[i].poster_path}" alt="">`;
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

	printToDom(domStrang, divName);
};

const printToDom = (strang, divName) => {
	$(`#${divName}`).append(strang);
};


const clearDom = (divName) => {
	$(`#${divName}`).empty();
};

module.exports = {domString, clearDom};
},{}],3:[function(require,module,exports){
"use strict";

const tmdb = require("./tmdb");
const firebaseApi = require("./firebaseApi");

const pressEnter = () => {
	$(document).keypress((event) => {
		if (event.key === "Enter") {
			let searchText = $("#search-bar").val();
			let query = searchText.replace(/ /g, "%20");
			tmdb.searchMovies(query);
		} 
	});
};


// Add function: myLinks - click events that checks the id of event.target and:
const myLinks = () => {
	$(document).click((e) => {
		if (e.target.id === "navSearch") {
			$("#search").removeClass("hide");
			$("#myMovies").addClass("hide");
			$("#authScreen").addClass("hide");
		} else if (e.target.id === "mine") {
			$("#search").addClass("hide");
			$("#myMovies").removeClass("hide");
			$("#authScreen").addClass("hide");
		} else if (e.target.id === "authenticate") {
			$("#search").addClass("hide");
			$("#myMovies").addClass("hide");
			$("#authScreen").removeClass("hide");
		}
	});
};

const googleAuth = () => {
	$("#googleButton").click((event) => {
		firebaseApi.authenticateGoogle().then((result) => {
			console.log("result", result);
		}).catch((err) => {
			console.log("error in authenticateGoogle", err);
		});
	});
};


module.exports = {pressEnter, myLinks, googleAuth};
},{"./firebaseApi":4,"./tmdb":6}],4:[function(require,module,exports){
"use strict";

let firebaseKey = "";
let userUid = "";

const setKey = (key) => {
	firebaseKey = key;
};

//Firebase: GOOGLE - Use input credentials to authenticate user.
let authenticateGoogle = () => {
  return new Promise((resolve, reject) => {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then((authData) => {
      	userUid = authData.user.uid;
          resolve(authData.user);
      }).catch((error) => {
          reject(error);
      });
  });
};

module.exports = {setKey, authenticateGoogle};
},{}],5:[function(require,module,exports){
"use strict";

let events = require("./events");
let apiKeys = require("./apiKeys");

apiKeys.retrieveKeys();
events.myLinks();
events.googleAuth();
events.pressEnter();
},{"./apiKeys":1,"./events":3}],6:[function(require,module,exports){
"use strict";

let tmdbKey;
let imgConfig;
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

const tmdbConfiguration = () => {
	return new Promise((resolve, reject) => {
		$.ajax(`https://api.themoviedb.org/3/configuration?api_key=${tmdbKey}`).done((data) => {
			resolve(data.images);
		}).fail((error) => {
			reject(error);
		});
	});
};

const getConfig = () => {
	tmdbConfiguration().then((results) => {
		imgConfig = results;
	}).catch((error) => {
		console.log("error in getConfig", error);
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
	getConfig();
};

const showResults = (movieArray) => {
	dom.clearDom('movies');
	dom.domString(movieArray, imgConfig, 'movies');
};

module.exports = {setKeys, searchMovies};
},{"./dom":2}]},{},[5]);
