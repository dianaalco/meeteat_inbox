/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var bcrypt = require("bcrypt");
module.exports = {
    schema: true,
    
    autosubscribe: ['destroy', 'update'],
    attributes: {
        name: {
  		    type: 'string',
  		    required: true
        },
        lastname: {
  		    type: 'string'
        },
        email: {
  		    type: 'email', 
            required: true
        },
        password: {
  		    type: 'string',
            minLength: 6,
            required: true
            
        },
        admin: {
            type: 'boolean',
            defaultsTo: false
        },
        locations: {
            collection: 'location',
            via: 'owner',
            dominant: true
        },
        events: {
            collection: 'event',
            via: 'owner',
            dominant: true
        },
        rooms: {
            collection: 'room',
            via: 'users',
            dominant: true
        },
        afterPublishUpdate: function(id, changes, req, options) {
            User.findOne(id).populate('rooms').exec(function(err, user) {
                sails.util.each(user.rooms, function(room) {
                    var previousName = options.previous.name == 'unknown' ? 'User #' + id : options.previous.name;
                    Room.message(room.id, {
                        room: {
                            id: room.id
                        },
                        from: {
                            id: 0
                        },
                        msg: previousName + " change their name to " + changes.name
                    }, req);
                });
            });
        },
        toJSON: function() {
            var obj = this.toObject();
            delete obj.password;
            delete obj.encryptedPassword;
            delete obj._csrf;
            return obj;
        }
    },
        
        beforeValidation: function(values, next) {
            console.log(values)
            if(typeof values.admin !== 'undefined') {
                if(values.admin === 'unchecked') {
                    values.admin = false;
                } else if (values.admin[1] === 'on') {
                    values.admin = true;
                }
            }
            next();

        },
        beforeCreate: function(values, next) {
            bcrypt.genSalt(10, function(err, salt) {
                if(err) return next(err);
                bcrypt.hash(values.password, salt, function passwordEncrypted(err, encryptedPass) {
                    if (err) return next(err);
                    values.encryptedPassword = encryptedPass;
                    next();
                });
            });
        }
    };

