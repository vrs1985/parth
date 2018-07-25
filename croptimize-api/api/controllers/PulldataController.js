var io = require('socket.io-client');
var API = require('../services/api');
var request = require('request');
var config = require('../../config');
/**
 * PulldataController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    connectToLiveData: function(req, res) {
        var authCode = req.params.acess_token;

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
                console.log('\n\n\n back end', body.access_token);
                // initialize connection
                var socket = io(`${config.API_ROOT}/circuit-data`, {
                    transports: ['websocket']
                });

                socket.on('connect', function() {
                    // when the client is able to successfully connect, send an 'authenticate' event with the user's id token
                    socket.emit('authenticate', {
                        token: token
                    });
                });

                socket.on('authorized', function() {
                    // the client has been successfully authenticated, and can now subscribe to one or more locations
                    // call the API to get their locations and subscribe them to the first one
                    API.getLocations(token)
                        .then(
                            function(locations) {
                                if (locations && locations.length) {
                                    socket.emit('subscribe', locations[0].id);
                                }
                            }
                        );
                });

                socket.on('subscriptionFailed', err => {
                    console.error('error subscribing to location');
                    console.error(err);
                });

                socket.on('data', function(data) {
                    console.log('DATAAA ', data);
                });

                socket.on('error', err => {
                    console.error('error');
                    console.error(err);
                });

                // if the connection drops, try to reconnect
                socket.on('disconnect', (err) => {
                    connectToLiveData(token);
                });
                return socket;
            }

        );
    }
};