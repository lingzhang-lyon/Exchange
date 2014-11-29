/**
 * New node file
 */
var OfferSchema= require('../app/models/offer');
var OfferHistorySchema= require('../app/models/offerHistory');
var CommentSchema= require('../app/models/comment');

exports.getOfferDetail = function(req, res){
	var offerId = req.param('offerId');
	var offer;
	var lastEvent;
	var comments;
	
	var testOffer={
			offerId : "offer.offerId",
			buyingQty : "offer.byingQty",
			offeredDetails : "offer.offeredDetails",
			buyerStatus : "offer.buyerStatus",
			sellerStatus : "offer.sellerStatus",
			offerExpiry : "offer.offerExpiry",
			productId : "offer.productId",
			buyerId : "offer.buyerId",
			lastModified : "offer.lastModified"	
	};
	var testLastEvent="added one more item";
	var testComments=[
	    {
	    	commentId : 1,
	    	commentDesc : "String",
	    	lastUpdated : new Date(),
	    	offerId : 1,
	    	userId : 1
		}
	];		
	
	

	
	OfferHistorySchema.find()
	.setOptions({"offerId": offerId,
		sort: 'lastModified'
		//TODO add more options:  sort descendant, limit 1	
	})
	.exec(function(err,result){
		if(err){
			//res.status(500).json({status:'could not find offer history'});
		}
		else{
			//lastEvent=result;
			lastEvent=testLastEvent;
		}
	});
	
	CommentSchema.find()
	.setOptions({"offerId": offerId})
	.exec(function(err,result){
		if(err){
			//res.status(500).json({status:'could not find offer comment'});
		}
		else{
			//comments=result;
			comments=testComments;
			
		}
	});
	
	OfferSchema.find()
	.setOptions({"offerId": offerId})
	.exec(function(err,result){
		if(err){
			res.status(500).json({status:'could not find offer'});
		}
		else{
			//offer=result;
			offer=testOffer;
			res.send('offerDetails', {
				offerId : offer.offerId,
				buyingQty : offer.byingQty,
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


