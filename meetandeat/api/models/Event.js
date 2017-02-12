/**
 * Event.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        title: {
  		    type: 'string',
  		    required: true
        },
        description: {
  		    type: 'string',
  		    required: true
        },
        date: {
  		    type: 'datetime',
  		    required: true
        },
        owner: {
  		    model: 'User'
        },
        event: {
  		    collection: 'location',
  		    via: 'location_event'
        },

        toJSON: function() {
  		    var obj = this.toObject();
  		    delete obj._csrf;
  		    return obj;
        }
    }
};

