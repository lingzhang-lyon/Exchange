
// app/routes.js

var User = require('../app/models/user');
var Movie = require('../app/models/movie');
var Post = require('../app/models/post');
var Offer= require('../app/models/offer');

GLOBAL.count=0;

module.exports = function (app, passport) {

//****************************************************************
// Offer Management
//****************************************************************	
	var OfferRoutes = require('../app/offerRoutes');
	app.get('/category/:categoryId/product/:productId/offer/testSaveOffer', OfferRoutes.testSaveOffer);
 	app.get('/category/:categoryId/product/:productId/offer/testGetAllOffer',  OfferRoutes.testGetAllOffer);
	app.get('/category/:categoryId/product/:productId/offer/:offerId', OfferRoutes.getOfferDetail);
	app.put('/category/:categoryId/product/:productId/offer/:offerId', OfferRoutes.updateOffer);
	app.del('/category/:categoryId/product/:productId/offer/:offerId', OfferRoutes.deleteOffer);
	
	app.post('/category/:categoryId/product/:productId/offer/:offerId/comment', OfferRoutes.addOfferComment);
	app.get('/category/:categoryId/product/:productId/offer/:offerId/comment', OfferRoutes.getOfferComment);
	app.post('/category/:categoryId/product/:productId/offer/:offerId/history', OfferRoutes.addOfferHistory);
	app.get('/category/:categoryId/product/:productId/offer/:offerId/history', OfferRoutes.getOfferHistory);

    
    //creat a offer
    app.post('/category/:categoryId/product/:productId/offer',function (req, res) {
            var newOffer = new Offer();
            var pid = req.param('productId');
            var cid = req.param('categoryId');
            var i = guid();
            //product.findOne({"local.productId": productId}, function (err, result) {
               // if(result!= null) {
                    newOffer.offerId=i;
                    newOffer.buyingQty=req.param('buyingQty');
                    newOffer.offeredDetails=req.param('offeredDetails');
                    newOffer.buyerStatus=req.param('buyerStatus');
                    newOffer.sellerStatus=req.param('sellerStatus');
                    newOffer.offerExpiry=req.param('offerExpiry');
                    newOffer.productId=req.param('productId');
                    newOffer.buyerId=req.param('buyerId');
                    newOffer.lastModified=new Date();
                    newOffer.save();
                    res.status(201).json({status:"A offer has been created",
                    uuid: i
                    });
               // }

               // else{res.status(500).send("error!!!")}
                    
           // });
     });

	

//****************************************************************
// Product Management
//****************************************************************
	var ProductRoutes = require('../app/productRoutes');
	app.get('/category/:categoryId/product', ProductRoutes.getAllProduct);
	app.post('/category/:categoryId/product', ProductRoutes.addProduct);
	app.get('/category/:categoryId/product/:productId', ProductRoutes.getProductDetail);
	app.put('/category/:categoryId/product/:productId', ProductRoutes.updateProduct);

//****************************************************************
// User Management
//****************************************************************  
    //add new user
   app.post('/users',function (req, res) {
        var newUser            = new User();
       
        var i = guid();
        // set the user's local credentials
        newUser.local.email      = req.param('email');//'email';//
        newUser.local.firstName  = req.param('firstName');//'firstName';//
        newUser.local.lastName   = req.param('lastName');//'lastName';//
        newUser.local.phone      = req.param('phone');//'phone';//
        newUser.local.uuid = i;
        newUser.save();
        res.status(201).json({status:"A user has been created",
            uuid: i
         });
     });
    //search user by uuid
    app.get('/user/:userid',function (req, res) {
        var id = req.param('userid');
        User.findOne({"local.uuid": id}, function (err, user) {
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
    });
//****************************************************************
// Member Management
//****************************************************************
    //add new member
    app.get('/addMember', isLoggedIn, function (req, res) {
        res.render('addmember.ejs'); // load the index.ejs file
    });
    app.post('/addMember', isLoggedIn, function (req, res) {
        var newUser            = new User();
        // set the user's local credentials
        newUser.local.email      = req.param('email');
        newUser.local.firstName  = req.param('firstName');
        newUser.local.lastName   = req.param('lastName');
        newUser.local.phone      = req.param('phone');
        newUser.local.zip        = req.param('zip');
        newUser.local.address    = req.param('address');
        newUser.local.password   = newUser.generateHash(req.param('password'));
        newUser.local.createDate = new Date();
        newUser.local.skills     = req.param('skills');
        newUser.local.items      = req.param('items');

        newUser.save();
        var pathName = '/profile/'+ req.param('email');
        res.redirect(pathName);

    });
    

    //member view profile
    app.get('/profile-view-only', isLoggedIn, function (req, res) {
        User.findOne({user_id: req.user.id}, function(err, user) {
            res.render('profile-view-only.ejs', {
                user : req.user
            });
        });
    });
    
  //member view profile
    app.get('/postcenter', isLoggedIn, function (req, res) {
        User.findOne({user_id: req.user.id}, function(err, user) {
            res.render('postcenter.ejs', {
                user : req.user
            });
        });
    });
    
    //view individual profile
    app.get('/profile/:id', isLoggedIn, function (req, res) {
         User.findOne({"local.email": req.params.id}, function (err, user) {
              if (err) {};
              res.render('profile.ejs', {user: user});

            });
    }); 


    //modify profile
    app.get('/modifyprofile/:id', isLoggedIn, function (req, res) {
        User.findOne({"local.email": req.params.id}, function (err, user) {
            if (err) {
            };
            res.render('modifyprofile.ejs', {
                user: user
            });
        });
    });

    app.post('/modifyprofile/:id', isLoggedIn, function (req, res) {
        User.update({"local.email": req.params.id},{"local.firstName": req.param('firstName'), "local.lastName":req.param('lastName'),
            "local.address":req.param('address'), "local.phone":req.param('phone')}).exec();
        var pathName = '/profile/'+ req.params.id;
        res.redirect(pathName);
    });
    
    //delete individual member
    app.get('/destroy/:id', isLoggedIn, function (req, res) {
        User.remove({"local.email": req.params.id}).exec();
        res.redirect('/adminconsole');
    });
    
    
    //search members
    app.get('/searchMember', function(req, res) {

        User.find({ "local.userType": { $ne: "admin" } },function (err, users) {
            if (err) {
            }
            ;
            res.render('searchMember.ejs', {
                users: users
            });
        });

    });
    
    //search members based on attributes
    app.post('/searchMember', isLoggedIn, function (req, res) {	
    	
    	var name = 'local.' + req.param('searchparam');
    	var value = {'$regex': req.param('str'), $options: 'i'};
    	var query = {};
    	query[name] = value;
    	
    	console.log(query);
    	
    	User.find(query, function (err, users) {
    		if (err) {
            }
            ;
            res.render('searchMember.ejs', {
                users: users
            });
        });

    });
    
    
    //view all members
    app.get('/memberAll', isLoggedIn, function (req, res) {	
    	
    	User.find({}, function (err, users) {
    		if (err) {
    			console.log('error occured');
                return;
            }
    		GLOBAL.count=GLOBAL.count+1;
            res.render('memberAll.ejs', {
            	users: users, 
            });
        });
    	
    });
    
    app.post('/memberAll', isLoggedIn, function (req, res) { 
    	res.redirect('/memberAll');     
    });
    
    
    
//****************************************************************
// Movie Management
//****************************************************************
    //Create New Movie
    
    app.get('/createMovie', isLoggedIn, function (req, res) {
    	res.render('createMovie.ejs'); // load the createMovie.ejs file
    });
    app.post('/createMovie', isLoggedIn, function (req, res) {
    	var newMovie            = new Movie();
    	var total=0;
    	
    	Movie.count({id:{$exists:true}},function(err,count){
    	
    newMovie.id				= count+1;//to  increment the id
	newMovie .MovieName  	= req.param('movie_name');
	newMovie .MovieBanner  	= req.param('banner');
	newMovie .ReleaseDate   = req.param('releaseDate');
	newMovie .RentAmount  		= req.param('rentAmount');
	newMovie .AvailableCopies  	= req.param('availableCopies');
	//newMovie.category 		= req.param('category');

	if(req.param('category') === "other"){
		newMovie.category = req.param('other');
	}
	else newMovie.category 		= req.param('category');
 
    
    	newMovie.save();
    	console.log(newMovie._id);
    	
    	var pathName = '/viewMoviePage/'+ newMovie._id;
    	res.redirect(pathName);
    	});
        });
//***************************************************************
  //delete individual movie
    
    app.get('/deleteMovie/:id', isLoggedIn, function (req, res) {
       Movie.remove({_id: req.params.id}).exec();
        res.redirect('/searchMovie');
    });
    
 //***************************************************************
    // search post for members
    app.get('/searchPostForMember', isLoggedIn, function (req, res) {
    	var twisted = function(res){
            return function(err, posts){
                if (err){
                    console.log('error occured');
                    return;
                }
                res.render('searchPostForMember.ejs', {posts: posts});
            }
        }
        Post.find({}, twisted(res)).limit(100);  
    });
    
    app.post('/searchPostForMember', isLoggedIn, function (req, res) {	
    	var twisted = function(res){
            return function(err, posts){
                if (err){
                    console.log('error occured');
                    return;
                }
                res.render('searchPostForMember.ejs', {posts: posts});
            }
        }
    	var name = req.param('searchparam');
    	var value = {'$regex': req.param('str'),$options: 'i'};
    	if (req.param('searchparam')=="poster" || req.param('searchparam')=="title" || req.param('searchparam')=="createDate" || req.param('searchparam')=="actionType" || req.param('searchparam')=="categoryFlag" || req.param('searchparam')=="categoryType")
    		{
    			value=req.param('str');
    		}
    	var query = {};
    	query[name] = value;
    	console.log(query);
    	Post.find(query, twisted(res));  	
    });
    
    //search movie for members
    /*
    app.post('/searchMovieForMembers', isLoggedIn, function (req, res) {	
    	var twisted = function(res){
            return function(err, movies){
                if (err){
                    console.log('error occured');
                    return;
                }
                res.render('searchMovieForMembers.ejs', {movies: movies});
            }
        }
    	var name = req.param('searchparam');
    	var value = {'$regex': req.param('str'),$options: 'i'};
    	if (req.param('searchparam')=="id" || req.param('searchparam')=="ReleaseDate" || req.param('searchparam')=="RentAmt" || req.param('searchparam')=="AvlCopies"){value=req.param('str');}
    	var query = {};
    	query[name] = value;
    	console.log(query);
    	Movie.find(query, twisted(res));  	
    });
    
    
    app.get('/searchMovieForMembers', isLoggedIn, function (req, res) {
    	var twisted = function(res){
            return function(err, movies){
                if (err){
                    console.log('error occured');
                    return;
                }
                res.render('searchMovieForMembers.ejs', {movies: movies});
            }
        }
        Movie.find({}, twisted(res)).limit(100);  
    });
    */
    
 //***************************************************************   
    //view movie for members
    
    app.get('/movie-view-only/:id', isLoggedIn, function (req, res) {
    	 Movie.findOne({id: req.params.id}, function (err,movies) {
             if (err) {};
             res.render('movie-view-only.ejs', {movies: movies});

        
        });
    });
    
    
 //***************************************************************   
    
    //view all movies
    app.get('/movieall', isLoggedIn, function (req, res) {	
    	var twisted = function(res){
            return function(err, movie){
                if (err){
                    console.log('error occured');
                    return;
                }
                GLOBAL.count=GLOBAL.count+1;
                res.render('movie.ejs', {movie: movie, count: GLOBAL.count});
            }
        }

        Movie.find({}, twisted(res));    	
    });
    app.post('/movieall', isLoggedIn, function (req, res) {
        res.redirect('/movieall');

    });
    
//*******************************************
    app.post('/searchMovie', isLoggedIn, function (req, res) {	
    	var twisted = function(res){
            return function(err, movies){
                if (err){
                    console.log('error occured');
                    return;
                }
                res.render('searchMovie.ejs', {movies: movies});
            }
        }
    	var name = req.param('searchparam');
    	var value = {'$regex': req.param('str'),$options: 'i'};
    	if (req.param('searchparam')=="id" || req.param('searchparam')=="ReleaseDate" || req.param('searchparam')=="RentAmt" || req.param('searchparam')=="AvlCopies"){value=req.param('str');}
    	var query = {};
    	query[name] = value;
    	console.log(query);
    	Movie.find(query, twisted(res));  	
    });
    
    app.get('/searchMovie', isLoggedIn, function (req, res) {
    	var twisted = function(res){
            return function(err, movies){
                if (err){
                    console.log('error occured');
                    return;
                }
                res.render('searchMovie.ejs', {movies: movies});
            }
        }
        Movie.find({}, twisted(res)).limit(100);  
    });
    
    //view individual movie
    app.get('/viewMoviePage/:id', isLoggedIn, function (req, res) {
        Movie.findOne({_id: req.params.id}, function (err,movies) {
              if (err) {};
              res.render('viewMoviePage.ejs', {movies: movies});

            });
    });   
//***************************************************************
  //modify movie
    
    
    app.get('/modifyMovie/:id', isLoggedIn, function (req, res) {
       Movie.findOne({_id: req.params.id}, function (err, movies) {
            if (err) {
            };
            res.render('modifyMovie.ejs', {
               movies: movies
            });
        });
    });

    app.post('/modifyMovie/:id', isLoggedIn, function (req, res) {
       Movie.update({_id:req.params.id},{"MovieName": req.param('movie_name'), "MovieBanner":req.param('banner'),
            "ReleaseDate":req.param('releaseDate'), "RentAmount":req.param('rentAmount'),"AvailableCopies":req.param('availableCopies'),"category":req.param('category')}).exec();
        var pathName = '/viewMoviePage/'+ req.params.id;
        res.redirect(pathName);
        
    });
    
    
//***************************************************************    


    //direct to user page
    app.get('/store', isLoggedIn, function (req, res) {
        res.render('store.ejs'); // load the index.ejs file
    });

    //direct to admin page
    app.get('/adminconsole', isLoggedIn, function (req, res) {
        res.render('adminconsole.ejs'); // load the index.ejs file
    });

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function (req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function (req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    app.get('/adminlogin', function (req, res) {
        // render the page and pass in any flash data if it exists
        res.render('adminlogin.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/postcenter', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    app.post('/adminlogin', passport.authenticate('local-login',{

        successRedirect: '/adminconsole', // redirect to the secure profile section
        failureRedirect: '/adminlogin', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages

    }));


    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function (req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile-view-only', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));



    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function (req, res) {
        req.logout();
        //req.session.destroy();
        res.redirect('/');

    });
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

//uuid gen
var guid = (function() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
                }
                return function() {
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
            };
        })();


var guid1 = (function(){ 
            function generateUUID() {
                var d = new Date().getTime();
                var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);
                return (c=='x' ? r : (r&0x3|0x8)).toString(16);
                 });
                return uuid;
                };
        })();

