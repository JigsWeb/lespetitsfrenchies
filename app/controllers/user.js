var User = require('../models/user'),
    Mailer = require('../services/mailer');

module.exports = {
  create: function(req, res){
    User.create({'email': req.body.email}, function (err, doc) {
      if (err) return res.render('./views/index', {'flash': 'Cette adresse e-mail est déjà utilisée !'});

      if(req.query.id_ref) User.findAndAddInvitation(req.query.id_ref,doc);

      Mailer.confirm(doc);

      return res.render('./views/index', {'flash': 'Invitation envoyée  à '+doc.email+' !'});
    })
  },
  read: function(req, res){
    User.findById(req.params.id, function(err, doc){
      if(err || !doc) return res.redirect('/');
      doc.getWaitingListPosition(function(waitingListPosition){
        return res.render('./views/user/read', {'user': doc,'waitingListPosition': waitingListPosition});
      });
    });
  },
  update: function(req, res){
    if(!req.params.token) return res.render('./views/index');

    User.findByTokenAndConfirm(req.params.token,function(info){
      return res.render('./views/index', {'flash': info});
    });
  },
}
