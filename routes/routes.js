var UserController = require('../controllers/usuario');
var passport = require('passport');

console.log('UserController', UserController)
const imagesFolder = "./public/img/uploads";
const fs = require('fs');


var rutas = function(app){

	app.get('/registro', function (req, res){
		res.render('registro');
	});

	app.get('/', function (req, res){
		res.render('login');
	});

	app.post('/login', passport.authenticate('user', {  successRedirect: '/gallery', failureRedirect: '/error', failureFlash: 'Usuario o contraseña erróneos'}));


	app.get('/paint', function (req, res){
		res.render('paint',{
			usuario : req.session.passport.user.nombre
		});
	});

	app.get('/gallery', function (req, res){
		fs.readdir(imagesFolder, (err, files) => {

			 res.render('index',{
				usuario : req.session.passport.user.nombre,
				images: files
			});
		})
	});


	app.get('/upload', function (req, res){
		res.render('upload', {
			usuario : req.session.passport.user.nombre
		});
	});


	app.post('/upload', UserController.upload, function (req, res){
		res.redirect('/');
	});

	app.get('/error', function (req, res){
		res.send(req.session.flash.error[0]);
	});


	app.post('/registro', UserController.registro, function(req, res){
		res.redirect('/');
	});

	app.get('/auth/twitter',passport.authenticate('twitter'));

	app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/gallery', failureRedirect: '/error' }));

};

module.exports = rutas;