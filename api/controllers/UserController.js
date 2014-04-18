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

    _config: {
        blueprints: {
            actions: false //don't allow ALL VERBS per controller action
        }
    }



};