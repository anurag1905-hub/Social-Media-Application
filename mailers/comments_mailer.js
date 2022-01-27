const nodeMailer = require('../config/nodemailer');

module.exports.newComment = function(post){
    let htmlString = nodeMailer.renderTemplate({post:post},'/comments/newComment.ejs');

    nodeMailer.transporter.sendMail({
       from:'',
       to:post.user.email,
       subject:"New Comment Added",
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