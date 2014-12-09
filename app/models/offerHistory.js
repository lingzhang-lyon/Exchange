/**
 * OfferHistory Model
 */
// load the things we need
var mongoose = require('mongoose');

// define the schema for our post model
var offerHistorySchema = mongoose.Schema({

	offerHistoryId : Number,
	modified : String,
	lastModified : Date,
	offerId : String

});

module.exports = mongoose.model('OfferHistory', offerHistorySchema);