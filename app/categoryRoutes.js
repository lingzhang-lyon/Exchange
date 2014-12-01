/**
 * New node file
 */
var category = require('../app/models/category');

// GET 
// "/category/:categoryId" Return the specific category.
exports.showOne = function(req,res){
	var cat_id = req.param('categoryId');
	category.find({"catId": cat_id}, function(err,result){
		if(err){
			res.status(500).json({status:'failure'});
		}
		else if(result== null){
			res.send("could not find the category");
		}
		else{
			res.status(200).json({
				category:result
			});
		}
	});
};

//GET 
// "/category" Return all categories.
exports.showAll = function(req,res){
	category.find({}, function(err,result){
		if(err){
			res.status(500).json({status:'failure'});
		}
		else if(result== null){
			res.send("no category");
		}
		else{
			res.status(200).json({
				category:result
			});
		}
	});
};

//POST
//"/category" Insert into database the specific category.
exports.add = function(req,res){
	var newCat = new category();
	var cat_name = req.body.categoryName;
	category.count({catId:{$exists: true}},
	     function (err, count){
		 newCat.catId = count +1;
		 newCat.catValue = cat_name;
		 newCat.save(function(err){
			 if(err){
					res.status(500).json({status:'failure'});
					console.log("failure to save");
				}
				else{
					res.status(200).json({
						categoryId : newCat.catId,
						categoryName: newCat.catValue
					});
				}
		});
	
});
};