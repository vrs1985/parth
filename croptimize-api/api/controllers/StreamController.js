var request = require('request');
var config = require('../../config');
var io = require('socket.io-client');

/**
 * StreamController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    subscribe: function(req, res) {
        var authCode = req.params.socket_token;
        sails.log.info('\n authCode \n', authCode, '\n');
        if (!authCode) return res.badRequest();
        this.getTokenForAuthCode(authCode).then(res => {
            console.log('\n subscribe \n', res, '\n');
            this.connectToLiveData(res);
        });
    },

    getTokenForAuthCode: authCode => {
        sails.log.info('\n authCode \n', authCode, '\n');
        return new Promise(
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
                        console.log('\n getTokenForAuthCode \n', body.access_token, '\n');
                        return resolve(body.access_token);
                    }
                );
            }
        );
    },

    makeAPICall: function(accessToken, endpoint) {
        console.log('after socket makeAPICall', accessToken);
        return new Promise(
            (resolve, reject) => {
                console.log(accessToken);
                request({
                        method: 'GET',
                        url: `${config.API_ROOT}${endpoint}`,
                        json: true,
                        auth: {
                            bearer: accessToken
                        }
                    },
                    (err, res, body) => {
                        if (err) {
                            console.log("makeAPICall error", err);
                            return reject(err);
                        }
                        console.log("makeAPICall resolve ", body);
                        return resolve(body);
                    }
                );
            }
        );
    },

    getUser: function(accessToken) {
        return this.makeAPICall(accessToken, {
            endpoint: '/v2/user'
        });
    },

    getLocations: function(accessToken) {
        // var custToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlFrWXdSa1k1UlVKQ09Ua3pPRVl4Umprd1FrWkVOa013UkRORVFUQkZOa0l4UVVJMFFqSkRRUSJ9.eyJpc3MiOiJodHRwczovL2VuZXJneWN1cmIuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDU5YmRiMzEyMTc1ZjJlNDRiOTJhOGY0YyIsImF1ZCI6WyJhcHAuZW5lcmd5Y3VyYi5jb20vYXBpIiwiaHR0cHM6Ly9lbmVyZ3ljdXJiLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE1Mjg2NDkzODAsImV4cCI6MTUyODczNTc4MCwiYXpwIjoiQWozVWZaak1rd25OUElaZzAyZWdOeWpiRkpRNnlneTYiLCJzY29wZSI6Im9wZW5pZCBvZmZsaW5lX2FjY2VzcyJ9.OB_Z6DT_-_6gIhDjgxc5OFd3z_j8mKrZvK5CtQS0Xc3o8Z05icwY7Dq2TBO-ZiQVb9KLxzbYfSR2EUJ0RvJ9SR6Twdz5yig7x4-wfPPxNWrbIy4mG4Nkg60LAdP6AE4ENGLUB9dK0sJOwNV-kOm6PMcGYjkNFq1JIxlqHFyJTK53AbE0ylLQktz-CBB0ADGqhxH-bpGBLtOCEq-jpYO-9nLe4hRrlM8XkZIKmWXR2XEHGJWCzqDIpxhF2TUj2UCcLvYmzcnF7YwVMIbcJz5rfv0JnHrNA3Ys0poCwrRESYRKKVcy3nI2EhZOgxRLv1YncCjszT1Ky_4pBzfRdX9TaA';
        // var custToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlFrWXdSa1k1UlVKQ09Ua3pPRVl4Umprd1FrWkVOa013UkRORVFUQkZOa0l4UVVJMFFqSkRRUSJ9.eyJpc3MiOiJodHRwczovL2VuZXJneWN1cmIuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDU5YmRiMzEyMTc1ZjJlNDRiOTJhOGY0YyIsImF1ZCI6WyJhcHAuZW5lcmd5Y3VyYi5jb20vYXBpIiwiaHR0cHM6Ly9lbmVyZ3ljdXJiLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE1Mjg2NTAxMDYsImV4cCI6MTUyODczNjUwNiwiYXpwIjoiQWozVWZaak1rd25OUElaZzAyZWdOeWpiRkpRNnlneTYiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIG9mZmxpbmVfYWNjZXNzIn0.ZAAlEeYXx2nMTlqq_SD10_mjn1AAPaayFUKj69DDY9RcpgsmhSOARWpqDVknXdCzv4yynDVAwKTyE2_zUf2JSo28-kaiVlMBZ4VnUlBwvcSaveBgCjgi7vCohyzxgrFZd9otVZgH2NX8KVRvyhWkplBQDO-f5LupCYiLufnVSShUIpacXT7TXBRL-ZLccoL4QWCe8iwkZrtTZ6pjfqT0fdMd9ed6XPSrWKn-HqV5CAkztrqm45qAruUTnRL8BUYupFxKilGuexzT1WynrQ_sSJ8b2eYO12dPOP6G-KfEMF2jWNIMdRSuJ5AkDVLZRwILgKgM3kET4c-0MLffHl_SIA'
        return this.makeAPICall(accessToken, {
            endpoint: '/v2/locations'
        });
    },

    connectToLiveData: function(token) {
        var self = this;
        // initialize connection
        var socket = io(`${config.API_ROOT}/circuit-data`, {
            transports: ['websocket']
        });
        console.log('socket websocket');
        socket.on('connect', function() {
            console.log('socket connect');
            // when the client is able to successfully connect, send an 'authenticate' event with the user's id token
            socket.emit('authenticate', {
                token: token
            });
        });

        socket.on('authorized', function() {
            console.log('socket authorized');
            // the client has been successfully authenticated, and can now subscribe to one or more locations
            // call the API to get their locations and subscribe them to the first one
            self.getLocations(token)
                .then(
                    function(locations) {
                        console.log('socket can subscribe', locations);
                        if (locations && locations.length) {
                            socket.emit('subscribe', locations[0].id);
                        }
                    }
                );
        });

        socket.on('subscriptionFailed', err => {
            console.log('socket subscriptionFailed');
            console.error('error subscribing to location');
            console.error(err);
        });

        socket.on('data', function(data) {
            console.log('socket data');
            // the client is receiving data for a specific location
            // data is a snapshot of the current state of all the circuits in a location
            // each circuit has a UUID, label, booleans that indicate whether they are mains circuits or production circuits, and a wattage value

            console.log('DATAAA ', data);
        });

        socket.on('error', err => {
            console.log('socket error');
            console.error('error');
            console.error(err);
        });

        // if the connection drops, try to reconnect
        socket.on('disconnect', (err) => {
            console.log('socket disconnect');
            self.connectToLiveData(token);
        });
        return socket;
    }
};

// eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlFrWXdSa1k1UlVKQ09Ua3pPRVl4Umprd1FrWkVOa013UkRORVFUQkZOa0l4UVVJMFFqSkRRUSJ9.eyJpc3MiOiJodHRwczovL2VuZXJneWN1cmIuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDU5YmRiMzEyMTc1ZjJlNDRiOTJhOGY0YyIsImF1ZCI6WyJhcHAuZW5lcmd5Y3VyYi5jb20vYXBpIiwiaHR0cHM6Ly9lbmVyZ3ljdXJiLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE1Mjg2NTM2MzcsImV4cCI6MTUyODc0MDAzNywiYXpwIjoiQWozVWZaak1rd25OUElaZzAyZWdOeWpiRkpRNnlneTYiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIG9mZmxpbmVfYWNjZXNzIn0.IS-0Pf_aKEn_4iVrGfZh624GFbdlInD143mrjuyoopdYbKpuFk0wuRHObNWR6VM10uOGVyl9KgeN_KpKo14Q_0VIE58BjQr_HfoXtk92fhuDBAnz3goLqhy3W2IfhJjtkt74aoJ2eIO6rYpAzehb5VB-Bpu7Uli-Q18creaba41w0Xt_4lVjcsBUl_QAdLBx6Zp4VlU90iP37hNKB99h7WLNm56o0rYUrTfnYizI0DFffy8Frj-A38Z4gOi6Vlhnpe44aYPzWZQ4tbHAWZOGfdf-sekmEW1XwPPwvArGOpyvC73hXur9X8anFiizjskjhamMT806m_MPMNOakaXS-A
// eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlFrWXdSa1k1UlVKQ09Ua3pPRVl4Umprd1FrWkVOa013UkRORVFUQkZOa0l4UVVJMFFqSkRRUSJ9.eyJpc3MiOiJodHRwczovL2VuZXJneWN1cmIuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDU5YmRiMzEyMTc1ZjJlNDRiOTJhOGY0YyIsImF1ZCI6WyJhcHAuZW5lcmd5Y3VyYi5jb20vYXBpIiwiaHR0cHM6Ly9lbmVyZ3ljdXJiLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE1Mjg2NTM3MTgsImV4cCI6MTUyODc0MDExOCwiYXpwIjoiQWozVWZaak1rd25OUElaZzAyZWdOeWpiRkpRNnlneTYiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIG9mZmxpbmVfYWNjZXNzIn0.aSMPaohA5MbL1DNruowyd9SQkJUDosfoZZRhFJHVuID2tb8pcmAWVDM2RH8WxfmLaY8nP5eNXUJ72ErlxpSQwngpo9g8OmG3VNsE66lMOChVFvW7Y3mJy157AXlXJoOeLtNOU5iKSHu1k5eg17IrLigmlG6FEiu99R9R1-3IkbjHaoY49fzWsmoPzZF6An-J5w3m5GJjK2jFCP2oEM06gSEpMinp6UO7vON8L0VM7QD3vVyee8EaG0bp69xmRFQgGXYL3JDLKHRy0H9POluarrRsJSvVM34qRbjVDlAdf67nRizJscONI4F-wGgfE4Mq4KvIgAePdiI-PJO26UK7iQ

// eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlFrWXdSa1k1UlVKQ09Ua3pPRVl4Umprd1FrWkVOa013UkRORVFUQkZOa0l4UVVJMFFqSkRRUSJ9.eyJpc3MiOiJodHRwczovL2VuZXJneWN1cmIuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDU5YmRiMzEyMTc1ZjJlNDRiOTJhOGY0YyIsImF1ZCI6WyJhcHAuZW5lcmd5Y3VyYi5jb20vYXBpIiwiaHR0cHM6Ly9lbmVyZ3ljdXJiLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE1Mjg2NTIwNjksImV4cCI6MTUyODczODQ2OSwiYXpwIjoiQWozVWZaak1rd25OUElaZzAyZWdOeWpiRkpRNnlneTYiLCJzY29wZSI6Im9wZW5pZCBvZmZsaW5lX2FjY2VzcyJ9.Nt1hR5f0fDtXJK89CiSrlNhEBVMK9zmAqf1aDHPNINZP7jcjwCZnl9nX79CRgbYj7lEosckouFuE2aMxqjmwyYheuSohKC4u3GQurFNflIs1GFp3MvaJ2voJ0JegvjkNg_-zM0jf7NaMTE_8KA1IZ589l5zI3LN7y46yuaNb2KYTZFNn0BZqyC7Oy0YBLkTHfpfis6nnYM3bTz4A3bpEQCWHeOoPk3oHt0bN_Voyry1p7DxpotFA516VdlqOaOQu-IZwR0fDRCL6ysjDAnkG51MqBRRhjetBeDHw-sAZyMu2DyHFW1qrd1yHOkrkwrbkjEPBLYaSalmOUQ-HzAdqmw
// eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlFrWXdSa1k1UlVKQ09Ua3pPRVl4Umprd1FrWkVOa013UkRORVFUQkZOa0l4UVVJMFFqSkRRUSJ9.eyJpc3MiOiJodHRwczovL2VuZXJneWN1cmIuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDU5YmRiMzEyMTc1ZjJlNDRiOTJhOGY0YyIsImF1ZCI6WyJhcHAuZW5lcmd5Y3VyYi5jb20vYXBpIiwiaHR0cHM6Ly9lbmVyZ3ljdXJiLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE1Mjg2NTQyNDYsImV4cCI6MTUyODc0MDY0NiwiYXpwIjoiQWozVWZaak1rd25OUElaZzAyZWdOeWpiRkpRNnlneTYiLCJzY29wZSI6Im9wZW5pZCBvZmZsaW5lX2FjY2VzcyJ9.awLxIWy3sB-lwKoUkZbUpJSGIn6JoKPqyEfrsBVw6CoYyTvjqBm7O-IycXnn8ncTiBS7MR58M1tWbgqZXV6cj1gv6vrqCmxkjlMZMULg36-bB52lE3KT5YiEH8Ief7ZkQzeAeDAkc6bnlgOzFyhyQ9ml_f0isG2hMUPSX_4S7Enbvf-wRWwutCBMOSowKapvQVfuMHIml1wnxmnI3mkxRqnMi_1PO0L0Z7NdO8xJq0swMQBV2sI5fBXo69bqYavrr7GgCD0JSftcPwY2JCWwtI4fakWHg8w-2X5hMUBThgmFPqWUQsjc02dDmFHF258rIgBWIwn4-PFxotrHcu_Thw
// eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlFrWXdSa1k1UlVKQ09Ua3pPRVl4Umprd1FrWkVOa013UkRORVFUQkZOa0l4UVVJMFFqSkRRUSJ9.eyJpc3MiOiJodHRwczovL2VuZXJneWN1cmIuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDU5YmRiMzEyMTc1ZjJlNDRiOTJhOGY0YyIsImF1ZCI6WyJhcHAuZW5lcmd5Y3VyYi5jb20vYXBpIiwiaHR0cHM6Ly9lbmVyZ3ljdXJiLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE1Mjg2NTQwMjIsImV4cCI6MTUyODc0MDQyMiwiYXpwIjoiQWozVWZaak1rd25OUElaZzAyZWdOeWpiRkpRNnlneTYiLCJzY29wZSI6Im9wZW5pZCBvZmZsaW5lX2FjY2VzcyJ9.MemUK_CC8bi-QZ0EXIeYU9CDRo1yCR0kSWslIzzc_qw95487P5A3WFXcq_IqOSPXnSdpthXrIRKkSaC_fSLAP22tVNTS3JKxnt7H8I2jj_dePM5FA3od8nz5nG2NNhyTm-0X2r1s9snCCgTYYlXZjRnAgpHEEmwHyE_xwF9ewWNTVUrgZq_JZyx4tSL-M9C2dcF1Iq9qr6EhaeXmeAQN_5yfYCVl0g3-VPexIfJkK-TjfKvNz_cqtnN98ldMkYpH21eddZjL4rIE1ft6iNBTHC3dlh2O9pwwVlx5bKGQ5bjbZd8rokY1H0jzWXfcMDTiOQG7mRYgo4BpUDBK0ugFCw
// eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlFrWXdSa1k1UlVKQ09Ua3pPRVl4Umprd1FrWkVOa013UkRORVFUQkZOa0l4UVVJMFFqSkRRUSJ9.eyJpc3MiOiJodHRwczovL2VuZXJneWN1cmIuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDU5YmRiMzEyMTc1ZjJlNDRiOTJhOGY0YyIsImF1ZCI6WyJhcHAuZW5lcmd5Y3VyYi5jb20vYXBpIiwiaHR0cHM6Ly9lbmVyZ3ljdXJiLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE1Mjg2NTQzMDcsImV4cCI6MTUyODc0MDcwNywiYXpwIjoiQWozVWZaak1rd25OUElaZzAyZWdOeWpiRkpRNnlneTYiLCJzY29wZSI6Im9wZW5pZCBvZmZsaW5lX2FjY2VzcyJ9.HUy3rDgkNpRFiQ-jAD9oN5i65bzczcalUyqCOYX6NoQ-84aopn23QRf8-uK_QuC1zs8UAMGPIlOPOGiDIJtR6vDclKYiLBolw1ygNakl5i_OolEMvBiooFyNg7W-dz_ewUDKkxvoy-QehgePvg_zer6NLcJcrBNWhsxcxi5wkC98qAsATBgNCHOwvQHh_CaH7IU67N7jMcf0LK2ln_CvoacSbanNaz8aje9h4AXu76yOyfjoMmZD2PDZt7e9XeprynVFEVOG6kVLEnY5OI1rH0Q8iC1M6FPkSAemViVb0OnG8cImYHQ3XYGUtF4PkzTERTp6paaUCHupXdKxJu7ZAQ
// 
//
// -ZK3jSSg9tioAjDF
// eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlFrWXdSa1k1UlVKQ09Ua3pPRVl4Umprd1FrWkVOa013UkRORVFUQkZOa0l4UVVJMFFqSkRRUSJ9.eyJpc3MiOiJodHRwczovL2VuZXJneWN1cmIuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDU5YmRiMzEyMTc1ZjJlNDRiOTJhOGY0YyIsImF1ZCI6WyJhcHAuZW5lcmd5Y3VyYi5jb20vYXBpIiwiaHR0cHM6Ly9lbmVyZ3ljdXJiLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE1Mjg2NTg3MzYsImV4cCI6MTUyODc0NTEzNiwiYXpwIjoiQWozVWZaak1rd25OUElaZzAyZWdOeWpiRkpRNnlneTYiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIG9mZmxpbmVfYWNjZXNzIn0.kI5ZLplIiOFQ3bblfMmwCKqwqbPy9zFx3fmcfj29P2sNh564Dpc_BuuvgVZTvE4_nJy_Iil4GPv86NTX1wLGJ5VArmc1dddDVSwOCh-PbhIz8nX9UPuGMAzenEPxEKre8H9lTm6o3DLYmISi67qMIA1Qu4jaWLW-PNnMW5wPY94gzeEnkchgnqfgN61HwvRmHezb1dGNWedtIDmmGY0oGVE_MM19llPpYY7DJObXOlKe6-YmVzoWMAmmHBerPU_OHN5n6SUCRd3ENMV3Dtwxu6BMPB9AUBZVirU20p69UN7Gm8n3berHRLaq6TWwAHBP9zZJNMquhIfiNFQ88UmbQA
// eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlFrWXdSa1k1UlVKQ09Ua3pPRVl4Umprd1FrWkVOa013UkRORVFUQkZOa0l4UVVJMFFqSkRRUSJ9.eyJpc3MiOiJodHRwczovL2VuZXJneWN1cmIuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDU5YmRiMzEyMTc1ZjJlNDRiOTJhOGY0YyIsImF1ZCI6WyJhcHAuZW5lcmd5Y3VyYi5jb20vYXBpIiwiaHR0cHM6Ly9lbmVyZ3ljdXJiLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE1Mjg2NTg5OTIsImV4cCI6MTUyODc0NTM5MiwiYXpwIjoiQWozVWZaak1rd25OUElaZzAyZWdOeWpiRkpRNnlneTYiLCJzY29wZSI6Im9wZW5pZCBvZmZsaW5lX2FjY2VzcyJ9.D1LzqnXbUAp5hr63jTsHuJCdkyqLEyFk2-NGNOofGwV7KF7X9XYibq2NzczYhZanmA98jq0j8Qf1MpXwa9KKMVW2aTmbJy9e_wZEeddRB41fc0CPbk4J-OYm2GO8OSjqC6Fem12i1nVxVO8yqwnLv3ufMi_UDHgc-5nN_6YcrwkMzur3Vq41j7EVkSkJuq4k4iX9-6drnBEq8-6lnblniDloDSTzxGzqWJkmol8UDv37-vE4NxXOhEB63Io3OQYomv9S-MSlTkWrFz79sWNhfMlvk0klBH6fyr0djmMsHbVMKpTyKXwDXQTBqBma2YhrRliYZfm6T7VKhQJ-Qud1yg
// _MOO9JoaBXNCgatz