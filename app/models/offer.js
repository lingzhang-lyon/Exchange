/**
 * offer model
 */
// load the things we need
var mongoose = require('mongoose');

// define the schema for our post model
var offerSchema = mongoose.Schema({

	offerId : String,
	buyingQty : Number,
	offeredDetails : String,
	buyerStatus : String,
	sellerStatus : String,
	offerExpiry : Date,
	productId : Number,
	buyerId : Number,
	lastModified : Date,

});

module.exports = mongoose.model('Offer', offerSchema);