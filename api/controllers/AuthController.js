/**
 * AuthController
 *
 * @module      :: Controller
 * @description :: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var passport = require('passport');

module.exports = {

    //GET (login page)
    index: function(req, res) {
        res.view();
    },

    //GET + POST
    signup: function(req, res) {
        if (req.method === "GET") {
            res.view("auth/signup");
        }
        // sign-up POST.
        // Creates a userprofile bases on username/password
        // redirects on success.
        // 
        // TODO: deprecate in favor of user.create
        // which is called through ajax. Then we can redirect on client
        else if (req.method === "POST") {

            req.body = req.body || {};
            req.body.provider = "local";

            User.create(req.body).exec(function(err, result) {
                if (err) {
                    req.flash('message', JSON.stringify(err));
                    return res.redirect('/signup');
                }
                //login after signup
                req.logIn(result, function(err) {
                    if (err) return next(err);
                    res.redirect('/');
                });
            });
        } else {
            res.send(405);
        }
    },


    //GET
    logout: function(req, res) {
        req.logout();
        req.flash('message', "Successfully logged out");
        res.redirect('/login');
    },

    //adapted from: http://jethrokuan.github.io/2013/12/19/Using-Passport-With-Sails-JS.html
    local: function(req, res) {
        if (req.method === "POST") {
            passport.authenticate('local', function(err, user, info) {
                if ((err) || (!user)) {
                    req.flash('message', info.message);
                    res.redirect('/login');
                    return;
                }
                req.logIn(user, function(err) {
                    if (err) res.redirect('/login');
                    return res.redirect('/');
                });
            })(req, res);
        } else {
            res.send(405); //Method Not Allowed
        }
    },

    // http://developer.github.com/v3/
    // http://developer.github.com/v3/oauth/#scopes
    github: function(req, res) {
        passport.authenticate('github', {
                failureRedirect: '/login'
            },
            function(err, user) {
                req.logIn(user, function(err) {
                    if (err) {
                        console.log(err);
                        res.view('500');
                        return;
                    }

                    res.redirect('/');
                    return;
                });
            })(req, res);
    },

    // https://developers.facebook.com/docs/
    // https://developers.facebook.com/docs/reference/login/
    facebook: function(req, res) {
        passport.authenticate('facebook', {
                failureRedirect: '/login',
                scope: ['email']
            },
            function(err, user) {
                req.logIn(user, function(err) {
                    if (err) {
                        console.log(err);
                        res.view('500');
                        return;
                    }

                    res.redirect('/');
                    return;
                });
            })(req, res);
    },

    // https://developers.google.com/
    // https://developers.google.com/accounts/docs/OAuth2Login#scope-param
    google: function(req, res) {
        passport.authenticate('google', {
                failureRedirect: '/login',
                scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
            },
            function(err, user) {
                req.logIn(user, function(err) {
                    if (err) {
                        console.log(err);
                        res.view('500');
                        return;
                    }

                    res.redirect('/');
                    return;
                });
            })(req, res);
    },



    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to AuthController)
     */
    //DON'T LIKE EXPOSING THIS, BUT OTHERWISE ALL THOSE SOCIAL CALLBASKS NEED TO 
    //BE EPLXICILT DEFINED IN ROUTES. 
    //FOR NOW THERE'S ONLY A COUPLE OF METHODS THAT NEED TO BE CLOSED
    //(I.E.: THOSE THAT ARE MEANS FOR NON-GETS)
    // _config: {
    //     blueprints: {
    //         actions: false //don't allow ALL VERBS per controller action
    //     }
    // }
    // 

    _config: {
        blueprints: {
            actions: true //allow ALL verbs per controller action. We make use manually only allowed sutff is exposed.
        }
    }


};