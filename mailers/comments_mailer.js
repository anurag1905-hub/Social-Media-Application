const nodeMailer = require('../config/nodemailer');

module.exports.newComment = function(comment){
    console.log('Inside new comment mailer');
    nodeMailer.transporter.sendMail({
       from:'innerlight436@gmail.com',
       to:comment.user.email,
       subject:"New Comment Published",
       html:'<h1>It is Working</h1>'
    },function(err,info){
        if(err){
            console.log('Error in sending email',err);
            return;
        }
        else{
            console.log(info);
            return;
        }
    });
}