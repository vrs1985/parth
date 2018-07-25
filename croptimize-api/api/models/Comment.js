/**
 * Comment.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

	schema: true,

	attributes: {
		text:{
			type: 'string',
			required: true
		},
		author:{
			type: 'string',
			defaultsTo: 'Anonymous author'
		},
		guitar:{
			model: 'guitar',
			required: true
		}

	}

};

