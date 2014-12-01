// load the things we need
var mongoose = require('mongoose');

// define the schema for our post model
var categorySchema = mongoose.Schema({
	catId		: Number,
	catValue	: String
});

categorySchema.index({catId: 1});
categorySchema.set('autoIndex', true);

module.exports = mongoose.model('Category', categorySchema);