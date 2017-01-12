/**
 * Profile.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	userid:{
          model: 'user'
      },
      firstname:{
          type: 'string'
      },
      lastname:{
          type: 'string'
      },
      bio:{
          type: 'string'
      },
      dob:{
          type: 'date'
      },
      contact:{
          type: 'text'
      }
  }
};
