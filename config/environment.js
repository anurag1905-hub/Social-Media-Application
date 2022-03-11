const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');
require('dotenv').config();

const logDirectory = path.join(__dirname,'../production_logs'); // Defines where the logs will be stored.
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log',{
    interval:'1d',
    path:logDirectory
});

const development = {
    name:'development',
    asset_path:'./assets',
    session_cookie_key:'webDevelopment',
    db:'users',
    smtp:{
        service:'gmail',
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        auth:{
            user:'',
            pass:''
        }
    },
    google_client_ID:"791041645048-0ttjugd2gg9mcvgiah9qfanii1gsteot.apps.googleusercontent.com",
    google_client_Secret:"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",
    google_callback_URL:"http://localhost:8000/users/auth/google/callback",
    jwt_secret:'socialMediaApplication',
    morgan:{
        mode:'dev',
        options:{stream:accessLogStream}
    }
}

const production = {
    name:process.env.SOCIAL_MEDIA_ENVIRONMENT,
    asset_path:process.env.SOCIAL_MEDIA_ASSET_PATH,
    session_cookie_key:process.env.SOCIAL_MEDIA_SESSION_COOKIE_KEY,
    db:process.env.SOCIAL_MEDIA_DB,
    smtp:{
        service:'gmail',
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        auth:{
            user:process.env.SOCIAL_MEDIA_GMAIL_USERNAME,
            pass:process.env.SOCIAL_MEDIA_GMAIL_PASSWORD
        }
    },
    google_client_ID:process.env.SOCIAL_MEDIA_GOOGLE_CLIENT_ID,
    google_client_Secret:process.env.SOCIAL_MEDIA_GOOGLE_CLIENT_SECRET,
    google_callback_URL:process.env.SOCIAL_MEDIA_GOOGLE_CALLBACK_URL,
    jwt_secret:process.env.SOCIAL_MEDIA_JWT_SECRET,
    morgan:{
        mode:'combined',
        options:{stream:accessLogStream}
    }
}

module.exports = production;