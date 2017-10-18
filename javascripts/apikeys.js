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