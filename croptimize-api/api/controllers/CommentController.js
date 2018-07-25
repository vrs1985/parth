/**
 * CommentController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

	subscribe: function(req, res){

		var id = req.params.id;

		if(!id) return res.badRequest();

		if(req.isSocket){
			Guitar.findOne(id, function(err, guitar){

				if(err) return res.serverError();
				if(!guitar) return res.notFound();

				Guitar.subscribe(req.socket, guitar);

			});
		} else {
			return res.notFound();
		}
	},

	create: function(req, res){

		var msg = req.body;

		var guitar_id = req.params.id;

		Guitar.findOne(guitar_id).exec(function(err, guitar){

			if(err) return res.serverError();

			if(!guitar) return res.badRequest();

			msg.guitar = guitar_id;

			Comment.create(msg, function(err, msg){


				if(err) return res.serverError();

				Guitar.publishUpdate(guitar.id, msg);

				return res.created(msg);


			});

		});
	}
};

