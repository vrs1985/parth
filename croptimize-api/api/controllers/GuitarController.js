/**
 * GuitarController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {

	count: function(req, res){

		Guitar.find().exec(function(err, guitars){
			return res.json({ count: guitars.length });
		});
	},


	see: function(req, res){

		var id = req.params.id;

		var page = req.query.page || 0;

		var page_size = 15;


		Guitar.findOne(id).populate('messages', {

				limit: page_size,
				skip: page
			
		}).exec(function(err, guitar){

			if(err)
				return res.serverError();			

			if(!guitar)
				return res.notFound();

			return res.view({ guitar });

		});

	}

};

