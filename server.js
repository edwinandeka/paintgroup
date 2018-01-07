var express = require('express');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server);
var redis = require('redis');
var client = redis.createClient();

//Aquí almacenamos las variables de sesión
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

//Passport
var passport = require('passport');

//Flash para enviar mensajes temporales como respuesta
var flash = require('connect-flash');

//Logger de peticiones http
var logger = require('morgan');
//Parsea las cookies y pobla el objeto req.cookies con un objeto de llaves, que tiene el nombre de la cookie
var cookieParser = require('cookie-parser');
//Parsea el cuerpo de las peticiones y respuestas http
var bodyParser = require('body-parser');

var path = require('path');
var _ = require('lodash');


//Requerimos Swig
var swig = require('swig');



var Usuario = require('./models/usuarios');
var Mensaje = require('./models/mensajes');
/**************Configuración**************/

//Con esto le decimos a express, que motor de template utilizar, a lo que asignamos Swig.
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

//En desarrollo deshabilitamos el cacheo de templates, pero en un entorno de desarrollo es esencial, para el optimo rendimiento.
//Leccion 4
app.set('view cache', false);
swig.setDefaults({ cache: false });

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Necesario para la gestión de las variables de sesión
app.use(session({
  store : new RedisStore({}),
  secret : 'nextapp',
  name: 'id'
}));
app.use(passport.initialize());
app.use(passport.session());


app.use(flash());

/**************Configuración**************/

passport.serializeUser(function(user, done) {
  console.log("Serialize: "+user);
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  console.log("Deserialize: "+obj);

  done(null, obj);
});

//Routes
var routes = require('./routes/routes');
routes(app);

//Connections 
var local = require('./connections/local');
local(app);
var twitter = require('./connections/twitter');
twitter(app);











var users = [];


var draw = {
  clickX: [],
  clickY: [],
  clickDrag: [],
  clickColor: [],
  clickSize: [],
};



io.on('connection', function(socket){

  users[socket.id] = {id: socket.id, username: null};

  socket.emit('DRAW', draw);
  
  socket.on('disconnect', function(){


  });

  socket.on('CLEAR', function(){
    draw.clickX = [];
    draw.clickY = [];
    draw.clickDrag = [];
    draw.clickColor = [];
    draw.clickSize = [];
    io.emit('CLEAR');

  });


  socket.on('NEW_CLICK', function(data){

    draw.clickX.push(data.x);
    draw.clickY.push(data.y);
    draw.clickDrag.push(data.dragging);
    draw.clickColor.push(data.curColor);
    draw.clickSize.push(data.curSize);

    io.emit('NEW_CLICK', data);
  });

  socket.on('NEW_USER', function(username) {
    users[socket.id].username  = username;
    
    io.emit('ADD_USER', users);
  });

});	

server.listen(3000, function(){
	console.log('Servidor corriendo en el puerto 3000');
});


