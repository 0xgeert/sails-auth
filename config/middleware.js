var passport = require('passport'),
    GitHubStrategy = require('passport-github').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    LocalStrategy = require('passport-local').Strategy,
    bcrypt = require('bcrypt');


var verifyHandler = function(token, tokenSecret, profile, done) {
    process.nextTick(function() {

        User.findOne({
            or: [{
                uid: parseInt(profile.id)
            }, {
                uid: profile.id
            }]
        }).done(function(err, user) {
            if (user) {
                return done(null, user);
            } else {

                var data = {
                    provider: profile.provider,
                    uid: profile.id,
                    name: profile.displayName
                };

                if (profile.emails && profile.emails[0] && profile.emails[0].value) {
                    data.email = profile.emails[0].value;
                }
                if (profile.name && profile.name.givenName) {
                    data.fistname = profile.name.givenName;
                }
                if (profile.name && profile.name.familyName) {
                    data.lastname = profile.name.familyName;
                }

                User.create(data).done(function(err, user) {
                    return done(err, user);
                });
            }
        });
    });
};

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {

    User.findOne({
        id: id
    }).done(function(err, user) {
        done(err, user);
    });
});


module.exports = {

    // Init custom express middleware
    express: {
        customMiddleware: function(app) {

            //http://jethrokuan.github.io/2013/12/19/Using-Passport-With-Sails-JS.html
            passport.use(new LocalStrategy(
                function(username, password, done) {
                    User.findByUsername(username).done(function(err, user) {
                        if (err) {
                            return done(null, err);
                        }
                        if (!user || user.length < 1) {
                            return done(null, false, {
                                message: 'Incorrect User'
                            });
                        }
                        //NOTE: because username is unique there should only be 1 result found
                        bcrypt.compare(password, user[0].password, function(err, res) {
                            if (!res) {
                                return done(null, false, {
                                    message: 'Invalid Password'
                                });
                            }
                            return done(null, user[0]);
                        });
                    });
                }
            ));

            passport.use(new GitHubStrategy({
                    clientID: "YOUR_CLIENT_ID",
                    clientSecret: "YOUR_CLIENT_SECRET",
                    callbackURL: "http://localhost:1337/auth/github/callback"
                },
                verifyHandler
            ));

            passport.use(new FacebookStrategy({
                    clientID: "YOUR_CLIENT_ID",
                    clientSecret: "YOUR_CLIENT_SECRET",
                    callbackURL: "http://localhost:1337/auth/facebook/callback"
                },
                verifyHandler
            ));

            passport.use(new GoogleStrategy({
                    clientID: '81386224429-1eqi5jleckj7melsaqgo1a0eusbaatuh.apps.googleusercontent.com',
                    clientSecret: 'DUB0pL5DkWVMNrBjFQd5pZGj',
                    callbackURL: 'http://localhost:1337/auth/google/callback'
                },
                verifyHandler
            ));

            app.use(passport.initialize());
            app.use(passport.session());
        }
    }

};