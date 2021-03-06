/**
 * Location.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        name: {
  		    type: 'string',
  		    required: true
        },
        description: {
  		    type: 'string',
  		    required: true
        },

        owner: {
  		    model: 'user'
        },
        location_event: {
            collection: 'event',
            via: 'event'
        },

        toJSON: function(){
  		    var obj = this.toObject();
  		    delete obj._csrf;
  		    return obj;
        }
    }
};

