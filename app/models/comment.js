/**
 * Comment Model
 */
// load the things we need
var mongoose = require('mongoose');

// define the schema for our post model
var commentSchema = mongoose.Schema({

	commentId : Number,
	commentDesc : String,
	lastUpdated : Date,
	offerId : Number,
	userId : Number

});

commentSchema.index({commentId: 1});
commentSchema.set('autoIndex', true);

module.exports = mongoose.model('Comment', commentSchema);