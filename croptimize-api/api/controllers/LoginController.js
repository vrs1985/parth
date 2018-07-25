/**
 * LoginController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var request = require('request');
var config = require('../../config');

module.exports = {

    get: function(req, res) {
        sails.log.info('User')
        return res.send('Hi there!');
    },
    /**
     * @param req
     * @param res
     */
    post: function(req, res) {
        user = req.allParams()
        sails.log.info("parms" + user.name + user.password);

        CustomerUser.findOne({
            'name': user.name,
            'password': user.password
        }).exec(function(error, user) {
            if (error) return res.serverError(error)

            if (user) {
                sails.log.info('User logged in', user)

                res.cookie('user', user.id);

                return res.json({
                    token: TokenService.issue({
                        id: user.id
                    })
                })
            } else {
                return res.forbidden()
            }
        });
    },
    getTokenForAuthCode: function(req, res) {
        var authCode = req.params.acess_token;
        new Promise(
            (resolve, reject) => {
                request({
                        method: 'POST',
                        url: `https://${config.AUTH_DOMAIN}/oauth/token`,
                        json: true,
                        body: {
                            grant_type: 'authorization_code',
                            client_id: config.AUTH_CLIENT_ID,
                            client_secret: config.AUTH_CLIENT_SECRET,
                            code: authCode,
                            redirect_uri: config.AUTH_REDIRECT_URI
                        }
                    },
                    (err, res, body) => {
                        if (err) {
                            return reject(err);
                        }
                        return resolve(body.access_token);
                    }
                );
            }
        ).then(response => {
            return res.json({
                token: response
            });

        })
    }

};