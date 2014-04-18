/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var bcrypt = require('bcrypt');

module.exports = {

    adapter: 'mongo',

    attributes: {
        provider: 'STRING',
        uid: 'INTEGER',
        name: 'STRING',
        email: 'STRING',
        firstname: 'STRING',
        lastname: 'STRING',

        //from http://jethrokuan.github.io/2013/12/19/Using-Passport-With-Sails-JS.html
        //TODO: merge
        username: {
            type: 'string',
            //required: true,
            unique: true
        },
        password: {
            type: 'string',
            //required: true
        },

        //Override toJSON method to remove password from API
        toJSON: function() {
            var obj = this.toObject();
            delete obj.password;
            return obj;
        }

    },

    beforeCreate: function(user, cb) {
        bcrypt.genSalt(10, function(err, salt) {
            if (user.password !== undefined) {
                bcrypt.hash(user.password, salt, function(err, hash) {
                    if (err) {
                        console.log(err);
                        cb(err);
                    } else {
                        user.password = hash;
                        cb(null, user);
                    }
                });
            } else {
                //social login doesn't have pass FOR NOW
                cb(null, user);
            }
        });
    }

};