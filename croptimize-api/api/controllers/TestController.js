var API = require('../services/api');

/**
 * TestController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    run: function(req, res) {
        sails.log.info('test passed');

        API.testApi();
        // return "all works fine";
        return res.json({ passed: 'Test Okay!' });
    }

};