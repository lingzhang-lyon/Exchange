/**
 * New node file
 */
var Offer= require('../app/models/offer');
var OfferHistory= require('../app/models/offerHistory');
var Comment= require('../app/models/comment');


//for test
exports.testSaveOffer = function(req, res){
		
	var newOffer=new Offer();
	newOffer.offerId="1";
	newOffer.buyingQty=100;
	
	newOffer.save(function(err){
		if(err){
			res.status(500).json({status:'failure'});
			console.log("failure to save");
		}
		else{
			res.send('saveResult', {
				status: "success"
			});
		}
	});
	
	
};


//for test
exports.testGetAllOffer = function(req, res){
	Offer.find()
	.exec(function(err,result){
		if(err){
			res.status(500).json({status:'failure'});
		}
		else{
			res.send('allOfferDetails', {
				allOfferDetails: result
			});
		}
	});
	
};





exports.getOfferDetail = function(req, res){
	var offerId = req.param('offerId');
	
	var testOffer={
			offerId : "offer.offerId",
			buyingQty : "offer.buyingQty",
			offeredDetails : "offer.offeredDetails",
			buyerStatus : "offer.buyerStatus",
			sellerStatus : "offer.sellerStatus",
			offerExpiry : "offer.offerExpiry",
			productId : "offer.productId",
			buyerId : "offer.buyerId",
			lastModified : "offer.lastModified"	
	};
	var testLastEvent="added one more item";
	var testComment={
	    	commentId : 1,
	    	commentDesc : "String",
	    	lastUpdated : new Date(),
	    	offerId : 1,
	    	userId : 1
		};	
	
	Offer.findOne({"offerId": offerId}, function(err,result){
		if(err){
			res.status(500).json({status:'failure'});
		}
		else if(result===null){
			res.send("could not find offer with this offerId");
		}
		else{
			
			var offer=result;
			//var offer=testOffer;
			var lastEvent=testLastEvent;
			var comments=[];
			comments.push(testComment);
			res.send('offerDetails', {
				offerIdInURL: offerId,
				offerId : offer.offerId,
				buyingQty : offer.buyingQty,
				offeredDetails : offer.offeredDetails,
				buyerStatus : offer.buyerStatus,
				sellerStatus : offer.sellerStatus,
				offerExpiry : offer.offerExpiry,
				productId : offer.productId,
				buyerId : offer.buyerId,
				lastModified : offer.lastModified,
				comments: comments,
				lastEvent: lastEvent,

			});
			
		}
	});
	
};


