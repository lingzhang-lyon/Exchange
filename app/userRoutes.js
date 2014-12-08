/**
 * New node file
 */
var User = require('../app/models/user');
var fun =  require('../app/funcations');
//Post
//'/users'
exports.addUser = function(req, res) {
	var newUser = new User();
	var emailId = req.param('emailId');
	console.log(fun.testEmail(emailId));
	User.findOne({'emailId':emailId},
		function (err, result) {
			console.log(result);
		  if(fun.testEmail(emailId)){
			if(result===null){
			newUser.userId 		= fun.guid();
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
			}
			else{res.send('emailId already taken!!!');}
		  }
		  else{res.send('emailId is valid :(');}
	});
};

//get 
///user/:userId    
exports.findUser = function(req, res) {
 var id = req.param('userid');
 User.findOne({"userId": id}, function (err, user) {
     if(err){
     res.status(500).json({status:'failure'});
     }
     else if(user===null){
     res.send("could not find user with this userId");
     }
     else{
     res.status(200).json({
         user: user
     });
     }
 });
};

