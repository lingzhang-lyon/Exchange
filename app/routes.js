// app/routes.js
var User = require('../app/models/user');
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
	var OfferRoutes = require('../app/offerRoutes');
    app.post('/category/:categoryId/product/:productId/offer',OfferRoutes.addOffer);
    //list all offer for a product
    app.get('/category/:categoryId/product/:productId/offer', OfferRoutes.listOffers);
 
  //****************************************************************
 // user Management
 //****************************************************************
 	var UserRoutes = require('../app/userRoutes');
 	app.post('/users', UserRoutes.addUser);
    	app.get('/users/:userid',UserRoutes.findUser);

//****************************************************************
// Product Management
//****************************************************************
	var ProductRoutes = require('../app/productRoutes');
	app.get('/category/:categoryId/product', ProductRoutes.getAllProduct);
	app.post('/category/:categoryId/product', ProductRoutes.addProduct);
	app.get('/category/:categoryId/product/:productId', ProductRoutes.getProductDetail);
	app.put('/category/:categoryId/product/:productId', ProductRoutes.updateProduct);
	app.del('/category/:categoryId/product/:productId', ProductRoutes.deleteProduct);

	
//****************************************************************
// Category Management
//****************************************************************
		var Category = require('../app/categoryRoutes');
		app.get('/category', Category.showAll);
		app.get('/category/:categoryId', Category.showOne);
		app.post('/category', Category.add);

//****************************************************************
// User Management
//****************************************************************  
    //add new user
   app.post('/users',function (req, res) {
        var newUser            = new User();
       
        var i = guid();
        // set the user's local credentials
        newUser.local.email      = req.param('emailId');//'email';//
        newUser.local.firstName  = req.param('firstName');//'firstName';//
        newUser.local.lastName   = req.param('lastName');//'lastName';//
        newUser.local.phone      = req.param('mobile');//'phone';//
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



