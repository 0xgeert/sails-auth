/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var bcrypt = require('bcrypt'),
    Charlatan = require('charlatan');

module.exports = {

    adapter: 'mongo',

    //only allow defined attribs
    schema: true,

    attributes: {

        //email is required. 
        //NOTE: it's **NOT** unique
        //Instead the comppund <provider,email> is unique. 
        //
        //Since waterline doesn't support compound indices yet
        //(see: https://github.com/balderdashy/waterline/issues/109)
        //We do a check in preCreate by doing an actual fetch
        //to check for existence of this combo
        email: {
            type: 'email',
            required: true
        },

        //displayname for user (also populated by social)
        //or firstname if entered when using login/pass
        displayname: {
            type: 'string',
            required: true,
        },

        //'local' or social provide
        provider: {
            type: 'string',
            required: true,
        },


        /////////////
        //used for strategy = local
        password: {
            type: 'string',
        },

        ///////////
        ///use for strategy != social
        uid: {
            type: 'integer',
            required: false,
        },
        rawprofile: {},
        firstname: 'string',
        lastname: 'string',

        //Override toJSON method to remove password from API
        toJSON: function() {
            var obj = this.toObject();
            delete obj.password;
            return obj;
        }

    },

    //defaults
    beforeValidation: function(user, cb) {
        if (!user.displayname) {
            user.displayname = user.firstname || Charlatan.Name.name();
        }
        cb(null, user);
    },

    beforeCreate: function(user, cb) {
        User.count({
            email: user.email,
            provider: user.provider
        }, function(err, count) {
            if (err) {
                console.log(err);
                return cb(err);
            }

            if (count > 0) {
                var msg = "user with combo <provider,email> already exists",
                    rule = "compoundIndexUniqueness";

                return cb({
                    'ValidationError': {
                        provider: [{
                            data: user.provider,
                            message: msg,
                            rule: rule
                        }],
                        email: [{
                            data: user.email,
                            message: msg,
                            rule: rule
                        }]
                    }
                });
            }

            bcrypt.genSalt(10, function(err, salt) {
                if (user.password !== undefined) {
                    bcrypt.hash(user.password, salt, function(err, hash) {
                        if (err) {
                            console.log(err);
                            return cb(err);
                        }
                        user.password = hash;
                        cb(null, user);
                    });
                } else {
                    //social login doesn't have pass FOR NOW
                    cb(null, user);
                }
            });
        });
    }

};