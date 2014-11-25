// load the things we need
var mongoose = require('mongoose');

// define the schema for our post model
var categorySchema = mongoose.Schema({
	catId		: String,
	catValue	: String
});

module.exports = mongoose.model('Category', categorySchema);