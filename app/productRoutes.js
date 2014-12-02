/**
 * New node file
 */
var Product = require('../app/models/product');

//GET
//'/category/:categoryId/product/'
exports.getAllProduct = function(req, res) {
	var categoryId = req.param('categoryId');
	
	Product.find({'categoryId': categoryId}, function(err, products) {
		if(err) {
			res.status(500).json({status:'failure'});
			console.log("Get all products error! Category Id: " + categoryId);
		} 
		else if(products === null) {
			res.send("could not find any product from category Id: " + categoryId);
			console.log("could not find any product from category Id: " + categoryId);
		} 
		else {
			var productlist = [];
			
			products.forEach(function(product) {
				console.log(product);
				productlist.push(product);
			});
			
			res.status(200).json( {
				products : productlist
			});
		}
	});
};

//Post
//'/category/:categoryId/product/'
exports.addProduct = function(req, res) {
	var newProduct = new Product();
	
	Product.count({ productId:{$exists: true}},
			function (err, count) {
				newProduct.productId 		 = count + 1;
				newProduct.productName 		 = req.param('productName');
				newProduct.quantity 		 = req.param('quantity');
				newProduct.userId 			 = req.param('userId');
				newProduct.expectedOffer 	 = req.param('expectedOffer');
				newProduct.productDesc	 	 = req.param('productDesc');
				newProduct.productExpiryDate = req.param('productExpiryDate');
				newProduct.isValid 			 = req.param('isValid');
				newProduct.categoryId 		 = req.param('categoryId');
				newProduct.lastUpdated 		 = req.param('lastUpdated');
				
				newProduct.save(function(err) {
					if(err) {
						res.status(500).json({status:'failure'});
						console.log(err);
						console.log("failure to add new product");
					}
					else {
						res.status(200).json({
							productId 			: newProduct.productId,
							productName 		: newProduct.productName,
							quantity 			: newProduct.quantity,
							userId 				: newProduct.userId,
							expectedOffer 		: newProduct.expectedOffer,
							productDesc 		: newProduct.productDesc,
							productExpiryDate 	: newProduct.productExpiryDate,
							isValid 			: newProduct.isValid,
							categoryId 			: newProduct.categoryId,
							lastUpdated 		: newProduct.lastUpdated
						});
					}
			});
		
	});
	
};

//GET
//'/category/:categoryId/product/:productId'
exports.getProductDetail = function(req, res) {
	var productId = req.param('productId');

	Product.findOne({"productId" : productId}, function(err, product) {
		if(err) {
			res.status(500).json({status:'failure'});
			console.log("Get product error! Product Id: " + productId);
		} 
		else if(product === null) {
			res.send("could not find the product by Product Id: " + productId);
			console.log("could not find the product by Product Id: " + productId);
		} 
		else {
			res.status(200).json(product);
		}
	});
};

//PUT
//Yuan
//'/category/:categoryId/product/:productId'
exports.updateProduct = function(req, res) {
	var productId = req.param('productId');

	Product.findOne({"productId" : productId}, function(err, product) {
		if(err) {
			res.status(500).json({status:'failure'});
			console.log("Update product error! Product Id: " + productId);
		} 
		else if(product === null) {
			res.send("could not find the product by Product Id: " + productId);
			console.log("could not find the product by Product Id: " + productId);
		} 
		else {
			// update product info
			product.productName 	  = req.param('productName');
			product.quantity 		  = req.param('quantity');
			product.userId 			  = req.param('userId');
			product.expectedOffer 	  = req.param('expectedOffer');
			product.productDesc	 	  = req.param('productDesc');
			product.productExpiryDate = req.param('productExpiryDate');
			product.isValid 		  = req.param('isValid');
			product.categoryId 		  = req.param('categoryId');
			product.lastUpdated 	  = req.param('lastUpdated');
			
			product.save(function(err) {
				if(err) {
					res.status(500).json({status:'failure'});
					console.log("failure to update found product");
				}
				else {
					res.status(200).json({
						productId 			: product.productId,
						productName 		: product.productName,
						quantity 			: product.quantity,
						userId 				: product.userId,
						expectedOffer 		: product.expectedOffer,
						productDesc 		: product.productDesc,
						productExpiryDate 	: product.productExpiryDate,
						isValid 			: product.isValid,
						categoryId 			: product.categoryId,
						lastUpdated 		: product.lastUpdated
					});
				}
			});
		}
	});
};

//DELETE
//'/category/:categoryId/product/:productId'
exports.deleteProduct = function(req, res) {
	var productId = req.param('productId');
	
	Product.remove({"productId": productId}, function(err) {
		if(err) {
			res.status(500).json({status:'failure'});
			console.log("Delete product error! Product Id: " + productId);
		} 
		else {
			res.status(200).json({
				status:'SUCCESS'
    		});  
			
			console.log("Delete product by Product Id: " + productId);
		}
	});
};


