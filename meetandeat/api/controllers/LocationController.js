/**
 * LocationController
 *
 * @description :: Server-side logic for managing locations
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	'new': function (req, res) {
        res.view();
    },
    index: function (req, res) {
        Location.find(function foundLocation(err, locations) {
            if(err) return res.redirect('/location/new');
                res.view({
                    locations: locations
                });
            });
    },
    create: function(req, res) {
        Location.create(req.params.all(), function locationCreated(err, location) {
            if (err) {
                //Assign the error to the session.flash
                req.session.flash = {
                    err: err
                };
                return res.redirect('/location/new');
                }
                res.redirect('/location/show/' + location.id); 
            });
    },
    show: function(req, res) {
        Location.findOne(req.param('id'), function foundLocation(err,location) {
            if(err || !location) return res.serverError(err);
                res.view({
                    location: location
            });
        });
    },
    edit: function (req, res) {
        // Find the user from the id passed in via params
        Location.findOne(req.param('id'), function foundLocation(err, location) {
            if (err) return res.serverError(err);
            if (!location) return res.serverError(err);
                res.view({
                    location: location
                });
        });
    },
    update: function(req, res, next) {
        var locationObj = {
            name: req.param('name'),
            description: req.param('description')
        }
        Location.update(req.param('id'), locationObj, function locationUpdated(err) {
            if (err) {
                return res.redirect('/location/edit/' + req.param('id'));
            }
            res.redirect('/location/show/' + req.param('id'));
        });
    },  
    destroy: function(req, res, next) {
        Location.findOne(req.param('id'), function foundLocation(err, location) {
            if (err) return next(err);
            if (!location) return next('Location doesn\'t exist.');

            Location.destroy(req.param('id'), function locationDestroyed(err) {
                if (err) return next(err);
                    res.redirect('/location/');
            });
        });
    },
    
    associateEvent: function(req, res, next) {
        Event.find(function foundEvents(err, events) {
            if (err) return next(err);
            res.view({
                events: events,
                location_id: req.param('id')
            });
        });
    },
    deassociateEvent: function(req,res,next){
        var event_id = req.param('event_id');
        var location_id = req.param('location_id');
            
        Event.findOne(event_id, function foundEvent(err, event) {
            if (err) return next(err);
            if (!event) return next();

            event.event.remove(location_id);
            event.save(function createDeassociation(err, saved) {
                if (err) res.redirect('/location/show/' + location_id);
                res.redirect('/location/show/' + location_id);
            });
        });
    },
    associateEventToLocation: function(req,res,next){
        var event_id = req.param('event_id');
        var location_id = req.param('location_id');

        Event.findOne({id:event_id})
            .then(function(event) {
                event.event.add(location_id);
                return event.save().fail(function() {
                sails.log.info('Location already has that event!');
            });
        })
        .then(function(){
            res.redirect('/location/show/' + location_id);
        })
        .fail(function(err) {
            sails.log.error('Unexpected error: ' +err);
            res.redirect('/event/associateLocation/');
        });
    } 				
};

