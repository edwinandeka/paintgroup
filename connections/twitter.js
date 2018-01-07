var passport = require('passport'),
	passportTwitter = require('passport-twitter'),
	TwitterStrategy = passportTwitter.Strategy;

var Usuario = require('../models/usuarios');

var twitterConnection = function (app) {
	passport.use(
		new TwitterStrategy(
		{
			consumerKey: 'B0cYFyr1fEKTv09IiIqA',
			consumerSecret: '5NfiNNTuzjLFzGeYYf6yVH6vDN4D5mLAHSS2pUb4m8',
			callbackURL: 'http://127.0.0.1:3000/auth/twitter/callback'
		},
		function (token, tokenSecret, profile, done) {

			console.log();
			Usuario.findOne({
				'twitter' : profile.id
			},
			function (err, user){
				if(err){
					return done(err);
				}

				if(!user){

					var usuario = new Usuario({
						username : profile.username,
						twitter : profile.id
					});

					var datos = JSON.stringify(eval("("+profile._raw+")"));
					usuario.nombre = JSON.parse(datos).name;

					usuario.save(function(err, user){
						if(err){
							done(err, null);
							return;
						}

						done(null, user);
					});
				}else{
					
					return done(err, user);
				}
			});
		}
	));
};

module.exports = twitterConnection;