/* CONFIG */

var POINT_PER_CONFIRM = 10;
var POINT_PER_UNCONFIRM = 2;

/* DEPENDENCIES */

var
  mongoose   = require('mongoose'),
  validators = require('mongoose-validators'),
  crypto     = require('crypto');

/* SCHEMA */

var Schema = mongoose.Schema;

var userSchema = new Schema({
  email: {type: String, required: true, unique: true, validate: validators.isEmail({'message': 'Please enter a valid email address.'})},
  id_ref: { type: Schema.Types.ObjectId, ref: 'User', default: null},
  invitations: [{ type: Schema.Types.ObjectId, ref: 'User'}],
  invitations_confirmed: { type: Number, default: 0 },
  places: { type: Number, default: 0 },
  state: { type: Boolean, default: false},
  token: String,
  createdAt: {type: Date, default: Date.now },
  updatedAt: Date,
});

/* METHODS */

userSchema.methods.getWaitingListPosition = function(cb){
  var that = this;
  this.model('User').find({}).sort({'places': -1}).exec(function(err, users){
    users.forEach(function(element,index){
      if(element.id == that.id) cb(index+1);
    });
  });
}

//Cherche l'utilisateur parrain et lui ajoute un parrainé
userSchema.statics.findAndAddInvitation = function(id_ref, children) {
  this.model('User').findById(id_ref, function(err, user){
    if(!err && user){
      user.invitations.push(children._id);
      user.places += POINT_PER_UNCONFIRM;
      user.save();

      children.id_ref = id_ref;
      children.save();
    }
  });
};

userSchema.statics.findByTokenAndConfirm = function(token, cb){
  var that = this;
  this.model('User').findOne({'token':token}, function(err, user){
    if(!err && user){
      if(user.state){
        cb("Cette invitation est déjà confirmée.");
      }
      else{
        user.state = true;
        user.save();

        that.model('User').findById(user.id_ref, function(err,doc){
          if(!err && doc){
            console.log("OK");
            doc.places += POINT_PER_CONFIRM;
            doc.invitations_confirmed++;
            doc.save();
          }
          cb("Invitation confirmée avec succès !");
        });
      }
    }
    else{
      cb("Cette invitation n'existe pas.");
    }
  });
}

userSchema.plugin(require('mongoose-lifecycle'));

var User = mongoose.model('User', userSchema);

/* LIFECYCLE */

//Créer un token pour la validation du compte
User.on('beforeInsert', function(user) {
  user.token = crypto.createHmac('sha256', "la crypto c'est la vie")
                   .update(user.email)
                   .digest('hex');
});

/* EXPORT */

module.exports = User;
