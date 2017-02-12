/**
 * EventController
 *
 * @description :: Server-side logic for managing events
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	'new': function(req, res) {
		res.view();
	},
	index: function(req, res) {
		Event.find(function foundEvent(err, events) {
			if(err) return res.redirect('/event/new');
			res.view({
				events: events
			});
		});
	},
	create: function(req, res) {
		Event.create(req.params.all(), function eventCreated(err, event) {
			if(err) {
				req.session.flash = {
					err: err
				};
				return res.redirect('/event/new');
			}
			res.redirect('/event/show/' + event.id);
		});
	},
	show: function(req, res) {
		Event.findOne(req.param('id'), function foundEvent(err, event) {
			if(err || !event) return res.serverError(err);
			res.view({
				event: event
			});
		});
	},
	edit: function(req, res) {
		Event.findOne(req.param('id'), function foundEvent(err, event) {
			if(err) return res.serverError(err);
			if(!event) return res.serverError(err);
			res.view({
				event: event
			});
		});
	},
	update: function(req, res, next) {
		var eventObj = {
			title: req.param('title'),
			description: req.param('description'),
			date: req.param('date')
		}
		Event.update(req.param('id'), eventObj, function eventUpdated(err) {
			if(err) {
				return res.redirect('/event/edit/' + req.param('id'));
			}
			res.redirect('/event/show/' + req.param('id'));
		});
	},
	destroy: function(req, res, next) {
		Event.findOne(req.param('id'), function foundEvent(err, event) {
			if(err) return next(err);
			if(!event) return next('Event doesn\'t exist.');

			Event.destroy(req.param('id'), function eventDestroyed(err) {
				if(err) return next(err);
				res.redirect('/event/');
			});
		});
	}
	
};

