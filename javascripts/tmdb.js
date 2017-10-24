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
	dom.clearDom();
	dom.domString(movieArray, imgConfig);
};

module.exports = {setKeys, searchMovies};