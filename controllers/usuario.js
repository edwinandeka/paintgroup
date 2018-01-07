var Usuario = require('../models/usuarios');
var url = require('url');

var passport = require('passport');
var passportTwitter = require('passport-twitter');
var TwitterStrategy = passportTwitter.Strategy;

var multer = require('multer');



var Storage = multer.diskStorage({
     destination: function(req, file, callback) {
         callback(null, "./public/img/uploads");
     },
     filename: function(req, file, callback) {
         callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
     }
 });

var upload = multer({
     storage: Storage
 }).array("imgUploader", 3); //Field name and max count

if (!fs.existsSync( "./public/img/uploads")){
    fs.mkdirSync( "./public/img/uploads");
}


var UserController = {
	
	/**
	 * almacena la información del usuario
	 */
	registro: function(req, res, next){
		var user = new Usuario({
			nombre : req.body.nombre,
			usuario : req.body.usuario,
			password : req.body.pass
		});

		user.save(function (err, usuario){
			if (!err) {
				res.status(201);
				next();
			}else{
				res.status(500);
				res.send('Ha ocurrido un problema!');
			}
		});
	},


	/**
	 * login con twitter
	 */
	twitter: function(req, res, next){
		var url_parts = url.parse(req.url, true);
		var query = url_parts.query;
	  	query.oauth_token

		console.log(req);
	},


	/**
	 * login con twitter
	 */
	upload: function(req, res, next){
		upload(req, res, function(err) {
	        if (err) {
	        	console.log(err);
	            return res.end("Something went wrong!" + err);
	        }
	        return res.redirect('/gallery');
	    });
	},

}









module.exports = UserController;


