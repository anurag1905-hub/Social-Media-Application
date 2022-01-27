const nodeMailer = require('../config/nodemailer');

module.exports.newComment = function(comment){
    let htmlString = nodeMailer.renderTemplate({comment:comment},'/comments/newComment.ejs');

    nodeMailer.transporter.sendMail({
       from:'innerlight436@gmail.com',
       to:comment.user.email,
       subject:"New Comment Published",
       html:htmlString
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