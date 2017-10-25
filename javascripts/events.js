"use strict";

const tmdb = require("./tmdb");
const dom = require("./dom");
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
			firebaseApi.getMovieList().then((results) => {
				dom.clearDom('moviesMine');
				dom.domString(results, tmdb.getImgConfig(), 'moviesMine', false);
			}).catch((err) => {
				console.log("error in getMovieList", err);
			});
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
		}).catch((err) => {
			console.log("error in authenticateGoogle", err);
		});
	});
};

const wishListEvents = () => {
	$("body").on("click", ".wishlist", (e) => {

		let mommy = e.target.closest(".movie");

		let newMovie = {
			"title": $(mommy).find(".title").html(),
			"overview": $(mommy).find(".overview").html(),
			"poster_path": $(mommy).find(".poster_path").attr("src").split("/").pop(),
			"rating": 0,
			"isWatched": false,
			"uid":""
		};

		firebaseApi.saveMovie(newMovie).then((results) => {
			$(mommy).remove();
		}).catch((err) => {
			console.log("error in saveMovie", err);
		});

	});
};

const reviewEvents = () => {
	$("body").on("click", ".review", (e) => {

		let mommy = e.target.closest(".movie");

		let newMovie = {
			"title": $(mommy).find(".title").html(),
			"overview": $(mommy).find(".overview").html(),
			"poster_path": $(mommy).find(".poster_path").attr("src").split("/").pop(),
			"rating": 0,
			"isWatched": true,
			"uid":""
		};

		firebaseApi.saveMovie(newMovie).then((results) => {
			$(mommy).remove();
		}).catch((err) => {
			console.log("error in saveMovie", err);
		});

	});
};

const init = () => {
	myLinks();
	googleAuth();
	pressEnter();
	wishListEvents();
	reviewEvents();
};



module.exports = {init};