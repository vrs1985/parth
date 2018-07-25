/**
 * Guitar.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

	schema: true,

	attributes: {
		brand:{
			type: 'string',
			required: true
		},
		strings:{
			type: 'integer',
			defaultsTo: 6
		},
		righthanded:{
			type: 'boolean',
			defaultsTo: true
		},
		comments:{
			collection: 'comment',
			via: 'guitar'
		}
	}

};

