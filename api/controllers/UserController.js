/**
 * UserController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {


    me: function(req, res) {
        res.json(req.user.toJSON());
    },

    create: function(req, res) {

        req.body = req.body || {};
        req.body.provider = "local";

        User.create(req.body).exec(function(err, result) {
            if (err) {
                return res.send(500, err);
            }
            return res.json(result);
        });
    }
};