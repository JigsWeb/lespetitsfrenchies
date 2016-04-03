var UserCtrl = require('./controllers/user');

module.exports = function(app){

  app.get('/', function (req, res) {
    return res.render('views/index.jade');
  });

  app.post('/', function(req, res){
    UserCtrl.create(req,res);
  });

  app.get('/:id',function(req, res){
    UserCtrl.read(req, res);
  });

  app.get('/confirm/:token', function(req, res){
    UserCtrl.update(req, res);
  });

  app.post('/confirm/:token', function(req, res){
    UserCtrl.create(req, res);
  });
};
