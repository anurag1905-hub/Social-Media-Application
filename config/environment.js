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
            user:'dummyemail584@gmail.com',
            pass:'dummyPassword@584'
        }
    },
    google_client_ID:"791041645048-0ttjugd2gg9mcvgiah9qfanii1gsteot.apps.googleusercontent.com",
    google_client_Secret:"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",
    google_callback_URL:"http://localhost:8000/users/auth/google/callback",
    jwt_secret:'socialMediaApplication'
}

const production = {
    name:'production'
}

module.exports = development;