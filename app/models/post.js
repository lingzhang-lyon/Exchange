// load the things we need
var mongoose = require('mongoose');

// define the schema for our post model
var postSchema = mongoose.Schema({
	poster			: String,
	title			: String,
	createDate		: Date,
	expireDate		: Date,
	contentType		: String, //post & reply
	actionType		: String, //offer & require
	categoryFlag	: String, //goods & services  
	categoryId		: String, //food, house, sports¡­.???
	content			: String,
	replyPosts		: [String]
});

module.exports = mongoose.model('Post', postSchema);