// load the things we need
var mongoose = require('mongoose');

// define the schema for our post model
var productSchema = mongoose.Schema({
	productName		  : String,
	userId			  : Number,
	quantity		  : Number,
	expectedOffer	  : String,
	productDesc		  : String,
	productExpiryDate : Date,
	isValid			  : Number,
	categoryId		  : Number,
	lastUpdated		  : Date
});

module.exports = mongoose.model('Product', productSchema);