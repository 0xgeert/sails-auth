/**
 * redirect user to profile when user already authenticated
 *
 */
module.exports = function(req, res, ok) {

    //TODO: sometimes called twice?
    //https://github.com/gebrits/sails-auth/issues/3
    //probably to do with X-Purpose: preview but not sure
    //since ubuntu chrome doesn't show that header
    //but disabling previewpreefetch in chrome solves the issue (black box)
    //
    // console.log(req.headers);
    // // X-Purpose: preview

    // User is authenticated so no need to go to auth related page
    if (req.isAuthenticated()) {
        req.flash('message', "Redirected to your profile, since you're already logged-in.");
        return res.redirect('/');
    }
    ok();

};