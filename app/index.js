/* DEPENDENCIES */

var express    = require('express'),
    config     = require('./config'),
    bodyParser = require('body-parser'),
    mongoose   = require('mongoose');

/* APP */

var app = express();

app.use('/public', express.static('bower_components'));

app.set('views', __dirname)
app.set('view engine', 'jade')

/* MONGOOSE INIT */

if(config.mongodb.user && config.mongodb.password === null){
  mongoose.connect('mongodb://'+config.mongodb.user+':'+config.mongodb.password+'@'+config.mongodb.host+':'+config.mongodb.port+'/'+config.mongodb.db);
}
else{
  mongoose.connect('mongodb://'+config.mongodb.host+':'+config.mongodb.port+'/'+config.mongodb.db);
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

/* Express routing */

require('./route')(app);

/* Run server */

app.listen(config.express.port, config.express.ip, function (error) {
  if (error) {
    console.log(error);
  }
  console.log('express is listening on http://' +
    config.express.ip + ':' + config.express.port)
})
