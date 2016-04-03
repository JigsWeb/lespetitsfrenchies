/* DEPENDENCIES */

var nodemailer  = require('nodemailer'),
    config      = require('../config');

/* MAILER */

var transporter = nodemailer.createTransport(config.mailer);

var mailOptions = {
    from: config.mailer.auth.user,
    to: null,
    subject: null,
    html: null,
};

module.exports = {
  confirm: function(user){
    mailOptions.subject = "Confirmation d'invitation";
    mailOptions.to = user.email;
    mailOptions.text = "Rendez-vous sur cette url valider votre invitation: http://127.0.0.1:3000/confirm/"+user.token;

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Message sent: ' + info.response);
        };
    });
  }
}
