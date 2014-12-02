/**
 * New node file
 */
var User = require('../app/models/user');

//Post
//'/users'
exports.addUser = function(req, res) {
	var newUser = new User();
	User.count({userId:{$exists: true}},
		function (err, count) {
			newUser.userId 		= count + 1;
			newUser.firstName	= req.param('firstName');
			newUser.lastName	= req.param('lastName');
			newUser.emailId		= req.param('emailId');
			newUser.mobile		= req.param('mobile');
			
			newUser.save(function(err) {
				if(err) {
					res.status(500).json({status:'failure'});
					console.log(err);
					console.log("failure to add new user");
				}
				else {
					res.status(200).json({
						userId 		: newUser.userId,
						firstName 	: newUser.firstName,
						lastName 	: newUser.lastName,
						emailId 	: newUser.emailId,
						mobile 		: newUser.mobile
					});
				}
			});
	});
};
