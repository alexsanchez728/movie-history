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