/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	'new': function(req, res) {
		res.locals.flash = _.clone(req.session.flash);
		res.view();
		req.session.flash={};
	},
	index: function(req, res) {
		User.find(function foundUser(err, users) {
			if(err) return res.redirect('/user/new');
			res.view({
				users: users
			});
		});
	},
	create: function(req, res) {
        User.create(req.params.all(), function userCreated(err, user) {
            if (err) {
            //Assign the error to the session.flash
                req.session.flash = {
                    err:err.ValidationError
                };
                return res.redirect('/user/new');
            }
                
            // Log user in
            if (req.session.authenticated == true) {
                res.redirect('/user/');
            }
            else {
                req.session.authenticated = true;
                req.session.User = user;

                res.redirect('/user/show/'+user.id);
            }
        });
    },
	show: function(req, res) {
		User.findOne(req. param('id'))
		.exec(function(err, user) {
			res.view({
				locations: user.locations,
				user: user
			});
		});
	},
	update: function(req, res, next) {
        var userObj = {
            name: req.param('name'),
            lastname: req.param('lastname'),
            email: req.param('email')
        }
		User.update(req.param('id'), req.params.all(), function userUpdated(err) {
			if(err) {
				return res.redirect('/user/edit/' + req.param('id'));
			}
			res.redirect('/user/show/' + req.param('id'));
		});
	},
	edit: function(req, res) {
		User.findOne(req.param('id'), function foundUser(err, user) {
			if(err) return res.serverError(err);
			if(!user) return res.serverError(err);

			res.view({
				user: user
			});
		});
	},
	destroy: function(req, res, next) {
        User.findOne(req.param('id'), function foundUser(err, user) {
            if(err) return next(err);

            if(!user) return next('User doesn\'t exist.');

            User.destroy(req.param('id'), function userDestroyed(err) {
                if(err) return next(err);

                if(user.id.toString() === req.session.User.id) {
                    res.redirect('/session/destroy');
                }
                else {
                    res.redirect('/user/');
                }
            });
        });
    },
   // Location 
    associateLocation: function(req, res, next) {
        Location.find(function foundLocations(err, locations) {
            if(err) return next(err);
            res.view({
                locations: locations,
                user_id: req.param('id')
            });
        });
    },

    deassociateLocation: function(req,res,next){
        var location_id = req.param('location_id');
        var user_id = req.param('user_id');
            
        User.findOne(user_id, function foundLocation(err, user) {
            if(err) return next(err);
            if(!user) return next();

            user.locations.remove(location_id);
            user.save(function createDeassociation(err, saved) {
                if(err) res.redirect('/user/show/' + user_id);
                res.redirect('/user/show/' + user_id);
            });
        });
    },
              
    associateLocationToUser: function(req,res,next){
        var location_id = req.param('location_id');
        var user_id = req.param('user_id');

        User.findOne({id:user_id}).then(function(user) {
            user.locations.add(location_id);
            return user.save().fail(function() {
                sails.log.info('User already has that location!');
            });
        })
        .then(function(){
            res.redirect('/user/show/' + user_id);
        })
        .fail(function(err) {
            sails.log.error('Unexpected error: ' +err);
            res.redirect('/user/associateLocation/');
        });
    },

    // Events
    associateEvent: function(req, res, next) {
        Event.find(function foundEvents(err, events) {
            if(err) return next(err);
            res.view({
                events: events,
                user_id: req.param('id')
            });
        });
    },

    deassociateEvent: function(req,res,next){
        var event_id = req.param('event_id');
        var user_id = req.param('user_id');
            
        User.findOne(user_id, function foundEvent(err, user) {
            if(err) return next(err);
            if(!user) return next();

            user.events.remove(event_id);
            user.save(function createDeassociation(err, saved) {
                if(err) res.redirect('/user/show/' + user_id);
                res.redirect('/user/show/' + user_id);
            });
        });
    },
              
    associateEventToUser: function(req,res,next){
        var event_id = req.param('event_id');
        var user_id = req.param('user_id');

        User.findOne({id:user_id}).then(function(user) {
            user.events.add(event_id);
            return user.save().fail(function() {
                sails.log.info('User already joins that event!');
            });
        })
        .then(function(){
            res.redirect('/user/show/' + user_id);
        })
        .fail(function(err) {
            sails.log.error('Unexpected error: ' +err);
            res.redirect('/user/associateEvent/');
        });
    },

     //chat 
    announce: function(req, res) {

    // Get the socket ID from the reauest
    var socketId = sails.sockets.getId(req);

    // Get the session from the request
    var session = req.session;

    // Create the session.users hash if it doesn't exist already
    session.users = session.users || {};

    User.create({
      name: 'unknown',
      socketId: socketId
    }).exec(function(err, user) {
      if (err) {
        return res.serverError(err);
      }

      // Save this user in the session, indexed by their socket ID.
      // This way we can look the user up by socket ID later.
      session.users[socketId] = user;

      // Subscribe the connected socket to custom messages regarding the user.
      // While any socket subscribed to the user will receive messages about the
      // user changing their name or being destroyed, ONLY this particular socket
      // will receive "message" events.  This allows us to send private messages
      // between users.
      User.subscribe(req, user, 'message');

      // Get updates about users being created
      User.watch(req);

      // Get updates about rooms being created
      Room.watch(req);

      // Publish this user creation event to every socket watching the User model via User.watch()
      User.publishCreate(user, req);

      res.json(user);

    });


  }
      
};

